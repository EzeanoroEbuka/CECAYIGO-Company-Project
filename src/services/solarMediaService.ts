import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";

export type SolarMediaType = "image" | "video";

export interface SolarMediaItem {
  id: string;
  type: SolarMediaType;
  title: string;
  description?: string;
  /** For type=image: direct image URL or Firebase Storage URL */
  imageUrl?: string;
  /** For type=video: YouTube embed URL e.g. https://www.youtube.com/embed/VIDEO_ID */
  videoEmbedUrl?: string;
  /** Optional thumbnail shown before video plays */
  thumbnailUrl?: string;
  category?: string;
  order?: number;
  published: boolean;
  createdAt?: any;
  updatedAt?: any;
}

const COLLECTION = "solarMedia";

/** Curated fallback items shown when Firestore is empty */
export const DEFAULT_SOLAR_MEDIA: SolarMediaItem[] = [
  {
    id: "default-1",
    type: "image",
    title: "Commercial Solar Installation",
    description: "CeC Ayigo 50KVA hybrid solar system installed at a manufacturing facility in Lagos.",
    imageUrl: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=900&q=80",
    category: "Installation",
    published: true,
    order: 1,
  },
  {
    id: "default-2",
    type: "image",
    title: "Solar Street Lighting — Lekki Expressway",
    description: "150W integrated solar street lights deployed along a 2km highway stretch.",
    imageUrl: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=900&q=80",
    category: "Street Lighting",
    published: true,
    order: 2,
  },
  {
    id: "default-3",
    type: "image",
    title: "Lithium Battery Bank — Off-Grid System",
    description: "200AH lithium battery bank providing 72-hour backup for a residential estate.",
    imageUrl: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=900&q=80",
    category: "Storage",
    published: true,
    order: 3,
  },
  {
    id: "default-4",
    type: "image",
    title: "Solar Panel Array — Rooftop Installation",
    description: "Monocrystalline solar panel array achieving 98% efficiency in direct Lagos sunlight.",
    imageUrl: "https://images.unsplash.com/photo-1497440001374-f26997328c1b?w=900&q=80",
    category: "Solar Panels",
    published: true,
    order: 4,
  },
  {
    id: "default-5",
    type: "image",
    title: "Hybrid Inverter System",
    description: "3.5KVA pure sine hybrid inverter with seamless grid-solar switching.",
    imageUrl: "https://images.unsplash.com/photo-1558449028-b53a39d100fc?w=900&q=80",
    category: "Inverters",
    published: true,
    order: 5,
  },
  {
    id: "default-6",
    type: "image",
    title: "Solar Security Camera Installation",
    description: "All-weather solar-powered CCTV cameras with night vision for industrial compounds.",
    imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=900&q=80",
    category: "Security",
    published: true,
    order: 6,
  },
];

export const solarMediaService = {
  async getAll(): Promise<SolarMediaItem[]> {
    try {
      const q = query(collection(db, COLLECTION), orderBy("order", "asc"));
      const snap = await getDocs(q);
      if (!snap.empty) {
        return snap.docs.map((d) => ({ id: d.id, ...d.data() } as SolarMediaItem));
      }
    } catch {
      // Firestore unavailable or empty — fall through to defaults
    }
    return DEFAULT_SOLAR_MEDIA;
  },

  async getPublished(): Promise<SolarMediaItem[]> {
    const all = await this.getAll();
    return all.filter((m) => m.published !== false);
  },

  async add(item: Omit<SolarMediaItem, "id" | "createdAt" | "updatedAt">): Promise<string> {
    const ref = await addDoc(collection(db, COLLECTION), {
      ...item,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return ref.id;
  },

  async update(id: string, data: Partial<Omit<SolarMediaItem, "id">>): Promise<void> {
    await updateDoc(doc(db, COLLECTION, id), {
      ...data,
      updatedAt: serverTimestamp(),
    });
  },

  async remove(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTION, id));
  },
};
