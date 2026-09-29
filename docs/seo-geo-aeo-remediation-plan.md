# SEO / GEO / AEO Remediation Plan

## Context

`docs/seo-geo-aeo-audit-2026-08-30.md` audited jumeirahye.com for technical SEO, answer-engine readiness (AEO), and local/generative GEO. It found 11 issues but changed no code. This plan implements the code-only fixes.

Three scope decisions were made by the user up front:

- **Blog (Finding 3) is out of scope.** The stub at `src/app/[locale]/(main)/blog/page.tsx` stays as-is; Findings 9 (duplicate blog metadata) and 10 (uniform sitemap `lastModified`) therefore remain open and are listed under "Deliberately not done".
- **Brand-disambiguation copy (Finding 1) is in scope.** Titles in `messages/en.json` / `messages/ar.json` get edited; the user reviews the string diff before merge.
- **robots.txt policy (Finding 8): allow everything.** No rule changes — only comments recording that allowing GPTBot / ClaudeBot / PerplexityBot / CCBot / Google-Extended is a deliberate decision, not a default.

Findings 6 (Google Business Profile), 7 (`llms.txt`), and 11 (Core Web Vitals) are operational or blocked on the blog and are not code work.

Two bugs not in the audit surfaced during exploration and are folded in, because they sit inside the files this plan already rewrites:

1. `src/app/[locale]/(main)/projects/[project]/page.tsx:39-43` builds breadcrumb JSON-LD URLs as `/${locale}/...` unconditionally. Under `localePrefix: "as-needed"` with `defaultLocale: "ar"`, the Arabic breadcrumbs point at `/ar/projects/...`, which does not exist — every Arabic project page publishes a breadcrumb trail of dead URLs.
2. There are three separate, mutually inconsistent `RealEstateAgent` nodes (root layout, contact page, project pages) with no shared `@id`, and `geo` is typed as numbers in one file and strings in another. Search engines see three unlinked businesses instead of one.

Intended outcome: FAQ answers and a matching `FAQPage` schema present in server HTML; old indexed URLs 301 instead of 404; one coherent, geo-complete business entity across all JSON-LD; consistent NAP; brand terms that don't compete head-on with the Dubai hotel chain.

---

## Task 1 — Single source of truth for site identity (`src/lib/site.ts`)

New file. Everything else in this plan depends on it. Today `NEXT_PUBLIC_SITE_URL || "https://jumeirahye.com"` is re-derived in at least 5 files, the phone number is hardcoded in 5 places in 2 different formats, and the locale-prefix ternary is copy-pasted in 3.

Export:

- `siteConfig` — `name`, `legalName`, `baseUrl`, `logo`, `phone` (single canonical E.164 `+967778265522`), `phoneDisplay`, `email` (`info@jumeirahye.com`), `address` (country `YE`, locality `Sana'a`, region `Sana'a Governorate`), `geo` (`{ latitude: 15.3694, longitude: 44.191 }` — numbers, one definition), `openingHours` (Sat–Thu 08:00–17:00), `priceRange`, `sameAs` (the canonical four profile URLs), `organizationId` = `` `${baseUrl}/#organization` ``.
- `absoluteUrl(locale, path)` — implements `localePrefix: "as-needed"` once: `ar` unprefixed, `en` prefixed. Mirrors the ternary currently in `src/app/sitemap.ts:30` and `projects/[project]/page.tsx:67-70`.

Then replace the duplicated literals in: `src/components/structured-data.tsx`, `contact-structured-data.tsx`, `project-structured-data.tsx`, `breadcrumb-schema.tsx`, `src/app/sitemap.ts`, and the breadcrumb arrays in `about/page.tsx`, `projects/page.tsx`, `contact/page.tsx`, `projects/[project]/page.tsx` (this is where the `/ar/...` bug dies).

`socials/page.tsx:11-32` currently uses different social URLs than `sameAs` (lowercase `instagram.com/jumeirahyemen`, a `facebook.com/share/...` link). Reconcile to the `siteConfig.sameAs` values so the profiles the site links and the profiles it claims in schema are the same set.

**Note:** `priceRange` has no known correct value in the repo. Ship `"$$$"` and flag it for the user to confirm or drop.

## Task 2 — FAQ answers in server HTML + `FAQPage` schema (Findings 2, 5)

The highest-impact item. `src/components/faqs-section.tsx:122-144` wraps the answer in `<AnimatePresence>{isActive && <m.div>…}` with `useState<number|null>(null)`, so no answer text exists in the initial HTML.

**2a. Shared question list.** New `src/data/faqs.ts`: `export const faqKeys = ["q2","q3","q4","q5"] as const;` — matching what is rendered today (`q1` exists in both message files at `messages/*.json:982-985` but is commented out at `faqs-section.tsx:19-23`). Both the UI and the schema read this array, so the JSON-LD can never drift from the visible content — a hard requirement for Google's FAQ rich results. Re-enabling `q1` later becomes a one-line change.

**2b. Always mount the answer.** In `faqs-section.tsx`, drop `AnimatePresence` and the `isActive &&` guard. Render the answer `m.div` unconditionally with `initial={false}` and `animate={isActive ? "open" : "closed"}`, variants `open: { height: "auto", opacity: 1 }` / `closed: { height: 0, opacity: 0 }`, keeping `overflow-hidden` and the existing 0.3s `easeOut`. Visual behavior is unchanged; the text is now in the document.

Use `height` rather than the current `maxHeight: 300` — `maxHeight` silently clips answers longer than 300px, and `height: "auto"` is what Motion is designed to animate.

**2c. Fix the accessibility of the toggle while here.** The question row is a `<div onClick>` (`faqs-section.tsx:109-121`) — not focusable, not keyboard-operable — and the only real `<button>` (line 148) is `lg:block`, so mobile has no accessible trigger at all. Make the question row a `<button type="button">` with `aria-expanded={isActive}` and `aria-controls` pointing at the answer's `id`; give the desktop plus/minus button an `aria-label` or mark it `aria-hidden` as decorative. This matters here because the same DOM change is what makes the content crawlable.

**2d. `FAQPage` JSON-LD.** New `src/components/faq-structured-data.tsx` — a server component (`await getTranslations("FAQsSection")`, same pattern as `project-structured-data.tsx:15`), mapping `faqKeys` to `Question` / `acceptedAnswer`. Emit via the same `dangerouslySetInnerHTML` script pattern the other four schema components use. Mount in `src/app/[locale]/(main)/page.tsx` next to `<FAQsSection />` (line 88).

## Task 3 — 301 redirects for old indexed URLs (Finding 4)

`next.config.ts` has no `redirects()` — only `headers()` at line 12. Add one:

| From | To |
|---|---|
| `/projects/sanaatowers` | `/projects/sanaa-towers` |
| `/projects/alhadah` | `/projects/alhathaa-towers` |
| `/en/projects/sanaatowers` | `/en/projects/sanaa-towers` |
| `/en/projects/alhadah` | `/en/projects/alhathaa-towers` |

All `permanent: true`. Config-level redirects run before the next-intl middleware, so the unprefixed forms resolve to Arabic exactly as a normal `/projects/...` request does.

## Task 4 — Complete the business entity (Finding 5)

Using `siteConfig` from Task 1:

- **`structured-data.tsx`** — add `@id: siteConfig.organizationId`, `geo`, `openingHoursSpecification`, `priceRange`, `areaServed`, `telephone`, and `email`. The `contactPoint` at lines 27-31 currently has neither phone nor email. Drop `alternateName` (line 12) — it duplicates `name` verbatim.
- **`contact-structured-data.tsx`** — reference the same `@id` instead of declaring `"@id": baseUrl` (line 14), so the two nodes merge into one business rather than competing. Replace the raw `streetAddress: t("location")` (line 19) — that message is a full sentence that re-states "Yemen, Sana'a" already present in `addressLocality` / `addressCountry`; use the street portion only and keep the full sentence as visible page copy.
- **`project-structured-data.tsx`** — its `geo` is strings (lines 34-38) while contact's is numbers; both now come from `siteConfig.geo`. Point `provider` (lines 53-57) at the organization `@id`.

## Task 5 — NAP consistency in the UI

`footer.tsx:39,44` and `contact-us-section.tsx:47,52` render the phone and email as plain `<p>` text, and the two components format the phone differently (`+967778265522` vs `+(967) 778265522`). Read both from `siteConfig` and wrap them in `tel:` / `mailto:` links. Inconsistent NAP across a site is a direct local-ranking signal, and the tap-to-call link is the conversion path on mobile.

## Task 6 — Brand disambiguation copy (Finding 1)

Bare project names are currently used as `<title>` values: `SanaaTowers.title` = `"Sana'a Towers"`, `Alhathaa-Towers.title` = `"Al-Hathaa Residential Towers"` — these feed `generateMetadata` at `projects/[project]/page.tsx:73`.

Add distinct `meta-title` keys per project (following the `ProjectsPage.meta-title` / `AboutUs.meta-title` pattern already in the file) so the page `<title>` carries brand + geography while the on-page `<h1>` stays clean — e.g. `"Sana'a Towers | Jumeirah Real Estate Investment, Sana'a Yemen"`. Update `generateMetadata` to prefer `meta-title`.

Also check `ContactUs` — it has a `description` but no `meta-title`.

Both `messages/en.json` and `messages/ar.json` must be edited in lockstep (`global.d.ts` types `Messages` off `en.json`). Keep the edit to `meta-title` / `meta-description` keys; do not touch body copy. **The user reviews this diff before merge.**

## Task 7 — Document the robots.txt decision (Finding 8)

`public/robots.txt` — no rule changes. Add a comment block stating that AI crawlers (GPTBot, ClaudeBot, PerplexityBot, CCBot, Google-Extended, Applebot-Extended) are intentionally allowed, so the next person reading it knows it is a decision rather than the default template. Also switch the hardcoded `Sitemap:` URL note — it stays hardcoded (static file, no env access), just flag it in the comment so it isn't missed if the domain changes.

---

## Deliberately not done

- **Finding 3 (blog)** — user chose to skip. Consequence: `/en/blog` keeps the homepage's `<title>` and description (**Finding 9** stays open), and `/blog` remains a live, linkable page with no content. Worth revisiting.
- **Finding 10 (sitemap `lastModified`)** — `new Date()` at build time stays; there is no per-page content timestamp to derive from until the blog exists.
- **Findings 6, 7, 11** — operational (Google Business Profile), blocked on content (`llms.txt`), or needs tooling access (Core Web Vitals).
- **`x-default` hreflang** — absent from both `sitemap.ts` and the layout's `alternates.languages`. Not in the audit; a correct and ~2-line addition for a bilingual site. Flagging rather than doing, since it is outside the audit's scope.

---

## Verification

1. `bun run lint` and `bun run build` — must pass. `typedRoutes: true` will surface any broken route literal introduced by the `absoluteUrl` refactor.
2. `bun run start`, then confirm the FAQ fix from a crawler's point of view — the thing the audit could not previously find:
   ```bash
   curl -s http://localhost:3000/ | grep -c "acceptedAnswer"        # expect 1
   curl -s http://localhost:3000/ | python3 -c "import sys,re,html; \
     print([html.unescape(x)[:80] for x in re.findall(r'<p[^>]*>([^<]{40,})</p>', sys.stdin.read())][:8])"
   ```
   Every visible FAQ answer must appear in the raw HTML with JS disabled, in both `/` (ar) and `/en`.
3. Extract and validate every JSON-LD block on `/`, `/en`, `/contact`, `/projects/sanaa-towers`: parse each `application/ld+json`, confirm valid JSON, confirm exactly one `@id` for the organization shared across pages, and confirm `geo` is present with numeric lat/long. Paste the homepage and a project page into Google's Rich Results Test before deploy.
4. Redirects:
   ```bash
   curl -sI http://localhost:3000/projects/sanaatowers | head -2   # 308/301 + Location
   curl -sI http://localhost:3000/projects/alhadah    | head -2
   ```
   Follow with `-L` and confirm a 200 at the destination. Re-run against production after deploy, since the audit confirmed the 404s live.
5. FAQ interaction and a11y by hand: keyboard-only Tab/Enter opens and closes a row on both mobile and desktop widths, `aria-expanded` flips, and the open/close animation is visually unchanged from today. Check RTL (`/`) as well as LTR (`/en`).
6. Confirm the phone and email render as working `tel:` / `mailto:` links in the footer and on the contact page, in both locales, and that the digits match `siteConfig.phone` exactly.
