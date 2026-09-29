"use client";

import { glide } from "@/lib/motion";
import {
  animate,
  m,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import React from "react";

type MouseGlowTrackerProps = {
  className?: string;
  children: React.ReactNode;
};

/** Critically damped: trails the pointer without overshooting it. */
const follow = { stiffness: 170, damping: 26, mass: 1 };

export default function MouseGlowTracker({
  className,
  children,
}: MouseGlowTrackerProps) {
  const reduceMotion = useReducedMotion();
  const x = useSpring(0, follow);
  const y = useSpring(0, follow);
  const opacity = useMotionValue(0);

  const pointerIn = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    // Enter at the pointer rather than sweeping in from the last exit point.
    x.jump(e.clientX - rect.left);
    y.jump(e.clientY - rect.top);
    animate(opacity, 0.07, glide(0.7));
  };

  const onMouseLeave = () => {
    animate(opacity, 0, glide(0.8));
  };

  const onMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    if (reduceMotion) {
      x.jump(px);
      y.jump(py);
    } else {
      x.set(px);
      y.set(py);
    }
  };

  return (
    <div
      className={`${className} relative overflow-hidden`}
      onMouseEnter={pointerIn}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove}
    >
      {/* Positioned by transform only (x/y), never left/top, so following
          the pointer costs no layout. */}
      <m.div
        style={{ x, y, opacity }}
        className="pointer-events-none absolute top-0 left-0 hidden size-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white blur-3xl lg:block"
      />
      {children}
    </div>
  );
}
