import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Quantica Tattoo",
    short_name: "Quantica",
    description: "Tattoo Studio Management",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#EAE5DF",
    theme_color: "#2C2C2C",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
