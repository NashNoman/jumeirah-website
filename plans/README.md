# Animation improvement plans — `/` (index) page

Branch: `animations/index-page-improvements` (based off `dev` at commit `d603e1d`).

Scope: fix flagged animation issues on the home page, plus a small set of gated
missed-opportunity additions (press feedback, popover exit animation). UI design
is preserved — every plan changes only motion properties (transitions, easing,
transform), never markup, layout, or visual styling.

| # | Title | Severity | Category | Status |
| --- | --- | --- | --- | --- |
| [001](001-faq-card-motion.md) | Fix FAQ card open/close motion (width easing, timing) | HIGH | Performance / Easing / Interruptibility | DONE |
| [002](002-mobile-menu-height-to-transform.md) | Move mobile nav menu open/close off layout property | MEDIUM | Performance | DONE |
| [003](003-service-card-hover-height.md) | Service card hover list: stop animating height | MEDIUM | Performance | DONE |
| [004](004-shorthand-transform-shared-presets.md) | Shared entrance presets use y/scale shorthand | LOW | Performance | DEFERRED |
| [005](005-locale-dropdown-exit-and-origin.md) | Locale dropdown: add exit animation + anchor to trigger | MEDIUM | Missed opportunity | DONE |
| [006](006-applink-press-feedback.md) | Add press feedback to primary CTA links | LOW | Missed opportunity | DONE |

## Manual test pass (2026-09-04)

All five executed plans were exercised in a running dev server (Chromium,
1280×1000 desktop + 390×844 mobile viewports, both `en` and `ar` locales):

- **001 FAQ card** — open/close now uses `luxuryEaseOut` with asymmetric
  durations (0.35s open / 0.2s close) instead of linear/inverted timing;
  width transition reads as smooth, no snap-back observed across repeated
  toggles.
- **002 Mobile menu** — open/close animates opacity + `scaleY` from
  `origin-top` with the `height` collapse delayed to follow, so it no longer
  visibly jumps on layout; verified on a 390px viewport.
- **003 Service card hover** — hover list now animates `opacity`/`y` instead
  of `height`; reveal is smooth, no reflow jump, confirmed on the "Real
  Estate Project Development" card.
- **005 Locale dropdown** — now wrapped in `AnimatePresence` with a mirrored
  exit (fade + scale + y), anchored to the trigger via `origin-top-right`
  (and `origin-top-left` in RTL/Arabic) instead of a fixed page corner;
  confirmed in both `en` and `ar`.
- **006 CTA press feedback** — `active:scale-[0.97]` with a 150ms transform
  transition applied via the shared `appLinkVariants`; confirmed present on
  the primary hero CTA.

No console/page errors were introduced by these changes (pre-existing
PostHog-missing-token warnings and a hydration warning on the contact form's
`caret-color` style are unrelated to this branch). Plan 004 remains
deferred per the scope note below.

## Execution order

001 → 002 → 003 → 005 → 006, in that order. No plan depends on another —
they touch disjoint files (`faqs-section.tsx`, `mobile-menu.tsx`,
`service-gallery-card.tsx`, `locale-switcher.tsx`, `app-link.tsx`) — but this
order goes highest-severity first.

Plan 004 is intentionally **deferred**, not executed on this branch: it would
touch shared preset files (`luxury-presets.ts`, `animated-group.tsx`,
`text-effect.tsx`) imported by every route in the app, not just `/`, and needs
its own dedicated review pass across all consuming pages before it's safe to
change. The plan file documents the finding and a scoped recommendation for
that future pass.

## Rejected candidates (considered, not planned)

- Embla carousel drag physics (`our-projects.section.tsx`) — already has its
  own momentum/snap handling via the Embla library; not a gap.
- Hover color/brightness transitions using Tailwind's plain `hover:` (not
  `@media (hover: hover)`-gated) across the site — real but very low-impact
  (color/shadow only, not movement) and site-wide in scope; not worth a
  dedicated plan for the index-page-only branch.
- `HeaderLinks` component (`src/app/[locale]/(main)/components/header-links.tsx`)
  — dead code, not imported anywhere in the app; skipped.
