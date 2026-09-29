# Project Details Page — SEO / GEO / AEO Audit

**Date:** 2026-09-04
**Scope:** `src/app/[locale]/(main)/projects/[project]/` — the three project detail pages (`sanaa-towers`, `alhathaa-towers`, `manarat-al-hudaydah`), both locales.
**Method:** Static review of the route, its sections, its data modules and its JSON-LD components, plus a **production build (`bun run build` + `bun run start`) and raw `curl` of the rendered HTML** — no JavaScript execution, deliberately mirroring what Googlebot's initial fetch, GPTBot, PerplexityBot and ClaudeBot actually see.
**Predecessors:** `docs/seo-geo-aeo-audit-2026-08-30.md` and `docs/seo-geo-aeo-remediation-plan.md`. That work is real and landed — canonicals, hreflang, `siteConfig`, breadcrumbs, 301s and the FAQ crawlability fix are all in place. This audit is about what is *still* broken, and it is not a short list.

---

## Verdict

The project detail page is a beautiful brochure that is, to a crawler, almost empty.

The measured numbers, from the built page:

| Metric | `/en/projects/sanaa-towers` |
|---|---|
| Total HTML served | **415 KB** |
| Visible text in the DOM (all tags stripped, scripts excluded) | **2,238 characters** |
| …of which is site chrome (nav, footer, contact block) | ~1,100 characters |
| Unique project copy actually rendered | **~1,100 characters** |
| Unique project copy that *exists in `messages/en.json`* for the towers alone | **10,099 characters** |
| Room-dimension lines in the data | **151** |
| Room-dimension lines in the HTML | **0** |
| Apartment models in the data | **12** |
| Apartment models whose description reaches the HTML | **1** |

You are shipping 415 KB to deliver 1.1 KB of indexable copy, while withholding 90% of the most specific, most differentiated, most query-matching content you own. Every competitor with a plain HTML table of apartment sizes outranks this page for the queries that actually convert, and no AI answer engine can cite it, because there is nothing to cite.

The 2026-08-30 audit called the FAQ answers being client-only "the single highest-impact AEO issue found." That bug was fixed on the homepage. **The exact same bug, at roughly ten times the scale, is still live on every project page** and was never audited.

---

## Findings by severity

| # | Finding | Severity | Type |
|---|---|---|---|
| 1 | 90% of tower/model content never enters the DOM | Critical | SEO + AEO |
| 2 | Manarat Al-Hudaydah is geotagged in the wrong city | Critical | GEO |
| 3 | `RealEstateListing` schema is structurally invalid | High | SEO |
| 4 | No price, no availability, no `Offer` — anywhere | High | AEO |
| 5 | `VideoObject` is ineligible and partly false | High | SEO |
| 6 | OG/Twitter images declare dimensions they do not have | High | SEO |
| 7 | `ApartmentComplex` is an orphan stub; 12 `Apartment` entities missing | High | SEO + AEO |
| 8 | Zero question-shaped content on the page | High | AEO |
| 9 | Meta description promises content the page does not contain | Medium | SEO |
| 10 | Heading hierarchy is broken and partly duplicated | Medium | SEO + a11y |
| 11 | 42 near-identical alt texts ("Apartment L photo 1…42") | Medium | SEO |
| 12 | Five image preloads competing for LCP; invalid `sizes` | Medium | CWV |
| 13 | No freshness signal of any kind | Medium | AEO |
| 14 | Brand-disambiguation strategy applied inconsistently | Medium | SEO |
| 15 | Language switcher links to a URL that 307-redirects | Low | SEO |
| 16 | Sitewide keyword-stuffed `<meta keywords>` on every page | Low | AEO |
| 17 | No visible breadcrumb; JSON-LD claims a trail the page doesn't show | Low | SEO |
| 18 | No `llms.txt`, no machine-readable project data | Low | AEO |

---

## Critical

### 1. Ninety percent of the page's content never reaches the DOM

`src/app/[locale]/(main)/projects/components/project-towers-display/details-panel.tsx:31-71` early-returns on `selectedDataTab`:

```tsx
if (selectedDataTab === "layout") {
  return <p>{t(selectedModelData.layout.description)}</p>;
}
…
if (selectedDataTab === "details" && selectedModelData.details) {
  return <ModelDetailsPanel … />;
}
```

`selectedDataTab` defaults to `"layout"`, and `selectedTower` / `selectedModel` default to `0`. So the server renders **exactly one paragraph**: Tower A / Model A's layout description. Everything else — Model B through Model N, Tower B in its entirety, and all 151 room-dimension lines across all three projects — is conditionally rendered on client state and exists in the response only as serialized JSON inside the React Flight payload, which is 46% of the 415 KB and is not indexable content.

Verified directly:

```
'Guest Reception Hall'   in-DOM=False   in-flight-payload=True
'3.75m'                  in-DOM=False   in-flight-payload=True
'330 square meters'      in-DOM=False   in-flight-payload=True
'310 square meters'      in-DOM=True    (the one rendered model)
```

**Why this is the most expensive bug on the site.** The room dimensions are the only content you have that nobody else has. "Sana'a Towers Model B area", "master bedroom size Al-Hathaa Towers", "شقق 310 متر صنعاء", "how many bedrooms in Manarat Al-Hudaydah Model C" — these are exactly the long-tail, high-intent, low-competition queries a three-project developer can realistically win, and they are the queries an AI answer engine fans out to when someone asks "what apartments can I buy in Sana'a." You have the answers. You are hiding them behind a `useState`.

It is also a self-inflicted content-thinness problem. Google's helpful-content systems see a 1.1 KB marketing page with stock adjectives ("integrated lifestyle", "qualitative addition"). That is the profile of a page that gets ignored, not one that ranks.

**Fix.** The same fix the FAQ section got, applied here: render all panels into the DOM and toggle visibility with CSS, not with conditional mounting.

- In `DetailsPanel`, render layout / details / photos panels for **every** model of **every** tower, all mounted, with the non-active ones hidden via `hidden` / `display:none` (CSS-hidden text is still indexed; Google has said so for years, and it is the standard tab pattern — this is not cloaking, the content is identical and user-reachable).
- Same treatment in `media-panel.tsx` and the tower/model tab panels: `role="tabpanel"` + `hidden` on the inactive ones is both the accessible pattern and the crawlable one.
- If mounting 12 models' worth of DOM is a performance concern, the alternative is a server-rendered, always-visible spec section *below* the interactive browser — a plain `<table>` per model with area and room dimensions. Uglier, and better: it is the single highest-value change available on this site.

Either way, budget for the page's indexable text to go from ~1.1 KB to ~11 KB. That is the whole point.

### 2. Manarat Al-Hudaydah is geotagged in the wrong city

From the built page at `/en/projects/manarat-al-hudaydah`:

```json
"address": { "addressLocality": "Sana'a", "addressRegion": "Sana'a Governorate" },
"geo":     { "latitude": 15.3694, "longitude": 44.191 }
```

Manarat Al-Hudaydah is in **Al-Hudaydah** — a Red Sea coastal city roughly 226 km west of Sana'a. Its own meta description says so ("Sea-view apartments on 30th and 16th Streets, Al-Hudaydah"). Its structured data says it is in Sana'a, at the company office's coordinates.

The root cause is `src/components/project-structured-data.tsx:26-41`, which reads `siteConfig.address` and `siteConfig.geo` — the **company office** — for every project. So all three projects also share one identical coordinate pair, which is separately wrong: Sana'a Towers is on 50th Street in the Hadeed area, Al-Hathaa Towers is elsewhere in Sana'a, and neither is at the Hadda Street office.

**Impact.** This is not a missing-data problem, it is a wrong-data problem, which is worse. You are publishing three verifiably false location claims in machine-readable form to every search engine, map surface and AI crawler. Local ranking depends on location consistency; you have manufactured inconsistency at the schema layer. An AI engine asked "where is Manarat Al-Hudaydah" and reading your own site will answer "Sana'a."

**Fix.** Per-project location in the data model, not sitewide config:

```ts
// src/data/types.ts
location: {
  addressLocality: string;      // "Al-Hudaydah"
  addressRegion: string;        // "Al-Hudaydah Governorate"
  streetAddress: string;        // "30th Street × 16th Street"
  geo: { latitude: number; longitude: number };
};
```

Populate it per project from the actual site coordinates, read it in `project-structured-data.tsx`, and if a project's real coordinates are unknown, **omit `geo` entirely** rather than substituting the office. Then surface the same address as visible text on the page (see Finding 8) — schema without corroborating on-page text is a weak signal.

---

## High

### 3. `RealEstateListing` is the wrong type and is carrying invalid properties

`project-structured-data.tsx:21-58` emits:

```json
{ "@type": "RealEstateListing", "telephone": …, "address": …, "geo": …,
  "openingHoursSpecification": …, "amenityFeature": … }
```

`RealEstateListing` is a subtype of `SearchResultsPage` → `WebPage` → `CreativeWork`. Its only own properties are `datePosted` and `leaseLength`. It is a *page type*, not a place. `telephone`, `geo`, `address`, `openingHoursSpecification` and `amenityFeature` are not valid on it, and a validator will report them as unrecognized.

`openingHoursSpecification` on a listing is additionally nonsense on its face — a building does not open at 08:00 and close at 17:00; the sales office does.

**Fix.** Drop the `RealEstateListing` node. Make `ApartmentComplex` (a proper `Residence`/`Place`) the primary entity for the project and hang everything real on it: `@id`, `url`, `image` (array), `address`, `geo`, `amenityFeature`, `numberOfAvailableAccommodationUnits`, `containsPlace`, `tourBookingPage`, and `provider`/`developer` pointing at the org `@id`. Keep `datePosted` only if you add a real listing date.

### 4. No price, no availability, no `Offer` — on a page selling apartments

Neither the copy nor the schema contains a price, a price range, a payment-plan structure, a delivery date, an availability status, or a unit count. The whole page is adjectives.

For AEO this is disqualifying. "How much is an apartment in Sana'a Towers" is the single most-asked question about this product, and an AI engine that cannot answer it from your page will answer it from somewhere else — a broker listing, a Facebook post, a forum — and cite that instead. The Princeton GEO study's top-ranked lever is *specific numbers with sources*, at roughly +37–40% citation rate. You have specific numbers (areas, dimensions) hidden in Finding 1, and no commercial numbers at all.

**Fix.**

- Add an `Offer` (or `AggregateOffer` with `lowPrice`/`highPrice`/`priceCurrency: "YER"` or `"USD"`, plus `availability`) per model, on the `Apartment` entities from Finding 7.
- If prices genuinely cannot be published, publish the *structure* instead: down-payment percentage, installment term, delivery quarter, what's included. "Starting from X, 30% down, 36 monthly installments, handover Q4 2026" is citable. "A secure investment" is not.
- Add a `/pricing.md` (or per-project `.md`) at the site root for agent readability, and link it from the sitemap.

### 5. The `VideoObject` is ineligible for rich results and contains a false claim

`src/components/video-structured-data.tsx:26-34`:

- **No `uploadDate`.** Google requires it. Without it the node is ineligible, full stop. The file's own comment acknowledges this and has been open since the last audit.
- **`contentUrl: "https://youtu.be/gcCwNqkCMGk"`.** `contentUrl` must point at the actual media file. A YouTube watch URL is an `embedUrl`, not a `contentUrl`. Setting both to the same watch URL is incorrect.
- **`thumbnailUrl`** points at `/images/sanaa-towers.webp`, a 1080×1350 **portrait** photo. Video thumbnails should be 16:9-ish; a 4:5 portrait will be rejected or cropped badly.
- **No `duration`.**
- **The video is not on the page.** The `<iframe>` in `video.section.tsx` only mounts after a click opens the modal. You are declaring a `VideoObject` for a page that, as served, contains no video.

**Fix.** Get the two upload dates out of YouTube Studio; set `uploadDate` and `duration`; drop `contentUrl`; generate a proper 16:9 thumbnail per video; and either render the iframe (or a `<link rel="preconnect">`-cheap facade with the real embed present) in the initial DOM, or drop the schema. A `VideoObject` that describes a video the page doesn't have is a trust problem, not just a missed rich result.

### 6. OG and Twitter images declare dimensions they do not have

`projects/[project]/page.tsx:96-101` hardcodes `width: 1200, height: 630`. The actual files:

| File | Real dimensions | Declared |
|---|---|---|
| `sanaa-towers.webp` | 1080 × 1350 (4:5 portrait) | 1200 × 630 |
| `alhathaa-towers.webp` | 1080 × 1350 (4:5 portrait) | 1200 × 630 |
| `manarat-al-hudaydah.webp` | 1629 × 2172 (3:4 portrait) | 1200 × 630 |

Every project page lies about its share image aspect ratio by roughly 2.4×. `twitter:card` is `summary_large_image`, which expects 2:1 — a 4:5 portrait gets centre-cropped to a sliver, and some platforms reserve a 1200×630 box and letterbox it. The homepage gets this right (`og-image.png` is genuinely 1200×630); the project pages do not.

Also: WebP OG images have patchy support across scrapers (WhatsApp in particular). Given every share of a project page goes through exactly this image, that is a bad bet.

**Fix.** Produce a real 1200×630 JPEG or PNG per project (`/images/og/<slug>.jpg`) and point `openGraph.images` and `twitter.images` at it, or generate them with `next/og` at `opengraph-image.tsx` so the dimensions can never drift from the declaration again.

### 7. `ApartmentComplex` is an orphan stub, and the 12 `Apartment` entities that should exist don't

The emitted node is five fields: `name`, `description` (verbatim duplicate of `RealEstateListing`'s), `address` (country + locality only), and `amenityFeature`. It has no `@id`, no `url`, no `image`, no `geo`, and no relationship to any other node on the page. Two disconnected top-level entities with identical `name` and `description` is not one project described twice — to a parser it's two things.

Meanwhile the data model contains, per project, a complete inventory: 12 models with exact floor areas (310 m², 330 m², 326 m², 210 m²…) and 151 room dimensions. None of it is in the graph.

**Fix.**

```
ApartmentComplex  @id: <projectUrl>#complex
  ├─ url, image[], address, geo, amenityFeature[]
  ├─ numberOfAvailableAccommodationUnits: 12
  ├─ provider → siteConfig.organizationId
  └─ containsPlace: [
        Apartment @id: <projectUrl>#model-a
          name, floorSize: QuantitativeValue{ value: 310, unitCode: "MTK" },
          numberOfRooms, numberOfBedrooms, numberOfBathroomsTotal,
          offers: Offer{ price, priceCurrency, availability }
        … × 12
     ]
```

`floorSize` alone, across 24 apartment entities sitewide, is more machine-readable substance than the entire site currently publishes. This is the highest-leverage schema work available and the data is already typed and translated.

Note the existing comment in `project-structured-data.tsx` about `numberOfBedrooms` being omitted because the data model has no numeric field — that was the right call at the time. The fix is to add the numeric fields to `ModelData`, not to keep omitting them; the room lists already encode bedroom counts, they just encode them as prose.

### 8. There is not one question-shaped element on the page

Headings on `/en/projects/sanaa-towers`, in order: *Sana'a Towers · Integrated Services in One Home · The project includes two modern residential towers · Project Towers · Modern Living Room Design · Sana'a Towers Features · Sana'a Towers Services*, plus feature/service names.

Not one of those matches how anyone searches or prompts. AI answer engines extract passages that directly answer a question; the extractable unit is a heading that looks like a query followed by a 40–60 word self-contained answer. This page has zero of those. It also never states, in body text, where the project is (except one clause buried in the video block), what it costs, when it delivers, who builds it, or how to buy — the five things every prospective buyer and every LLM asks first.

The homepage has an `FAQPage`. The project pages, which are where the buying questions actually are, have nothing.

**Fix.** Add a per-project FAQ section — server-rendered, always in the DOM, with `FAQPage` JSON-LD, reusing the pattern already built in `src/components/faq-structured-data.tsx` and `src/data/faqs.ts`. Six to eight questions per project, answered in 40–60 words each:

- Where is [project] located?
- How much do apartments at [project] cost, and what payment plans are available?
- What apartment sizes and layouts are available?
- When will [project] be delivered / is it ready to move in?
- What amenities and services are included?
- Is [project] earthquake-resistant? *(you claim this as a feature and never explain it — it's a genuine differentiator in Yemen and a natural citation magnet)*
- Can non-residents buy at [project]?
- What after-sales maintenance is provided?

And add a plain, visible address line near the top of each project page ("Hadeed area, south of 50th Street, Sana'a" / "30th and 16th Streets, Al-Hudaydah"). It costs one `<p>` and it is a direct local-SEO and GEO signal that currently only exists in a `<meta>` tag.

---

## Medium

### 9. The meta description promises content the page does not have

Sana'a Towers: *"Two towers on 50th Street, Sana'a. Ten apartment layouts from 310 m2, earthquake-resistant structure, private meters per unit. Floor plans and payment plans."*

Cross-checked against the rendered page:

- **"Ten apartment layouts"** — the data has **12** models (Tower A: A, B, C, D, H; Tower B: J, K, L, M, N, T, W). Your own description undercounts your inventory.
- **"private meters per unit"** — appears nowhere on the page. Not in the features list, not in the copy.
- **"payment plans"** — appears nowhere on the page. Not a word about payment.
- **"Floor plans"** — technically present as images, but with `alt="Model A layout"`.

Two of four claims are unsupported by the page. Google rewrites descriptions when they don't match the content, and an AI engine that fetches this page after seeing "payment plans" in the SERP snippet finds nothing and does not cite you. Descriptions are a promise; keep them or change them.

### 10. Heading hierarchy is broken, and one heading is duplicated in the DOM

Rendered order: `H1 → H2 → H2 → H2 → H3 → H2 → H3… → H5 → H5 → H5 → H3 → H4`.

- The image-gallery section's only heading is an **`<h3>` with no parent `<h2>`** (`image-gallery.section.tsx:223`).
- The footer jumps to **`<h5>`**, then the contact block drops back to `<h3>` and uses an **`<h4>` for a full sentence** ("We are happy to receive your inquiries…") — a heading being used as body copy.
- The towers section carries **two H2s for one section**: a visible one and an `sr-only` "Project Towers".

Worse, `src/components/text-effect.tsx` renders every heading and description it wraps **twice** — once as `aria-hidden` per-word spans (the visible copy) and once inside `<span class="sr-only">` (line 446). The served HTML contains:

```html
<h2><span aria-hidden="true"><span>Sana'a Towers Services</span></span>
    <span class="sr-only"><span>Sana'a Towers Services</span></span></h2>
```

Text extraction yields `Sana'a Towers ServicesSana'a Towers Services`. The description paragraph is fragmented into one `aria-hidden` `<span>` per word plus a duplicate sr-only copy. So the *visible* text is marked hidden from the accessibility tree — which is precisely the tree that agentic AI crawlers read — and the text a crawler recovers is doubled and word-fragmented.

**Fix.** Restore a clean `H1 → H2 → H3` order (give the gallery an `<h2>`, demote the footer to `<h3>`/`<h4>`, turn the contact `<h4>` into a `<p>`, drop the redundant sr-only H2). In `TextEffect`, emit the segmented spans *or* the sr-only copy, not both — the standard pattern is `aria-hidden` segments inside a container with an `aria-label`, so the text appears once in the DOM.

### 11. Forty-two identical alt texts

The Sana'a Towers page ships 101 `<img>` elements. Forty-two of them are `alt="Apartment L photo 1"` … `alt="Apartment L photo 42"`. Others are `"Model A layout"`, `"Fullscreen"`.

These are the interior photographs of a luxury apartment in Sana'a and they carry zero descriptive text. No image-search visibility, no multimodal extraction, no accessibility value. (Credit where due: the interior-design gallery does have real alts — "Guest reception (Diwan)", "TV unit and entertainment center". The model photo sets do not.)

**Fix.** Write real alts into `messages/*.json` for the model photo sets — subject, room, project, city: *"Master bedroom of Model L, Sana'a Towers, Sana'a"*. 42 strings per locale is a copy task, not an engineering one, and it is the cheapest image-SEO win on the site.

### 12. Five image preloads fight over LCP, and one `sizes` is invalid

The built page emits five `<link rel="preload" as="image">` entries:

1. The hero background (`priority` + `fetchPriority="high"`, from the root layout) — decorative.
2. The site logo.
3. The gallery's full-bleed background image (`image-gallery.section.tsx:166-169`: `fill`, `sizes="100vw"`, `priority`) — rendered at `opacity-40` as **decoration**, below the fold.
4–5. Two gallery thumbnails (`priority={index < 3}`, line 258) — below the fold.

Preloading a below-the-fold decorative full-viewport image at high priority, on a market where mobile bandwidth is the binding constraint, is the textbook LCP regression. Three of the five preloads are for content the user will not see for several screens.

Separately, the hero's `sizes` attribute is `"(max-width: 768px) 100vh, (max-width: 1200px) 100vw, 100vw"` — **`100vh` in a `sizes` attribute** (`src/app/[locale]/layout.tsx:90`). `sizes` describes width. On a portrait phone `100vh` ≫ `100vw`, so the browser selects a needlessly large candidate. Almost certainly a typo for `100vw`.

**Fix.** Drop `priority` from the gallery background and from the thumbnail slides; keep exactly one high-priority image, the actual LCP element. Fix `100vh` → `100vw`. Then re-measure — 415 KB of HTML plus 205 kB of first-load JS for this route is already a heavy page before images.

### 13. No freshness signal anywhere

No `dateModified`, no `datePublished`, no "last updated", no `Article`/`WebPage` node with a date, and (deliberately, per `sitemap.ts`) no `lastmod`. The sitemap decision is defensible. Having *no* date signal on the entire page is not.

AI answer engines weight recency heavily, and a real-estate page with no date reads as possibly-stale inventory — the worst possible framing for a product where "is this still available?" is the second question after price.

**Fix.** Add a real `dateModified` per project, sourced from a field in each project's data module that a human updates when the project's facts change (not the build timestamp — that's the trap `sitemap.ts` correctly avoided). Surface it in the `ApartmentComplex`/`Offer` node and, ideally, as a visible "Information updated: [month year]" line.

### 14. Brand disambiguation was applied to two projects out of three, inconsistently

The previous audit's Finding 1 — that "Jumeirah" collides with the Dubai hotel group and must always be qualified — was implemented unevenly:

| Page | `<title>` |
|---|---|
| Sana'a Towers (en) | `Sana'a Towers: Apartments for Sale on 50th Street, Sana'a` — **no brand token at all** |
| Sana'a Towers (ar) | `صنعاء تاورز: شقق للبيع في شارع الخمسين، صنعاء \| جميرا` |
| Al-Hathaa (en) | `Al-Hathaa Towers, Sana'a: Completed Apartments \| Jumeirah` |
| Al-Hathaa (ar) | `أبراج الحظاء، صنعاء: شقق سكنية منجزة \| جميرا للاستثمار العقاري` |
| Manarat (en) | `Manarat Al-Hudaydah \| Jumeirah, Al-Hudaydah Yemen` |
| Manarat (ar) | `منارة الحديدة \| جميرا للاستثمار العقاري، الحديدة، اليمن` |

Three different brand suffixes ("Jumeirah", "جميرا", "جميرا للاستثمار العقاري"), one page with none, and the English Sana'a title repeats "Sana'a" twice while omitting the company entirely. The H1s are worse: `Sana'a Towers`, `Al-Hathaa Residential Towers`, `Manarat Al-Hudaydah` — all bare, none carrying a city or brand qualifier.

**Fix.** Pick one suffix policy and encode it once — `title.template: "%s | Jumeirah Real Estate Investment"` in the root layout metadata, with per-page titles carrying project + city and no brand token. That makes drift structurally impossible instead of relying on three hand-written string pairs staying in sync.

---

## Low

### 15. The language switcher links to a redirecting URL

The Arabic switch on `/en/projects/sanaa-towers` links to `/ar/projects/sanaa-towers`, which **307-redirects** to `/projects/sanaa-towers` (verified). Under `localePrefix: "as-needed"` the canonical Arabic URL is unprefixed, and `hreflang` correctly points there — but the visible internal link does not. Every Arabic switch costs a round trip, and crawlers keep re-queueing a set of `/ar/*` URLs that only ever redirect. Point the switcher at the canonical form.

### 16. Sitewide keyword-stuffed `<meta keywords>` on every page

Every project page carries the identical homepage keyword string: *"real estate Yemen, property investment Yemen, luxury apartments Yemen, Sana'a real estate, residential towers Yemen, Jumeirah Real Estate Investment, real estate development, property management Yemen."*

Google has ignored `meta keywords` since 2009, so the direct cost is zero — but it is a comma-separated keyword list with no page-level relevance, duplicated across every URL, and the Princeton GEO research measured keyword stuffing as the one optimization that *actively reduces* AI citation rate (−10%). Delete it, or at minimum stop serving the homepage's list on project pages.

### 17. Breadcrumb JSON-LD with no visible breadcrumb

`BreadcrumbSchema` emits a correct three-level trail. The page renders no breadcrumb navigation at all. Not a violation, but structured data that describes UI the user cannot see is a weaker signal than markup backed by real navigation — and a visible trail is genuine UX on a site where project pages are two levels deep.

### 18. No `llms.txt`, no machine-readable project data

`public/` contains no `llms.txt`, no `llms-full.txt`, no `pricing.md`, no per-project data file. Flagged as Finding 7 in the previous audit and still open. Given Findings 1 and 4 — the substantive content isn't in the HTML and there are no prices — an `llms.txt` today would point AI systems at pages that can't answer their questions. **Do Findings 1, 4 and 8 first; then `llms.txt` becomes worth writing.** Order matters here.

---

## What is genuinely right

Not everything is broken, and the previous remediation pass holds up:

- Canonicals, `hreflang` (including `x-default`), and the `absoluteUrl` / `hreflangAlternates` helpers are correct on all six project URLs — verified against the built HTML.
- `siteConfig` as a single source of truth for NAP eliminated a real class of inconsistency; the org node has `@id`, `geo`, `openingHours`, `telephone`, `email`, `areaServed`.
- The 301s for the old indexed slugs work (`/projects/sanaatowers` → 308 → `/projects/sanaa-towers`).
- `robots.txt` allows AI crawlers deliberately and documents the decision.
- `en.json` / `ar.json` are in perfect key parity for all three project namespaces — zero missing keys in either direction.
- Meta titles and descriptions exist for all three projects in both locales and are within length limits. (The stale fallback comment in `page.tsx:73-76` about Manarat lacking `meta-title` no longer applies — it has one.)
- The sitemap's refusal to fake `lastModified` is the right call.
- Contact CTA, `tel:`/`mailto:` links, and the footer project cross-links are all present and crawlable.

The foundation is sound. The problem is that the page built on it is empty.

---

## Recommended order of work

**Phase 1 — stop the bleeding (highest value per hour)**

1. **Finding 1** — mount all tower/model panels in the DOM. Single biggest change on the site; takes indexable text from ~1.1 KB to ~11 KB per page.
2. **Finding 2** — per-project location data; stop publishing Al-Hudaydah as Sana'a.
3. **Finding 6** — real 1200×630 OG images (or `opengraph-image.tsx`).
4. **Finding 12** — remove the three spurious `priority` flags; fix `100vh` → `100vw`.

**Phase 2 — make it answerable**

5. **Finding 8** — per-project FAQ section + `FAQPage` schema + a visible address line.
6. **Finding 4** — prices, or the payment structure if prices can't be published; `Offer` nodes.
7. **Finding 9** — rewrite meta descriptions to match what the page will then actually contain.

**Phase 3 — make it machine-readable**

8. **Findings 3 + 7** — drop `RealEstateListing`; build the `ApartmentComplex` → `containsPlace: Apartment[]` graph with `floorSize` and `offers`.
9. **Finding 5** — fix or remove the `VideoObject`.
10. **Finding 13** — per-project `dateModified`.

**Phase 4 — cleanup**

11. **Findings 10, 11, 14** — heading hierarchy, `TextEffect` double-render, 42 alt texts, `title.template`.
12. **Findings 15, 16, 17** — switcher URL, drop `meta keywords`, visible breadcrumb.
13. **Finding 18** — `llms.txt`, once there is something worth pointing it at.

---

## Appendix — reproducing these measurements

```bash
bun install && bun run build
PORT=3111 bun run start &

# Indexable text actually served (scripts stripped)
curl -s http://localhost:3111/en/projects/sanaa-towers \
  | python3 -c "import sys,re,html; h=sys.stdin.read(); \
      b=re.sub(r'(?is)<script.*?</script>','',h); \
      t=re.sub(r'\s+',' ',html.unescape(re.sub(r'(?s)<[^>]+>',' ',b))); \
      print(len(t.strip()))"
# → 2238

# Content present in the flight payload but absent from the DOM
curl -s http://localhost:3111/en/projects/sanaa-towers \
  | python3 -c "import sys,re; h=sys.stdin.read(); \
      b=re.sub(r'(?is)<script.*?</script>','',h); \
      [print(p, 'DOM=', p in b, 'payload=', p in h) \
       for p in ['Guest Reception Hall','3.75m','330 square meters']]"

# JSON-LD nodes
curl -s http://localhost:3111/en/projects/manarat-al-hudaydah \
  | grep -o 'application/ld+json.\{0,600\}'
```
