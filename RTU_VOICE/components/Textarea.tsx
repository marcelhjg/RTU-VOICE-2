/**
 * components/Textarea.tsx
 * -----------------------------------------------------------------
 * A ready-made multi-line text box (for descriptions) with a label, an
 * optional character counter, and an error message.
 */
import type { TextareaHTMLAttributes } from "react";
import { WarningIcon } from "./Icons";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string;
  label: string;
  error?: string;
  /** Shows a "0 / 2000" counter when maxLength and a string value are provided. */
  counter?: boolean;
}

export default function Textarea({ id, label, error, counter, className = "", ...rest }: TextareaProps) {
  // How many characters have been typed (for the "0 / 2000" counter).
  const length = typeof rest.value === "string" ? rest.value.length : 0;
  return (
    <div className="field">
      <label htmlFor={id} className="label">
        {label}
      </label>
      <textarea
        id={id}
        className={`input textarea ${error ? "input-error" : ""} ${className}`}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        {...rest}
      />
      {/* Character counter, shown only when `counter` and `maxLength` are given */}
      {counter && rest.maxLength ? (
        <p className="counter" aria-live="polite">
          {length} / {rest.maxLength}
        </p>
      ) : null}
      {error && (
        <p id={`${id}-error`} className="field-error" role="alert">
          <WarningIcon /> {error}
        </p>
      )}
    </div>
  );
}
