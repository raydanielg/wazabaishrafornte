import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Wazabiashara",
    short_name: "Wazabiashara",
    description:
      "Business management made simple — sales, stock, customers, expenses, debts and reports in one place.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0a0a0a",
    icons: [
      { src: "/brand/pwa-192.png", sizes: "192x192", type: "image/png" },
      { src: "/brand/pwa-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/brand/pwa-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
