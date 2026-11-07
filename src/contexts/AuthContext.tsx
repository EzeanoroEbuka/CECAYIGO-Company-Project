import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  signOut as firebaseSignOut,
  updateProfile,
  User as FirebaseUser,
} from "firebase/auth";
import { toast } from "sonner";
import { authFetch } from "@/lib/authFetch";
import type { Role } from "@/lib/roles";

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: Role;
  phone?: string;
  mustChangePassword?: boolean;
  createdAt?: any;
}

interface AuthContextType {
  /** The signed-in customer/admin. null for guests (anonymous visitors are NOT treated as signed in). */
  user: FirebaseUser | null;
  profile: UserProfile | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<UserProfile>;
  signUp: (name: string, email: string, password: string, phone?: string) => Promise<UserProfile>;
  signOut: () => Promise<void>;
  /** Admin only — enforced again on the server. */
  updateUserRole: (uid: string, role: Role) => Promise<void>;
  /** Admin only. */
  getAllUsers: () => Promise<UserProfile[]>;
  /** Admin only: create a new account (admin or customer) with a temporary password. */
  createUser: (input: { name: string; email: string; password: string; role: Role }) => Promise<void>;
  /** Re-reads the profile (e.g. after the password was changed). */
  refreshProfile: () => Promise<void>;
}

const noop = async () => {
  throw new Error("AuthProvider is missing");
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  isAdmin: false,
  loading: true,
  signIn: noop as any,
  signUp: noop as any,
  signOut: noop,
  updateUserRole: noop,
  getAllUsers: async () => [],
  createUser: noop,
  refreshProfile: noop,
});

const profileFromToken = async (fbUser: FirebaseUser, phone?: string): Promise<UserProfile> => {
  let role: Role = "customer"; // safe default if the token can't be read (e.g. offline)
  try {
    const token = await fbUser.getIdTokenResult();
    role = token.claims.role === "admin" ? "admin" : "customer";
  } catch (err) {
    console.warn("Could not read token (offline?):", err);
  }
  return {
    uid: fbUser.uid,
    email: fbUser.email || "",
    displayName: fbUser.displayName || (fbUser.email || "Customer").split("@")[0],
    role,
    phone,
  };
};

/** Loads (and on first sign-in creates) the profile on the server. The role is decided server-side. */
const loadProfile = async (fbUser: FirebaseUser, phone?: string): Promise<UserProfile> => {
  try {
    const res = await authFetch("/api/auth/profile", {
      method: "POST",
      body: JSON.stringify({ phone }),
    });
    if (res.ok) {
      const data = await res.json();
      return data.profile as UserProfile;
    }
  } catch (err) {
    console.warn("Could not load profile from server:", err);
  }
  return profileFromToken(fbUser, phone);
};

const apiError = async (res: Response, fallback: string) => {
  try {
    const data = await res.json();
    return new Error(data.error || fallback);
  } catch {
    return new Error(fallback);
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {


    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        if (currentUser && !currentUser.isAnonymous) {
          setUser(currentUser);
          setProfile(await loadProfile(currentUser));
        } else {
          setUser(null);
          setProfile(null);
          // Guests still get a background anonymous session so the cart and checkout keep working
          if (!currentUser) signInAnonymously(auth).catch(() => {});
        }
      } catch (err) {
        console.warn("Auth state handling failed:", err);
      } finally {
        setLoading(false); // always stop the loading state, even when offline
      }
    });
    return () => unsubscribe();
  }, []);

  
  const signIn = async (email: string, password: string) => {
    const res = await signInWithEmailAndPassword(auth, email.trim(), password);
    await res.user.getIdToken(true); // make sure we hold the freshest role claim
    const prof = await loadProfile(res.user);
    setUser(res.user);
    setProfile(prof);
    toast.success(`Welcome back, ${prof.displayName || "Customer"}!`);
    return prof;
  };

  const signUp = async (name: string, email: string, password: string, phone?: string) => {
    // Self-registration ALWAYS creates a customer. Admins can only be made by other admins.
    const res = await createUserWithEmailAndPassword(auth, email.trim(), password);
    if (name.trim()) await updateProfile(res.user, { displayName: name.trim() });
    const prof = await loadProfile(res.user, phone?.trim());
    setUser(res.user);
    setProfile(prof);
    toast.success("Account created successfully!");
    return prof;
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setProfile(null);
      toast.success("Signed out successfully");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const refreshProfile = async () => {
    const current = auth.currentUser;
    if (current && !current.isAnonymous) setProfile(await loadProfile(current));
  };

  const updateUserRole = async (uid: string, role: Role) => {
    const res = await authFetch(`/api/admin/users/${uid}/role`, {
      method: "PATCH",
      body: JSON.stringify({ role }),
    });
    if (!res.ok) {
      const err = await apiError(res, "Failed to update user role");
      toast.error(err.message);
      throw err;
    }
    toast.success(role === "admin" ? "User is now an admin" : "Admin access removed");
  };

  const getAllUsers = async (): Promise<UserProfile[]> => {
    const res = await authFetch("/api/admin/users");
    if (!res.ok) throw await apiError(res, "Could not load users");
    const data = await res.json();
    return data.users as UserProfile[];
  };

  const createUser = async (input: { name: string; email: string; password: string; role: Role }) => {
    const res = await authFetch("/api/admin/users", { method: "POST", body: JSON.stringify(input) });
    if (!res.ok) throw await apiError(res, "Could not create the account");
  };

  const isAdmin = profile?.role === "admin";

  return (
    <AuthContext.Provider
      value={{ user, profile, isAdmin, loading, signIn, signUp, signOut, updateUserRole, getAllUsers, createUser, refreshProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
