/**
 * app/layout.tsx
 * -----------------------------------------------------------------
 * The ROOT layout: wraps every page in the site. It loads the fonts,
 * the CSS files, the browser-tab title/icon, and the shared providers.
 */
import type { Metadata, Viewport } from "next";
import { Inter, Noto_Serif } from "next/font/google";
import "../styles/globals.css"; // base styles, header, landing page, auth pages
import "../styles/app.css"; // student pages, admin/department console
import AppProviders from "@/components/AppProviders";
import { LOGO_SRC } from "@/components/Logo";

// Inter = clean sans-serif font for normal text. Noto Serif = headings and the logo text.
const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const serif = Noto_Serif({ subsets: ["latin"], weight: ["600", "700"], variable: "--font-serif", display: "swap" });

// Browser tab title, description, and the small icon (favicon) = the RTU Voice logo.
export const metadata: Metadata = {
  title: "RTU Voice",
  description: "A safe and confidential platform for reporting harassment within the university.",
  icons: { icon: LOGO_SRC },
};
export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`}>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
