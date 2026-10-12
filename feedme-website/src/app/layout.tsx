import type { Metadata, Viewport } from "next";
import "./globals.css";
import AppShell from "@/components/layout/AppShell";
import { AppProvider } from "@/hooks/useAppState";

export const metadata: Metadata = {
  title: "FeedMe AI — Smart Performance & Nutrition",
  description:
    "AI Food Vision, Smart Portion Tracking, Progressive Overload Coach, and Daily Energy Balance in a Modern Bento Athletic interface.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0F172A",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="th" className="h-full">
      <body className="min-h-full font-sans antialiased text-[#0F172A] bg-[#F1F5F9]">
        <AppProvider>
          <AppShell>{children}</AppShell>
        </AppProvider>
      </body>
    </html>
  );
}
