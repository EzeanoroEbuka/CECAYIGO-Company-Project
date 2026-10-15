import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut,
  updateProfile,
  User as FirebaseUser
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc, collection, getDocs, serverTimestamp } from "firebase/firestore";
import { toast } from "sonner";

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: "admin" | "customer";
  phone?: string;
  createdAt?: any;
}

interface AuthContextType {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string, phone?: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUserRole: (uid: string, role: "admin" | "customer") => Promise<void>;
  getAllUsers: () => Promise<UserProfile[]>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  isAdmin: false,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  updateUserRole: async () => {},
  getAllUsers: async () => []
});

const INITIAL_ADMIN_EMAILS = [
  "admin@cecayigo.com",
  "admin@ayigo.com",
  "admin@gmail.com"
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper to fetch or initialize user profile in Firestore
  const fetchOrCreateProfile = async (fbUser: FirebaseUser): Promise<UserProfile> => {
    const userDocRef = doc(db, "users", fbUser.uid);
    try {
      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists()) {
        const data = docSnap.data() as UserProfile;
        return data;
      }
    } catch (err) {
      console.warn("Could not read profile from Firestore:", err);
    }

    // Determine if this user should be the first admin
    let role: "admin" | "customer" = "customer";
    const userEmail = (fbUser.email || "").toLowerCase();

    if (INITIAL_ADMIN_EMAILS.includes(userEmail)) {
      role = "admin";
    } else {
      // Check if there are any existing admins in Firestore
      try {
        const usersSnap = await getDocs(collection(db, "users"));
        if (usersSnap.empty) {
          // First user who signs up becomes admin!
          role = "admin";
        } else {
          const hasAdmin = usersSnap.docs.some(d => d.data().role === "admin");
          if (!hasAdmin) {
            role = "admin";
          }
        }
      } catch {
        // Fallback: check localStorage for offline mock
        if (typeof window !== "undefined") {
          const savedUsers = JSON.parse(localStorage.getItem("cec_registered_users") || "[]");
          if (savedUsers.length === 0) role = "admin";
        }
      }
    }

    const newProfile: UserProfile = {
      uid: fbUser.uid,
      email: fbUser.email || "",
      displayName: fbUser.displayName || fbUser.email?.split("@")[0] || "Customer",
      role,
      createdAt: new Date().toISOString()
    };

    try {
      await setDoc(userDocRef, {
        ...newProfile,
        createdAt: serverTimestamp()
      });
    } catch (err) {
      console.warn("Could not save profile to Firestore:", err);
    }

    // Also persist locally
    if (typeof window !== "undefined") {
      try {
        const savedUsers: UserProfile[] = JSON.parse(localStorage.getItem("cec_registered_users") || "[]");
        const idx = savedUsers.findIndex(u => u.uid === newProfile.uid);
        if (idx >= 0) savedUsers[idx] = newProfile;
        else savedUsers.push(newProfile);
        localStorage.setItem("cec_registered_users", JSON.stringify(savedUsers));
      } catch {}
    }

    return newProfile;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser && !currentUser.isAnonymous) {
        try {
          const prof = await fetchOrCreateProfile(currentUser);
          setProfile(prof);
        } catch {
          setProfile({
            uid: currentUser.uid,
            email: currentUser.email || "",
            displayName: currentUser.displayName || "Customer",
            role: INITIAL_ADMIN_EMAILS.includes((currentUser.email || "").toLowerCase()) ? "admin" : "customer"
          });
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const res = await signInWithEmailAndPassword(auth, email.trim(), password);
      const prof = await fetchOrCreateProfile(res.user);
      setProfile(prof);
      toast.success(`Welcome back, ${prof.displayName || "Customer"}!`);
    } catch (error: any) {
      console.error("Sign in error:", error);
      throw error;
    }
  };

  const signUp = async (name: string, email: string, password: string, phone?: string) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email.trim(), password);
      if (name.trim()) {
        await updateProfile(res.user, { displayName: name.trim() });
      }
      
      const prof = await fetchOrCreateProfile(res.user);
      if (phone && db) {
        try {
          await updateDoc(doc(db, "users", res.user.uid), { phone });
          prof.phone = phone;
        } catch {}
      }
      setProfile(prof);
      toast.success(`Account created successfully! ${prof.role === 'admin' ? '(Admin Access Granted)' : ''}`);
    } catch (error: any) {
      console.error("Sign up error:", error);
      throw error;
    }
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

  const updateUserRole = async (uid: string, role: "admin" | "customer") => {
    try {
      if (db) {
        await updateDoc(doc(db, "users", uid), { role });
      }
      // Update local storage backup
      if (typeof window !== "undefined") {
        const savedUsers: UserProfile[] = JSON.parse(localStorage.getItem("cec_registered_users") || "[]");
        const updated = savedUsers.map(u => u.uid === uid ? { ...u, role } : u);
        localStorage.setItem("cec_registered_users", JSON.stringify(updated));
      }
      if (profile && profile.uid === uid) {
        setProfile({ ...profile, role });
      }
      toast.success(`User role updated to ${role}`);
    } catch (error: any) {
      console.error("Update role error:", error);
      toast.error("Failed to update user role");
    }
  };

  const getAllUsers = async (): Promise<UserProfile[]> => {
    try {
      if (db) {
        const snap = await getDocs(collection(db, "users"));
        if (!snap.empty) {
          return snap.docs.map(d => ({ uid: d.id, ...d.data() })) as UserProfile[];
        }
      }
    } catch (err) {
      console.warn("Could not fetch users from Firestore:", err);
    }

    if (typeof window !== "undefined") {
      try {
        const saved: UserProfile[] = JSON.parse(localStorage.getItem("cec_registered_users") || "[]");
        if (saved.length > 0) return saved;
      } catch {}
    }

    return profile ? [profile] : [];
  };

  const isAdmin = profile?.role === "admin";

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      isAdmin,
      loading,
      signIn,
      signUp,
      signOut,
      updateUserRole,
      getAllUsers
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
