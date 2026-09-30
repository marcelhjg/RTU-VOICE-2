/**
 * app/page.tsx  (URL: /)
 * -----------------------------------------------------------------
 * The LANDING page: the first page visitors see. It has the header, the
 * harassment notice banner, the "Your Voice Matters" title, the Login and
 * Register buttons, and the 3 steps (Submit, Validated, Track).
 * Some text has a desktop version and a shorter mobile version
 * (only-desktop / only-mobile classes).
 */
import AuthHeader from "@/components/AuthHeader";
import Button from "@/components/Button";
import { PencilIcon, SearchIcon, ShieldIcon, WarningIcon } from "@/components/Icons";
import type { ReactNode } from "react";

// The shape of one step card.
interface Step {
  n: number;
  title: string;
  mobileTitle: string;
  text: string;
  icon: ReactNode;
  tone: "gold" | "blue";
}

// The 3 steps shown at the bottom. Change the text here to edit them.
const steps: Step[] = [
  { n: 1, title: "Submit", mobileTitle: "1. Submit", text: "File a report with details and supporting evidence.", icon: <PencilIcon />, tone: "gold" },
  { n: 2, title: "Validated", mobileTitle: "2. Validated", text: "The admin office reviews and assigns it to the right department.", icon: <ShieldIcon />, tone: "blue" },
  { n: 3, title: "Track", mobileTitle: "3. Track Progress", text: "Follow progress anytime using your tracking ID.", icon: <SearchIcon />, tone: "blue" },
];

// The page itself.
export default function LandingPage() {
  return (
    <div className="page">
      {/* Top bar with logo + Login / Register */}
      <AuthHeader />
      {/* Yellow notice banner */}
      <div className="notice" role="note">
        <WarningIcon />
        <p>
          <span className="only-desktop">
            This platform is dedicated to reporting harassment. All reports are taken seriously and handled
            confidentially. False reporting may result in disciplinary action.
          </span>
          <span className="only-mobile">
            This platform is dedicated to reporting harassment. Reports are handled confidentially.
          </span>
        </p>
      </div>

      {/* Main area: title, subtitle, buttons, and steps */}
      <main className="hero">
        <p className="eyebrow only-desktop">SAFE · CONFIDENTIAL · TRACKED</p>
        <h1 className="hero-title">
          Your Voice <span className="gold">Matters</span>
        </h1>
        <p className="hero-sub">
          <span className="only-desktop">A safe and confidential platform for reporting harassment within the university.</span>
          <span className="only-mobile">A safe and confidential platform for reporting harassment within the university.</span>
        </p>
        {/* Login and Register buttons (centered by .hero-actions in globals.css) */}
        <div className="hero-actions">
          <Button href="/login">Login</Button>
          <Button href="/register" variant="outline">
            Register
          </Button>
        </div>

        {/* Build one card for each item in the `steps` list above */}
        <ol className="steps">
          {steps.map((s) => (
            <li key={s.n} className="step">
              <span className={`tile tile-${s.tone}`}>{s.icon}</span>
              <div className="step-body">
                <h2 className="step-title">
                  <span className="only-desktop">{s.title}</span>
                  <span className="only-mobile">{s.mobileTitle}</span>
                </h2>
                <p className="step-text only-desktop">{s.text}</p>
              </div>
              <span className="step-num only-desktop" aria-hidden="true">
                {s.n}
              </span>
            </li>
          ))}
        </ol>
      </main>
    </div>
  );
}
