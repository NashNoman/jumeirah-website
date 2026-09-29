"use client";
import { inViewOnce, reveal, withDelay } from "@/lib/motion";
import type { Variants } from "motion/react";
import { m } from "motion/react";
import React, { Children, isValidElement, ReactNode } from "react";

export type TextEffectProps = {
  children: ReactNode; // string OR React elements
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
  /**
   * `mask`: each word rises from behind its own edge, one after another.
   * `fade`: the text fades up as a single block (for running copy).
   */
  reveal?: "mask" | "fade";
  /** `view` plays once the text is on screen; `mount` plays immediately. */
  trigger?: "view" | "mount";
  delay?: number;
  /** Seconds between words (mask only). */
  stagger?: number;
  /** Seconds each word takes to rise (mask only). */
  duration?: number;
  style?: React.CSSProperties;
};

/**
 * Splits children into word segments, each keeping its trailing space.
 * The segments are rendered as `inline-block whitespace-pre` boxes in both
 * modes — this is the box structure the site has always laid its headings
 * out with, and keeping it is what guarantees line breaks stay put.
 */
const splitChildren = (children: ReactNode): ReactNode[][] => {
  let segments: ReactNode[] = [];
  const result: ReactNode[][] = [];
  Children.forEach(children, (child) => {
    if (typeof child === "string") {
      child.split(/(\s+)/).forEach((part) => {
        if (part === " ") {
          result.push([...segments, " "]);
          segments = [];
        } else if (part) {
          segments.push(part);
        }
      });
    } else if (isValidElement(child)) {
      segments.push(child);
    }
  });
  result.push(segments);

  return result;
};

/**
 * Best-effort plain-text flattening of TextEffect's children, used for the
 * accessible label — see the aria-label note where the tag is rendered.
 */
const extractText = (node: ReactNode): string => {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (isValidElement<{ children?: ReactNode }>(node)) {
    return extractText(node.props.children);
  }
  return "";
};

export function TextEffect({
  children,
  as = "p",
  className,
  reveal: mode = "mask",
  trigger = "view",
  delay = 0,
  stagger = 0.05,
  duration = 1.1,
  style,
}: TextEffectProps) {
  const segments = splitChildren(children);
  const MotionTag = m[as as keyof typeof m] as typeof m.div;

  const container: Variants =
    mode === "mask"
      ? {
          hidden: {},
          visible: {
            transition: { staggerChildren: stagger, delayChildren: delay },
          },
        }
      : withDelay(reveal.fade, delay);
  const word = reveal.mask(duration);

  const triggerProps =
    trigger === "mount"
      ? { initial: "hidden" as const, animate: "visible" as const }
      : {
          initial: "hidden" as const,
          whileInView: "visible" as const,
          viewport: inViewOnce(0.5),
        };

  // The per-word segments below are individually aria-hidden, so assistive
  // tech needs the plain string some other way. It used to be a second,
  // visually-hidden text node — which put the same string in the DOM
  // twice, and crawlers that read raw textContent (rather than the
  // accessibility tree) rendered it as "TitleTitle". An aria-label carries
  // the same string as an attribute, not a text node, so it reaches
  // assistive tech without duplicating visible/indexable text.
  const plainText = extractText(children);

  return (
    <MotionTag
      {...triggerProps}
      {...(plainText ? { "aria-label": plainText } : {})}
      variants={container}
      className={className}
      style={style}
    >
      {segments.map((segment, index) =>
        mode === "mask" ? (
          // The outer box is the clip; the inner one moves. The inner is
          // `block` so `::first-letter` styling on the outer box (e.g. the
          // yellow initial from `first-letter-primary`) still reaches it.
          <span
            key={index}
            aria-hidden
            className="reveal-mask inline-block whitespace-pre"
          >
            <m.span variants={word} className="block">
              {segment}
            </m.span>
          </span>
        ) : (
          <span
            key={index}
            aria-hidden
            className="inline-block whitespace-pre"
          >
            {segment}
          </span>
        ),
      )}
    </MotionTag>
  );
}
