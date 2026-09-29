import afterSaleServicesImage from "@/../public/images/after-sale-services.webp";
import propertyManagementImage from "@/../public/images/property-management.webp";
import realEstateProjectDevelopmentImage from "@/../public/images/real-estate-project-development.webp";
import afterSaleServicesIcon from "@/../public/svg/after-sale.svg";
import commercialIcon from "@/../public/svg/commercial-properties-icon.svg";
import developmentIcon from "@/../public/svg/development.svg";
import { AnimatedGroup } from "@/components/animated-group";
import Section from "@/components/section";
import SectionLink from "@/components/ui/section-link";
import { useTranslations } from "next-intl";
import { ServiceGalleryCard } from "../service-gallery-card";

const galleryImages = [
  {
    src: realEstateProjectDevelopmentImage,
    title: "real-estate-project-development",
    icon: developmentIcon,
    options: ["s1", "s2", "s3"],
  },
  {
    src: propertyManagementImage,
    title: "property-management",
    icon: commercialIcon,
    options: ["s4", "s5", "s6"],
  },
  {
    src: afterSaleServicesImage,
    title: "after-sale-services",
    icon: afterSaleServicesIcon,
    options: ["s7", "s8"],
  },
];

export default function OurServicesSection() {
  const t = useTranslations("OurServicesSection");
  const ct = useTranslations("Common");

  return (
    <Section
      title={t("our-services")}
      description={t("our-services-description")}
      sectionLink={() => (
        <SectionLink href="/projects">
          {ct.rich("what-we-offer", {
            span: (s) => <span className="text-primary">{s}</span>,
          })}
        </SectionLink>
      )}
      className="!px-0 max-lg:!max-w-none lg:!px-4"
    >
      <div className="container">
        <AnimatedGroup
          preset="card"
          trigger="view-each"
          className="flex flex-col gap-7 lg:flex-row lg:justify-between lg:gap-7"
          childrenClassName="flex-1"
        >
          {galleryImages.map((image, index) => (
            <ServiceGalleryCard key={index} {...image} />
          ))}
        </AnimatedGroup>
      </div>
    </Section>
  );
}
