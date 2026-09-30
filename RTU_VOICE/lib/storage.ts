/**
 * lib/storage.ts
 * -----------------------------------------------------------------
 * Small "safe" helpers for localStorage (the little storage inside the
 * browser). Because there is no backend yet, this is where the demo
 * remembers things like the logged-in user and the complaints.
 * Each helper uses try/catch so the app does not crash if the browser
 * blocks storage (for example in private mode).
 */

// Read a saved value. If nothing is saved (or it fails), return `fallback`.
export function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

// Save a value (it is turned into text with JSON.stringify first).
export function writeJSON(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable or full: ignore */
  }
}

// Delete a saved value (used when logging out).
export function removeKey(key: string): void {
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}
