import type { Transition, Variants } from "motion/react";

/**
 * The site's whole motion vocabulary. Every animation uses one of these
 * three curves; the same values are exposed to CSS in globals.css as
 * `--ease-glide`, `--ease-settle` and `--ease-exit` (Tailwind: `ease-glide`
 * etc.) for hover/press transitions that don't need JavaScript.
 */
export const ease = {
  /** Entrances and reveals: a fast start and a long, quiet landing. */
  glide: [0.16, 1, 0.3, 1],
  /** State that goes both ways, and anything closing or folding away. */
  settle: [0.65, 0, 0.35, 1],
  /** Short fade-outs. Things leave faster than they arrive. */
  exit: [0.4, 0, 1, 1],
} as const;

export const glide = (duration: number): Transition => ({
  duration,
  ease: ease.glide,
});

export const settle = (duration: number): Transition => ({
  duration,
  ease: ease.settle,
});

export const exit = (duration = 0.2): Transition => ({
  duration,
  ease: ease.exit,
});

/**
 * Opacity always runs on its own short clock. MotionConfig's
 * `reducedMotion="user"` drops transform animations entirely, so keeping
 * opacity in every reveal is what turns them into plain fades for people
 * who asked for less motion.
 */
const fadeIn: Transition = { duration: 0.5, ease: "easeOut" };

/** Delay added to every value of a variant's transition (for manual staggers). */
export function withDelay(variants: Variants, delay: number): Variants {
  if (!delay) return variants;
  const visible = variants.visible as { transition?: Record<string, any> };
  const transition = Object.fromEntries(
    Object.entries(visible.transition ?? {}).map(([key, value]) => [
      key,
      value && typeof value === "object" && !Array.isArray(value)
        ? { ...value, delay: (value.delay ?? 0) + delay }
        : value,
    ]),
  );
  return { ...variants, visible: { ...visible, transition } as any };
}

export const reveal = {
  /** A word or line of type rising from behind its own edge (see TextEffect). */
  mask: (duration = 1.1): Variants => ({
    hidden: { y: "110%", opacity: 0 },
    visible: {
      y: "0%",
      opacity: 1,
      transition: { y: glide(duration), opacity: fadeIn },
    },
  }),

  /** Copy and small UI: a short lift. */
  rise: {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { y: glide(1), opacity: fadeIn },
    },
  } satisfies Variants,

  /** Paragraphs revealed as one block. */
  fade: {
    hidden: { opacity: 0, y: 14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { y: glide(0.9), opacity: { duration: 0.7, ease: "easeOut" } },
    },
  } satisfies Variants,

  /** Primary call to action: lift plus a hint of scale. */
  button: {
    hidden: { opacity: 0, y: 12, scale: 0.96 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { y: glide(0.9), scale: glide(0.9), opacity: fadeIn },
    },
  } satisfies Variants,

  /** Image cards: a longer rise. Pair with `settleImage` inside the card. */
  card: {
    hidden: { opacity: 0, y: 56 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { y: glide(1.1), opacity: { duration: 0.6, ease: "easeOut" } },
    },
  } satisfies Variants,

  /**
   * The photo inside a revealing card, settling into its frame. Driven by
   * the card's own hidden/visible labels, so it needs no trigger of its own.
   */
  settleImage: {
    hidden: { scale: 1.15 },
    visible: { scale: 1, transition: glide(1.6) },
  } satisfies Variants,
};

/** Standard viewport options for scroll-triggered reveals. */
export const inViewOnce = (amount = 0.25) => ({ once: true, amount }) as const;
