import type { MetadataRoute } from "next";

// Web app manifest — makes the storefront installable as a PWA.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "GlobalSource Africa",
    short_name: "GSA",
    description:
      "Grains, pulses, nuts, dried spices, cocoa, coffee and shea from verified African origins.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#FBFAF7",
    theme_color: "#1F6B4A",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
