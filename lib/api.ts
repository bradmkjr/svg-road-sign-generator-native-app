import { Platform } from "react-native";
import type { SignInfo, SignListResponse, SignResponse, SignType } from "./types";

// Android emulator can't reach the host machine via `localhost` — it needs the
// special `10.0.2.2` alias. iOS simulator and web both resolve `localhost` fine.
// A physical device (Expo Go over LAN) needs EXPO_PUBLIC_API_BASE_URL set to the
// dev machine's LAN IP, e.g. `http://192.168.1.23:4000`.
const DEFAULT_BASE_URL =
  Platform.OS === "android" ? "http://10.0.2.2:4000" : "http://localhost:4000";

const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? DEFAULT_BASE_URL;

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, init);
  } catch {
    throw new ApiError(`Could not reach the sign API at ${BASE_URL}`, 0);
  }

  const body = (await res.json().catch(() => null)) as
    | (T & { error?: string })
    | null;

  if (!res.ok) {
    throw new ApiError(body?.error ?? res.statusText, res.status);
  }
  return body as T;
}

/**
 * Sign types the backend serves but the app hides (code stays, UI doesn't
 * link them). Includes the Forest Service trail / forest road signs, which
 * live on Trail-Signs.work instead. Mirrors the frontend's HIDDEN_SIGN_TYPES.
 */
const HIDDEN_SIGN_TYPES = new Set<string>([
  "frd-sign",
  "trail-junction",
  "nra-sign",
  "recreation-site",
]);

export async function getSigns(): Promise<SignInfo[]> {
  const r = await request<SignListResponse>("/api/signs");
  return r.signs.filter((s) => !HIDDEN_SIGN_TYPES.has(s.type));
}

/** Params where a value may be repeated (e.g. `dest`). */
export type SignParams = Record<string, string | string[]>;

function toQuery(params: SignParams): URLSearchParams {
  const q = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    // `palette=standard` is the default — never worth putting in a URL.
    if (key === "palette" && value === "standard") continue;
    for (const v of Array.isArray(value) ? value : [value]) {
      if (v !== "") q.append(key, v);
    }
  }
  return q;
}

export function getSign(type: SignType, params: SignParams = {}): Promise<SignResponse> {
  const query = toQuery(params).toString();
  return request<SignResponse>(`/api/signs/${type}${query ? `?${query}` : ""}`);
}

/**
 * PNG aspect-ratio framing. `minimal` is the sign's own bounding box; the others
 * pad it with transparent pixels. `4x3` / `16x9` flip to portrait for a
 * taller-than-wide sign — the backend picks the orientation.
 */
export type PngRatio = "minimal" | "1x1" | "4x3" | "16x9";

/**
 * Output size — the pixel box the sign is scaled to fit inside (transparent
 * padding aside). `full` (4500×5400) is the print-ready max; `large` (3000×3600,
 * the default), `medium` (1600×1920), `small` (800×960) and `tiny` (400×480)
 * are for web use.
 */
export type PngSize = "tiny" | "small" | "medium" | "large" | "full";

/**
 * URL for the PNG (transparent, trimmed, @ 300 DPI). `ratio` pads the sign to a
 * fixed aspect (default `minimal` = no padding); `size` sets the pixel box
 * (default `large`).
 */
export function signPngUrl(
  type: SignType,
  params: SignParams = {},
  opts: { ratio?: PngRatio; size?: PngSize } = {},
): string {
  const q = toQuery(params);
  if (opts.ratio && opts.ratio !== "minimal") q.set("ratio", opts.ratio);
  if (opts.size && opts.size !== "large") q.set("size", opts.size);
  const query = q.toString();
  return `${BASE_URL}/api/signs/${type}.png${query ? `?${query}` : ""}`;
}
