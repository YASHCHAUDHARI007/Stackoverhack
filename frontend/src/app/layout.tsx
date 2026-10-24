import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "WOBBLE — Test Reliability & Empirical Verification",
  description:
    "Developer observability platform for non-deterministic test triage, automated reproduction, and empirical verification.",
  keywords: [
    "test reliability",
    "flaky tests",
    "test verification",
    "developer tools",
    "observability",
    "automated reproduction",
    "delta debugging",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} dark antialiased`}
    >
      <body className="min-h-screen bg-[#0B0C0D] text-[#F0EEE8] font-sans selection:bg-[#222424] selection:text-[#F0EEE8]">
        {children}
      </body>
    </html>
  );
}
