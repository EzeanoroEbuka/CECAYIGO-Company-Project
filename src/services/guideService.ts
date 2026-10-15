import { db } from "@/lib/firebase";
import { collection, getDocs, doc, getDoc, setDoc, updateDoc, deleteDoc, query, orderBy, serverTimestamp } from "firebase/firestore";

export interface GuideDoItem {
  title: string;
  desc: string;
  imgUrl?: string;
}

export interface GuideDontItem {
  title: string;
  desc: string;
  hazard: "critical" | "warning";
  imgUrl?: string;
}

export interface AdminGuideItem {
  id: string;
  category: "lighting" | "breakers" | "solar" | "wiring" | "general";
  title: string;
  videoTitle: string;
  videoEmbedUrl: string;
  duration: string;
  productId?: string;
  productName?: string;
  summary: string;
  dos: GuideDoItem[];
  donts: GuideDontItem[];
  createdAt?: any;
}

const LOCAL_STORAGE_GUIDES_KEY = "cec_admin_guides_catalog";

export const INITIAL_DEFAULT_GUIDES: AdminGuideItem[] = [
  {
    id: "guide-floodlight-100w",
    category: "lighting",
    title: "LED Floodlight & High-Bay Lighting: Safe Outdoor Mounting",
    videoTitle: "Official CeC Floodlight Mounting, Tilt Angle & Earthing Demo",
    videoEmbedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "4:30 mins",
    productId: "cec-led-floodlight-100w",
    productName: "CeC Pro Series 100W IP66 LED Floodlight",
    summary: "Complete technician guide on grounding anti-surge wires, angle mounting for heat dissipation, and waterproof junction box sealing.",
    dos: [
      {
        title: "Always firmly connect the Green/Yellow Ground wire",
        desc: "Earthing guarantees anti-surge protection (6KV) can divert lightning strikes and prevents dangerous chassis voltage leakage during heavy rainstorms.",
        imgUrl: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&q=80"
      },
      {
        title: "Mount at a downward angle of 30° - 45°",
        desc: "Downward slope ensures rainwater runs off the glass faceplate and heat dissipates efficiently through the aluminum rear cooling fins.",
        imgUrl: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=500&q=80"
      },
      {
        title: "Use an IP68 waterproof connection box",
        desc: "All cable terminations must be enclosed in a certified outdoor junction box sealed with waterproof silicone grommets."
      }
    ],
    donts: [
      {
        title: "NEVER snip off the Earth wire to fit 2-pin extension plugs",
        desc: "Cutting the ground wire leaves the metal housing vulnerable. In wet outdoor conditions, this creates severe electrocution hazards.",
        hazard: "critical",
        imgUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&q=80"
      },
      {
        title: "DO NOT submerge in water (e.g. pools or fountains)",
        desc: "IP66 rating is designed to resist torrential rain and pressure jets, NOT continuous underwater pressure. Submerging will cause short circuits.",
        hazard: "critical"
      },
      {
        title: "DO NOT mount upside down facing the sky",
        desc: "Facing upwards causes standing water to pool over the lens, accelerating seal fatigue and blocking heat release.",
        hazard: "warning"
      }
    ]
  },
  {
    id: "guide-smart-breaker-63a",
    category: "breakers",
    title: "Smart WiFi Din-Rail Circuit Breaker: Wiring & Overload Protection",
    videoTitle: "CeC 63A Smart Breaker: Distribution Board Installation & Pairing",
    videoEmbedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "6:15 mins",
    productId: "cec-smart-wifi-circuit-breaker",
    productName: "CeC Smart WiFi Din-Rail Circuit Breaker 63A",
    summary: "Step-by-step wiring guide for DB mounting, terminal torque requirements, and Tuya/SmartLife smartphone app pairing.",
    dos: [
      {
        title: "Verify INPUT (Top) vs OUTPUT (Bottom) orientation",
        desc: "Mains / Generator power enters strictly at the top terminals (1 for Live, N for Neutral). House load wires connect at the bottom.",
        imgUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500&q=80"
      },
      {
        title: "Tighten screw clamps to 2.5 Nm torque",
        desc: "Properly torqued screw terminals prevent micro-arcing and excessive thermal degradation during peak household power draw."
      },
      {
        title: "Pair using 2.4GHz WiFi band",
        desc: "Ensure your mobile phone connects to 2.4GHz WiFi during initial device discovery. 5GHz networks are not recognized by smart IoT relays."
      }
    ],
    donts: [
      {
        title: "NEVER wire load power into the top terminals",
        desc: "Reversing Input and Output reverses the internal current transformer and will destroy the WiFi microcontroller upon power-up.",
        hazard: "critical"
      },
      {
        title: "DO NOT exceed 63A continuous load without load shedding",
        desc: "If your residential or commercial facility exceeds 63 Amps, install separate dedicated sub-breakers for high-draw air conditioning units.",
        hazard: "warning"
      }
    ]
  },
  {
    id: "guide-hybrid-inverter-35kva",
    category: "solar",
    title: "Pure Sine Wave Inverters: Battery Sequencing & DC Polarity",
    videoTitle: "CeC Hybrid Inverter: Battery Sequence, MPPT Connection & Safety",
    videoEmbedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "8:00 mins",
    productId: "cec-hybrid-solar-inverter-35kva",
    productName: "CeC Pure Sine Wave Hybrid Solar Inverter 3.5kVA / 24V",
    summary: "Critical safety procedure: always energize battery bank first, verify 25mm² cable sizing, and keep PV string within 145V Voc limits.",
    dos: [
      {
        title: "ALWAYS connect Battery cables BEFORE connecting Solar Panels",
        desc: "The MPPT charge controller requires battery reference voltage to initialize its operating parameters safely before high-voltage solar strings are applied.",
        imgUrl: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=500&q=80"
      },
      {
        title: "Use minimum 25mm² pure copper battery cables",
        desc: "Heavy-gauge cables prevent voltage drop and dangerous heat accumulation when heavy motor loads start up."
      },
      {
        title: "Install a 150A DC fuse on the positive battery leg",
        desc: "A fast-acting DC fuse protects your expensive battery bank and inverter in the event of an unexpected external short circuit."
      }
    ],
    donts: [
      {
        title: "NEVER cross battery positive and negative polarities",
        desc: "Reversing DC polarity causes instantaneous diode breakdown and irreversible capacitor rupture inside the inverter.",
        hazard: "critical"
      },
      {
        title: "DO NOT exceed maximum Solar Array Open Circuit Voltage (145V Voc)",
        desc: "Connecting too many solar panels in series will exceed the maximum voltage limit of the internal charge controller.",
        hazard: "critical"
      }
    ]
  }
];

export const guideService = {
  async getAllGuides(): Promise<AdminGuideItem[]> {
    // 1. Try Firestore
    try {
      if (db) {
        const q = query(collection(db, "guides"));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as AdminGuideItem[];
        }
      }
    } catch (err) {
      console.warn("Could not fetch guides from Firestore:", err);
    }

    // 2. Try localStorage
    if (typeof window !== "undefined") {
      try {
        const local = localStorage.getItem(LOCAL_STORAGE_GUIDES_KEY);
        if (local) {
          const parsed = JSON.parse(local);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {}
    }

    // 3. Fallback to Initial Seed Guides
    return INITIAL_DEFAULT_GUIDES;
  },

  async getGuideById(id: string): Promise<AdminGuideItem | null> {
    try {
      if (db) {
        const docSnap = await getDoc(doc(db, "guides", id));
        if (docSnap.exists()) {
          return { id: docSnap.id, ...docSnap.data() } as AdminGuideItem;
        }
      }
    } catch {}

    const all = await this.getAllGuides();
    return all.find(g => g.id === id || g.productId === id) || null;
  },

  async saveGuide(guide: AdminGuideItem): Promise<void> {
    const guideId = guide.id || `guide-${Date.now()}`;
    const cleanGuide: AdminGuideItem = {
      ...guide,
      id: guideId
    };

    // 1. Save to Firestore
    try {
      if (db) {
        await setDoc(doc(db, "guides", guideId), {
          ...cleanGuide,
          updatedAt: serverTimestamp()
        });
      }
    } catch (err) {
      console.warn("Could not save guide to Firestore:", err);
    }

    // 2. Always persist in localStorage
    if (typeof window !== "undefined") {
      try {
        const all = await this.getAllGuides();
        const existingIdx = all.findIndex(g => g.id === guideId);
        if (existingIdx >= 0) {
          all[existingIdx] = cleanGuide;
        } else {
          all.unshift(cleanGuide);
        }
        localStorage.setItem(LOCAL_STORAGE_GUIDES_KEY, JSON.stringify(all));
      } catch {}
    }
  },

  async deleteGuide(id: string): Promise<void> {
    try {
      if (db) {
        await deleteDoc(doc(db, "guides", id));
      }
    } catch (err) {
      console.warn("Could not delete guide from Firestore:", err);
    }

    if (typeof window !== "undefined") {
      try {
        const all = await this.getAllGuides();
        const filtered = all.filter(g => g.id !== id);
        localStorage.setItem(LOCAL_STORAGE_GUIDES_KEY, JSON.stringify(filtered));
      } catch {}
    }
  }
};
