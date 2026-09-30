/**
 * components/RequireRole.tsx
 * -----------------------------------------------------------------
 * A "gatekeeper". Wrap a page with it to say "only this role may see
 * this". Example: <RequireRole role="admin"> ... </RequireRole>
 *   - Not logged in      -> sent to /login
 *   - Wrong role         -> sent to their own home page
 *   - Correct role       -> the page is shown
 * This is only a front-end check. The backend must enforce it for real.
 */
"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import type { ReactNode } from "react";
import { homeFor, useAuth } from "@/lib/auth";
import type { Role } from "@/types/user";

/** Client-side role gate (RBAC placeholder; the backend must enforce this for real). */
export default function RequireRole({ role, children }: { role: Role; children: ReactNode }) {
  const { user, ready } = useAuth();
  const router = useRouter();
  // Allowed only after the saved login was read AND the role matches.
  const allowed = ready && user?.role === role;

  // Redirect people who are not allowed.
  useEffect(() => {
    if (!ready) return; // wait until we know who is logged in
    if (!user) router.replace("/login");
    else if (user.role !== role) router.replace(homeFor(user.role));
  }, [ready, user, role, router]);

  // Show nothing until allowed (prevents a flash of the wrong page).
  return allowed ? <>{children}</> : null;
}
