import { siteConfig } from "@/lib/site";
import { useTranslations } from "next-intl";

export default function StructuredData({ locale }: { locale: string }) {
  const t = useTranslations("Metadata");

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "@id": siteConfig.organizationId,
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    url: siteConfig.baseUrl,
    logo: siteConfig.logo,
    description: t("description"),
    telephone: siteConfig.phone,
    email: siteConfig.email,
    address: {
      "@type": "PostalAddress",
      addressCountry: siteConfig.address.country,
      addressLocality: siteConfig.address.locality,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: siteConfig.geo.latitude,
      longitude: siteConfig.geo.longitude,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: siteConfig.openingHours.dayOfWeek,
      opens: siteConfig.openingHours.opens,
      closes: siteConfig.openingHours.closes,
    },
    areaServed: siteConfig.address.country,
    sameAs: siteConfig.sameAs,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: siteConfig.phone,
      email: siteConfig.email,
      contactType: "Customer Service",
      availableLanguage: ["English", "Arabic"],
    },
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.baseUrl,
    description: t("description"),
    inLanguage: [locale],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />
    </>
  );
}
