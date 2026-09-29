/**
 * Shared FAQ question set for every project detail page — each project's
 * own translation namespace supplies the actual question/answer text
 * (`<ProjectKey>.faqs.<key>.question` / `.answer`), so content stays
 * project-specific while the schema and UI stay generic. Mirrors the
 * homepage's `faqKeys` (src/data/faqs.ts) pattern.
 */
export const projectFaqKeys = [
  "location",
  "layouts",
  "delivery",
  "amenities",
  "earthquake",
  "payment",
  "after-sales",
] as const;
