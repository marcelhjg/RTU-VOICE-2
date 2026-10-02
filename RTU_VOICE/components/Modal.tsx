"use client";
/**
 * components/Modal.tsx
 * -----------------------------------------------------------------
 * A pop-up window (dialog) shown on top of the page, used for complaint
 * details, assigning and reassigning. It locks page scrolling, keeps the
 * Tab key inside the pop-up, and closes with Esc or a click outside.
 */
import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { CloseIcon } from "./Icons";

interface ModalProps {
  title?: string;
  headerIcon?: ReactNode;
  onClose?: () => void;
  /** When false the dialog has no close button and ignores Esc / backdrop clicks. */
  dismissible?: boolean;
  className?: string;
  children: ReactNode;
}

// Everything inside the pop-up that the keyboard can focus (used to keep Tab inside it).
const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

/** Render conditionally: mounted = open. Locks page scroll and traps focus while open. */
export default function Modal({ title, headerIcon, onClose, dismissible = true, className = "", children }: ModalProps) {
  const ref = useRef<HTMLDivElement>(null); // points to the pop-up box
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  // When the pop-up opens: lock scrolling and focus it. When it closes: undo everything.
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    ref.current?.focus();

    // Keyboard rules: Esc closes; Tab loops around inside the pop-up.
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && dismissible) {
        closeRef.current?.();
        return;
      }
      if (e.key !== "Tab" || !ref.current) return;
      const items = ref.current.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      previous?.focus?.();
    };
  }, [dismissible]);

  return (
    // The dark background; clicking it (outside the box) closes the pop-up.
    <div
      className="modal-scrim"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && dismissible) closeRef.current?.();
      }}
    >
      <div ref={ref} className={`modal ${className}`} role="dialog" aria-modal="true" aria-label={title ?? "Dialog"} tabIndex={-1}>
        {/* Title bar with the X close button */}
        {title && (
          <div className="modal-head">
            {headerIcon && <div className="modal-head-icon">{headerIcon}</div>}
            <h2 className="modal-title">{title}</h2>
            {dismissible && onClose && (
              <button type="button" className="modal-x" aria-label="Close" onClick={onClose}>
                <CloseIcon />
              </button>
            )}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
