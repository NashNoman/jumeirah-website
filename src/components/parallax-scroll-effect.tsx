"use client";

import { cn } from "@/lib/utils";
import {
  m,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";

type ParallaxScrollEffectProps = Omit<Parameters<typeof m.div>[0], "style">;

/**
 * The hero backdrop's scroll depth: it trails the page at 0.35× and eases
 * in to 1.08× as the hero scrolls away. Scroll-linked values map straight
 * from scroll position with no smoothing — a spring here would lag behind
 * the user's finger. Switched off entirely under reduced motion.
 */
export default function ParallaxScrollEffect({
  className,
  ...props
}: ParallaxScrollEffectProps) {
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 350]);
  const scale = useTransform(scrollY, [0, 1000], [1, 1.08]);
  // Constant stand-ins keep server and client markup identical.
  const still = useMotionValue(0);
  const unscaled = useMotionValue(1);

  return (
    <m.div
      style={{
        y: reduceMotion ? still : y,
        scale: reduceMotion ? unscaled : scale,
      }}
      className={cn(
        "transform-gpu will-change-transform contain-paint",
        className,
      )}
      {...props}
    />
  );
}
