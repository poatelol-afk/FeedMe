import type { Metadata, Viewport } from "next";
import "./globals.css";
import AppShell from "@/components/layout/AppShell";
import { AppProvider } from "@/hooks/useAppState";

export const metadata: Metadata = {
  title: "FeedMe — Eat Well, Move More",
  description:
    "Track nutrition, earn coins from workouts, and redeem cheat meals. A mindful approach to fitness.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#111110",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full">
      <body
        className="min-h-full font-[family-name:var(--font-inter)]"
        style={{ background: "var(--bg-base)", color: "var(--text-primary)" }}
      >
        <AppProvider>
          <AppShell>{children}</AppShell>
        </AppProvider>
      </body>
    </html>
  );
}
