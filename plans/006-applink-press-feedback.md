# 006 — Add press feedback to primary CTA links (AppLink)

- **Status**: TODO
- **Commit**: d603e1d
- **Severity**: LOW (missed opportunity — feedback)
- **Category**: Missed opportunity (feedback)
- **Estimated scope**: 1 file (`src/components/app-link.tsx`)

## Problem

`src/components/app-link.tsx:6-18` (current):

```tsx
const appLinkVariants = cva("rounded-full z-40 px-5 py-3 lg:px-7 lg:py-3", {
  variants: {
    variant: {
      default:
        "bg-primary text-black hover:brightness-110 focus:brightness-110 hover:drop-shadow-md hover:drop-shadow-[0_0_5px_#ffcb05] focus:drop-shadow-[0_0_5px_#ffcb05] hover:text-black/70 focus:text-black/70 transition-shadow transition transition-discrete",
      outline:
        "bg-glass border border-white/30 bg-white/5 !backdrop-blur-lg transition-colors hover:bg-white/20 focus:bg-white/20",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});
```

`AppLink` is this site's primary CTA button component — on `/` it renders the "Contact us" button in the hero (`src/app/[locale]/(main)/page.tsx`, `<AppLink href="/contact">{ct("contact-us")}</AppLink>`) and the "About us" link in `AboutUsCard`. It has hover feedback (brightness/shadow/background) but no `:active` press feedback — clicking it gives no tactile confirmation that the click registered before the page navigates. This is a clear feedback gap: `.claude/skills/find-animation-opportunities/SKILL.md` lists exactly this pattern ("Pressable elements with no `:active` state → `transform: scale(0.97)` with `transition: transform 160ms ease-out`").

Gate check:
- **Frequency**: occasional-to-tens/day (a CTA button, clicked once per visit at most by a given user) — eligible for standard, subtle feedback.
- **Purpose**: Feedback (confirming the interface heard the press).
- **Speed**: 160ms — within the 100-160ms press-feedback budget.
- **Function**: helps (this is exactly what press feedback is for), no data being read is disturbed.

## Target

Add a Tailwind `active:` press-scale to both variants, using the same GPU-safe `transform` property already used elsewhere in this codebase for press feedback (`src/app/[locale]/(main)/components/sections/our-projects.section.tsx:80` already does `active:scale-95 active:brightness-80` on the project cards — this plan extends the same pattern to `AppLink`, using a more subtle scale since a button reads differently than a full-image card):

```tsx
const appLinkVariants = cva(
  "rounded-full z-40 px-5 py-3 transition-transform duration-150 ease-out active:scale-[0.97] lg:px-7 lg:py-3",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-black hover:brightness-110 focus:brightness-110 hover:drop-shadow-md hover:drop-shadow-[0_0_5px_#ffcb05] focus:drop-shadow-[0_0_5px_#ffcb05] hover:text-black/70 focus:text-black/70 transition-shadow transition transition-discrete",
        outline:
          "bg-glass border border-white/30 bg-white/5 !backdrop-blur-lg transition-colors hover:bg-white/20 focus:bg-white/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);
```

`duration-150 ease-out` is Tailwind's built-in `ease-out` (not a custom cubic-bezier) — acceptable here per `.claude/skills/review-animations/STANDARDS.md` since the surrounding project already mixes Tailwind's built-in transition utilities for simple hover/press states (e.g. `transition-colors`, `transition-shadow` elsewhere in this same file use built-in Tailwind easing, not the custom curves from `src/lib/easings.ts` — those are reserved for Motion/Framer entrance choreography). `active:scale-[0.97]` matches the standard's press-feedback range (0.95-0.98) and is intentionally more subtle than the `active:scale-95` already used on project cards, since this is a small pill button, not a large image card.

## Repo conventions to follow

- Tailwind `active:` variant for press feedback with `scale-*` — exemplar already in this codebase: `src/app/[locale]/(main)/components/sections/our-projects.section.tsx:80` (`active:scale-95 active:brightness-80`).
- `cva` variant structure in `src/components/app-link.tsx` — keep the base string and per-variant strings separated exactly as today; only add to the base string (applies to both variants) since press feedback should be identical regardless of visual style.

## Steps

1. Open `src/components/app-link.tsx`.
2. Change the base class string (first argument to `cva`) from:
   ```tsx
   const appLinkVariants = cva("rounded-full z-40 px-5 py-3 lg:px-7 lg:py-3", {
   ```
   to:
   ```tsx
   const appLinkVariants = cva(
     "rounded-full z-40 px-5 py-3 transition-transform duration-150 ease-out active:scale-[0.97] lg:px-7 lg:py-3",
     {
   ```
   (adjust the closing paren/brace to match — `cva` now takes the string as its own line per the target shown above; keep the rest of the object argument exactly as it is today).
3. Leave the `variant` definitions (`default`, `outline`) and `defaultVariants` untouched.
4. Leave `AppLink`'s component body (lines 20-33) untouched.

## Boundaries

- Do NOT touch the `variant` strings themselves — only the base class string.
- Do NOT change `AppLink`'s props, the `Link` wrapper, or any other file.
- Do NOT add new dependencies.
- If `src/components/app-link.tsx:6-18` doesn't match what's quoted above (drift since commit `d603e1d`), STOP and report instead of improvising.

## Verification

- **Mechanical**: `bun run lint` and `bun run build` — expect both to pass.
- **Feel check**: run `bun run dev`, go to `/`:
  - Press-and-hold (mouse down, don't release) the "Contact us" button in the hero — it should visibly shrink slightly (3%) within ~150ms.
  - Release — it should spring back to full size.
  - Do the same on the "About us" outline-variant link in the About Us card section.
  - Confirm hover brightness/shadow effects still work exactly as before (unchanged).
  - On a touch device or Chrome DevTools device-mode with touch simulation, tap-and-hold — confirm the press state still shows (Tailwind's `active:` works on touch via `:active` pseudo-class, no special touch handling needed).
- **Done when**: both `AppLink` variants scale down subtly on press and spring back on release, using a GPU-composited `transform`, with zero change to hover/focus styling or button layout.
