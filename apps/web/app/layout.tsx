import type { Metadata } from "next";
import {
  Caveat,
  Inter,
  JetBrains_Mono,
  Permanent_Marker,
} from "next/font/google";
import "./globals.css";

/*
 * Fonts are self-hosted at build time by next/font.
 *
 * brush  -> headlines (dry-brush / marker feel from the design comps)
 * sans   -> body copy
 * mono   -> small wide-tracked labels
 */
const brush = Permanent_Marker({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-brush",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans-body",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-label",
  display: "swap",
});

const hand = Caveat({
  subsets: ["latin"],
  variable: "--font-hand-face",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Rachit Doshi | Portfolio",
  description:
    "Engineer, builder, curious mind. Projects, experience and skills.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${brush.variable} ${sans.variable} ${mono.variable} ${hand.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
