import { easings } from "@/lib/easings";
import { m, Variants } from "motion/react";
import { LocaleSwitcher } from "./locale-switcher";
import { NavigationLinks } from "./navigation-links";
import { SocialLinks } from "./social-links";

interface MobileMenuProps {
  isOpen: boolean;
  /** Collapse in a single frame, with no exit animation. Set when the
   * menu is closing because the page navigated rather than because the
   * user tapped the hamburger. */
  instant?: boolean;
  /** Called for taps that deliberately don't navigate (the link for the
   * page you're already on, or the already-active locale) — without it
   * those would leave the menu open with nothing left to close it. */
  onNonNavigatingSelect?: () => void;
}

const closedState = { opacity: 0, scaleY: 0.96, height: 0 };

const navMenuVariants: Variants = {
  open: {
    opacity: 1,
    scaleY: 1,
    height: "auto",
    transition: { duration: 0.2, ease: easings.gentleEaseOut },
  },
  closed: {
    ...closedState,
    transition: {
      duration: 0.2,
      ease: easings.gentleEaseOut,
      height: { delay: 0.2 },
    },
  },
  // A separate variant rather than a `transition` prop override: Motion
  // gives a variant's own transition priority over the prop, so the prop
  // is silently ignored for a variant that defines one.
  closedInstantly: {
    ...closedState,
    transition: { duration: 0 },
  },
};

export function MobileMenu({
  isOpen,
  instant,
  onNonNavigatingSelect,
}: MobileMenuProps) {
  return (
    <m.div
      variants={navMenuVariants}
      initial="closed"
      // The staggered children need no variant of their own: the existing
      // overflow-hidden + height: 0 clips them in the same frame.
      animate={isOpen ? "open" : instant ? "closedInstantly" : "closed"}
      className="col-span-2 origin-top space-y-5 overflow-hidden lg:hidden"
    >
      <div className="space-y-1 pt-10 pb-4">
        <NavigationLinks
          onSamePageClick={onNonNavigatingSelect}
          className="flex-col items-stretch gap-2 text-center text-lg"
          linkClassName="block p-2 !text-2xl"
          animated
          isOpen={isOpen}
          stagger={0.08}
        />
      </div>
      <div className="px-4 pb-2">
        <LocaleSwitcher
          variant="mobile"
          className="justify-center gap-6"
          onSameLocaleSelect={onNonNavigatingSelect}
          animated
          stagger={0.08}
          isOpen={isOpen}
        />
      </div>
      <div className="mx-auto flex items-center justify-around gap-3 p-4">
        <SocialLinks
          className="flex gap-4"
          iconClassName="size-6"
          anchorClassName="rounded-full p-4 transition-colors active:bg-white/20"
          animated
          isOpen={isOpen}
          stagger={0.1}
        />
      </div>
    </m.div>
  );
}
