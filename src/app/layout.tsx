import type { Metadata, Viewport } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart";
import { Header } from "@/components/Header";
import { SiteFooter } from "@/components/SiteFooter";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import { ChatWidget } from "@/components/ChatWidget";

// Clean, modern display font for the brand wordmark + headings.
const display = Outfit({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "GlobalSource Africa — non-perishable African farm products",
  description:
    "Grains, pulses, nuts, dried spices, cocoa, coffee and shea from verified African origins. Sold and backed by GlobalSource Africa.",
  manifest: "/manifest.webmanifest",
  applicationName: "GlobalSource Africa",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "GlobalSource",
  },
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#1F6B4A",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${inter.variable}`}>
      <body>
        <CartProvider>
          <Header />
          <main>{children}</main>
          <SiteFooter />
        </CartProvider>
        <ServiceWorkerRegister />
        <ChatWidget />
      </body>
    </html>
  );
}
