"use client";

import { reveal } from "@/lib/motion";
import { m } from "motion/react";
import Image from "next/image";

const MotionImage = m.create(Image);

/**
 * A next/image that settles into its frame (scale 1.15 → 1) when the card
 * around it reveals. It has no trigger of its own: it follows the
 * hidden/visible labels of the nearest animated ancestor, and outside of
 * one it simply renders at rest.
 */
export default function SettleImage(
  props: Omit<React.ComponentProps<typeof MotionImage>, "variants">,
) {
  return <MotionImage {...props} variants={reveal.settleImage} />;
}
