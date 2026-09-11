import type { SignParams } from "./api";
import type { SignType } from "./types";

/** A parameter input for a sign, driving both the form UI and default params. */
export type Field =
  | {
      name: string;
      label: string;
      kind: "text";
      placeholder?: string;
      /** Only fetch once the value matches (avoids errors on partial input). */
      pattern?: RegExp;
      default: string;
    }
  | {
      name: string;
      label: string;
      kind: "select";
      options: { value: string; label: string }[];
      default: string;
    }
  | {
      name: string;
      label: string;
      kind: "destinations";
      /** `Name:miles` strings, or `Name:miles:direction` when `directed`. */
      default: string[];
      max: number;
      /** Add a per-row travel-direction picker → `Name:miles:direction`. */
      directed?: boolean;
    };

/** Travel directions for a `directed` destinations field (MUTCD D1 guide sign). */
export const DEST_DIRECTIONS = [
  { value: "ahead", label: "Ahead ↑" },
  { value: "left", label: "Left ←" },
  { value: "right", label: "Right →" },
  { value: "bear-left", label: "Bear left ↖" },
  { value: "bear-right", label: "Bear right ↗" },
  { value: "back", label: "Back ↓" },
] as const;

export const SIGN_FIELDS: Partial<Record<SignType, Field[]>> = {
  stop: [
    {
      name: "text",
      label: "Legend (a phrase wraps to multiple lines)",
      kind: "text",
      placeholder: "STOP",
      // Backend R1-1 upper-cases the legend, wraps words onto up to 4 lines,
      // and caps the input at 32 characters. Use `|` to force a line break.
      pattern: /^.{1,32}$/,
      default: "STOP",
    },
  ],
  "street-name": [
    { name: "text", label: "Street name", kind: "text", placeholder: "Main St", default: "" },
  ],
  "speed-limit": [
    {
      name: "unit",
      label: "Units",
      kind: "select",
      default: "mph",
      options: [
        { value: "mph", label: "mph — R2-1" },
        { value: "kmh", label: "km/h — metric R2-1" },
      ],
    },
    {
      name: "limit",
      label: "Limit",
      kind: "text",
      placeholder: "25",
      pattern: /^\d{1,3}$/,
      default: "",
    },
  ],
  milepost: [
    {
      name: "mile",
      label: "Mile",
      kind: "text",
      placeholder: "74.2",
      pattern: /^\d{1,3}(\.\d)?$/,
      default: "74",
    },
    {
      name: "variant",
      label: "Road type",
      kind: "select",
      default: "conventional",
      options: [
        { value: "conventional", label: "Conventional road (10 in)" },
        { value: "freeway", label: "Freeway / expressway (12 in)" },
      ],
    },
    {
      name: "units",
      label: "Legend",
      kind: "select",
      default: "mile",
      options: [
        { value: "mile", label: "MILE (miles)" },
        { value: "km", label: "km (kilometers)" },
      ],
    },
  ],
  distance: [
    {
      name: "dest",
      label: "Destinations",
      kind: "destinations",
      default: ["Stratton:16", "Limon:76"],
      max: 3,
    },
  ],
  guide: [
    {
      name: "heading",
      label: "Heading (optional)",
      kind: "text",
      placeholder: "Junction",
      default: "",
    },
    {
      name: "dest",
      label: "Destinations",
      kind: "destinations",
      default: ["Springfield:24:ahead", "Airport:3:right"],
      max: 3,
      directed: true,
    },
  ],
  "exit-gore": [
    {
      name: "direction",
      label: "Exit side",
      kind: "select",
      default: "right",
      options: [
        { value: "right", label: "Right exit (arrow ↗)" },
        { value: "left", label: "Left exit (arrow ↖)" },
      ],
    },
    {
      name: "exit",
      label: "Exit number (optional → E5-1a)",
      kind: "text",
      placeholder: "44A",
      pattern: /^[1-9]\d{0,2}[A-Za-z]?$/,
      default: "",
    },
  ],
  interstate: [
    {
      name: "number",
      label: "Route number",
      kind: "text",
      placeholder: "80",
      pattern: /^\d{1,3}$/,
      default: "80",
    },
    {
      name: "state",
      label: "State name (optional)",
      kind: "text",
      placeholder: "e.g. New Jersey — M1-1a",
      default: "",
    },
  ],
  "us-route": [
    {
      name: "number",
      label: "Route number",
      kind: "text",
      placeholder: "66",
      pattern: /^\d{1,3}$/,
      default: "66",
    },
  ],
  "state-route": [
    {
      name: "number",
      label: "Route number",
      kind: "text",
      placeholder: "1",
      pattern: /^\d{1,3}$/,
      default: "1",
    },
  ],
  "do-not-enter": [
    {
      name: "text",
      label: "Legend (two lines, separate with |)",
      kind: "text",
      placeholder: "DO NOT|ENTER",
      default: "",
    },
  ],
  "regulatory-sign": [
    {
      name: "text",
      label: "Legend (| or new line forces a line break)",
      kind: "text",
      placeholder: "DO NOT|PASS",
      default: "",
    },
    {
      name: "layout",
      label: "Shape",
      kind: "select",
      default: "auto",
      options: [
        { value: "auto", label: "Auto — size to the legend" },
        { value: "portrait", label: "Portrait — stack more lines" },
        { value: "landscape", label: "Landscape — wider, fewer lines" },
      ],
    },
    {
      name: "color",
      label: "Field",
      kind: "select",
      default: "#ffffff",
      options: [
        { value: "#ffffff", label: "White — black legend" },
        { value: "#c8102e", label: "Red — white legend (WRONG WAY)" },
      ],
    },
  ],
  "prohibition-sign": [
    {
      name: "symbol",
      label: "Movement",
      kind: "select",
      default: "right-turn",
      options: [
        { value: "right-turn", label: "Right turn" },
        { value: "left-turn", label: "Left turn" },
        { value: "u-turn", label: "U-turn" },
        { value: "straight", label: "Straight through" },
        { value: "straight-or-right", label: "Straight or right turn" },
        { value: "straight-or-left", label: "Straight or left turn" },
      ],
    },
    {
      name: "circle",
      label: "Red circle & slash",
      kind: "select",
      default: "yes",
      options: [
        { value: "yes", label: "Yes — prohibited (R3-1 / 2 / 4 / 27)" },
        { value: "no", label: "No — arrow only (R3-5 / 5a / 6)" },
      ],
    },
  ],
  "one-way": [
    {
      name: "style",
      label: "Style",
      kind: "select",
      default: "r6-1",
      options: [
        { value: "r6-1", label: "Horizontal — white arrow (R6-1)" },
        { value: "r6-2", label: "Vertical — stacked over arrow (R6-2)" },
      ],
    },
    {
      name: "direction",
      label: "Arrow",
      kind: "select",
      default: "right",
      options: [
        { value: "right", label: "Right →" },
        { value: "left", label: "Left ←" },
      ],
    },
    {
      name: "text",
      label: "Legend",
      kind: "text",
      placeholder: "ONE WAY",
      default: "",
    },
  ],
  warning: [
    {
      name: "symbol",
      label: "Symbol",
      kind: "select",
      default: "curve-right",
      options: [
        { value: "curve-right", label: "Curve right (W1-2)" },
        { value: "curve-left", label: "Curve left (W1-2)" },
        { value: "turn-right", label: "Turn right (W1-1)" },
        { value: "turn-left", label: "Turn left (W1-1)" },
        { value: "arrow-right", label: "Arrow right" },
        { value: "arrow-left", label: "Arrow left" },
        { value: "pedestrian", label: "Pedestrian crossing (W11-2)" },
        { value: "deer", label: "Deer crossing (W11-3)" },
        { value: "cattle", label: "Cattle crossing (W11-4)" },
        { value: "equestrian", label: "Equestrian crossing (W11-7)" },
        { value: "farm-equipment", label: "Farm equipment (W11-5)" },
        { value: "snowmobile", label: "Snowmobile crossing (W11-6)" },
        { value: "truck", label: "Truck crossing (W11-10)" },
        { value: "fire-station", label: "Fire station (W11-8)" },
        { value: "bicycle", label: "Bicycle crossing (W11-1)" },
        { value: "merge", label: "Merge (W4-1)" },
        { value: "entering-roadway-merge", label: "Entering roadway merge (W4-5)" },
        { value: "entering-roadway-merge-left", label: "Entering roadway merge, left (W4-5)" },
      ],
    },
    {
      name: "text",
      label: "Or a word message (overrides the symbol)",
      kind: "text",
      placeholder: "CURVE AHEAD",
      default: "",
    },
  ],
  "work-zone": [
    {
      name: "text",
      label: "Message",
      kind: "text",
      placeholder: "ROAD WORK AHEAD",
      default: "ROAD WORK AHEAD",
    },
  ],
  "no-passing-zone": [
    {
      name: "color",
      label: "Background",
      kind: "select",
      default: "#ffcd00",
      options: [
        { value: "#ffcd00", label: "Yellow — MUTCD W14-3" },
        { value: "#ff7900", label: "Orange" },
      ],
    },
    {
      name: "text",
      label: "Legend",
      kind: "text",
      placeholder: "NO PASSING ZONE",
      default: "NO PASSING ZONE",
    },
  ],
};

/** The params a sign should be generated with before the user touches anything. */
export function defaultsFor(type: SignType): SignParams {
  // `palette` is a universal option, not a per-sign field — see `signParams.ts`.
  const out: SignParams = { palette: "standard" };
  for (const field of SIGN_FIELDS[type] ?? []) {
    if (field.kind === "destinations") out[field.name] = field.default;
    else if (field.default) out[field.name] = field.default;
  }
  return out;
}

/**
 * "Popular meme signs" — one-click "populate + generate" shortcuts, keyed by the
 * sign they belong on, shown as a grid below the preview while that type is
 * selected. Mostly number lore (42, 66, 69, 88, 404, 420, 666, 777, 911, …);
 * the mph speed-limit tops out at 120 on the backend, so the big numbers live
 * on the route / exit / distance / milepost signs instead.
 */
export type MemePreset = {
  emoji: string;
  label: string;
  params: SignParams;
};

export const MEME_PRESETS: Partial<Record<SignType, MemePreset[]>> = {
  "speed-limit": [
    { emoji: "🚗", label: "88 — Back to the Future", params: { limit: "88" } },
    { emoji: "🎸", label: "55 — can't drive 55", params: { limit: "55" } },
    { emoji: "😎", label: "69 — nice", params: { limit: "69" } },
    { emoji: "🔢", label: "67 — six seven", params: { limit: "67" } },
    { emoji: "🌌", label: "42 — the Answer", params: { limit: "42" } },
    { emoji: "💯", label: "100 — full marks", params: { limit: "100" } },
    { emoji: "🃏", label: "13 — unlucky", params: { limit: "13" } },
  ],
  "exit-gore": [
    { emoji: "😎", label: "Exit 69", params: { direction: "right", exit: "69" } },
    { emoji: "🌿", label: "Exit 420", params: { direction: "right", exit: "420" } },
    { emoji: "🚫", label: "Exit 404 — not found", params: { direction: "right", exit: "404" } },
    { emoji: "😈", label: "Exit 666", params: { direction: "right", exit: "666" } },
    { emoji: "🎰", label: "Exit 777 — jackpot", params: { direction: "right", exit: "777" } },
    { emoji: "🌌", label: "Exit 42", params: { direction: "right", exit: "42" } },
  ],
  distance: [
    { emoji: "😎", label: "Nice — 69 mi", params: { dest: ["Nice:69"] } },
    { emoji: "🌿", label: "Blaze It — 420 mi", params: { dest: ["Blaze It:420"] } },
    { emoji: "🌌", label: "The Answer — 42 mi", params: { dest: ["The Answer:42"] } },
    { emoji: "😈", label: "Hell — 666 mi", params: { dest: ["Hell:666"] } },
    { emoji: "🎰", label: "Vegas — 777 mi", params: { dest: ["Vegas:777"] } },
    { emoji: "🚫", label: "Nowhere — 404 mi", params: { dest: ["Nowhere:404"] } },
  ],
  guide: [
    {
      emoji: "😎",
      label: "Nice ← / Blaze It →",
      params: { dest: ["Nice:69:left", "Blaze It:420:right"] },
    },
    {
      emoji: "🌌",
      label: "The Answer — 42 mi",
      params: { dest: ["The Answer:42:ahead"] },
    },
    {
      emoji: "🎰",
      label: "Hell ← / Vegas →",
      params: { dest: ["Hell:666:left", "Vegas:777:right"] },
    },
  ],
  milepost: [
    { emoji: "🌿", label: "Mile 420 — the stolen one", params: { mile: "420" } },
    { emoji: "😎", label: "Mile 69", params: { mile: "69" } },
    { emoji: "🔢", label: "Mile 67", params: { mile: "67" } },
    { emoji: "🚗", label: "Mile 88", params: { mile: "88" } },
    { emoji: "🌌", label: "Mile 42 — the Answer", params: { mile: "42" } },
    { emoji: "😈", label: "Mile 666", params: { mile: "666" } },
    { emoji: "🚨", label: "Mile 911", params: { mile: "911" } },
  ],
  interstate: [
    { emoji: "😎", label: "I-69", params: { number: "69" } },
    { emoji: "🌿", label: "I-420", params: { number: "420" } },
    { emoji: "🔢", label: "I-67", params: { number: "67" } },
    { emoji: "🛣️", label: "I-66", params: { number: "66" } },
    { emoji: "🚗", label: "I-88", params: { number: "88" } },
    { emoji: "🌌", label: "I-42", params: { number: "42" } },
  ],
  "us-route": [
    { emoji: "🛣️", label: "Route 66 — get your kicks", params: { number: "66" } },
    { emoji: "😈", label: "US 666 — the Devil's Highway", params: { number: "666" } },
    { emoji: "🃏", label: "US 13 — unlucky", params: { number: "13" } },
    { emoji: "😎", label: "US 69", params: { number: "69" } },
  ],
  "state-route": [
    { emoji: "🌊", label: "SR 1 — the coast road", params: { number: "1" } },
    { emoji: "🌿", label: "SR 420", params: { number: "420" } },
    { emoji: "😎", label: "SR 69", params: { number: "69" } },
    { emoji: "🌌", label: "SR 42", params: { number: "42" } },
  ],
  "street-name": [
    { emoji: "🍪", label: "Sesame St", params: { text: "Sesame St" } },
    { emoji: "⚡", label: "Electric Ave", params: { text: "Electric Ave" } },
    { emoji: "🎸", label: "Abbey Rd", params: { text: "Abbey Rd" } },
    { emoji: "🕵️", label: "Baker St", params: { text: "Baker St" } },
    { emoji: "😱", label: "Elm St", params: { text: "Elm St" } },
  ],
  "do-not-enter": [
    { emoji: "🙅", label: "NO U", params: { text: "NO|U" } },
    { emoji: "🚪", label: "GET OUT", params: { text: "GET|OUT" } },
    { emoji: "🔙", label: "TURN BACK", params: { text: "TURN|BACK" } },
  ],
  "one-way": [
    { emoji: "🙅", label: "NO WAY", params: { direction: "right", text: "NO WAY" } },
    { emoji: "🎤", label: "MY WAY", params: { direction: "right", text: "MY WAY" } },
    { emoji: "🛣️", label: "THIS WAY", params: { direction: "right", text: "THIS WAY" } },
    { emoji: "↩️", label: "WRONG WAY", params: { direction: "left", text: "WRONG WAY" } },
  ],
  "regulatory-sign": [
    { emoji: "🚫", label: "DO NOT PASS (R4-1)", params: { text: "DO NOT PASS" } },
    {
      emoji: "↩️",
      label: "WRONG WAY (R5-1a)",
      params: { text: "WRONG WAY", color: "#c8102e" },
    },
    { emoji: "🚧", label: "ROAD CLOSED (R11-2)", params: { text: "ROAD CLOSED" } },
    { emoji: "🙃", label: "DO NOT CARE", params: { text: "DO NOT CARE" } },
    { emoji: "😴", label: "STAY IN LANE (R4-9)", params: { text: "STAY IN LANE" } },
    { emoji: "💸", label: "FINES HIGHER (R2-6P)", params: { text: "FINES HIGHER" } },
    { emoji: "🛑", label: "DO NOT ENGAGE", params: { text: "DO NOT ENGAGE" } },
  ],
};
