import BreadcrumbSchema from "@/components/breadcrumb-schema";
import ContactStructuredData from "@/components/contact-structured-data";
import ContactUsSection from "@/components/contact-us-section";
import { absoluteUrl, hreflangAlternates } from "@/lib/site";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("Common");

  return (
    <>
      <ContactStructuredData locale={locale} />
      <BreadcrumbSchema
        items={[
          { name: t("home"), url: absoluteUrl(locale) },
          { name: t("contact-us"), url: absoluteUrl(locale, "/contact") },
        ]}
      />
      <main className="bg-transparent pt-20 lg:pt-13">
        <ContactUsSection isFooter={false} />
      </main>
      <div className="from-background absolute top-0 left-0 -z-10 size-full bg-linear-to-t from-50% to-[#00010100]" />
    </>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const t = await getTranslations("ContactUs");
  const { locale } = await params;

  const currentUrl = absoluteUrl(locale, "/contact");

  return {
    // absolute: this title already ends in the sales-office phone number —
    // the highest-value differentiator for a contact page — so it opts out
    // of the root layout's title.template rather than pushing that number
    // further from the SERP truncation boundary.
    title: { absolute: t("meta-title") },
    description: t("meta-description"),
    alternates: {
      canonical: currentUrl,
      languages: hreflangAlternates("/contact"),
    },
    openGraph: {
      type: "website",
      locale: locale === "ar" ? "ar_YE" : "en_US",
      url: currentUrl,
      title: t("meta-title"),
      description: t("meta-description"),
      siteName: "Jumeirah Real Estate Investment",
    },
  };
}
