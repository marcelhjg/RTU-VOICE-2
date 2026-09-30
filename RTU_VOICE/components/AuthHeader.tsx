/**
 * components/AuthHeader.tsx
 * -----------------------------------------------------------------
 * The top bar of the public pages (landing, login, register, etc.):
 * the logo on the left and the Login / Register buttons on the right.
 */
import Logo from "./Logo";
import Button from "./Button";

// Which button should look "filled" (the page the user is currently on).
export type ActiveNav = "login" | "register" | undefined;

/**
 * Header: 72px, one flex row. Login / Register share one height and gap.
 * The active page's button is the filled pill (Register page → Register,
 * all other auth pages → Login). On the landing page both are plain text.
 */
export default function AuthHeader({ active }: { active?: ActiveNav }) {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Logo size={44} />
        <nav className="nav" aria-label="Primary">
          <Button
            href="/login"
            pill
            variant={active === "login" ? "primary" : "nav"}
            aria-current={active === "login" ? "page" : undefined}
          >
            Login
          </Button>
          <Button
            href="/register"
            pill
            variant={active === "register" ? "primary" : "nav"}
            aria-current={active === "register" ? "page" : undefined}
          >
            Register
          </Button>
        </nav>
      </div>
    </header>
  );
}
