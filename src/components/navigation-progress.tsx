"use client";

import { easings } from "@/lib/easings";
import {
  animate,
  m,
  useMotionValue,
  useReducedMotion,
  type AnimationPlaybackControls,
} from "motion/react";
import { usePathname } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react";

/**
 * Every route on this site is statically generated and Next prefetches
 * links on hover/viewport, so the overwhelming majority of navigations
 * commit in well under 100ms. A bar that appears and completes inside
 * that window reads as a flicker rather than as feedback, so the run
 * starts tracking on click but stays at opacity 0 until this delay has
 * elapsed — a fast navigation therefore draws nothing at all.
 */
const REVEAL_DELAY_MS = 150;
const REVEAL_DURATION_S = 0.15;
/** NProgress's `minimum`: enough movement to evidence the click instantly. */
const INITIAL_PROGRESS = 0.08;
/** Never reach the end until the page actually lands. */
const TRICKLE_TARGET = 0.9;
const TRICKLE_DURATION_S = 6;
const FINISH_DURATION_S = 0.2;
const FADE_OUT_DURATION_S = 0.25;
/** Last-resort guard so the bar can never be left stranded on screen. */
const SAFETY_TIMEOUT_MS = 8000;

const NavigationProgressContext = createContext<{ start: () => void } | null>(
  null,
);

/**
 * Returns `start()`, which begins a progress run. Completion is detected
 * by the provider itself (see below), so callers only ever announce the
 * *intent* to navigate — they never have to report back.
 */
export function useNavigationProgress() {
  const context = useContext(NavigationProgressContext);

  if (!context) {
    throw new Error(
      "useNavigationProgress must be used within a NavigationProgressProvider",
    );
  }

  return context;
}

export function NavigationProgressProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const reduceMotion = useReducedMotion();

  // Progress lives in motion values rather than React state so that the
  // ~60 updates a second it produces never re-render the tree below.
  const scaleX = useMotionValue(0);
  const opacity = useMotionValue(0);

  const trickleRef = useRef<AnimationPlaybackControls | null>(null);
  const revealRef = useRef<AnimationPlaybackControls | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startedAtRef = useRef(0);
  const activeRef = useRef(false);
  /** Bumped on every start so a finish sequence can detect it was superseded. */
  const runIdRef = useRef(0);

  // next/navigation's pathname, not next-intl's: the locale-stripped one
  // reports "/about" for both /about and /en/about, so a locale switch
  // would never register as a completed navigation.
  const pathname = usePathname();
  const pathnameRef = useRef(pathname);

  const reset = useCallback(() => {
    trickleRef.current?.stop();
    revealRef.current?.stop();
    trickleRef.current = null;
    revealRef.current = null;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const complete = useCallback(() => {
    if (!activeRef.current) return;

    activeRef.current = false;
    const runId = runIdRef.current;
    const elapsed = performance.now() - startedAtRef.current;
    reset();

    // The navigation beat the reveal delay, so nothing was ever painted.
    // Snap both values back to zero rather than animating an exit for a
    // bar the user never saw.
    if (elapsed < REVEAL_DELAY_MS) {
      scaleX.set(0);
      opacity.set(0);
      return;
    }

    const finish = reduceMotion
      ? Promise.resolve()
      : animate(scaleX, 1, {
          duration: FINISH_DURATION_S,
          ease: "easeOut",
        });

    void Promise.resolve(finish)
      .then(() => {
        if (runIdRef.current !== runId) return;
        return animate(opacity, 0, {
          duration: FADE_OUT_DURATION_S,
          ease: easings.gentleEaseOut,
        });
      })
      .then(() => {
        if (runIdRef.current !== runId) return;
        scaleX.set(0);
      });
  }, [opacity, reduceMotion, reset, scaleX]);

  const start = useCallback(() => {
    // Clicking a second link mid-flight continues the existing run rather
    // than snapping the bar back to the start.
    if (activeRef.current) return;

    activeRef.current = true;
    runIdRef.current += 1;
    startedAtRef.current = performance.now();
    reset();

    // Under reduced motion the bar carries the same information by
    // fading a full-width line in and out, with no travel.
    scaleX.set(reduceMotion ? 1 : INITIAL_PROGRESS);
    opacity.set(0);

    if (!reduceMotion) {
      // Decelerating, never accelerating: the duration is unknown, so a
      // curve that speeds up would reach the end and have to stall —
      // and a stalled bar is what users read as broken.
      trickleRef.current = animate(scaleX, TRICKLE_TARGET, {
        duration: TRICKLE_DURATION_S,
        ease: "easeOut",
      });
    }

    revealRef.current = animate(opacity, 1, {
      duration: REVEAL_DURATION_S,
      delay: REVEAL_DELAY_MS / 1000,
      ease: "easeOut",
    });

    timeoutRef.current = setTimeout(complete, SAFETY_TIMEOUT_MS);
  }, [complete, opacity, reduceMotion, reset, scaleX]);

  // App Router navigation runs inside a React transition, so the router
  // state — and with it usePathname() — updates exactly when the new
  // route commits. A pathname change *is* "the next page is displayed".
  useEffect(() => {
    if (pathnameRef.current === pathname) return;
    pathnameRef.current = pathname;
    complete();
  }, [complete, pathname]);

  useEffect(() => {
    const handlePopState = () => {
      // popstate fires with location already updated but React not yet
      // committed, so a real route change is exactly this inequality.
      // Hash-only back/forward compares equal and is correctly ignored,
      // and a cancelled iOS swipe-back never emits the event at all.
      if (window.location.pathname !== pathnameRef.current) start();
    };

    window.addEventListener("popstate", handlePopState);

    return () => window.removeEventListener("popstate", handlePopState);
  }, [start]);

  useEffect(() => reset, [reset]);

  return (
    <NavigationProgressContext.Provider value={{ start }}>
      {/* The glow sits on the outer, untransformed wrapper: as a
          drop-shadow it is applied after the child's scaleX, so it hugs
          the bar evenly instead of being squashed the way a box-shadow
          on the scaled element itself would be. */}
      <m.div
        aria-hidden
        style={{ opacity }}
        className="pointer-events-none fixed inset-x-0 top-0 z-[1000] h-[3px] drop-shadow-[0_0_6px_#ffcb05]"
      >
        <m.div
          style={{ scaleX }}
          className="bg-primary h-full w-full origin-left rtl:origin-right"
        />
      </m.div>
      {children}
    </NavigationProgressContext.Provider>
  );
}
