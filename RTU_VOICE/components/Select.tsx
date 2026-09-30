/**
 * components/Select.tsx
 * -----------------------------------------------------------------
 * A ready-made dropdown (select box). Give it a list of options and it
 * creates the choices. Used for categories, statuses and departments.
 */
import type { SelectHTMLAttributes } from "react";

// An option can be plain text ("Academic") or { value, label } when they differ.
export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "children"> {
  id: string;
  label?: string;
  options: ReadonlyArray<SelectOption | string>;
  /** Adds an empty first option, e.g. "Select department". */
  placeholder?: string;
  variant?: "field" | "compact"; // "compact" = smaller version used in the filter bar
}

export default function Select({ id, label, options, placeholder, variant = "field", className = "", ...rest }: SelectProps) {
  return (
    <div className={variant === "field" ? "field" : "field-inline"}>
      {label && (
        <label htmlFor={id} className="label">
          {label}
        </label>
      )}
      <select id={id} className={`select ${variant === "compact" ? "select-compact" : ""} ${className}`} {...rest}>
        {/* Empty first choice such as "Category" or "Select department" */}
        {placeholder !== undefined && <option value="">{placeholder}</option>}
        {/* Turn each option into an <option> element */}
        {options.map((o) => {
          const opt = typeof o === "string" ? { value: o, label: o } : o;
          return (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          );
        })}
      </select>
    </div>
  );
}
