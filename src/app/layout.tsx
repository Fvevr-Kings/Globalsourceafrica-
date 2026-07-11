import type { Metadata, Viewport } from "next";
import { Outfit, Inter, Archivo, IBM_Plex_Mono } from "next/font/google";
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

// v2 industrial display + "shipping manifest" mono (PRD §3.2). Archivo carries
// the expanded/stencil-adjacent feel via weight + uppercase tracking in CSS.
const heading = Archivo({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
  weight: ["600", "700", "800"],
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500", "600"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

const SHARE_TAGLINE = "Connecting Africa's resources to the global market";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "GlobalSource Africa — non-perishable African farm products",
  description:
    "Grains, pulses, nuts, dried spices, cocoa, coffee and shea from verified African origins. Sold and backed by GlobalSource Africa.",
  openGraph: {
    type: "website",
    siteName: "GlobalSource Africa",
    title: "GlobalSource Africa",
    description: SHARE_TAGLINE,
    url: "/",
    images: [{ url: "/icons/icon-512.png", width: 512, height: 512, alt: "GlobalSource Africa" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "GlobalSource Africa",
    description: SHARE_TAGLINE,
    images: ["/icons/icon-512.png"],
  },
  manifest: "/manifest.webmanifest",
  applicationName: "GlobalSource Africa",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "GSA",
  },
  other: {
    // Standard PWA capability meta (replaces the deprecated apple-only one).
    "mobile-web-app-capable": "yes",
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
    <html lang="en" className={`${display.variable} ${inter.variable} ${heading.variable} ${mono.variable}`}>
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
