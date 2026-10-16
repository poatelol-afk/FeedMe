import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FeedMe 2.0 — เปลี่ยนการคุมอาหารและออกกำลังกายให้เป็นเกมที่สนุกที่สุด",
  description:
    "แอปพลิเคชันคุมอาหารและฟิตเนสสไตล์เกม RPG: Smart Kitchen & BLE Scale, Strava-grade Run & Lift, และ Duolingo-style Leagues",
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0F172A",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="th" className="h-full scroll-smooth">
      <body className="min-h-full font-sans antialiased text-white bg-[#0F172A] selection:bg-[#58CC02]/30 selection:text-white">
        {children}
      </body>
    </html>
  );
}
