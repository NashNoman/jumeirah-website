# 003 — Service card hover list: stop animating height

- **Status**: TODO
- **Commit**: d603e1d
- **Severity**: MEDIUM
- **Category**: Performance
- **Estimated scope**: 1 file (`src/app/[locale]/(main)/components/service-gallery-card.tsx`)

## Problem

`src/app/[locale]/(main)/components/service-gallery-card.tsx:10-19` (current):

```tsx
const listVariants: Variants = {
  initial: {
    opacity: 0,
    height: 0,
  },
  active: {
    opacity: 1,
    height: "auto",
  },
};
```

Applied at lines 68-74, triggered by `whileHover="active"` (desktop) or `whileInView` (mobile, below `md`) on the parent at line 46-50. `height` is a layout property. This card sits inside `OurServicesSection` (`src/app/[locale]/(main)/components/sections/our-services.section.tsx`), which renders 3 of these side-by-side — hovering across them in sequence (a realistic scan pattern on a services section) triggers concurrent layout recalculation for each.

## Target

The list content (`<ul>` with `pt-10`) always occupies the same reserved space when active — the card's `aspect-[4/5]` container (line 43) already gives it a fixed footprint, and the list is absolutely free to overflow within that fixed-aspect card without changing document flow, since `ImageContainer` already clips overflow (verify: check `src/components/image-container.tsx` for `overflow-hidden` before implementing — if absent, add `overflow-hidden` to the relevant wrapper as part of this fix, since the current `height: auto` growth was implicitly relying on the card being tall enough already).

Replace the height animation with opacity + transform, keeping the list always laid out (so no layout shift) and just revealing it:

```tsx
const listVariants: Variants = {
  initial: {
    opacity: 0,
    y: 12,
  },
  active: {
    opacity: 1,
    y: 0,
  },
};
```

## Repo conventions to follow

- Easing/duration already applied via the `transition` prop at lines 70-74 (`duration: 0.5, ease: easings.softEaseInOut, delay: ...`) — keep that transition object exactly as-is; this plan only changes the *properties* being animated in `listVariants`, not the timing.
- Exemplar of opacity+y entrance pattern already used elsewhere: `src/lib/transitions.ts` `transitionVariants.item` (`hidden: { opacity: 0, y: 12 }`, `visible: { opacity: 1, y: 0, ... }`) — this plan's target variants intentionally mirror that shape (`y: 12` matches the existing repo convention exactly).

## Steps

1. Read `src/components/image-container.tsx` first to confirm it (or its rendered wrapper) already clips overflowing children (look for `overflow-hidden` on the element that wraps `children`). Report what you find before proceeding — if there's no overflow clipping, this plan's approach still works visually (the list was previously invisible via `opacity: 0` before hover, and `y: 12` keeps it within a few pixels of its final position, so overflow is not a practical concern), but note it so a future pass can confirm.
2. Open `src/app/[locale]/(main)/components/service-gallery-card.tsx`.
3. Replace `listVariants` (lines 10-19) with:
   ```tsx
   const listVariants: Variants = {
     initial: {
       opacity: 0,
       y: 12,
     },
     active: {
       opacity: 1,
       y: 0,
     },
   };
   ```
4. Leave the `transition` prop on the inner `m.div` (lines 70-74) untouched — same `duration: 0.5`, `ease: easings.softEaseInOut`, `delay` logic.
5. Leave the outer `m.div` (`initial="initial" whileHover="active" whileInView={...}`, lines 46-51) and all markup/classNames untouched.

## Boundaries

- Do NOT change the `whileHover`/`whileInView` trigger logic or the `breakpoint.md` conditional — only the `listVariants` object.
- Do NOT change the card's aspect ratio, padding, or any className.
- Do NOT add new dependencies.
- If `src/app/[locale]/(main)/components/service-gallery-card.tsx:10-19` doesn't match what's quoted above (drift since commit `d603e1d`), STOP and report instead of improvising.

## Verification

- **Mechanical**: `bun run lint` and `bun run build` — expect both to pass.
- **Feel check**: run `bun run dev`, go to `/`, scroll to "Our Services":
  - On a viewport ≥768px (`md`), hover each of the 3 service cards in turn — the option list should fade + rise into place without the card's image or icon jumping/shifting position.
  - On a viewport <768px, scroll the section into view — the list should reveal the same way (via `whileInView`).
  - Open DevTools → Performance, record while hovering across all 3 cards rapidly — confirm no "Layout" thrashing appears (there may still be some from other page elements; look specifically for events tied to this component during the hover).
  - Visually confirm the list appears in the same final position as before this change (no regression in the "preserve the same UI design" requirement) — compare against a screenshot taken before the change if unsure.
- **Done when**: `listVariants` no longer references `height`, the hover/in-view reveal still looks correct with no visible layout shift or clipped content, and the card's fixed aspect ratio is unchanged.
