import { db } from "@/lib/firebase";
import { collection, getDocs, doc, getDoc, query, where, limit, orderBy, addDoc, serverTimestamp, updateDoc, Timestamp } from "firebase/firestore";

export interface ProductReview {
  id: string;
  productId: string;
  userName: string;
  userEmail?: string;
  rating: number;
  title: string;
  comment: string;
  verified?: boolean;
  createdAt: string;
}

export interface UsageGuideItem {
  title: string;
  description: string;
  imageUrl?: string;
  hazardLevel?: "warning" | "danger" | "safe";
}

export interface ProductGuide {
  productId: string;
  videoUrl?: string; // e.g. YouTube or mp4
  videoTitle?: string;
  videoDuration?: string;
  summary: string;
  dos: UsageGuideItem[];
  donts: UsageGuideItem[];
  installationSteps: string[];
  safetyTips: string[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discountedPrice?: number;
  images: string[];
  category: string;
  inStock: boolean;
  featured?: boolean;
  createdAt?: any;
  features: string[];
  specifications: Record<string, string>;
  rating?: number;
  reviewCount?: number;
  guide?: ProductGuide;
}

// Company curated default catalog for CeC Ayigo products
export const DEFAULT_COMPANY_PRODUCTS: Product[] = [
  {
    id: "cec-led-floodlight-100w",
    name: "CeC Pro Series 100W IP66 LED Floodlight",
    description: "Industrial-grade outdoor LED floodlight with anti-surge protection (6KV), aluminum die-cast body, and high-lumen COB chip. Engineered for demanding Lagos weather conditions and commercial compounds.",
    price: 45000,
    discountedPrice: 38500,
    images: [
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80",
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&q=80"
    ],
    category: "Lighting",
    inStock: true,
    featured: true,
    rating: 4.9,
    reviewCount: 38,
    features: [
      "100W High Lumen Efficiency (130 lm/Watt)",
      "IP66 Waterproof & Dustproof Rating",
      "6KV Built-in Surge & Lightning Protection",
      "Die-Cast Aluminum Heat Dissipation Housing",
      "Over 50,000 Hours Operational Lifespan",
      "Pre-wired with heavy-duty heat-resistant cable"
    ],
    specifications: {
      "Input Voltage": "AC 85V - 265V, 50/60Hz",
      "Color Temperature": "6500K Daylight White",
      "Beam Angle": "120 Degrees Wide Dispersion",
      "Power Factor": "> 0.95",
      "Body Material": "Die-cast Aluminum Alloy + Toughened Glass",
      "Warranty": "2 Years Official CeC Ayigo Warranty",
      "Origin": "Engineered for Nigerian Grid Conditions"
    },
    guide: {
      productId: "cec-led-floodlight-100w",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Embed preview
      videoTitle: "Official CeC 100W Floodlight Mounting & Anti-Surge Wiring",
      videoDuration: "4 mins",
      summary: "Comprehensive guide on secure wall/pole mounting, waterproof junction sealing, and surge protector connection.",
      dos: [
        {
          title: "Ground the Yellow/Green Earth wire firmly",
          description: "Always connect the earth/grounding cable to avoid electrical leakage during heavy rainfall and lightning storms.",
          hazardLevel: "safe",
          imageUrl: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&q=80"
        },
        {
          title: "Angle downwards at 30° to 45°",
          description: "Mount with an angled downward tilt so rainwater easily drains off the glass faceplate and heat dissipates through the rear cooling fins.",
          hazardLevel: "safe",
          imageUrl: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400&q=80"
        },
        {
          title: "Use IP68 waterproof junction box",
          description: "Seal wire connections inside a rated waterproof box with rubber grommets when installing outdoors.",
          hazardLevel: "safe"
        }
      ],
      donts: [
        {
          title: "NEVER cut off grounding wire to fit a 2-pin plug",
          description: "Disabling the earth line eliminates surge suppression and risks severe electrical shocks during wet seasons.",
          hazardLevel: "danger",
          imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&q=80"
        },
        {
          title: "DO NOT submerge or mount inside swimming pools",
          description: "This floodlight is rainproof (IP66), not submersible (IP68 underwater). Submerging will destroy the driver and cause short circuits.",
          hazardLevel: "danger"
        },
        {
          title: "DO NOT connect to unstable generator without AVR",
          description: "Running from small low-grade generators with wild voltage spikes (>300V) without a stabilizer may reduce driver lifespan.",
          hazardLevel: "warning"
        }
      ],
      installationSteps: [
        "1. Disconnect main breaker before attempting any electrical wiring.",
        "2. Mark holes on wall/pole using mounting bracket as template.",
        "3. Drill and secure bracket firmly using expansion anchor bolts.",
        "4. Connect Live (Brown), Neutral (Blue), and Earth (Green/Yellow) to mains.",
        "5. Tighten stainless steel angle adjustment bolts to lock orientation."
      ],
      safetyTips: [
        "Always test voltage before touching exposed conductors.",
        "Ensure mounting surface supports at least 5x the weight of the light fixture.",
        "Allow unit to cool for 15 minutes before servicing."
      ]
    }
  },
  {
    id: "cec-smart-wifi-circuit-breaker",
    name: "CeC Smart WiFi Din-Rail Circuit Breaker 63A",
    description: "Intelligent WiFi energy meter and overload protector. Monitor real-time voltage, current, and kilowatt-hour consumption from your mobile phone. Includes automated timer schedules and voltage trip protection.",
    price: 32000,
    discountedPrice: 27500,
    images: [
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80",
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80"
    ],
    category: "Electrical Accessories",
    inStock: true,
    featured: true,
    rating: 4.8,
    reviewCount: 24,
    features: [
      "Real-time Remote Control via Smartphone App",
      "Voltage / Current / Power Consumption Metering",
      "Configurable Over-voltage & Under-voltage Protection",
      "Automated Schedule & Timer on/off settings",
      "Voice Control compatible with Alexa & Google Home",
      "Standard 35mm Din Rail distribution board mounting"
    ],
    specifications: {
      "Rated Current": "1A - 63A Adjustable",
      "Rated Voltage": "AC 230V, 50Hz",
      "Under-voltage cut-off": "140V - 210V (Configurable)",
      "Over-voltage cut-off": "230V - 300V (Configurable)",
      "Wireless Protocol": "2.4GHz WiFi 802.11 b/g/n",
      "Mechanical Life": "> 100,000 Operations",
      "Warranty": "18 Months CeC Ayigo Guarantee"
    },
    guide: {
      productId: "cec-smart-wifi-circuit-breaker",
      videoTitle: "Wiring & WiFi Pairing for CeC Smart Breaker 63A",
      videoDuration: "6 mins",
      summary: "Step-by-step connection to the distribution board (DB) and Tuya/SmartLife smartphone app pairing.",
      dos: [
        {
          title: "Match Line In & Load Out correctly",
          description: "Top terminals are strictly INPUT (from meter/generator), and bottom terminals are strictly OUTPUT (to house circuits).",
          hazardLevel: "safe"
        },
        {
          title: "Tighten screw terminals with 2.5 Nm torque",
          description: "Loose terminal connections cause arcing, excessive heat buildup, and false trips.",
          hazardLevel: "safe"
        }
      ],
      donts: [
        {
          title: "NEVER reverse Input and Output terminals",
          description: "Feeding power backwards into output terminals will fry the internal micro-controller immediately upon power up.",
          hazardLevel: "danger"
        },
        {
          title: "DO NOT exceed 63A continuous load on a single breaker",
          description: "Calculate household total load. If exceeding 63A, split loads across multiple dedicated sub-breakers.",
          hazardLevel: "warning"
        }
      ],
      installationSteps: [
        "1. Turn off main incoming isolator switch.",
        "2. Snap CeC Smart Breaker onto the 35mm DIN rail inside DB box.",
        "3. Wire incoming Live to terminal 1 and incoming Neutral to terminal N.",
        "4. Wire load Live to terminal 2 and load Neutral to terminal N.",
        "5. Power on, hold WiFi button for 5 seconds until indicator blinks rapidly, and pair in mobile app."
      ],
      safetyTips: [
        "Installation should be performed by a licensed electrician.",
        "Ensure home WiFi is on 2.4GHz network (5GHz is not supported)."
      ]
    }
  },
  {
    id: "cec-hybrid-solar-inverter-35kva",
    name: "CeC Pure Sine Wave Hybrid Solar Inverter 3.5kVA / 24V",
    description: "Heavy-duty pure sine wave hybrid solar inverter equipped with 60A MPPT Solar Charge Controller. Seamless 10ms transfer time keeps sensitive computers, TVs, and lighting running without rebooting when NEPA/PHCN goes off.",
    price: 360000,
    discountedPrice: 325000,
    images: [
      "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80",
      "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=800&q=80"
    ],
    category: "Inverters",
    inStock: true,
    featured: true,
    rating: 5.0,
    reviewCount: 42,
    features: [
      "3.5kVA / 3000W Continuous Pure Sine Wave Output",
      "Integrated 60A MPPT Solar Charge Controller",
      "Dual battery compatibility (Lithium & Tubular Gel)",
      "Zero-flicker 10ms Automatic Transfer Switch (UPS Mode)",
      "Smart Multi-stage Battery Charger from Grid or Generator",
      "Comprehensive LCD Display for Solar, Battery & Load monitoring"
    ],
    specifications: {
      "DC Battery Voltage": "24V DC (2x 12V in series)",
      "AC Output Voltage": "220V / 230V AC ± 3%",
      "Max PV Open Circuit Voltage": "145V DC",
      "Efficiency": "> 94% Peak",
      "Surge Power": "7000VA (for compressor starting)",
      "Cooling": "Smart Temperature-Controlled High-Speed Fans",
      "Warranty": "2 Years Official CeC Ayigo Warranty"
    },
    guide: {
      productId: "cec-hybrid-solar-inverter-35kva",
      videoTitle: "CeC 3.5kVA Inverter Battery Connection & MPPT Solar Setup",
      videoDuration: "8 mins",
      summary: "Detailed overview of proper 24V battery bank cabling, DC fuse placement, solar panel string sizing, and inverter parameter configuration.",
      dos: [
        {
          title: "Use minimum 25mm² pure copper battery cables",
          description: "Thick cables prevent voltage drop and excessive heat when running heavy household loads like refrigerators.",
          hazardLevel: "safe"
        },
        {
          title: "Always connect BATTERIES FIRST before connecting Solar Panels",
          description: "The inverter controller needs battery reference voltage to initialize safely before high-voltage solar inputs are energized.",
          hazardLevel: "safe"
        }
      ],
      donts: [
        {
          title: "NEVER short-circuit 24V battery terminals",
          description: "A battery short releases massive energy instantly, creating fire risks and terminal destruction.",
          hazardLevel: "danger"
        },
        {
          title: "DO NOT exceed 145V Voc from solar panel array",
          description: "Over-voltage from too many panels in series will permanently burn out the MPPT charge controller.",
          hazardLevel: "danger"
        }
      ],
      installationSteps: [
        "1. Mount inverter vertically in a well-ventilated, dry room away from direct sunlight.",
        "2. Wire 24V battery bank with an in-line 150A DC fuse on the positive lead.",
        "3. Connect battery leads to inverter with correct polarity (+ Red, - Black). Turn inverter on.",
        "4. Connect Solar PV strings through a DC isolator switch.",
        "5. Connect AC Grid Input and AC Consumer Output lines through proper changeover switches."
      ],
      safetyTips: [
        "Wear protective safety glasses when working with battery banks.",
        "Keep at least 20cm clearance around cooling fans for optimal air flow."
      ]
    }
  },
  {
    id: "cec-designer-wall-switch-socket-gold",
    name: "CeC Luxury Tempered Glass 13A Wall Socket with USB-C & USB-A",
    description: "Premium champagne gold tempered glass wall socket. Features dual USB fast-charge ports (1x Type-C PD 20W + 1x USB-A QC 3.0), child safety shutter, and fire-retardant PC backing.",
    price: 12500,
    discountedPrice: 9800,
    images: [
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80"
    ],
    category: "Electrical Accessories",
    inStock: true,
    featured: true,
    rating: 4.7,
    reviewCount: 19,
    features: [
      "Scratch-Resistant Toughened Crystal Glass Panel",
      "Integrated 20W USB-C Power Delivery Fast Charger",
      "13A Universal British Standard 3-Pin Socket with Switch",
      "Built-in Child Protection Safety Shutter",
      "Fire-Retardant 850°C Phosphor Copper Core",
      "Fits standard 86x86mm UK/Nigerian pattress back boxes"
    ],
    specifications: {
      "Rated Current": "13A Max, 250V AC",
      "USB Output": "USB-C: 5V/3A, 9V/2.22A, 12V/1.67A (20W PD)",
      "Panel Size": "86mm x 86mm Standard",
      "Panel Material": "4mm Ultra-Clear Tempered Glass",
      "Color": "Champagne Gold / Crystal White / Obsidian Black",
      "Certifications": "SONCAP, CE, RoHS Compliant"
    }
  }
];

export const productService = {
  async getFeaturedProducts(limitCount = 6): Promise<Product[]> {
    // 1. Try server API
    try {
      const res = await fetch(`/api/products/featured?limit=${encodeURIComponent(String(limitCount))}`);
      if (res.ok) {
        const json = (await res.json()) as { products: any[] };
        if (Array.isArray(json.products) && json.products.length > 0) {
          return json.products as unknown as Product[];
        }
      }
    } catch {}

    // 2. Fallback to client Firestore
    try {
      if (db) {
        const productsQuery = query(
          collection(db, 'products'),
          where('featured', '==', true),
          limit(limitCount)
        );
        const snapshot = await getDocs(productsQuery);
        if (!snapshot.empty) {
          return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[];
        }
      }
    } catch {}

    // 3. Fallback to rich company defaults
    return DEFAULT_COMPANY_PRODUCTS.filter(p => p.featured).slice(0, limitCount);
  },
  
  async getAllProducts(): Promise<Product[]> {
    try {
      const res = await fetch(`/api/products`);
      if (res.ok) {
        const json = await res.json() as { products: any[] };
        if (Array.isArray(json.products) && json.products.length > 0) {
          return json.products as unknown as Product[];
        }
      }
    } catch {}

    try {
      if (db) {
        const productsQuery = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(productsQuery);
        if (!snapshot.empty) {
          return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[];
        }
      }
    } catch {}

    return DEFAULT_COMPANY_PRODUCTS;
  },
  
  async getProductById(id: string): Promise<Product | null> {
    try {
      const res = await fetch(`/api/products/${encodeURIComponent(id)}`);
      if (res.ok) {
        const json = await res.json() as { product?: any };
        if (json.product) return json.product as unknown as Product;
      }
    } catch {}

    try {
      if (db) {
        const productDoc = await getDoc(doc(db, 'products', id));
        if (productDoc.exists()) {
          return { id: productDoc.id, ...productDoc.data() } as Product;
        }
      }
    } catch {}

    const found = DEFAULT_COMPANY_PRODUCTS.find(p => p.id === id);
    if (found) return found;

    return null;
  },
  
  async getProductsByCategory(category: string, limitCount = 10): Promise<Product[]> {
    try {
      const params = new URLSearchParams({ category, limit: String(limitCount) });
      const res = await fetch(`/api/products/category?${params.toString()}`);
      if (res.ok) {
        const json = await res.json() as { products: any[] };
        if (Array.isArray(json.products) && json.products.length > 0) {
          return json.products as unknown as Product[];
        }
      }
    } catch {}

    try {
      if (db) {
        const productsQuery = query(
          collection(db, 'products'),
          where('category', '==', category),
          where('inStock', '==', true),
          limit(limitCount)
        );
        const snapshot = await getDocs(productsQuery);
        if (!snapshot.empty) {
          return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[];
        }
      }
    } catch {}

    return DEFAULT_COMPANY_PRODUCTS.filter(p => p.category.toLowerCase() === category.toLowerCase()).slice(0, limitCount);
  },

  async getProductReviews(productId: string): Promise<ProductReview[]> {
    // 1. Try Firestore
    try {
      if (db) {
        const q = query(collection(db, `products/${productId}/reviews`), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as ProductReview[];
        }
      }
    } catch {}

    // 2. Check localStorage
    if (typeof window !== "undefined") {
      try {
        const saved = JSON.parse(localStorage.getItem(`reviews_${productId}`) || "[]");
        if (saved.length > 0) return saved;
      } catch {}
    }

    // Default sample reviews for CeC Ayigo products
    return [
      {
        id: "rev-1",
        productId,
        userName: "Engr. Babatunde A.",
        rating: 5,
        title: "Superior build quality and zero heat buildup",
        comment: "Installed 12 units on a client's estate in Lekki. Light output is incredibly crisp, and the housing survived our torrential Lagos downpours without condensation. Highly recommended for professionals.",
        verified: true,
        createdAt: "2 days ago"
      },
      {
        id: "rev-2",
        productId,
        userName: "Chidinma O.",
        rating: 5,
        title: "Exact replacement, fast delivery to Surulere",
        comment: "CeC Ayigo delivered within 24 hours of my order. Easy to install and the packaging was robust. Exactly as advertised.",
        verified: true,
        createdAt: "1 week ago"
      }
    ];
  },

  async submitProductReview(productId: string, review: Omit<ProductReview, "id" | "productId" | "createdAt">): Promise<void> {
    const newReview: ProductReview = {
      id: `rev-${Date.now()}`,
      productId,
      ...review,
      verified: true,
      createdAt: "Just now"
    };

    // Save to Firestore
    try {
      if (db) {
        await addDoc(collection(db, `products/${productId}/reviews`), {
          ...newReview,
          createdAt: serverTimestamp()
        });
      }
    } catch (err) {
      console.warn("Firestore review save fallback:", err);
    }

    // Save to localStorage
    if (typeof window !== "undefined") {
      try {
        const key = `reviews_${productId}`;
        const existing = JSON.parse(localStorage.getItem(key) || "[]");
        existing.unshift(newReview);
        localStorage.setItem(key, JSON.stringify(existing));
      } catch {}
    }
  },

  async createProduct(productData: Omit<Product, 'id' | 'createdAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'products'), {
        ...productData,
        createdAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  async updateProduct(id: string, productData: Partial<Omit<Product, 'id' | 'createdAt'>>): Promise<void> {
    try {
      const productRef = doc(db, 'products', id);
      await updateDoc(productRef, {
        ...productData,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }
};
