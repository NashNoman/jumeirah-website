# 002 — Move mobile nav menu open/close off layout property

- **Status**: TODO
- **Commit**: d603e1d
- **Severity**: MEDIUM
- **Category**: Performance
- **Estimated scope**: 1 file (`src/components/navbar/mobile-menu.tsx`)

## Problem

`src/components/navbar/mobile-menu.tsx:12-15` (current):

```tsx
const navMenuVariants: Variants = {
  open: { opacity: 1, height: "auto" },
  closed: { opacity: 0, height: 0 },
};
```

Applied at line 19-24:

```tsx
<m.div
  variants={navMenuVariants}
  initial="closed"
  animate={isOpen ? "open" : "closed"}
  transition={{ duration: 0.2, ease: easings.gentleEaseOut }}
  className="col-span-2 space-y-5 overflow-hidden lg:hidden"
>
```

`height` is a layout-triggering property — animating it forces the browser to recompute layout every frame instead of compositing on the GPU. This runs on every hamburger tap, which on a marketing site is a moderate-frequency interaction (a handful of times per mobile session, more during QA/browsing).

## Target

Because the menu's content is variable-height text (nav links + locale switcher + social icons) whose real height isn't known ahead of time, the cleanest transform-safe approach that preserves the exact same visual open/close (grow-from-top, fade in) without hardcoding a max-height guess is to keep `height: auto` for layout purposes but move the *visual* motion to `transform: scaleY()` + `opacity`, using `transform-origin: top` so it grows downward from the navbar (matching today's grow-from-top look), while `height` itself switches instantly between the two end states (no interpolation) so the browser only ever computes layout twice (start/end) instead of every frame:

```tsx
const navMenuVariants: Variants = {
  open: {
    opacity: 1,
    scaleY: 1,
    height: "auto",
    transition: { duration: 0.2, ease: easings.gentleEaseOut },
  },
  closed: {
    opacity: 0,
    scaleY: 0.96,
    height: 0,
    transition: {
      duration: 0.2,
      ease: easings.gentleEaseOut,
      height: { delay: 0.2 }, // let opacity/scale finish, then collapse height instantly
    },
  },
};
```

This is a pragmatic middle ground given Motion's `x`/`y`/`scale` shorthand props are themselves main-thread (not the compositor fast-path) — see repo-wide finding in plan `004`. For this menu specifically, keep it simple: the real win is that the *content* isn't visibly reflowing mid-animation (it fades/scales while height snaps), which reads as smooth even though `height` still changes. Add `transform-origin: top` via className so the scale reads correctly.

## Repo conventions to follow

- Easing tokens live in `src/lib/easings.ts` — this file already imports and uses `easings.gentleEaseOut` (line 1, line 23) correctly. Keep using it.
- `transform-origin` via Tailwind utility class, e.g. `origin-top` — exemplar of Tailwind-utility-driven transform origin: `src/components/ui/grid-background-effect.tsx` uses no such pattern (it's a stub), but Tailwind's built-in `origin-top` utility is the standard approach used elsewhere in this codebase for positioning (e.g. `-translate-x-1/2` utilities in `src/app/[locale]/(main)/page.tsx`).

## Steps

1. Open `src/components/navbar/mobile-menu.tsx`.
2. Replace the `navMenuVariants` object (lines 12-15) with:
   ```tsx
   const navMenuVariants: Variants = {
     open: {
       opacity: 1,
       scaleY: 1,
       height: "auto",
       transition: { duration: 0.2, ease: easings.gentleEaseOut },
     },
     closed: {
       opacity: 0,
       scaleY: 0.96,
       height: 0,
       transition: {
         duration: 0.2,
         ease: easings.gentleEaseOut,
         height: { delay: 0.2 },
       },
     },
   };
   ```
3. Remove the now-redundant top-level `transition={{ duration: 0.2, ease: easings.gentleEaseOut }}` prop from the `m.div` at line 23 (the per-variant `transition` set in step 2 replaces it) — variants win over a shared `transition` prop when both set the same properties, so leaving the old prop is harmless but redundant; remove it for clarity.
4. Add `origin-top` to the `m.div`'s `className` at line 24, so it reads: `className="col-span-2 space-y-5 overflow-hidden origin-top lg:hidden"`.
5. Leave everything else in the file (the `NavigationLinks`, `LocaleSwitcher`, `SocialLinks` children and their own `stagger`/`animated`/`isOpen` props) untouched.

## Boundaries

- Do NOT touch `NavigationLinks`, `LocaleSwitcher`, or `SocialLinks` internals — only the `navMenuVariants` object and the outer `m.div`'s `transition` prop / `className`.
- Do NOT add new dependencies.
- Do NOT change the menu's visual appearance (background, spacing, content) — only how the open/close motion is driven.
- If `src/components/navbar/mobile-menu.tsx:12-24` doesn't match what's quoted above (drift since commit `d603e1d`), STOP and report instead of improvising.

## Verification

- **Mechanical**: `bun run lint` and `bun run build` — expect both to pass with no new errors.
- **Feel check**: run `bun run dev` on a viewport <1024px (or use responsive device mode), open `/`:
  - Tap the hamburger — the menu should fade + very-subtly scale in from the top, feeling at least as smooth as before, with no visible layout jump.
  - Tap again to close — same motion in reverse, content should fade out before the container collapses (not clip mid-text).
  - Open DevTools → Performance panel, record while opening/closing the menu 3-4 times rapidly — confirm no long "Layout" or "Recalculate Style" frames dominate (some layout cost is expected at the instant `height` flips, but not sustained across the animation).
  - Toggle `prefers-reduced-motion: reduce` — confirm the menu still opens/closes (opacity change preserved) even though this plan doesn't add explicit reduced-motion handling; if it looks broken, flag as a follow-up, don't fix here.
- **Done when**: `navMenuVariants` no longer interpolates `height` across the transition duration (only snaps instantly, gated after the fade/scale), `scaleY` + `opacity` carry the visible motion, and the menu's open/close still looks like a smooth top-anchored reveal.
