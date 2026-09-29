import { AnimatedGroup } from "@/components/animated-group";
import SectionWrapper from "@/components/section-wrapper";
import { TextEffect } from "@/components/text-effect";
import GridBackgroundEffect from "@/components/ui/grid-background-effect";
import { cn } from "@/lib/utils";
import { PropsWithChildren } from "react";

type SectionProps = {
  title: string | React.ReactNode;
  description?: string | React.ReactNode;
  className?: string;
  sectionLink?: () => React.ReactNode;
  imgClassName?: string;
} & PropsWithChildren;

export default function Section({
  title,
  description,
  sectionLink,
  className,
  children,
  imgClassName,
}: SectionProps) {
  return (
    <SectionWrapper>
      <GridBackgroundEffect
        className={cn(
          "absolute start-1/2 top-0 !h-auto -translate-x-1/2 object-cover object-center opacity-70 lg:!w-full rtl:translate-x-1/2",
          imgClassName,
        )}
      />
      <div className="relative z-20 container px-2 py-5 lg:mb-5">
        <div className="flex items-center justify-between">
          <TextEffect as="h2" className="ltr:first-letter-primary">
            <span className="first-letter-primary-or-clip pb-1 text-3xl md:text-4xl">
              {title}
            </span>
          </TextEffect>
          {sectionLink && (
            <AnimatedGroup delay={0.15}>
              {sectionLink()}
            </AnimatedGroup>
          )}
        </div>
        {description && (
          <TextEffect
            reveal="fade"
            as="p"
            delay={0.12}
            className="mt-2 text-sm font-light text-[#9C9C9C] md:text-lg lg:text-xl"
          >
            {description}
          </TextEffect>
        )}
      </div>
      <div className={cn("relative z-20 container pt-3", className)}>
        {children}
      </div>
    </SectionWrapper>
  );
}
