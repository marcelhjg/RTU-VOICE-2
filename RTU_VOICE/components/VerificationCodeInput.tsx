"use client";
/**
 * components/VerificationCodeInput.tsx
 * -----------------------------------------------------------------
 * Six separate boxes, one for each digit of the verification code.
 * Features: only numbers allowed, auto-move to the next box, Backspace
 * goes to the previous box, arrow keys move around, and pasting a full
 * code fills all boxes.
 */
import { useRef } from "react";
import type { ClipboardEvent, KeyboardEvent } from "react";
import { CODE_LENGTH, type VerificationCode } from "@/types/auth";

interface Props {
  value: VerificationCode;
  onChange: (next: VerificationCode) => void;
  label?: string;
}

export default function VerificationCodeInput({ value, onChange, label = "Verification code" }: Props) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  // Split the code into 6 slots (empty text for boxes not yet filled).
  const digits = Array.from({ length: CODE_LENGTH }, (_, i) => value[i] ?? "");

  // Send the updated code to the parent screen.
  const commit = (next: string[]) => onChange(next.join("").slice(0, CODE_LENGTH));
  // Move the cursor to box number i (never outside the 6 boxes).
  const focusAt = (i: number) => refs.current[Math.max(0, Math.min(CODE_LENGTH - 1, i))]?.focus();

  // Typing a digit: keep only the last number typed, then jump to the next box.
  const handleChange = (i: number, raw: string) => {
    const d = raw.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[i] = d;
    commit(next);
    if (d) focusAt(i + 1);
  };

  // Backspace on an empty box goes back one; arrow keys move left/right.
  const handleKeyDown = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[i]) {
      e.preventDefault();
      const next = [...digits];
      next[i - 1] = "";
      commit(next);
      focusAt(i - 1);
    } else if (e.key === "ArrowLeft") focusAt(i - 1);
    else if (e.key === "ArrowRight") focusAt(i + 1);
  };

  // Pasting a code: keep the first 6 digits and fill all the boxes at once.
  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, CODE_LENGTH);
    if (!pasted) return;
    e.preventDefault();
    onChange(pasted);
    focusAt(pasted.length);
  };

  return (
    <div className="code" role="group" aria-label={label}>
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          className="code-box"
          inputMode="numeric"
          autoComplete={i === 0 ? "one-time-code" : "off"}
          maxLength={1}
          value={d}
          aria-label={`Digit ${i + 1}`}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
        />
      ))}
    </div>
  );
}
