/**
 * components/Input.tsx
 * -----------------------------------------------------------------
 * A ready-made text field: label on top, the input box, and an error or
 * hint message below. Used by the login, register and reset forms.
 */
import type { InputHTMLAttributes, ReactNode } from "react";
import { WarningIcon } from "./Icons";

// Props = the settings you can pass in when using <Input ... />.
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string; // links the label to the input
  label: string; // text shown above the box
  error?: string; // red message shown when the value is invalid
  hint?: string; // small gray helper text
  /** Element rendered inside the field at the right edge (e.g. show/hide). */
  trailing?: ReactNode;
}

export default function Input({ id, label, error, hint, trailing, className = "", ...rest }: InputProps) {
  // Tells screen readers which message belongs to this input.
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  return (
    <div className="field">
      <label htmlFor={id} className="label">
        {label}
      </label>
      <div className="control">
        <input
          id={id}
          className={`input ${error ? "input-error" : ""} ${trailing ? "input-has-trailing" : ""} ${className}`}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          {...rest}
        />
        {trailing} {/* e.g. the show/hide eye button */}
      </div>
      {error ? (
        <p id={`${id}-error`} className="field-error" role="alert">
          <WarningIcon /> {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="field-hint">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
