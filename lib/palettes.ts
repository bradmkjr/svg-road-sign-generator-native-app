// Mirrors PALETTES in ../svg-road-sign-generator-backend/src/signs/palettes.ts
// and svg-road-sign-generator-frontend/src/lib/palettes.ts — keep in sync.

export type PaletteId =
  | "standard"
  | "mono"
  | "sepia"
  | "blueprint"
  | "noir"
  | "slate"
  | "kraft"
  | "rose";

export const PALETTES: { id: PaletteId; label: string }[] = [
  { id: "standard", label: "Standard (FHWA)" },
  { id: "mono", label: "Monochrome" },
  { id: "sepia", label: "Sepia" },
  { id: "blueprint", label: "Blueprint" },
  { id: "noir", label: "Noir" },
  { id: "slate", label: "Slate" },
  { id: "kraft", label: "Kraft" },
  { id: "rose", label: "Rose" },
];

export const DEFAULT_PALETTE: PaletteId = "standard";

/** Human label for a palette id (falls back to the id). */
export function paletteLabel(id: string): string {
  return PALETTES.find((p) => p.id === id)?.label ?? id;
}
