import type { Metadata, Viewport } from "next";
import "./globals.css";
import AppShell from "@/components/layout/AppShell";
import { AppProvider } from "@/hooks/useAppState";

export const metadata: Metadata = {
  title: "FeedMe — กินดี มีวินัย ฟิตหุ่นสนุกสไตล์ Duolingo",
  description:
    "เพื่อนคู่หูสุขภาพ AI และตาชั่งอัจฉริยะ IoT ชั่งอาหารอัตโนมัติ วางแผนยกเวท Progressive Overload และสะสมเหรียญรางวัล",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#58CC02",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="th" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full font-sans antialiased text-[#4B4B4B] bg-[#F7F7F7]">
        <AppProvider>
          <AppShell>{children}</AppShell>
        </AppProvider>
      </body>
    </html>
  );
}
