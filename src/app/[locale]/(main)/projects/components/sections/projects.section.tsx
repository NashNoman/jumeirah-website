import alHathaaTowersImage from "@/../public/images/alhathaa-towers.webp";
import manaratAlHudaydahImage from "@/../public/images/manarat-al-hudaydah.webp";
import sanaaTowersImage from "@/../public/images/sanaa-towers.webp";
import CategoryProjectItem from "@/app/[locale]/(main)/projects/components/category-project-item";
import Carousel from "@/components/carousel";
import { useTranslations } from "next-intl";

const carouselOptions = {
  align: "center",
  containScroll: false,
  skipSnaps: true,
  breakpoints: {
    "(min-width: 768px)": {
      align: "start",
      containScroll: "keepSnaps",
      slidesToScroll: 1,
      skipSnaps: true,
    },
    "(min-width: 1024px)": {
      align: "center",
      slidesToScroll: 3,
      containScroll: "keepSnaps",
      skipSnaps: false,
      active: false,
    },
    "(min-width: 1280px)": {
      align: "center",
      slidesToScroll: 3,
      containScroll: false,
      skipSnaps: true,
    },
  },
} as const;

export default function ProjectsSection() {
  const t = useTranslations("ProjectsPage");

  const projects = [
    {
      title: t("manarat-al-hudaydah.title"),
      status: t("manarat-al-hudaydah.status"),
      image: manaratAlHudaydahImage,
      href: "/projects/manarat-al-hudaydah",
    },
    {
      title: t("sanaa-towers.title"),
      status: t("sanaa-towers.status"),
      image: sanaaTowersImage,
      href: "/projects/sanaa-towers",
    },
    {
      title: t("alhathaa-towers.title"),
      status: t("alhathaa-towers.status"),
      image: alHathaaTowersImage,
      href: "/projects/alhathaa-towers",
    },
  ] as const;

  return (
    <section className="bg-background mb-20 md:mb-32 lg:mb-52">
      <div className="relative z-30 space-y-10 md:space-y-12 lg:space-y-16">
        <div className="relative md:container md:mx-auto">
          <Carousel
            options={carouselOptions}
            className="md:fade-x w-full overflow-hidden md:px-24 lg:px-0 lg:mask-none"
          >
            <div className="embla__container flex gap-4 md:gap-6">
              {projects.map((project, index) => (
                <div
                  className="embla__slide not-first:[&_h3]:text-foreground not-first:[&_h3]:first-letter-primary flex-[0_0_90%] sm:flex-[0_0_80%] md:mx-2 md:flex-[0_0_47%] lg:flex-1 first:[&_h3]:from-[1.5ch] first:[&_h3]:to-[1.5ch]"
                  key={index}
                >
                  <CategoryProjectItem
                    title={project.title}
                    status={project.status}
                    img={project.image}
                    href={project.href}
                  />
                </div>
              ))}
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
}
