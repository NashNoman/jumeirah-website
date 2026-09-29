"use client";
import { inViewOnce, reveal, withDelay } from "@/lib/motion";
import { Variants, m } from "motion/react";
import React, { ReactNode } from "react";

export type RevealPreset = "rise" | "fade" | "button" | "card";

export type AnimatedGroupProps = {
  children: ReactNode;
  className?: string;
  childrenClassName?: string;
  preset?: RevealPreset;
  as?: React.ElementType;
  /**
   * `view`: the group plays once it is on screen, children staggered.
   * `view-each`: every child plays when it reaches the screen itself, so
   * items further down never animate off-screen.
   * `mount`: plays immediately (above-the-fold content).
   */
  trigger?: "view" | "view-each" | "mount";
  delay?: number;
  stagger?: number;
  /** Share of the element that must be visible before it plays. */
  amount?: number;
  ref?: React.RefObject<any>;
};

const AnimatedGroup = ({
  children,
  className,
  childrenClassName,
  preset = "rise",
  as = "div",
  trigger = "view",
  delay = 0,
  stagger = 0.08,
  amount = 0.25,
  ref,
}: AnimatedGroupProps) => {
  const item = reveal[preset];

  const MotionComponent: React.ComponentType<any> =
    ((m as any)[as as keyof typeof m] as React.ComponentType<any>) || m.div;

  if (trigger === "view-each") {
    const Tag = as;
    return (
      <Tag className={className} ref={ref}>
        {React.Children.map(children, (child, i) => (
          <m.div
            key={i}
            variants={withDelay(item, delay + i * stagger)}
            initial="hidden"
            whileInView="visible"
            viewport={inViewOnce(amount)}
            className={childrenClassName}
          >
            {child}
          </m.div>
        ))}
      </Tag>
    );
  }

  const container: Variants = {
    hidden: {},
    visible: {
      transition: { delayChildren: delay, staggerChildren: stagger },
    },
  };

  return (
    <MotionComponent
      initial="hidden"
      {...(trigger === "mount"
        ? { animate: "visible" }
        : { whileInView: "visible", viewport: inViewOnce(amount) })}
      variants={container}
      className={className}
      ref={ref}
    >
      {React.Children.map(children, (child, i) => (
        <m.div key={i} variants={item} className={childrenClassName}>
          {child}
        </m.div>
      ))}
    </MotionComponent>
  );
};

export { AnimatedGroup };
