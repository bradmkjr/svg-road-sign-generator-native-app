// Mirrors the backend contract in
// ../svg-road-sign-generator-backend/src/signs/types.ts — keep in sync.
// Also mirrors svg-road-sign-generator-frontend/src/lib/types.ts.

/** Every sign type the app links. The backend also serves the hidden
 *  Forest Service signs (frd-sign, trail-junction, …) which live elsewhere. */
export const SIGN_TYPES = [
  "stop",
  "yield",
  "speed-limit",
  "street-name",
  "milepost",
  "distance",
  "guide",
  "exit-gore",
  "interstate",
  "us-route",
  "state-route",
  "do-not-enter",
  "regulatory-sign",
  "prohibition-sign",
  "one-way",
  "warning",
  "work-zone",
  "no-passing-zone",
] as const;

export type SignType = (typeof SIGN_TYPES)[number];

export interface SignInfo {
  type: SignType;
  label: string;
  description: string;
}

export interface SignMeta {
  width: number;
  height: number;
  params: Record<string, string | number>;
}

export interface SignResponse {
  type: SignType;
  svg: string;
  meta: SignMeta;
}

export interface SignListResponse {
  signs: SignInfo[];
}
