export interface ProcessedImage {
  originalUrl: string;
  generatedUrl: string | null;
  promptUsed: string;
  timestamp: number;
}

export enum DamageType {
  BROKEN_SEAL = "Broken or tampered seal",
  OPEN_PACKAGE = "Opened package on delivery",
  TORN_PACKAGING = "Torn or ripped packaging",
  CRUSHED_BOX = "Crushed shipping box",
  MISALIGNED_PARTS = "Misaligned or loose parts",
  LEAKAGE = "Leaking contents",
  MISSING_PARTS = "Missing parts or components",
  LABEL_DAMAGED = "Damaged or unreadable label",
  DIRTY_OR_STAINED = "Dirty or stained during transport",
  DEFORMED = "Deformed due to pressure or heat",
  IMPACT_DAMAGE = "Impact damage from drops",
  MOISTURE_EXPOSED = "Exposed to excessive moisture",
  TEMPERATURE_DAMAGE = "Damaged by extreme temperature",
  BROKEN_INTERNAL = "Broken internal components",
  SMALL_DAMAGE = "Small damage on the product",
  SCRATCHES = "Scratches on the product",
  RUST = "Rust on the product",
  CORROSION = "Corrosion on the product",
  SIDE_DENT = "Side dent on the product",
}

export interface AppState {
  originalImage: string | null; // Base64
  generatedImage: string | null; // Base64
  isGenerating: boolean;
  error: string | null;
  selectedDamage: DamageType | null;
  customPrompt: string;
}
