import { absoluteUrl, siteConfig } from "@/lib/site";
import { useTranslations } from "next-intl";

export default function ContactStructuredData({ locale }: { locale: string }) {
  const t = useTranslations("ContactUs");

  // LocalBusiness Schema with ContactPoint
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: siteConfig.name,
    image: siteConfig.logo,
    "@id": siteConfig.organizationId,
    url: siteConfig.baseUrl,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    areaServed: siteConfig.address.country,
    address: {
      "@type": "PostalAddress",
      streetAddress: t("street-address"),
      addressLocality: siteConfig.address.locality,
      addressRegion: siteConfig.address.region,
      addressCountry: siteConfig.address.country,
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
    sameAs: siteConfig.sameAs,
  };

  // ContactPage Schema
  const contactPageSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: t("contact-us"),
    description: t("description"),
    url: absoluteUrl(locale, "/contact"),
    mainEntity: {
      "@type": "RealEstateAgent",
      "@id": siteConfig.organizationId,
      name: siteConfig.name,
      contactPoint: {
        "@type": "ContactPoint",
        telephone: siteConfig.phone,
        contactType: "Customer Service",
        availableLanguage: ["English", "Arabic"],
        areaServed: "YE",
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(contactPageSchema),
        }}
      />
    </>
  );
}
