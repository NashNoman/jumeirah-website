"use client";

import { domMax, LazyMotion, MotionConfig } from "motion/react";

export default function LazyMotionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LazyMotion features={domMax}>
      {/* With the OS "reduce motion" setting on, Motion skips transform and
          layout animations; every reveal also animates opacity on its own
          short clock (see lib/motion.ts), so they become plain fades. */}
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
