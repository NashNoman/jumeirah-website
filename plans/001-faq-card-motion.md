# 001 — Fix FAQ card open/close motion (width→transform, easing, asymmetric timing)

- **Status**: TODO
- **Commit**: d603e1d
- **Severity**: HIGH
- **Category**: Performance / Easing / Interruptibility
- **Estimated scope**: 1 file (`src/components/faqs-section.tsx`)

## Problem

`src/components/faqs-section.tsx:48-65` (current):

```tsx
const faqCardVariants: Variants = {
  inactive: {
    width: "var(--max-width-inactive)",
    transition: {
      type: "tween",
      duration: 0.4,
      ease: "linear",
    },
  },
  active: {
    width: "var(--max-width-active)",
    transition: {
      type: "tween",
      duration: 0.1,
      ease: "linear",
    },
  },
};
```

Three separate problems on the same open/close interaction (nearly every visitor opens at least one FAQ):

1. **Layout-property animation.** `width` forces layout recalculation on the row and its `layout`-animated siblings (`src/components/faqs-section.tsx:96-133`) on every click.
2. **Inverted asymmetric timing.** Opening (`active`, the deliberate user-initiated expand) is `duration: 0.1` — it snaps in 100ms. Closing (`inactive`, the system settling back) is `duration: 0.4` — it lingers for 400ms. This is backwards: the deliberate action should be the slower, more considered one; the system response should be the snap.
3. **Linear easing.** `ease: "linear"` has no acceleration curve — mechanical, out of step with every other curve in this codebase (`src/lib/easings.ts`), which are all custom cubic-beziers.

The card only actually changes width at the `lg` breakpoint — at `md` and below `--max-width-active` and `--max-width-inactive` are both `100%` (`src/components/faqs-section.tsx:101`, `lg:[--max-width-active:90%] lg:[--max-width-inactive:66%]`), so the fix must preserve that responsive width value, just stop *animating* `width` directly.

## Target

Animate `transform: scaleX()` instead of `width`, anchored so it grows from the left edge (reading direction start) rather than distorting from center — since the card's left edge (question number) stays fixed while the card widens. Because `scaleX` also scales the card's children (text, padding) which is wrong here, the correct GPU-safe approach for this specific case is to keep the layout width change but let Motion's own `layout` prop animate it via `transform` under the hood (Motion animates `layout` changes using FLIP transforms, not raw `width`), rather than an explicit `width` keyframe.

Target `src/components/faqs-section.tsx:48-65`:

```tsx
const faqCardVariants: Variants = {
  inactive: {
    width: "var(--max-width-inactive)",
    transition: {
      type: "tween",
      duration: 0.2,
      ease: [0.16, 1, 0.3, 1], // easings.luxuryEaseOut — fast system response
    },
  },
  active: {
    width: "var(--max-width-active)",
    transition: {
      type: "tween",
      duration: 0.35,
      ease: [0.16, 1, 0.3, 1], // easings.luxuryEaseOut — deliberate, considered expand
    },
  },
};
```

The `m.div` at `src/components/faqs-section.tsx:96` already has `layout="position"` — add `layout` (full layout animation, not just position) is NOT the fix here since `layout` on the same element that also has explicit `width` keyframes conflicts. Instead: keep explicit `width` animation (Motion still composites this efficiently for a single element with `willChange` applied), fix only the duration/easing values above. This is the pragmatic fix — a true transform-only alternative would require restructuring the card's inner layout (out of scope: "preserve the same UI design").

Import the shared easing instead of a bare array:

```tsx
import { easings } from "@/lib/easings";
// ...
inactive: { width: "var(--max-width-inactive)", transition: { type: "tween", duration: 0.2, ease: easings.luxuryEaseOut } },
active: { width: "var(--max-width-active)", transition: { type: "tween", duration: 0.35, ease: easings.luxuryEaseOut } },
```

## Repo conventions to follow

- Easing tokens live in `src/lib/easings.ts` — import `easings` and reference `easings.luxuryEaseOut` (`[0.16, 1, 0.3, 1]`), don't hand-roll a new cubic-bezier or use a bare string like `"linear"`.
- Exemplar of the correct import pattern: `src/app/[locale]/(main)/components/service-gallery-card.tsx:5` (`import { easings } from "@/lib/easings";`) and its usage at line 72 (`ease: easings.softEaseInOut`).
- Duration values live inline per-component in this codebase (no shared duration token file) — match the existing pattern of hardcoded `duration` numbers seen throughout `src/lib/transitions.ts`.

## Steps

1. Open `src/components/faqs-section.tsx`. Add `import { easings } from "@/lib/easings";` near the top (after the existing `motion/react` import).
2. Replace the `faqCardVariants` object (lines 48-65) with:
   ```tsx
   const faqCardVariants: Variants = {
     inactive: {
       width: "var(--max-width-inactive)",
       transition: {
         type: "tween",
         duration: 0.2,
         ease: easings.luxuryEaseOut,
       },
     },
     active: {
       width: "var(--max-width-active)",
       transition: {
         type: "tween",
         duration: 0.35,
         ease: easings.luxuryEaseOut,
       },
     },
   };
   ```
3. Leave `faqAnswerVariants` (lines 67-76) and the `transition={{ duration: 0.3, ease: "easeOut" }}` on the answer `m.div` (line 126) untouched — the height/opacity accordion pattern is explicitly acceptable per this codebase's animation standards (`.claude/skills/review-animations/STANDARDS.md` — "Opacity + height in entering/exiting lists is trial and error; there's no formula").
4. Leave the `Minus`/`Plus` icon button, `LayoutGroup`, and all markup/classNames untouched — this plan touches only the two `transition` objects inside `faqCardVariants`.

## Boundaries

- Do NOT touch `faqAnswerVariants` or its transition (line 126) — out of scope, already acceptable.
- Do NOT change markup, className strings, or the CSS custom properties `--max-width-active`/`--max-width-inactive`.
- Do NOT add new dependencies.
- If the current code at `src/components/faqs-section.tsx:48-65` doesn't match what's quoted above (drift since commit `d603e1d`), STOP and report instead of improvising.

## Verification

- **Mechanical**: `bun run lint` — expect no new errors. `bun run build` — expect a successful production build.
- **Feel check**: run `bun run dev`, open `/` (or `/en`), scroll to the FAQ section, and:
  - On a viewport ≥1024px (`lg`), click a question — the card should visibly widen with a deliberate, slightly slower motion (350ms) using a smooth ease-out curve (fast start, gentle settle), not a linear crawl.
  - Click it again to close — it should snap back noticeably faster (200ms) than it opened.
  - Click rapidly between two different FAQ cards — motion should feel responsive, not sluggish or delayed.
  - In Chrome DevTools → More tools → Animations, set playback to 25% and confirm the curve visibly eases out (fast-then-slow) rather than moving at constant speed.
  - Toggle `prefers-reduced-motion: reduce` in the Rendering panel — this component has no explicit reduced-motion handling today; note whether that gap is acceptable (width/opacity changes are subtle, non-vestibular) or should be a follow-up finding — do not add reduced-motion handling as part of this plan (out of scope).
- **Done when**: `faqCardVariants` uses `easings.luxuryEaseOut` for both states, opening duration (0.35s) is longer than closing duration (0.2s), and the FAQ section behaves identically in every other respect (layout, markup, responsive breakpoints).
