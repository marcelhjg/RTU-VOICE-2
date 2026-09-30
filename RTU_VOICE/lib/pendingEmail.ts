/**
 * lib/pendingEmail.ts
 * -----------------------------------------------------------------
 * Remembers which email the user typed on the Register / Forgot
 * password screen, so the next screen (Verify) can show it.
 * MOCK ONLY: a real backend would handle this instead.
 */
"use client";
import { useEffect, useState } from "react";

const KEY = "rtuvoice:pending-email"; // name used in sessionStorage
export const FALLBACK_EMAIL = "name@rtu.edu.ph"; // shown if nothing was saved

/** Mock-only: carries the email between screens without a backend. */
export function savePendingEmail(email: string): void {
  try {
    sessionStorage.setItem(KEY, email.trim());
  } catch {
    /* storage unavailable: fall back to sample email */
  }
}

// Hook: gives the saved email (or the sample one) to a screen.
export function usePendingEmail(): string {
  const [email, setEmail] = useState(FALLBACK_EMAIL);
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(KEY);
      if (stored) setEmail(stored);
    } catch {
      /* ignore */
    }
  }, []);
  return email;
}
