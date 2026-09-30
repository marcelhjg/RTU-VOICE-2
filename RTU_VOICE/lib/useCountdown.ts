/**
 * lib/useCountdown.ts
 * -----------------------------------------------------------------
 * A small hook for the "Resend code in 30s" timer on the
 * verification screens.
 */
"use client";
import { useCallback, useEffect, useState } from "react";

/** Counts down once per second from `seconds`; `restart` resets it. */
export function useCountdown(seconds: number) {
  const [remaining, setRemaining] = useState(seconds);

  // Every second, subtract 1 until it reaches 0.
  useEffect(() => {
    if (remaining <= 0) return;
    const id = window.setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => window.clearTimeout(id); // clean up the timer when needed
  }, [remaining]);

  // Puts the timer back to the starting number (used by the "Resend" button).
  const restart = useCallback(() => setRemaining(seconds), [seconds]);
  return { remaining, restart };
}
