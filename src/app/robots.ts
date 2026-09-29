import { siteConfig } from "@/lib/site";
import { MetadataRoute } from "next";

// Blanket `Allow: /` deliberately includes AI/LLM crawlers (GPTBot, ClaudeBot,
// PerplexityBot, CCBot, Google-Extended, Applebot-Extended) — allowing AI
// training and answer-engine indexing is intentional here, not an oversight.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${siteConfig.baseUrl}/sitemap.xml`,
  };
}
