import FeaturesSection from "@/app/[locale]/(main)/projects/[project]/features.section";
import ProjectFaqsSection from "@/app/[locale]/(main)/projects/[project]/project-faqs.section";
import ServicesSection from "@/app/[locale]/(main)/projects/[project]/services.section";
import SpecificationsSection from "@/app/[locale]/(main)/projects/[project]/specifications.section";
import { ProjectTowersDisplay } from "@/app/[locale]/(main)/projects/components/project-towers-display";
import AppLink from "@/components/app-link";
import PageHeader from "@/components/page-header";
import { Project, ProjectData } from "@/data/types";
import locationIcon from "@/../public/svg/location-icon.svg";
import { useTranslations } from "next-intl";
import Image from "next/image";
import ImageGallerySection from "./image-gallery.section";
import VideoSection from "./video.section";

interface ProjectDetailsProps<T extends Project> {
  projectData: ProjectData<T>;
}

export default function ProjectDetails({
  projectData,
}: ProjectDetailsProps<Project>) {
  const t = useTranslations<Project>(projectData.projectKey);
  const ct = useTranslations("Common");

  return (
    <>
      <PageHeader
        className={
          projectData.projectKey === "SanaaTowers"
            ? "[&_h1]:from-[1.5ch] [&_h1]:to-[1.5ch]"
            : "[&_h1]:first-letter-primary [&_h1]:text-foreground"
        }
        title={t(projectData.title)}
        subTitle={t(projectData.subtitle)}
      >
        <div className="flex items-center justify-center gap-4 text-xs font-semibold md:gap-6 md:text-sm lg:text-base">
          <AppLink href="/contact" className="lg:py-2">
            {ct("contact-us")}
          </AppLink>
        </div>
      </PageHeader>
      {/* Plain visible address — previously the project's location only
          existed inside a <meta> tag and JSON-LD, never on the page a
          person (or a crawler reading rendered text) actually sees. */}
      <p className="relative z-30 container -mt-8 mb-8 flex items-center justify-center gap-2 text-center text-sm text-white/60 md:-mt-10 md:mb-10">
        <Image src={locationIcon} alt="" aria-hidden className="size-4" />
        {projectData.location.streetAddress}, {projectData.location.addressLocality}
      </p>
      <main className="bg-background mb-32 space-y-32 lg:mb-52 lg:space-y-52">
        {projectData.videoSection && <VideoSection projectData={projectData} />}
        <section className="relative z-30 container">
          <h2 className="mb-5 text-center text-3xl md:mb-6 md:text-4xl lg:mb-8">
            {t.rich("towersSection.title", {
              span: (s) => <span className="text-primary">{s}</span>,
            })}
          </h2>
          <ProjectTowersDisplay projectData={projectData} />
        </section>
        <SpecificationsSection projectData={projectData} />
        {projectData.imageGallerySection && (
          <ImageGallerySection projectData={projectData} />
        )}
        {projectData.featuresSection && (
          <FeaturesSection projectData={projectData} />
        )}
        {projectData.servicesSection && (
          <ServicesSection projectData={projectData} />
        )}
        <ProjectFaqsSection projectData={projectData} />
      </main>
    </>
  );
}
