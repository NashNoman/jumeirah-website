import AboutUsCard from "@/app/[locale]/(main)/components/sections/about-us-card.section";
import OurProjectsSection from "@/app/[locale]/(main)/components/sections/our-projects.section";
import OurServicesSection from "@/app/[locale]/(main)/components/sections/our-services.section";
import HeroCopy from "@/app/[locale]/(main)/components/hero-copy";
import { AnimatedGroup } from "@/components/animated-group";
import AppLink from "@/components/app-link";
import FAQStructuredData from "@/components/faq-structured-data";
import FAQsSection from "@/components/faqs-section";
import { TextEffect } from "@/components/text-effect";
import GridBackgroundEffect from "@/components/ui/grid-background-effect";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("HomePage");
  const ct = useTranslations("Common");

  return (
    <div className="overflow-hidden">
      <header className="relative z-10">
        <div className="container grid grid-rows-2 pt-52 pb-32 md:pt-36 lg:grid-cols-3 lg:pt-20 lg:pb-40">
          <HeroCopy className="z-30 col-span-2 row-span-2 space-y-2 rtl:space-y-8">
            <TextEffect
              as="h1"
              trigger="mount"
              delay={0.25}
              stagger={0.06}
              duration={1.2}
              className="text-foreground drop-shadow-background/70 md:drop-shadow-background/20 ltr:first-letter-primary text-center font-serif text-3xl leading-relaxed drop-shadow-xl max-md:mb-6 md:text-start md:text-4xl lg:mb-3 lg:text-5xl lg:leading-tight rtl:lg:leading-normal [&>span:first-child]:block"
            >
              <span className="from-primary to-foreground bg-linear-to-r from-[1ch] to-[1ch] bg-clip-text pb-1 text-7xl font-bold md:text-7xl lg:text-8xl rtl:bg-linear-to-l rtl:text-transparent">
                {t("jumeirah-hero")}
              </span>{" "}
              {ct("rei")}
            </TextEffect>
            <AnimatedGroup
              trigger="mount"
              delay={0.75}
              className="max-md:mb-4"
              childrenClassName="w-fit rounded-3xl lg:rounded-4xl"
            >
              <div className="max-w-md text-center leading-6 font-medium text-[#d3d5d7] backdrop-blur-none md:max-w-xl md:text-start md:text-lg md:leading-7 lg:max-w-2xl lg:leading-8">
                <p>
                  {t.rich("hero-description", {
                    span: (s) => <span className="text-primary">{s}</span>,
                  })}
                </p>
              </div>
            </AnimatedGroup>
            <AnimatedGroup
              trigger="mount"
              preset="button"
              delay={0.95}
              className="z-20 mt-4 flex items-center justify-center gap-4 text-xs font-semibold md:mt-6 md:justify-start md:text-sm lg:ms-2.5 lg:text-sm"
              childrenClassName="rounded-full backdrop-blur-lg"
            >
              {/* <AppLink href="/projects" variant="outline">
                {t("our-projects")}
              </AppLink> */}
              <AppLink href="/contact">{ct("contact-us")}</AppLink>
            </AnimatedGroup>
          </HeroCopy>
          <div>
            {/* <GlassCard className="mx-auto aspect-video w-80 opacity-0" />
            <GlassCard className="mx-auto aspect-video w-80 bg-black/20 backdrop-blur-none" />
            <GlassCard className="mx-auto aspect-video w-80 bg-black/20 backdrop-blur-none" /> */}
          </div>
        </div>
        <HeroBackground />
      </header>
      <main className="space-sections">
        <OurProjectsSection />
        <OurServicesSection />
        <AboutUsCard />
        <FAQsSection />
        <FAQStructuredData />
      </main>
    </div>
  );
}

function HeroBackground() {
  return (
    <>
      <div className="to-background via-background md:via-background/50 absolute start-0 bottom-0 -z-20 h-2/3 w-full bg-linear-to-b from-[#00010100]" />
      <GridBackgroundEffect className="absolute start-0 bottom-0 -z-10 -translate-x-1/2 translate-y-1/2 rtl:translate-x-1/2" />
    </>
  );
}
