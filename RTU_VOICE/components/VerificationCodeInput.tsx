"use client";
/**
 * components/VerificationCodeInput.tsx
 * -----------------------------------------------------------------
 * Six separate boxes, one for each character of the verification code.
 * Features: letters and numbers allowed, auto-move to the next box, Backspace
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
  const characters = Array.from({ length: CODE_LENGTH }, (_, i) => value[i] ?? "");

  // Send the updated code to the parent screen.
  const commit = (next: string[]) => onChange(next.join("").slice(0, CODE_LENGTH));
  // Move the cursor to box number i (never outside the 6 boxes).
  const focusAt = (i: number) => refs.current[Math.max(0, Math.min(CODE_LENGTH - 1, i))]?.focus();

  // Normalize typed or autofilled text, distributing multiple characters across boxes.
  const handleChange = (i: number, raw: string) => {
    const entered = raw.replace(/[^a-z0-9]/gi, "").toUpperCase().slice(0, CODE_LENGTH - i);
    const next = [...characters];
    for (let offset = 0; offset < entered.length; offset++) next[i + offset] = entered[offset];
    if (!entered) next[i] = "";
    commit(next);
    if (entered) focusAt(i + entered.length);
  };

  // Backspace on an empty box goes back one; arrow keys move left/right.
  const handleKeyDown = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !characters[i]) {
      e.preventDefault();
      if (i === 0) return;
      const next = [...characters];
      next[i - 1] = "";
      commit(next);
      focusAt(i - 1);
    } else if (e.key === "ArrowLeft") focusAt(i - 1);
    else if (e.key === "ArrowRight") focusAt(i + 1);
  };

  // Pasting a code: keep the first 6 letters or numbers and fill all boxes.
  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData("text").replace(/[^a-z0-9]/gi, "").toUpperCase().slice(0, CODE_LENGTH);
    if (!pasted) return;
    e.preventDefault();
    onChange(pasted);
    focusAt(pasted.length);
  };

  return (
    <div className="code" role="group" aria-label={label}>
      {characters.map((character, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          className="code-box"
          inputMode="text"
          autoCapitalize="characters"
          autoComplete={i === 0 ? "one-time-code" : "off"}
          maxLength={CODE_LENGTH}
          spellCheck={false}
          value={character}
          aria-label={`Character ${i + 1}`}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
        />
      ))}
    </div>
  );
}
