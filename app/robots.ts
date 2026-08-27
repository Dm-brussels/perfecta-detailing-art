import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/leads", "/api/"],
    },
    sitemap: "https://perfectadetailing.be/sitemap.xml",
  };
}
