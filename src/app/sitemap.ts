import { absoluteUrl, hreflangAlternates } from "@/lib/site";
import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = ["en", "ar"];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Define route configurations with specific priorities
  const routeConfig = [
    { path: "", priority: 1.0, changeFrequency: "daily" as const },
    { path: "/projects", priority: 0.9, changeFrequency: "weekly" as const },
    {
      path: "/projects/sanaa-towers",
      priority: 0.85,
      changeFrequency: "weekly" as const,
    },
    {
      path: "/projects/alhathaa-towers",
      priority: 0.85,
      changeFrequency: "weekly" as const,
    },
    {
      path: "/projects/manarat-al-hudaydah",
      priority: 0.85,
      changeFrequency: "weekly" as const,
    },
    { path: "/about", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/contact", priority: 0.8, changeFrequency: "monthly" as const },
  ];

  // No lastModified field: this site has no per-page content-change
  // tracking, and stamping every URL with the build time on every deploy
  // (regardless of whether that page's content actually changed) teaches
  // crawlers to distrust the signal. Omit it rather than fake it — Google
  // falls back to its own crawl-based freshness detection.
  routeConfig.forEach(({ path, priority, changeFrequency }) => {
    locales.forEach((locale) => {
      sitemapEntries.push({
        url: absoluteUrl(locale, path),
        changeFrequency,
        priority,
        alternates: {
          languages: hreflangAlternates(path),
        },
      });
    });
  });

  return sitemapEntries;
}
