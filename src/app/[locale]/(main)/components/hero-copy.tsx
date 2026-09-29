"use client";

import {
  m,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";

/**
 * The hero's text column. As the page scrolls away it drifts at a fifth of
 * the scroll speed and fades out, so it reads as sitting deeper than the
 * content that follows. At the top of the page it is exactly at rest.
 */
export default function HeroCopy({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 800], [0, 160]);
  const opacity = useTransform(scrollY, [60, 520], [1, 0]);
  // Constant stand-ins rather than dropping the style prop, so the server
  // and client render the same markup whatever the motion preference.
  const still = useMotionValue(0);
  const opaque = useMotionValue(1);

  return (
    <m.div
      className={className}
      style={{ y: reduceMotion ? still : y, opacity: reduceMotion ? opaque : opacity }}
    >
      {children}
    </m.div>
  );
}
