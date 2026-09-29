import ProjectsSection from "@/app/[locale]/(main)/projects/components/sections/projects.section";
import AppLink from "@/components/app-link";
import BreadcrumbSchema from "@/components/breadcrumb-schema";
import PageHeader from "@/components/page-header";
import {
  absoluteUrl,
  hreflangAlternates,
  siteConfig,
  withBrandSuffix,
} from "@/lib/site";
import { Metadata } from "next";
import { useLocale, useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

export default function ProjectsPage() {
  const locale = useLocale();
  const t = useTranslations("ProjectsPage");
  const ct = useTranslations("Common");
  const homeT = useTranslations("Common");

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: homeT("home"), url: absoluteUrl(locale) },
          { name: homeT("projects"), url: absoluteUrl(locale, "/projects") },
        ]}
      />
      <PageHeader title={t("title")} subTitle={t("sub-title")}>
        <div className="flex items-center justify-center gap-4 text-xs font-semibold md:gap-6 md:text-sm lg:text-base">
          <AppLink href="/contact" className="lg:py-2">
            {ct("contact-us")}
          </AppLink>
        </div>
      </PageHeader>
      <main>
        <ProjectsSection />
        {/* <OurPartnersSection /> */}
      </main>
    </>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const t = await getTranslations("ProjectsPage");
  const { locale } = await params;

  const currentUrl = absoluteUrl(locale, "/projects");

  return {
    title: t("meta-title"),
    description: t("meta-description"),
    alternates: {
      canonical: currentUrl,
      languages: hreflangAlternates("/projects"),
    },
    openGraph: {
      type: "website",
      locale: locale === "ar" ? "ar_YE" : "en_US",
      url: currentUrl,
      title: withBrandSuffix(locale, t("meta-title")),
      description: t("meta-description"),
      siteName: "Jumeirah Real Estate Investment",
      images: [
        {
          url: `${siteConfig.baseUrl}/images/sanaa-towers.webp`,
          width: 1080,
          height: 1350,
          alt: t("sanaa-towers.title"),
        },
        {
          url: `${siteConfig.baseUrl}/images/alhathaa-towers.webp`,
          width: 1080,
          height: 1350,
          alt: t("alhathaa-towers.title"),
        },
        {
          url: `${siteConfig.baseUrl}/images/manarat-al-hudaydah.webp`,
          width: 1080,
          height: 1350,
          alt: t("manarat-al-hudaydah.title"),
        },
      ],
    },
  };
}
