# 005 — Desktop locale dropdown: add exit animation + anchor to trigger

- **Status**: TODO
- **Commit**: d603e1d
- **Severity**: MEDIUM (missed opportunity — teleporting state + wrong/missing origin)
- **Category**: Missed opportunity (spatial consistency, preventing jarring change)
- **Estimated scope**: 1 file (`src/components/navbar/locale-switcher.tsx`)

## Problem

`src/components/navbar/locale-switcher.tsx`, `DesktopLocaleDropdown` function, lines ~150-165 (current):

```tsx
{open && (
  <m.div
    className="absolute right-0 z-[1000] mt-3 min-w-44 overflow-hidden rounded-xl border border-white/10 bg-[#0F0F0F]/80 p-1 shadow-lg backdrop-blur"
    initial={animated ? { opacity: 0, y: 8 } : undefined}
    animate={animated ? { opacity: 1, y: 0 } : undefined}
    transition={{ duration: 0.2, ease: [0.25, 1, 0.5, 1] }}
  >
```

Two gaps:

1. **No exit animation.** The dropdown is conditionally rendered (`{open && (...)}`) with no `AnimatePresence` wrapper, so when the user closes it (click-outside via `onDocumentClick`, or selecting a locale), it disappears instantly — a teleporting state change, not a jarring one on entry but definitely jarring on exit, breaking the spatial story the entrance sets up.
2. **No `transform-origin`.** The dropdown is a popover anchored under the globe icon button (`absolute right-0`), but nothing sets `transform-origin` — per this repo's standard (`.claude/skills/review-animations/STANDARDS.md`, "Physicality"): "Origin-aware popovers. Scale from the trigger, not center." Currently there's no scale transform at all (only `y`/`opacity`), so this is really a missing-origin-anchored-scale opportunity, not a bug in an existing scale.

This is a popover on a nav element used site-wide — occasional frequency (opened when a visitor wants to switch language), well within the "Occasional — standard animation" tier. Purpose: spatial consistency (dropdown should visually originate from its trigger) + preventing a jarring change (symmetric enter/exit).

## Target

```tsx
import { AnimatePresence, m, Variants } from "motion/react";
// ...

<AnimatePresence>
  {open && (
    <m.div
      className="absolute end-0 top-full z-[1000] mt-3 min-w-44 origin-top-right overflow-hidden rounded-xl border border-white/10 bg-[#0F0F0F]/80 p-1 shadow-lg backdrop-blur rtl:origin-top-left"
      initial={animated ? { opacity: 0, scale: 0.95, y: 8 } : undefined}
      animate={animated ? { opacity: 1, scale: 1, y: 0 } : undefined}
      exit={animated ? { opacity: 0, scale: 0.95, y: 8 } : undefined}
      transition={{ duration: 0.2, ease: [0.25, 1, 0.5, 1] }}
    >
```

Notes on the target:
- `exit` mirrors `initial` exactly (symmetric path in/out), per this repo's own "Physicality" and this skill's "Spatial consistency" guidance.
- `scale: 0.95` (never `scale: 0`, per standard) is added alongside the existing `y: 8` — a small, subtle scale-in from the trigger corner reinforces the anchor.
- `origin-top-right` (with an `rtl:origin-top-left` override) sets `transform-origin` to the corner nearest the trigger button (`right-0`-anchored today) — becomes `end-0`/`origin-top-right` so it's correct for both LTR and RTL locales (this site supports `ar`/`en` — see `src/i18n/routing.ts`). Using Tailwind logical `end-0` instead of `right-0` is necessary for correctness in RTL, matching the logical-property convention already used throughout this codebase (`start-`/`end-` appear extensively in `src/app/[locale]/(main)/page.tsx`).
- The duration/easing (`0.2s`, `[0.25, 1, 0.5, 1]`) is unchanged — already within the 150-250ms dropdown budget from `.claude/skills/review-animations/STANDARDS.md`.

## Repo conventions to follow

- Logical properties (`start-`/`end-` instead of `left-`/`right-`) for RTL correctness — exemplar: `src/app/[locale]/(main)/page.tsx` uses `start-0`, `end-0` extensively (e.g. `<div className="... start-0 bottom-0 ...">`).
- `AnimatePresence` for exit animations — this codebase already uses it in `src/components/text-effect.tsx:427` (`<AnimatePresence mode="popLayout">`).
- Never `scale(0)` — use `scale: 0.9-0.97` — this codebase's easings/transitions convention already avoids `scale(0)` everywhere else (`src/lib/luxury-presets.ts` doesn't use it; `src/components/text-effect.tsx`'s `scale` preset at line 189 is the one exception in the codebase, `hidden: { opacity: 0, scale: 0 }` — do NOT copy that pattern; it is itself a latent issue, not a convention to follow).

## Steps

1. Open `src/components/navbar/locale-switcher.tsx`.
2. Add `AnimatePresence` to the existing `motion/react` import at the top: change `import { m, Variants } from "motion/react";` to `import { AnimatePresence, m, Variants } from "motion/react";`.
3. In `DesktopLocaleDropdown`, wrap the `{open && (...)}` block in `<AnimatePresence>...</AnimatePresence>`.
4. On the `m.div` inside it, change:
   - `className="absolute right-0 z-[1000] mt-3 min-w-44 overflow-hidden rounded-xl border border-white/10 bg-[#0F0F0F]/80 p-1 shadow-lg backdrop-blur"` → `className="absolute end-0 top-full z-[1000] mt-3 min-w-44 origin-top-right overflow-hidden rounded-xl border border-white/10 bg-[#0F0F0F]/80 p-1 shadow-lg backdrop-blur rtl:origin-top-left"` (adds `top-full` to make the positioning explicit alongside `mt-3`, switches `right-0`→`end-0`, adds the origin utility).
   - `initial={animated ? { opacity: 0, y: 8 } : undefined}` → `initial={animated ? { opacity: 0, scale: 0.95, y: 8 } : undefined}`
   - `animate={animated ? { opacity: 1, y: 0 } : undefined}` → `animate={animated ? { opacity: 1, scale: 1, y: 0 } : undefined}`
   - Add a new prop: `exit={animated ? { opacity: 0, scale: 0.95, y: 8 } : undefined}`
   - Leave `transition={{ duration: 0.2, ease: [0.25, 1, 0.5, 1] }}` unchanged.
5. Leave `DesktopLocaleDropdown`'s state logic (`useState`, `onDocumentClick`, the button, and the inner `m.ul`/`m.li` list) untouched.

## Boundaries

- Do NOT touch the mobile variant of `LocaleSwitcher` (the `variant === "mobile"` branch) — it has no exit-animation gap (it's driven by the parent `MobileMenu`'s own open/close, plan 002 already covers that container).
- Do NOT change the dropdown's content, list items, or click-outside logic.
- Do NOT add new dependencies (`AnimatePresence` is already part of `motion/react`, already imported elsewhere in this codebase).
- If the current code doesn't match what's quoted above (drift since commit `d603e1d`), STOP and report instead of improvising.

## Verification

- **Mechanical**: `bun run lint` and `bun run build` — expect both to pass.
- **Feel check**: run `bun run dev` on a viewport ≥1024px, go to `/`:
  - Click the globe icon — dropdown should scale+fade+rise in from its top-right corner (top-left in Arabic/`ar` locale — switch locale to verify).
  - Click elsewhere (click-outside) — dropdown should now visibly animate out (fade+scale+shrink toward its origin corner) instead of vanishing instantly.
  - Select a locale from the dropdown — same exit motion should play (briefly) before navigation.
  - In DevTools Animations panel, confirm the exit animation is present as its own timeline entry (not just Instant removal).
  - Toggle `prefers-reduced-motion: reduce` and confirm the dropdown still opens/closes (this component doesn't currently branch on reduced motion — note as an existing gap, don't fix here, out of scope).
- **Done when**: the dropdown's enter and exit use the same mirrored `{opacity, scale, y}` path, `transform-origin` is anchored to the trigger corner (and correctly mirrors in RTL), and clicking outside / selecting a locale no longer causes an instant disappearance.
