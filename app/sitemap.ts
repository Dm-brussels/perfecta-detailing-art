import type { MetadataRoute } from "next";

const BASE = "https://perfectadetailing.be";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE, changeFrequency: "monthly", priority: 1 },
    { url: `${BASE}/devis`, changeFrequency: "monthly", priority: 0.8 },
  ];
}
