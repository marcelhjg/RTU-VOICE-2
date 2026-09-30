/**
 * components/Logo.tsx
 * -----------------------------------------------------------------
 * The RTU Voice logo. It is used in every header and in the login card.
 *
 * TO CHANGE THE LOGO:
 *   1) Replace the file  public/provided-assets/rtu-voice-logo.png
 *      (same file name = no code change needed), OR use a new file name
 *      and update LOGO_SRC below.
 *   2) If the new picture has a different shape, update LOGO_WIDTH and
 *      LOGO_HEIGHT below to the picture's real pixel size. They are only
 *      used to keep the correct proportion so the logo is never stretched.
 */
import Image from "next/image";
import Link from "next/link";

// Where the logo image lives (files inside /public are reached without "public" in the path).
export const LOGO_SRC = "/provided-assets/rtu-voice-logo.png";
// The real pixel size of the image file (393 x 352).
const LOGO_WIDTH = 393;
const LOGO_HEIGHT = 352;

interface LogoProps {
  /** Rendered pixel width of the emblem. */
  size?: number;
  /** Show the "RTU Voice" wordmark next to the emblem. */
  withText?: boolean;
  href?: string; // where the logo goes when clicked
}

// Just the picture (no text, no link). Used inside drawers, login card and console header.
export function LogoMark({ size = 40 }: { size?: number }) {
  return (
    <Image
      src={LOGO_SRC}
      alt="RTU Voice logo"
      width={size}
      height={Math.round(size * (LOGO_HEIGHT / LOGO_WIDTH))} // keeps the picture's proportion
      priority // load it right away because it is at the top of the page
      className="logo-img"
    />
  );
}

// Picture + "RTU Voice" text, wrapped in a link (clicking it goes to `href`, default: home page).
export default function Logo({ size = 40, withText = true, href = "/" }: LogoProps) {
  return (
    <Link href={href} className="logo" aria-label="RTU Voice home">
      <LogoMark size={size} />
      {withText && <span className="logo-text">RTU Voice</span>}
    </Link>
  );
}
