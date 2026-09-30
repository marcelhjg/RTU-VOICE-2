/**
 * lib/format.ts
 * -----------------------------------------------------------------
 * Small helper functions that change data into text that is nice to
 * read: dates, file sizes, short previews, and tracking IDs.
 */

// Use UTC so a date never shifts to another day on different computers.
const opts = { timeZone: "UTC" } as const;

/** "Sep 20" */
export function shortDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { ...opts, month: "short", day: "2-digit" });
}

/** "September 20, 2026" */
export function longDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { ...opts, month: "long", day: "numeric", year: "numeric" });
}

/** "Sep 20, 2026" */
export function mediumDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { ...opts, month: "short", day: "numeric", year: "numeric" });
}

// Turns a number of bytes into "512 B", "34 KB" or "1.2 MB".
export function fileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// Cuts long text down to `max` characters and adds "…" (used for card previews).
export function excerpt(text: string, max: number): string {
  const clean = text.replace(/\s+/g, " ").trim(); // remove extra spaces and line breaks
  return clean.length > max ? `${clean.slice(0, max - 1).trimEnd()}…` : clean;
}

/** TRK-8F3K-92QD -> TRK-8F3K (used in compact department views) */
export function shortId(id: string): string {
  return id.slice(0, 8);
}

// Letters and numbers allowed in a tracking ID.
// Confusing ones (O, 0, I, 1) are left out so people do not misread them.
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

// Makes a random piece of text with `n` characters.
function chunk(n: number): string {
  let s = "";
  for (let i = 0; i < n; i++) s += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  return s;
}

// Makes a tracking ID like TRK-8F3K-92QD. It keeps trying until the ID is not already used.
export function generateTrackingId(existing: ReadonlySet<string>): string {
  let id = `TRK-${chunk(4)}-${chunk(4)}`;
  while (existing.has(id)) id = `TRK-${chunk(4)}-${chunk(4)}`;
  return id;
}
