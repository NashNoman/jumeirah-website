"use client";

import ImageContainer from "@/components/image-container";
import { useBreakpoint } from "@/hooks/use-breakpoint";
import { glide, settle } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { AnimatePresence, m, type Variants } from "motion/react";
import { useTranslations } from "next-intl";
import Image, { StaticImageData } from "next/image";
import { useState } from "react";

const listVariants: Variants = {
  hidden: {},
  visible: { transition: { delayChildren: 0.08, staggerChildren: 0.05 } },
  // Leaves as one quick fade. `popLayout` below takes it out of the flow
  // at the same moment, so the title travels back in parallel instead of
  // waiting for the fade to finish. Ease-out so most of it is gone at once:
  // the returning title passes through where the list was.
  exit: { opacity: 0, transition: { duration: 0.15, ease: "easeOut" } },
};

// On the way back the title waits a beat, so it never crosses the list's
// first line while that is still visible.
const titleIn = { layout: glide(0.7) };
const titleOut = { layout: { ...glide(0.7), delay: 0.06 } };

const optionVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { y: glide(0.6), opacity: { duration: 0.45, ease: "easeOut" } },
  },
};

export function ServiceGalleryCard({
  src,
  title,
  tag = "div",
  icon,
  options,
}: {
  src: StaticImageData;
  title: string;
  tag?: React.ElementType;
  icon: StaticImageData;
  options: string[];
}) {
  const t = useTranslations("OurServicesSection");
  const breakpoint = useBreakpoint();
  const [isActive, setIsActive] = useState(false);

  return (
    <ImageContainer
      src={src}
      containerTag={tag}
      fetchPriority="high"
      alt={t(title as Parameters<typeof t>[0])}
      className="aspect-[4/5] h-full w-full flex-1 text-center md:max-lg:aspect-auto"
      imageClassName={cn(
        "transition-[scale] duration-1400 ease-glide",
        isActive && "motion-safe:scale-[1.04]",
      )}
      sizes="(max-width: 1024px) 100vw, 33vw"
      settle
    >
      <m.div
        onHoverStart={() => breakpoint.md && setIsActive(true)}
        onHoverEnd={() => breakpoint.md && setIsActive(false)}
        onViewportEnter={() => !breakpoint.md && setIsActive(true)}
        onViewportLeave={() => !breakpoint.md && setIsActive(false)}
        viewport={{ amount: 1 }}
        className="relative flex h-full flex-col items-center justify-center overflow-hidden p-5 py-16 lg:py-30"
      >
        <m.div
          aria-hidden
          initial={false}
          animate={{ opacity: isActive ? 1 : 0 }}
          transition={isActive ? glide(0.5) : settle(0.35)}
          className="!pointer-events-none absolute inset-0 -z-10 bg-linear-[208deg] from-zinc-900/0 to-zinc-900 rtl:bg-linear-[152deg]"
        />
        <m.div
          layout="position"
          transition={isActive ? titleIn : titleOut}
          className="flex w-full flex-col items-center gap-2"
        >
          <div className="bg-glass rounded-full border border-white/30 p-4 md:p-4">
            <Image
              src={icon}
              placeholder="empty"
              alt={t(title as Parameters<typeof t>[0])}
              className="size-12 md:size-14 lg:size-14"
              fetchPriority="high"
              priority
            />
          </div>
          <h3 className="z-10 text-2xl">
            {t(title as Parameters<typeof t>[0])}
          </h3>
        </m.div>
        <AnimatePresence mode="popLayout">
          {isActive && (
            <m.div
              key="options"
              variants={listVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full pt-10"
            >
              <ul className="list-inside list-disc space-y-2 text-lg font-thin text-white/80">
                {options.map((option, index) => (
                  <m.li key={index} variants={optionVariants}>
                    {t(option as Parameters<typeof t>[0])}
                  </m.li>
                ))}
              </ul>
            </m.div>
          )}
        </AnimatePresence>
      </m.div>
    </ImageContainer>
  );
}
