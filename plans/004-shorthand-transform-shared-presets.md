# 004 — Shared entrance presets use y/scale shorthand instead of transform strings

- **Status**: DEFERRED (documented, not executed this pass — see rationale)
- **Commit**: d603e1d
- **Severity**: LOW (documented finding, not executed in this pass)
- **Category**: Performance
- **Estimated scope**: 3 shared files (`src/lib/luxury-presets.ts`, `src/components/animated-group.tsx`, `src/components/text-effect.tsx`) used by every page on the site, not just `/`

## Problem

Every entrance preset in these three files animates the Framer Motion (`motion/react`) shorthand props `y`, `scale`, `skewY`, `x` directly (e.g. `src/lib/luxury-presets.ts:19` `hidden: { opacity: 0, y: 32 }`), rather than a literal `transform` string. Per this repo's animation performance standard (`.claude/skills/review-animations/STANDARDS.md`, "Performance" section): "Framer Motion shorthands are NOT hardware-accelerated. `x`/`y`/`scale` run on the main thread via rAF and drop frames under load." A full `transform` string composited via CSS is preferred.

On `/`, this pattern drives the hero headline's word-by-word reveal (`luxuryPresets.hero`, first thing painted, competing with image decode/hydration) and effectively every section entrance (`transitionVariants.item`, `AnimatedGroup` slide/scale/blur-slide presets, `TextEffect` rise/cascade/skew-fade/clip/mask-slide presets).

## Why this plan is deferred rather than executed now

This request's scope is explicitly "improve the animations on the index page while preserving the same UI design." These three files are **shared infrastructure** imported by every route in the app (`about`, `blog`, `projects/[project]`, `contact`, `socials` all use `Section`, `AnimatedGroup`, and/or `TextEffect`). Rewriting the shorthand props to literal `transform` strings site-wide:

1. Requires re-verifying every non-`/` page that consumes these presets (out of the reviewed scope for this branch).
2. Risks visible behavior differences in edge cases — e.g. `TextEffect`'s `clip`/`mask-slide` presets combine `clipPath` with `x`/`skewY` in the same variant, and RTL pages mirror `x`/`skewY` via CSS logical properties elsewhere in the codebase; converting to a single `transform` string needs care to not break RTL mirroring (`rtl:` variants exist throughout `src/app/[locale]/(main)/page.tsx` for exactly this reason).
3. Is explicitly LOW severity per the review that produced this finding — no dropped-frame regression has been observed, it's a theoretical performance ceiling, not a felt problem today.

## Recommendation for a future pass

If pursued, scope it to one preset at a time, starting with the highest-visibility one (`luxuryPresets.hero`, the H1 reveal), and test every page that imports `Section`/`AnimatedGroup`/`TextEffect` (grep for importers first: `grep -rl "from \"@/components/animated-group\"\|from \"@/components/text-effect\"\|from \"@/components/section\"" src/app`) before merging. Convert `{ y: N }` → `{ transform: "translateY(Npx)" }` and `{ scale: N }` → `{ transform: "scale(N)" }`; when a variant combines multiple transform functions (e.g. `luxuryPresets.rise`'s `y` + implicit none), compose them into one string: `transform: "translateY(30px)"`. For `TextEffect`'s `mask-slide`/`skew-fade` presets that combine `x`/`skewY`, compose as `transform: "translateX(-30px) skewY(8deg)"`.

## Boundaries (for this branch)

- Do NOT modify `src/lib/luxury-presets.ts`, `src/components/animated-group.tsx`, or `src/components/text-effect.tsx` in this pass.
- This plan file exists to record the finding for a future dedicated session — it is intentionally not executed alongside plans 001-003, 005, 006.
