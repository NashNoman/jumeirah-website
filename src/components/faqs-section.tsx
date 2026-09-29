"use client";

import Section from "@/components/section";
import SectionLink from "@/components/ui/section-link";
import { faqKeys } from "@/data/faqs";
import { exit, glide, settle } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { LayoutGroup, m, Variants } from "motion/react";
import { useTranslations } from "next-intl";
import { useState } from "react";

export default function FAQsSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const t = useTranslations("FAQsSection");
  const ct = useTranslations("Common");

  const questions = faqKeys.map((key) => ({
    question: t(`${key}.question`),
    answer: t(`${key}.answer`),
  }));

  return (
    <Section
      title={t("title")}
      sectionLink={() => (
        <SectionLink className="hidden md:block" href="/projects">
          {ct.rich("what-we-offer", {
            span: (s) => <span className="text-primary">{s}</span>,
          })}
        </SectionLink>
      )}
    >
      <ul className="relative space-y-4 lg:space-y-8">
        {questions.map((q, i) => (
          <FAQCard
            key={i}
            {...q}
            index={i}
            onClick={() => setActiveIndex(i === activeIndex ? null : i)}
            isActive={activeIndex === i}
          />
        ))}
      </ul>
    </Section>
  );
}

// Width and height run on one clock: Glide when opening, Settle when
// closing. Nothing else may transition these properties — a CSS
// transition on the same element re-targets every frame Motion writes and
// turns the motion to mush.
const OPEN = glide(0.6);
const CLOSE = settle(0.45);

const faqCardVariants: Variants = {
  inactive: { width: "var(--max-width-inactive)", transition: CLOSE },
  active: { width: "var(--max-width-active)", transition: OPEN },
};

const faqAnswerVariants: Variants = {
  open: { height: "auto", transition: OPEN },
  closed: { height: 0, transition: CLOSE },
};

// The text follows the box open, and leaves first when it closes.
const faqAnswerTextVariants: Variants = {
  open: {
    opacity: 1,
    y: 0,
    transition: { ...glide(0.5), delay: 0.12 },
  },
  closed: { opacity: 0, y: 8, transition: exit(0.15) },
};

/**
 * lucide's Plus, with its vertical stroke able to turn. Rotated a quarter
 * turn it lies exactly on the horizontal stroke — lucide's Minus — so the
 * resting states are the two original icons.
 */
function PlusMinusIcon({ open }: { open: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <m.path
        d="M12 5v14"
        initial={false}
        // Once it lands it hands over to the horizontal stroke, so the open
        // state is a single stroke (two overlapping anti-aliased edges
        // would render a hair heavier than lucide's Minus).
        animate={{ rotate: open ? 90 : 0, opacity: open ? 0 : 1 }}
        transition={
          open
            ? { rotate: glide(0.5), opacity: { duration: 0, delay: 0.5 } }
            : { rotate: settle(0.4), opacity: { duration: 0 } }
        }
      />
    </svg>
  );
}

function FAQCard({
  question,
  answer,
  index,
  onClick,
  isActive,
}: {
  question: string;
  answer: string;
  index: number;
  onClick: () => void;
  isActive: boolean;
}) {
  const answerId = `faq-answer-${index}`;

  return (
    <li className="flex gap-5 text-sm md:text-lg">
      <LayoutGroup>
        <m.div
          layout="position"
          variants={faqCardVariants}
          initial="inactive"
          animate={isActive ? "active" : "inactive"}
          transition={{ layout: OPEN }}
          className="flex w-full gap-6 rounded-2xl border border-white/30 bg-white/5 px-4 py-2 backdrop-blur-xl [--max-width-active:100%] [--max-width-inactive:100%] md:gap-7 md:px-6 md:py-4 lg:rounded-[2.5rem] lg:px-8 lg:py-6 lg:[--max-width-active:90%] lg:[--max-width-inactive:66%]"
        >
          <span className="text-primary font-semibold md:text-lg">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div className="w-full">
            {/* Width/negative-margin values here must stay in sync with the
                outer card's own padding (px-4 py-2 / md:px-6 md:py-4 /
                lg:px-8 lg:py-6 on the m.div above) — changing one without
                the other silently breaks the click/tap hit-area fix. */}
            <button
              type="button"
              onClick={onClick}
              aria-expanded={isActive}
              aria-controls={answerId}
              className="-my-2 block w-[calc(100%_+_1rem)] cursor-pointer border-0 bg-transparent py-2 text-start font-bold md:-my-4 md:w-[calc(100%_+_1.5rem)] md:py-4 lg:-my-6 lg:w-[calc(100%_+_2rem)] lg:py-6"
            >
              {question}
            </button>
            <m.div
              id={answerId}
              layout
              initial={false}
              animate={isActive ? "open" : "closed"}
              variants={faqAnswerVariants}
              aria-hidden={!isActive}
              className="max-w-[40rem] overflow-hidden"
            >
              <m.p
                variants={faqAnswerTextVariants}
                className="pt-4 pb-4 text-[#9C9C9C] lg:pt-8"
              >
                {answer}
              </m.p>
            </m.div>
          </div>
        </m.div>
        <m.div
          layout
          transition={{ layout: OPEN }}
          className="hidden flex-grow-1 lg:block"
        >
          <button
            type="button"
            onClick={onClick}
            aria-hidden="true"
            tabIndex={-1}
            className={cn(
              "text-primary fill-grow aspect-square cursor-pointer rounded-full border border-white/30 bg-white/5 p-6 text-3xl backdrop-blur-xl",
              isActive && "fill-grow-full text-black",
            )}
          >
            <PlusMinusIcon open={isActive} />
          </button>
        </m.div>
      </LayoutGroup>
    </li>
  );
}
