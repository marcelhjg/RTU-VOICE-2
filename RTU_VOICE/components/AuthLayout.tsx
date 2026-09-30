/**
 * components/AuthLayout.tsx
 * -----------------------------------------------------------------
 * The shared layout for login, register, forgot password, verify and
 * reset screens: header on top, and a centered card below it.
 */
import type { ReactNode } from "react";
import AuthHeader, { type ActiveNav } from "./AuthHeader";
import { LogoMark } from "./Logo";

interface AuthLayoutProps {
  active: ActiveNav; // which header button to highlight
  children: ReactNode;
}

// The page frame: header + main area.
export default function AuthLayout({ active, children }: AuthLayoutProps) {
  return (
    <div className="page">
      <AuthHeader active={active} />
      <main className="auth-main">{children}</main>
    </div>
  );
}

interface AuthCardProps {
  title: string;
  subtitle?: ReactNode;
  /** Emblem above the heading (Login screen, desktop). */
  showLogo?: boolean;
  children: ReactNode;
}

// The white card in the middle that holds the form.
export function AuthCard({ title, subtitle, showLogo, children }: AuthCardProps) {
  return (
    <section className="auth-card" aria-labelledby="auth-title">
      <div className="auth-head">
        {showLogo && <LogoEmblem />}
        <h1 id="auth-title" className="auth-title">
          {title}
        </h1>
        {subtitle && <p className="auth-sub">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}

// The big logo shown above the "Login" title.
function LogoEmblem() {
  return (
    <div className="auth-emblem">
      <LogoMark size={56} />
    </div>
  );
}
