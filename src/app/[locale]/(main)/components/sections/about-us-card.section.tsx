import ourMissionContainerImage from "@/../public/images/our-mission.webp";
import missionIcon from "@/../public/svg/mission-icon.svg";
import targetIcon from "@/../public/svg/target-icon.svg";
import { AnimatedGroup } from "@/components/animated-group";
import AppLink from "@/components/app-link";
import GotoIcon from "@/components/goto-icon";
import SectionWrapper from "@/components/section-wrapper";
import { TextEffect } from "@/components/text-effect";
import Card from "@/components/ui/card";
import GridBackgroundEffect from "@/components/ui/grid-background-effect";
import { useTranslations } from "next-intl";
import Image from "next/image";

export default function AboutUsCard() {
  const t = useTranslations("AboutUsCard");
  const ct = useTranslations("Common");

  return (
    <SectionWrapper
      className="relative container mx-auto mb-6 max-md:px-4 lg:mb-36"
    >
      <GridBackgroundEffect className="absolute start-1/2 top-0 container -translate-x-1/2 rotate-180 object-contain object-top opacity-90 rtl:translate-x-1/2" />
      <Card className="container border-2 border-[#7A7A7A]/60">
        <div className="mx-auto grid grid-flow-dense gap-8 px-10 md:grid-cols-2 xl:grid-cols-5 xl:gap-12 xl:gap-x-28">
          <div className="xl:col-span-3">
            <TextEffect
              className="first-letter-primary text-[1.4rem] leading-tight md:text-[1.6rem] lg:mb-5 lg:text-4xl"
              as="h2"
              stagger={0.04}
            >
              {t("title")}
            </TextEffect>
            <TextEffect
              className="mt-2 text-sm font-light text-[#DFDFDF] md:mt-5 md:text-lg lg:text-xl"
              reveal="fade"
              as="p"
              delay={0.15}
            >
              {t("description")}
            </TextEffect>
          </div>
          <AnimatedGroup
            stagger={0.12}
            className="md:col-start-1 md:row-start-2 xl:col-span-3"
          >
            <div className="relative overflow-hidden rounded-full">
              <div>
                <Image
                  alt="Jumeirah Real Estate Investment vision and mission"
                  src={ourMissionContainerImage}
                  placeholder="blur"
                  className="w-full object-cover md:h-32 lg:h-fit"
                />
                <div className="absolute top-0 right-0 left-0 size-full bg-linear-to-tr from-[#1A1A1A] to-[#1A1A1A]/0 opacity-50 rtl:bg-linear-to-tl" />
              </div>
            </div>
            <AnimatedGroup
              delay={0.1}
              className="z-50 mt-4 flex items-center justify-center gap-2"
            >
              <GotoIcon alt="about-us" className="lg:max-xl:size-12" />
              <AppLink
                className="z-10 py-1.5 text-xs font-bold lg:px-5 lg:py-2 lg:text-base"
                href="/about"
              >
                {ct("about-us")}
              </AppLink>
            </AnimatedGroup>
          </AnimatedGroup>
          <section className="xl:col-span-2">
            <AnimatedGroup className="flex items-center gap-5 md:mb-5 xl:mt-5 xl:mb-8 xl:gap-7">
              <Image
                src={targetIcon}
                alt="target-icon"
                className="size-6 lg:size-8 xl:size-10"
              />
              <TextEffect
                as="h3"
                delay={0.08}
                className="first-letter-primary text-[1.4rem] md:text-[1.6rem] lg:text-4xl"
              >
                {t("our-vision")}
              </TextEffect>
            </AnimatedGroup>
            <TextEffect
              reveal="fade"
              as="p"
              delay={0.2}
              className="mt-2 text-sm font-light text-[#9C9C9C] md:text-lg lg:text-xl"
            >
              {t("our-vision-subtext")}
            </TextEffect>
          </section>
          <section className="justify-center lg:flex lg:flex-col xl:col-span-2">
            <AnimatedGroup className="flex items-center gap-5 md:mb-5 xl:mt-5 xl:mb-8 xl:gap-7">
              <Image
                src={missionIcon}
                alt="target-icon"
                className="size-6 md:size-8 lg:size-9 xl:size-11"
              />
              <TextEffect
                as="h3"
                delay={0.08}
                className="first-letter-primary text-[1.4rem] md:text-[1.6rem] lg:text-4xl"
              >
                {t("our-message")}
              </TextEffect>
            </AnimatedGroup>
            <TextEffect
              reveal="fade"
              as="p"
              delay={0.2}
              className="mt-2 text-sm font-light text-[#9C9C9C] md:text-lg lg:text-xl"
            >
              {t("our-message-subtext")}
            </TextEffect>
          </section>
        </div>
      </Card>
    </SectionWrapper>
  );
}
