/**
 * components/console/ConsoleHeader.tsx
 * -----------------------------------------------------------------
 * The dark blue top bar shared by the Admin and Department pages:
 * logo + name on the left, the page label and a Logout button on the right.
 */
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import LogoutConfirmationModal from "../LogoutConfirmationModal";
import { LogoMark } from "../Logo";
import { useAuth } from "@/lib/auth";

// label = text on desktop, shortLabel = shorter text on phones.
export default function ConsoleHeader({ label, shortLabel }: { label: string; shortLabel: string }) {
  const router = useRouter();
  const { logout } = useAuth();
  const [logoutOpen, setLogoutOpen] = useState(false);
  return (
    <>
      <header className="console-header">
        <div className="console-inner">
          {/* Match the circular logo holder used in the student side menu. */}
          <div className="logo">
            <span className="logo-box round">
              <LogoMark size={36} />
            </span>
            <span className="logo-text">RTU Voice</span>
          </div>
          <div className="console-right">
            <span className="console-label">
              <span className="only-desktop">{label}</span>
              <span className="only-mobile">{shortLabel}</span>
            </span>
            <button type="button" className="console-logout" onClick={() => setLogoutOpen(true)}>
              Logout
            </button>
          </div>
        </div>
      </header>
      {logoutOpen && (
        <LogoutConfirmationModal
          onClose={() => setLogoutOpen(false)}
          onConfirm={() => {
            logout();
            router.replace("/login");
          }}
        />
      )}
    </>
  );
}
