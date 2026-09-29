# SEO Audit — jumeirahye.com

Read against source on `claude/website-seo-audit-4ax13e`, 4 Sep 2026. Both locales.
Live site was not reachable from the audit environment, so all findings are code-level.
Interactive version: https://claude.ai/code/artifact/84026c89-6ba0-41bc-a5ad-b5ad3883436f

## Verdict

The SEO plumbing is good: self-referencing canonicals per locale, reciprocal hreflang,
locale-aware sitemap, breadcrumb/Organization/RealEstateListing JSON-LD, per-page Open
Graph, 301s for legacy slugs, `localeDetection: false`. None of that is the problem.

The problem is that it points at content with nothing in it: ~450 words on the homepage,
283 on `/about`, 85 on `/contact`, 48 on `/projects`. Arabic `للبيع` (for sale), `تمليك`,
`أقساط`, `سعر` return **zero** hits; all 8 occurrences of `بيع` are inside "after-sales
services". Every `<h1>` is a navigation label. The company sells apartments in Sana'a and
Al-Hudaydah and the site never says so.

## B. Broken in production

| # | Severity | Finding | Evidence |
|---|---|---|---|
| 1 | Critical | Site-wide OG image is a 404 | `layout.tsx:150` → `/images/og-image.jpg`; file absent. Same for `{project}-twitter.jpg` on all 3 projects |
| 2 | Critical | `/blog` indexable, `subTitle="test"`, empty second `<h1>`, no metadata → duplicates homepage title | `(main)/blog/page.tsx` |
| 3 | Critical | Brand spelled 3 ways | EN `Metadata.title` "Investments" (1 occurrence) vs "Investment" (24). AR title `جميرا للاستثمارات العقارية` vs meta-titles `جميرا للإستثمار العقاري` (wrong hamza, 6 strings incl. the homepage H1 at `ar.json:12`) |
| 4 | High | FAQ `q1` dropped from page and `FAQPage` schema | `src/data/faqs.ts` → `faqKeys = ["q2","q3","q4","q5"]`. q1 is the strongest E-E-A-T answer on the site |
| 5 | High | `/socials` indexable, inherits homepage title+description | `[locale]/socials/page.tsx` — no `generateMetadata`. Same for `not-found.tsx` |
| 6 | High | `SearchAction` declares a search feature that doesn't exist | `structured-data.tsx` → `/projects?search={search_term_string}` |
| 7 | Medium | Primary CTA on `/projects` links to `#` | `(main)/projects/page.tsx` |
| 8 | Medium | `twitter.creator` `@jumeirah_rei` ≠ owned handle `@JumeirahYemen` | `layout.tsx` vs `site.ts` `sameAs` |

## C. Technical

- **No `x-default` hreflang** on a site whose root serves Arabic (`localePrefix: "as-needed"`). Add `"x-default": absoluteUrl("ar", path)` to every `generateMetadata` and to `sitemap.ts`.
- **`lastModified: new Date()`** on all 14 sitemap URLs, every build, plus `changeFrequency: "daily"` on a page that changes yearly. Google learns to ignore `lastmod`. Hard-code real dates or derive from git; drop `changeFrequency`.
- **149 MB of images**, single files to 2.17 MB (`manarat-al-hudaydah/gallery/apartment-3/7.webp`). Re-encode galleries at q72–78 / 2000px long edge.
- **Two YouTube project films, no `VideoObject`** (`sanaa-towers/index.ts:149`, `alhathaa-towers/index.ts:19`).
- **Property schema hard-coded**: `numberOfBedrooms: "2-4"` and `numberOfBathroomsTotal: "2-3"` as strings, identical for all three projects (Manarat Model B is a 1-bed). No `floorSize`, no per-model `Apartment` nodes, no `offers`/`availability` — despite full room schedules living in the data files.
- **Breadcrumb markup with no visible breadcrumbs.** Org schema missing `foundingDate` (2013), `streetAddress`, `alternateName`; `areaServed` is the bare string `"YE"`.
- **`public/robots.txt` hard-codes the domain** while the rest of the codebase reads `siteConfig.baseUrl`. Replace with `src/app/robots.ts`.

## D. On-page

- **Every H1 is a label**: "About Us", "Jumeirah Projects", the company name.
- **Meta descriptions run 195–521 chars** against a ~155 render limit:

| String | EN | AR | Verdict |
|---|---|---|---|
| Homepage description | 195 | 164 | truncated |
| About description | 381 | 250 | truncated 2.4× |
| Sana'a Towers description | 521 | 347 | truncated 3.3× |
| Al-Hathaa description | 393 | 250 | truncated 2.5× |
| Manarat description | 337 | 230 | truncated 2.1× |
| Al-Hathaa title | 76 | 60 | EN truncated |
| Manarat title | — | — | **key missing**, falls back to bare project name |

- **`subtitle` is byte-identical to `meta-description`** on `/about`, `/projects` and two project pages.
- **247 images with numbered alt text** ("Apartment B photo 1…31", "Interior Designs view 1…51"), while the three hero project renders get `alt=""` + `aria-hidden` via `ImageContainer`, removing them from Google Images.

## E. Rewrites (measured char counts)

| Where | Use |
|---|---|
| Home title AR | `شقق وأبراج للبيع في صنعاء والحديدة \| جميرا للاستثمار العقاري` (60) |
| Home title EN | `Apartments for Sale in Sana'a & Al-Hudaydah \| Jumeirah` (54) |
| Home desc AR | `جميرا للاستثمار العقاري: شقق تمليك في أبراج سكنية بصنعاء والحديدة منذ 2013. تصميم مقاوم للزلازل، تشطيب فاخر، وأقساط مريحة. احجز زيارة معاينة.` (141) |
| Home desc EN | `Jumeirah builds and sells apartments in Sana'a and Al-Hudaydah. Three tower projects since 2013, earthquake-resistant build, installment plans. Book a viewing.` (159) |
| Home H1 AR / EN | `شقق وأبراج سكنية للبيع في صنعاء والحديدة` / `Apartments and residential towers for sale in Sana'a and Al-Hudaydah` |
| Projects title | `مشاريع أبراج سكنية في صنعاء والحديدة \| جميرا للاستثمار العقاري` (62) / `Residential Tower Projects in Sana'a & Al-Hudaydah \| Jumeirah` (61) |
| Projects desc EN | `Three tower developments by Jumeirah: Sana'a Towers on 50 Street, the completed Al-Hathaa Towers, and sea-view Manarat Al-Hudaydah. Layouts and prices.` (151) |
| Sana'a Towers title | `صنعاء تاورز: شقق للبيع في شارع الخمسين، صنعاء \| جميرا` (53) / `Sana'a Towers: Apartments for Sale on 50 Street, Sana'a` (55) |
| Sana'a Towers desc EN | `Two towers on 50 Street, Sana'a. Ten apartment layouts from 310 m2, earthquake-resistant structure, private meters per unit. Floor plans and payment plans.` (155, from 521) |
| Al-Hathaa title | `أبراج الحظاء، صنعاء: شقق سكنية منجزة \| جميرا للاستثمار العقاري` (62) / `Al-Hathaa Towers, Sana'a: Completed Apartments \| Jumeirah` (57) |
| Al-Hathaa desc EN | `Al-Hathaa Towers is a completed gated residential compound in Sana'a: two towers, secured parking, landscaped grounds, and full after-sales maintenance.` (152) |
| Manarat title | `منارة الحديدة: شقق بإطلالة بحرية للبيع \| جميرا للاستثمار العقاري` (64) / `Manarat Al-Hudaydah: Sea-View Apartments for Sale` (49) |
| Manarat desc EN | `Sea-view apartments on 30th and 16th Streets, Al-Hudaydah. Four layouts, earthquake-resistant structure, health club, jacuzzi, cafe, private parking.` (149) |
| About title / desc EN | `About Jumeirah: Yemeni Property Developer Since 2013` (52) / `Jumeirah Real Estate Investment and Contracting Ltd. has developed residential towers in Sana'a and Al-Hudaydah since 2013. Who we are and what we build.` (153) |
| Contact title / desc EN | `Contact Jumeirah: Sana'a Sales Office \| +967 778 265 522` (56) / `Talk to Jumeirah's sales team in Sana'a about apartments in Sana'a Towers, Al-Hathaa Towers, and Manarat Al-Hudaydah. Call +967 778 265 522 or send a message.` (158) |

**Alt-text pattern.** Not "Apartment B photo 12" but "Living room of the 330 m² Model B apartment, Sana'a Towers Tower A, Sana'a" — generate from room/view + model + area + tower + project + city, all of which already sit in the message files.

**Stop writing**: "innovative and sustainable real estate solutions" (×4), "A Vision that Leads, Values that Inspire", "Solid Foundations, Promises Fulfilled", "a human and investment value that reflects a complete lifestyle", "the premier reference in real estate investment". Replace with what you can prove: 310–330 m² apartments, earthquake-resistant reinforced structure, individual water and electricity meters per unit, completed and handed over, private parking and 24-hour security.

## F. Missing pages

| Page | Targets | Note |
|---|---|---|
| Per-model unit pages | "شقة 310 متر صنعاء" | ~20 full room schedules already exist, locked inside a tabbed JS widget |
| `/services` | "إدارة عقارات صنعاء", "تطوير عقاري اليمن" | 8 services listed in a carousel, no page; a dead CTA already points here |
| Payment plans / how to buy | "شقق بالتقسيط صنعاء" | Highest commercial intent available; mentioned once, in an accordion |
| `/sanaa`, `/al-hudaydah` | "عقارات صنعاء", "عقارات الحديدة" | Al-Hudaydah has almost no competition |
| `/blog` with real posts | informational | Route exists and currently ships the word "test" |

## G. Order of work

1. **Half a day** — `faqKeys` q1; brand spelling both locales; delete `SearchAction`; fix Twitter handle; kill `href="#"`; `noindex` on `/socials`, `/blog`, 404; remove empty `<h1>`.
2. **One day** — ship section E into both message files; add `x-default` everywhere; export real OG images.
3. **Next week** — write missing body copy: 2 sentences per project on `/projects`, a distinct `/about` subtitle, a first paragraph per project page naming district + status + unit range.
4. **Next week** — re-encode galleries, then measure CWV on `/projects/manarat-al-hudaydah`.
5. **Two weeks** — real alt text from model/dimension data; drop `aria-hidden` on project cards.
6. **This month** — schema: derived bed/bath counts, per-model `Apartment` + `floorSize`, `offers`, `VideoObject`, `foundingDate`, visible breadcrumbs.
7. **This quarter** — section F pages, starting with unit pages and payment plans.
8. **Ongoing** — fix sitemap `lastModified`.

## Not verifiable from source

Rich Results Test on the rendered JSON-LD, Search Console coverage/query data, and
PageSpeed Insights LCP on the gallery-heavy project pages. Search Console access would
sharpen the section E keyword targets.
