export const GUIDE_CATEGORIES = [
  { id: "lighting", label: "LED & Floodlights" },
  { id: "floodlights", label: "Solar Floodlights" },
  { id: "streetlights", label: "Solar Streetlights" },
  { id: "camera-streetlights", label: "Streetlights with Cameras" },
  { id: "cameras", label: "Solar Cameras" },
  { id: "fans", label: "Solar Fans" },
  { id: "panels", label: "Solar Panels" },
  { id: "solar", label: "Solar Inverters & Batteries" },
  { id: "generators", label: "Generators & Kits" },
  { id: "breakers", label: "Smart Breakers & DB" },
  { id: "wiring", label: "Wiring & Cables" },
  { id: "general", label: "General Safety" },
];

export const guideCategoryLabel = (id: string) =>
  GUIDE_CATEGORIES.find((c) => c.id === id)?.label ?? id;