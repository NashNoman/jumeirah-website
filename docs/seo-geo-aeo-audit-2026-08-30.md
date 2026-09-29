# SEO / GEO / AEO Audit — jumeirahye.com

**Date:** 2026-08-30
**Scope:** Technical SEO, AEO (Answer Engine Optimization — FAQ/rich-snippet/direct-answer readiness), and GEO in both senses (Generative Engine Optimization — visibility to AI answer engines like ChatGPT/Perplexity/Google AI Overviews — and local/geographic SEO for the Sana'a, Yemen market).
**Method:** Static review of the repository (`src/app`, `src/data`, `src/components`), live crawl of the deployed site at `https://jumeirahye.com` (raw HTML via `curl`, no JS execution — this deliberately mirrors how most AI crawlers see the site), and web searches to check current visibility and third-party listings.

This is an audit only — no code was changed. Findings are ordered by severity within each category.

---

## Critical

### 1. Brand name collides with the globally known "Jumeirah" hotel brand

A plain search for the company name surfaces Wikipedia pages for the Jumeirah hotel chain (Dubai) and Jumeirah Beach Residence before any signal specific to Jumeirah Real Estate Investment (Yemen). This is a structural SEO problem, not a fixable bug: the company is competing for a generic-looking brand term against a globally dominant, unrelated brand with vastly more backlinks and search volume.

**Impact:** Any SEO/GEO/AEO strategy that leans on the bare brand name ("Jumeirah") to rank or to get cited by AI engines will underperform indefinitely. All differentiation has to come from qualifiers.

**Recommendation:** Consistently pair the brand name with disambiguating terms in titles, H1s, meta descriptions, and structured data — e.g. "Jumeirah Real Estate Investment — Yemen", "Jumeirah Real Estate Investment (Sana'a)", project names ("Sana'a Towers", "Al-Hathaa Towers"), and neighborhood terms ("Hadda", "Sana'a Political District"). Avoid ever using "Jumeirah" alone as a page title or primary heading.

### 2. FAQ answers are not present in the server-rendered HTML

Confirmed by fetching the raw HTML of the homepage directly (`curl`, no JS): the FAQ section renders four question rows with visible text (e.g. "ما الذي يميز عقاراتكم عن غيرها في السوق؟") inside `<p>` tags, but the corresponding answers are **not present anywhere in the HTML document** — not even hidden/collapsed. They appear to be mounted only after client-side interaction (the row is a `<div>` with `cursor-pointer` and a plus-icon `<button>`, not a native `<details>`/`<summary>` or an always-mounted, CSS-hidden element).

**Impact:** This is the single highest-impact AEO issue found. Google's FAQ rich-snippet eligibility, and every AI answer engine that does not execute JavaScript or simulate clicks (GPTBot, PerplexityBot, ClaudeBot, and most others), see only the questions — never the answers. The content that would make this site directly citable in an AI-generated answer effectively does not exist from a crawler's point of view.

**Recommendation:** Re-render the FAQ section so the full answer text is present in the initial server-rendered HTML — either with native `<details>`/`<summary>` (progressive enhancement, no JS required for content to exist) or with the answer `<div>` always mounted in the DOM and visually collapsed via CSS/height animation rather than conditionally rendered. Pair this with `FAQPage` JSON-LD structured data (see Finding 5) once the answers are actually crawlable.

### 3. The blog is a non-functional placeholder with zero content

`src/app/[locale]/(main)/blog/page.tsx` is a stub: a `PageHeader` with a literal `subTitle="test"`, an empty `<div className="container"></div>`, and no body content at all. There is no `generateMetadata`, no post listing, and no `[slug]` dynamic route for individual posts. The live page at `/en/blog` confirms this — total visible text on the page is ~650 characters, all of it shared site chrome (nav, footer, contact info), none of it blog content.

**Impact:** This is the largest missing subsystem for both AEO and generative-engine visibility. AI answer engines and Google's helpful-content systems reward substantive, specific, well-structured long-form text — the kind that answers real buyer questions ("what are the payment plan options for Sana'a Towers", "what documents do I need to buy property in Yemen as a non-resident", etc.). Right now the site has almost none of that; it is nearly all short marketing copy and image-driven sections. Every project page, FAQ, and future blog post is a missed opportunity to be the source an AI engine quotes.

**Recommendation:** Build out the blog as a real content pipeline (post listing, per-post `generateMetadata`, `Article`/`BlogPosting` structured data, per-locale content) — this is the primary lever for both AEO and generative-GEO growth, but it needs content/editorial input, not just code. Flagged here as a finding; not scoped or built as part of this audit.

### 4. Old indexed URLs 404 with no redirect

Google currently has these URLs indexed and surfaces them in search results:

- `https://jumeirahye.com/projects/sanaatowers` → **404**, no redirect
- `https://jumeirahye.com/projects/alhadah` → **404**, no redirect

These are pre-rename slugs (no locale prefix, different slug format) from before the site's current URL structure (`/projects/sanaa-towers`, `/projects/alhathaa-towers` under `src/app/[locale]/(main)/projects/[project]/page.tsx`). Both were confirmed via `curl -L` (0 redirects, final status 404).

**Impact:** Live, currently-ranking search results point users to dead pages — direct loss of traffic and conversions. Google also discounts crawl budget and link equity on sites with unmanaged 404s from prior URL structures.

**Recommendation:** Add permanent (301) redirects from the old slugs to their current equivalents. In Next.js this is typically a `redirects()` entry in `next.config.ts`/`next.config.js`, mapping `/projects/sanaatowers` → `/projects/sanaa-towers` and `/projects/alhadah` → `/projects/alhathaa-towers` (per locale, matching however `localePrefix: "as-needed"` resolves these paths).

---

## High

### 5. Structured data is thin — no `FAQPage`, no local/geo fields

The only JSON-LD present sitewide (confirmed by parsing the two `application/ld+json` script tags served on the homepage) is:

- `RealEstateAgent` (from `src/components/structured-data.tsx`) — has `address` (country + locality only, **no `geo` lat/long, no `openingHours`, no `priceRange`, no `areaServed`**)
- `WebSite` (search action pointing at `/projects?search=...`)

`src/components/project-structured-data.tsx`, `contact-structured-data.tsx`, and `breadcrumb-schema.tsx` exist and are used on their respective pages, but there is no `FAQPage` schema anywhere despite the homepage having a visible FAQ section (see Finding 2).

**Impact:** Missing `geo` coordinates and local-business fields reduce eligibility for Google's local pack / Maps integration (see Finding 6). Missing `FAQPage` schema means even after Finding 2 is fixed, the FAQ content won't get the rich-snippet treatment in search results without the schema also being added.

**Recommendation:** Extend the `RealEstateAgent` schema with `geo` (latitude/longitude for the Sana'a Political District location), `openingHours`, `priceRange`, and `areaServed`. Add `FAQPage` structured data alongside the FAQ section once its answers are server-rendered.

### 6. No confirmed Google Business Profile / Maps listing

A web search for the company plus "google business profile maps" surfaces only the company's own site pages and a Facebook page — no Google Maps or Business Profile listing appears.

**Impact:** Without a Google Business Profile, the business is invisible in the local 3-pack (the map + 3 listings block Google shows for "real estate company near me" style queries), has no aggregated review presence, and misses one of the highest-leverage local-GEO signals available to a physical-location business.

**Recommendation:** Claim/create and fully complete a Google Business Profile (category, hours, service area, photos, and — critically — encourage reviews). This is an operational/account task, not a code change, but it's the single highest-leverage move available for local GEO in Sana'a and should be prioritized alongside any code fixes.

### 7. No `llms.txt`

`https://jumeirahye.com/llms.txt` returns 404.

**Impact:** `llms.txt` is an emerging (not yet universally adopted) convention some AI crawlers and aggregators check for a curated map of a site's most important content, similar in spirit to `robots.txt`/`sitemap.xml` but aimed at LLM consumption. Low priority on its own, but cheap to add and most useful once there's actual content (Finding 3) worth pointing to.

**Recommendation:** Defer until the blog/content pipeline exists, then add a curated `llms.txt` linking to the highest-value pages.

### 8. robots.txt allows all crawlers by default, but this isn't a deliberate GEO decision

Current `public/robots.txt`:

```
User-agent: *
Allow: /
```

This does allow AI crawlers (GPTBot, PerplexityBot, ClaudeBot, Google-Extended, CCBot, Applebot-Extended, etc.) by default, since there's no bot-specific disallow rule. That's consistent with a "maximize AI visibility" GEO strategy — but as written, it's an accident of the default template, not a decision anyone made. Some businesses deliberately block training-data crawlers (CCBot, Google-Extended) while still allowing search-indexing and answer-engine bots.

**Recommendation:** No code change needed unless the business wants to differentiate crawler access. Worth a conscious sign-off that "allow everything" is the intended policy, given it directly trades off against AI training-data control.

---

## Medium

### 9. Per-page metadata gaps risk duplicate titles/descriptions

The blog page (`src/app/[locale]/(main)/blog/page.tsx`) has no `generateMetadata` export at all, so it inherits the root layout's metadata verbatim — meaning `/en/blog` currently has the exact same `<title>` and meta description as the homepage. Other routes (about, projects, contact) do define their own metadata correctly; blog is the outlier because it's unbuilt (see Finding 3).

**Recommendation:** Will resolve naturally once the blog is built out with real `generateMetadata` per page/post — flagging so it isn't missed.

### 10. Sitemap `lastModified` is a single build-time timestamp for every URL

`src/app/sitemap.ts` sets `lastModified: new Date()` uniformly for every entry, so every URL in `sitemap.xml` shows the same timestamp (the last deploy time), not the actual last-changed date of that specific page's content.

**Impact:** Weakens the crawl-priority signal `lastModified` is meant to provide — Google can't tell which pages actually changed recently. Low priority now with a small, mostly-static site; matters more once there's a blog with posts that update independently of deploys.

**Recommendation:** Once there's real per-page content (projects data updates, blog posts), derive `lastModified` from actual content timestamps rather than `new Date()` at build time.

### 11. Core Web Vitals not measured in this audit

This audit did not have access to PageSpeed Insights / Lighthouse tooling or a Google Search Console connection, so Core Web Vitals (LCP, INP, CLS) and real-world performance/indexing data are **unverified**, not confirmed clean. The codebase shows good practices on the surface (Next.js `Image` component with `placeholder="blur"`, `priority`/`fetchPriority` on the hero image, `LazyMotion` for animation bundle size), but this hasn't been measured against a live report.

**Recommendation:** Run this through PageSpeed Insights (or connect Google Search Console) before treating performance as settled either way.

---

## What's already solid (do not change)

- Root layout (`src/app/[locale]/layout.tsx`) `generateMetadata` — thorough `openGraph`, `twitter`, `alternates.languages` (hreflang), `canonical`, and `robots` directives, all correctly locale-aware.
- `src/app/sitemap.ts` — correct locale alternates per URL, valid XML, reachable at `/sitemap.xml`, returns 200.
- `public/robots.txt` — valid, reachable, correctly points to the sitemap.
- The hero `<h1>` uses an animated per-character reveal (individual `<span>`s with `opacity:0` for the animation) but includes a `sr-only` span containing the full, real heading text — a genuinely good pattern that keeps the heading crawlable and accessible despite the animation. Don't "fix" this into something simpler; it already does the right thing.

---

## Priority if acting on this

**Cheap and high-impact (code-only, no content/ops dependency):**
- Finding 2 (FAQ answers in server HTML) + Finding 5's `FAQPage` schema
- Finding 4 (301 redirects for old slugs)
- Finding 5's `geo`/local fields on `RealEstateAgent`

**High-impact but needs content/ops input, not just code:**
- Finding 3 (real blog content pipeline)
- Finding 6 (Google Business Profile — an account/ops task)

**Low priority / defer:**
- Finding 7 (`llms.txt`) — do after Finding 3
- Finding 9, 10 — will mostly resolve as side effects of Finding 3
- Finding 11 — needs tooling access, not a fix in itself
