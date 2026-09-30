/**
 * components/Button.tsx
 * -----------------------------------------------------------------
 * The one button used across the whole site. Give it a `variant` to change
 * its look (primary, outline, nav, gold, approve, reject, assign).
 * If you pass `href` it becomes a link; otherwise it is a normal button.
 * The colors and sizes are in styles/globals.css and styles/app.css.
 */
import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

// The available looks.
export type ButtonVariant = "primary" | "outline" | "nav" | "gold" | "approve" | "reject" | "assign";

// Settings that both the link version and the button version accept.
interface CommonProps {
  variant?: ButtonVariant;
  /** Full-width (form) button. */
  block?: boolean;
  /** Pill shape used in the header. */
  pill?: boolean;
  /** Compact table/card action button. */
  small?: boolean;
  className?: string;
  children: ReactNode;
}

type ButtonProps = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps> & { href?: undefined };
type LinkButtonProps = CommonProps & { href: string; "aria-current"?: "page" };

// Decides between <Link> (has href) and <button> (no href).
export default function Button(props: ButtonProps | LinkButtonProps) {
  const { variant = "primary", block, pill, small, className = "", children, ...rest } = props;
  // Build the CSS class list, e.g. "btn btn-primary btn-block".
  const cls = [
    "btn",
    `btn-${variant}`,
    block ? "btn-block" : "",
    pill ? "btn-pill" : "",
    small ? "btn-sm" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // Has an href -> render a link that looks like a button.
  if ("href" in rest && rest.href !== undefined) {
    const { href, ...linkRest } = rest as { href: string };
    return (
      <Link href={href} className={cls} {...linkRest}>
        {children}
      </Link>
    );
  }
  // No href -> render a real <button> (default type="button" so it does not submit forms by accident).
  const { type = "button", ...buttonRest } = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button type={type} className={cls} {...buttonRest}>
      {children}
    </button>
  );
}
