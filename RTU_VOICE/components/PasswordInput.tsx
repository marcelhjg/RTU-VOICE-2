"use client";
/**
 * components/PasswordInput.tsx
 * -----------------------------------------------------------------
 * A password field with a small eye button that shows or hides the
 * password. It reuses the normal <Input> component.
 */
import { useState } from "react";
import Input, { type InputProps } from "./Input";
import { EyeIcon, EyeOffIcon } from "./Icons";

type PasswordInputProps = Omit<InputProps, "type" | "trailing">;

export default function PasswordInput(props: PasswordInputProps) {
  const [visible, setVisible] = useState(false); // is the password currently shown as plain text?
  return (
    <Input
      {...props}
      type={visible ? "text" : "password"} // "password" hides the letters
      trailing={
        <button
          type="button"
          className="eye"
          onClick={() => setVisible((v) => !v)} // click = switch between show and hide
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
        >
          {visible ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      }
    />
  );
}
