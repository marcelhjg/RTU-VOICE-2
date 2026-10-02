/**
 * components/StudentShell.tsx
 * -----------------------------------------------------------------
 * The frame around every student page:
 *   - top bar with the menu (hamburger) button and the logo
 *   - the slide-out side menu (drawer) with the navigation links
 *   - only students can see it (RequireRole sends everyone else away)
 */
"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { ComponentType, ReactNode, SVGProps } from "react";
import { ClockIcon, FileIcon, GlobeIcon, HomeIcon, LogoutIcon, MenuIcon, SearchIcon, WarningIcon } from "./Icons";
import LogoutConfirmationModal from "./LogoutConfirmationModal";
import Logo, { LogoMark } from "./Logo";
import RequireRole from "./RequireRole";
import { useAuth } from "@/lib/auth";

// The links shown in the side menu: where they go, their text, and their icon.
type IconType = ComponentType<SVGProps<SVGSVGElement>>;
const NAV: ReadonlyArray<{ href: string; label: string; icon: IconType }> = [
  { href: "/dashboard", label: "Home", icon: HomeIcon },
  { href: "/submit", label: "Submit Complaint", icon: FileIcon },
  { href: "/track", label: "Track Status", icon: SearchIcon },
  { href: "/public", label: "Public Dashboard", icon: GlobeIcon },
  { href: "/history", label: "History", icon: ClockIcon },
];

// The actual layout (kept separate so RequireRole can protect it at the bottom).
function Shell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const [open, setOpen] = useState(false); // is the side menu open?
  const [logoutOpen, setLogoutOpen] = useState(false);

  // Close the menu whenever the user goes to another page.
  useEffect(() => setOpen(false), [pathname]);

  // While the menu is open: lock page scrolling and let the Esc key close it.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="page">
      {/* Top bar: menu button + logo (logo links back to the dashboard) */}
      <header className="app-header">
        <div className="app-header-inner">
          <button
            type="button"
            className="icon-btn"
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls="student-drawer"
            onClick={() => setOpen(true)}
          >
            <MenuIcon />
          </button>
          <Logo size={60} href="/dashboard" />
        </div>
      </header>

      {/* Warning banner, shown only on the Submit Complaint page */}
      {pathname === "/submit" && (
        <div className="notice" role="note">
          <WarningIcon />
          <p>
            <span className="only-desktop">
              Please provide clear details and supporting evidence. Anonymous submissions may be reviewed slower than verified reports.
            </span>
            <span className="only-mobile">Provide clear details and evidence. Anonymous reports may be reviewed slower.</span>
          </p>
        </div>
      )}

      {/* Dark overlay behind the menu; clicking it closes the menu */}
      <div className={`scrim ${open ? "open" : ""}`} onClick={() => setOpen(false)} aria-hidden="true" />
      <aside id="student-drawer" className={`drawer ${open ? "open" : ""}`} aria-label="Main navigation" inert={!open}>
        {/* Menu top: logo in a white circle (so it is visible on the dark blue) + name */}
        <div className="drawer-brand">
          <span className="logo-box round">
            <LogoMark size={34} />
          </span>
          <div>
            <p className="drawer-name">RTU Voice</p>
            <p className="drawer-sub">Rizal Technological University – Pasig Branch</p>
          </div>
        </div>
        {/* Navigation links; the current page is highlighted */}
        <nav className="drawer-nav">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link key={href} href={href} className={`drawer-link ${active ? "active" : ""}`} aria-current={active ? "page" : undefined}>
                <Icon />
                {label}
              </Link>
            );
          })}
        </nav>
        {/* Logout button at the bottom of the menu */}
        <div className="drawer-foot">
          <button type="button" className="drawer-link" onClick={() => setLogoutOpen(true)}>
            <LogoutIcon />
            Logout
          </button>
        </div>
      </aside>

      {/* The page content goes here */}
      <main className="app-main">{children}</main>
      {logoutOpen && (
        <LogoutConfirmationModal
          onClose={() => setLogoutOpen(false)}
          onConfirm={() => {
            logout();
            router.replace("/login");
          }}
        />
      )}
    </div>
  );
}

// What other files import: the shell, protected so only students can enter.
export default function StudentShell({ children }: { children: ReactNode }) {
  return (
    <RequireRole role="student">
      <Shell>{children}</Shell>
    </RequireRole>
  );
}
