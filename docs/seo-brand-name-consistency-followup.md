# Follow-up: Brand name spelling/wording is inconsistent across the site

## Context

Surfaced during the final review of `docs/seo-geo-aeo-remediation-plan.md` (2026-09-02). Not fixed as part of that plan — the user asked for a handoff instead, since picking the "correct" spelling of the company's own name is a business decision, not a code decision. This doc is that handoff.

Two separate inconsistencies were found, one in each locale. Both are brand-identity bugs: the same company name rendered differently depending on which page/tag a visitor or crawler lands on.

## 1. Arabic: three different spellings of "Real Estate Investment"

```
grep -n "للإستثمار\|للاستثمار\|للاستثمارات" messages/ar.json
```

- **`جميرا للاستثمار العقاري`** (hamzat-wasl on `ال`, singular "investment") — used 6 times, all in body copy: `HomePage.hero-description` (:51), `AboutUsCard.description` (:77), `Alhathaa-Towers.meta-description`/`.subtitle` (:780-781), `AboutUs.company-history-description` (:1376), and the FAQ answer at `FAQsSection.q1.answer` (:1310). This form is the grammatically standard one (`استثمار` takes hamzat waṣl in its definite form).
- **`جميرا للإستثمار العقاري`** (hamza-on-alif, singular) — used 6 times, all in SEO-facing fields: `Common.rei` (:12 — this is the suffix rendered right after "Jumeirah" in the homepage `<h1>` hero text, so it's on the most visible text on the site), and the 5 `meta-title` keys: `SanaaTowers` (:94), `Alhathaa-Towers` (:779), `ContactUs` (:1331), `ProjectsPage` (:1345), `AboutUs` (:1371). This is a common misspelling (extra hamza).
- **`جميرا للاستثمارات العقارية`** (hamzat-wasl, but *plural* "investments" — a third, grammatically different variant) — used in the `Metadata` namespace (`title`, `description`, `keywords`, `og-image-alt`, lines ~43-46), which is the fallback/root metadata for the site.

So depending on which exact page and which exact tag (`<title>` vs `<h1>` vs meta description vs a project's own meta-title) a visitor or a search/AI crawler sees, the company's own name appears three different ways.

## 2. English: `Metadata.title` says "Investments" (plural), everywhere else says "Investment" (singular)

```
grep -rn "Real Estate Investment" messages/en.json
```

- `Metadata.title` = `"Jumeirah Real Estate Investments | Premier Properties in Yemen"` (plural — the odd one out)
- `Metadata.description`, `Metadata.keywords`, `Metadata.og-image-alt`, `siteConfig.name`/`siteConfig.legalName` in `src/lib/site.ts`, `AboutUs.meta-title`, `ProjectsPage.meta-title`, `ContactUs.meta-title` (added in this plan's Task 6), and both new project `meta-title` keys (also Task 6) all use the singular **"Jumeirah Real Estate Investment"**.

`Metadata.title` is consumed as the root/fallback document title (`src/app/[locale]/layout.tsx`), so this single plural form is a genuinely high-visibility inconsistency, not a buried string.

## Recommendation

Pick one canonical form per locale (the singular form — `Jumeirah Real Estate Investment` / `جميرا للاستثمار العقاري` — matches `siteConfig.name`/`siteConfig.legalName` in `src/lib/site.ts` and the majority of existing body copy, so it's the natural choice unless there's a reason the plural/alternate form is the actually-registered legal or marketing name) and do one sweep:

- `messages/en.json`: fix `Metadata.title` (1 change).
- `messages/ar.json`: decide whether `للاستثمار` or `للإستثمار` is correct, then fix whichever set is wrong (6 keys) — `Common.rei` plus the 5 `meta-title` keys — and separately fix the 4 `Metadata.*` keys that currently use the plural `للاستثمارات` variant.

Small diff (~11 lines across 2 files), but touches the single most SEO-visible string on the site (root `<title>`) plus every page's brand-disambiguation `meta-title` (the exact surface `docs/seo-geo-aeo-remediation-plan.md` Task 6 was about) — worth a deliberate pass with someone who can confirm the correct Arabic spelling and the correct English form, not a blind find-and-replace.
