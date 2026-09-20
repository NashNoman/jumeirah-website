import alHathaaTowersImage from "@/../public/images/alhathaa-towers.webp";
import manaratAlHudaydahImage from "@/../public/images/manarat-al-hudaydah.webp";
import sanaaTowersImage from "@/../public/images/sanaa-towers.webp";
import { AnimatedGroup } from "@/components/animated-group";
import Carousel from "@/components/carousel";
import GotoIcon from "@/components/goto-icon";
import ImageContainer from "@/components/image-container";
import Section from "@/components/section";
import SectionLink from "@/components/ui/section-link";
import Link from "@/components/progress-link";
import { transitionVariants } from "@/lib/transitions";
import { useTranslations } from "next-intl";

const projects = [
  {
    title: "manarat-al-hudaydah",
    titleNoSpan: "manarat-al-hudaydah-no-span",
    status: "under-construction",
    image: manaratAlHudaydahImage,
    href: "/projects/manarat-al-hudaydah",
  },
  {
    title: "sanaa-towers",
    titleNoSpan: "sanaa-towers-no-span",
    status: "under-construction",
    image: sanaaTowersImage,
    href: "/projects/sanaa-towers",
  },
  {
    title: "alhathaa-towers",
    titleNoSpan: "alhathaa-towers-no-span",
    status: "complete",
    image: alHathaaTowersImage,
    href: "/projects/alhathaa-towers",
  },
] as const;

const carouselOptions = {
  align: "center",
  containScroll: false,
  skipSnaps: true,
  breakpoints: {
    "(min-width: 768px)": {
      align: "center",
      slidesToScroll: 2,
      active: false,
    },
  },
} as const;

export default function OurProjectsSection() {
  const t = useTranslations("ExploreOurProjectsSection");
  const ct = useTranslations("Common");
  const projectsT = useTranslations("ProjectTitles");

  return (
    <Section
      title={t("our-projects")}
      description={t("our-projects-description")}
      sectionLink={() => (
        <SectionLink href="/projects">
          {t.rich("more-projects", {
            span: (s) => <span className="text-primary">{s}</span>,
          })}
        </SectionLink>
      )}
      enableAnimation
    >
      <Carousel options={carouselOptions} className="w-full md:px-4">
        <AnimatedGroup
          variants={transitionVariants}
          className="flex gap-4 md:justify-center md:gap-6 lg:gap-12"
          childrenClassName="embla__slide md:mx-2 flex-[0_0_90%] sm:flex-[0_0_80%] md:flex-[0_0_calc((100%-3rem)/3)] lg:flex-[0_0_calc((100%-6rem)/3)] first:[&_h3]:from-[1.5ch] first:[&_h3]:to-[1.5ch] not-first:[&_h3]:text-foreground not-first:[&_h3]:first-letter-primary"
          inherit
        >
          {projects.map((p) => (
            <ImageContainer
              key={p.title}
              src={p.image}
              alt={projectsT(p.title)}
              className="w-full cursor-pointer overflow-hidden rounded-[3rem] duration-300 ease-in-out active:scale-95 active:brightness-80 lg:rounded-4xl [&_figure>div]:opacity-20 [&_figure>div]:transition-opacity hover:[&_figure>div]:opacity-20 lg:[&_figure>div]:opacity-60"
              sizes="(max-width: 640px) 90vw, (max-width: 768px) 80vw, (max-width: 1024px) 47vw, (max-width: 1536px) 40vw, 28vw"
            >
              <Link
                href={p.href}
                className="flex h-full flex-col justify-between gap-80 px-5 py-4 md:px-6 md:py-6 lg:gap-96 lg:px-5 lg:py-4 xl:gap-[30rem]"
              >
                <p className="bg-glass self-start rounded-2xl border border-white/30 bg-black/20 px-3 py-1.5 text-xs text-[#dadada] md:px-4 md:text-base lg:border-2">
                  {ct(p.status)}
                </p>
                <div className="flex items-center justify-center gap-2">
                  <GotoIcon
                    className="md:size-10 md:p-1.5"
                    alt={projectsT(p.title)}
                  />
                  <div className="border-gradient-to-e border-gradient-to-neutral-500/60 grow rounded-2xl bg-linear-to-r from-[#1A1A1A] to-[#1A1A1A]/0 p-2 text-center md:text-lg rtl:bg-linear-to-l">
                    <h3 className="first-letter-primary-or-clip mx-auto w-fit lg:py-1.5">
                      {projectsT(p.title)}
                    </h3>
                  </div>
                </div>
              </Link>
            </ImageContainer>
          ))}
        </AnimatedGroup>
      </Carousel>
    </Section>
  );
}
