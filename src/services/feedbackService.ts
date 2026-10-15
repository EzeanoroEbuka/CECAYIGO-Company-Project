import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, doc, updateDoc, query, orderBy, serverTimestamp, Timestamp } from "firebase/firestore";

export interface FeedbackSubmission {
  id?: string;
  ticketId: string;
  type: "complaint" | "feedback" | "order_issue" | "warranty" | "general";
  name: string;
  email: string;
  phone: string;
  orderNumber?: string;
  productName?: string;
  priority: "low" | "medium" | "urgent";
  subject: string;
  message: string;
  status: "open" | "in_review" | "resolved";
  createdAt?: any;
}

const LOCAL_STORAGE_KEY = "cec_feedback_submissions";

export const feedbackService = {
  generateTicketId(): string {
    const random = Math.floor(100000 + Math.random() * 900000);
    return `CEC-TK-${random}`;
  },

  async submitFeedback(data: Omit<FeedbackSubmission, "ticketId" | "status" | "createdAt">): Promise<string> {
    const ticketId = this.generateTicketId();
    const submission: FeedbackSubmission = {
      ...data,
      ticketId,
      status: "open",
      createdAt: new Date().toISOString()
    };

    // 1. Try Firebase Firestore
    try {
      if (db) {
        const docRef = await addDoc(collection(db, "feedback"), {
          ...submission,
          createdAt: serverTimestamp()
        });
        submission.id = docRef.id;
      }
    } catch (err) {
      console.warn("Firestore feedback submission fallback to local storage:", err);
    }

    // 2. Always persist locally for offline / immediate reliability
    try {
      if (typeof window !== "undefined") {
        const existing = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "[]");
        existing.unshift(submission);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(existing));
      }
    } catch {}

    return ticketId;
  },

  async getAllFeedback(): Promise<FeedbackSubmission[]> {
    // 1. Try Firestore
    try {
      if (db) {
        const q = query(collection(db, "feedback"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as FeedbackSubmission[];
        }
      }
    } catch (err) {
      console.warn("Could not fetch feedback from Firestore, using local:", err);
    }

    // 2. Fallback to localStorage or mock submissions
    if (typeof window !== "undefined") {
      try {
        const saved = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "[]");
        if (saved.length > 0) return saved;
      } catch {}
    }

    // Default sample data so admin can see how it looks
    return [
      {
        id: "sample-1",
        ticketId: "CEC-TK-849102",
        type: "complaint",
        name: "Emeka Okonkwo",
        email: "emeka.o@example.com",
        phone: "+234 803 234 5678",
        orderNumber: "ORD-94281",
        productName: "CeC Heavy-Duty Floodlight 100W",
        priority: "urgent",
        subject: "Flickering after sudden power surge",
        message: "The floodlight began flickering yesterday after an abrupt power outage in our facility. Please provide warranty assistance.",
        status: "open",
        createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
      },
      {
        id: "sample-2",
        ticketId: "CEC-TK-512934",
        type: "feedback",
        name: "Amina Yusuf",
        email: "amina.y@example.com",
        phone: "+234 814 987 6543",
        priority: "medium",
        subject: "Excellent LED Panel Quality & Request for Bulk Pricing",
        message: "We installed 40 units of CeC Ceiling LED Panels in our Ikeja office. Incredible lighting consistency! We want to request catalog pricing for our Abuja branch.",
        status: "in_review",
        createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
      }
    ];
  },

  async updateFeedbackStatus(id: string, status: "open" | "in_review" | "resolved"): Promise<void> {
    try {
      if (db && id && !id.startsWith("sample-")) {
        await updateDoc(doc(db, "feedback", id), { status });
      }
    } catch (err) {
      console.warn("Firestore update error:", err);
    }

    if (typeof window !== "undefined") {
      try {
        const existing: FeedbackSubmission[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "[]");
        const updated = existing.map(item => item.id === id || item.ticketId === id ? { ...item, status } : item);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      } catch {}
    }
  }
};
