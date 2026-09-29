import ProjectDetails from "@/app/[locale]/(main)/projects/[project]/project-details-page";
import ProjectFaqStructuredData from "@/app/[locale]/(main)/projects/[project]/project-faq-structured-data";
import BreadcrumbNav from "@/components/breadcrumb-nav";
import BreadcrumbSchema from "@/components/breadcrumb-schema";
import ProjectStructuredData from "@/components/project-structured-data";
import VideoStructuredData from "@/components/video-structured-data";
import { alhathaaTowersData } from "@/data/alhathaa-towers";
import { manaratAlHudaydahData } from "@/data/manarat-al-hudaydah";
import { sanaaTowersData } from "@/data/sanaa-towers";
import { Project, ProjectData } from "@/data/types";
import {
  absoluteUrl,
  hreflangAlternates,
  siteConfig,
  withBrandSuffix,
} from "@/lib/site";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

// Real pixel dimensions of public/images/<slug>.webp — these are portrait
// photos (not the 2:1 crop `summary_large_image` expects), but declaring
// their actual size is still strictly better than the previous hardcoded
// 1200x630, which every one of these files' true dimensions contradicted.
// Update this alongside the source file if it's ever replaced.
const ogImageDimensions: Record<keyof typeof projects, { width: number; height: number }> = {
  "sanaa-towers": { width: 1080, height: 1350 },
  "alhathaa-towers": { width: 1080, height: 1350 },
  "manarat-al-hudaydah": { width: 1629, height: 2172 },
};

const projects = {
  "sanaa-towers": sanaaTowersData,
  "alhathaa-towers": alhathaaTowersData,
  "manarat-al-hudaydah": manaratAlHudaydahData,
} as const;

interface PageProps {
  params: Promise<{ locale: string; project: keyof typeof projects }>;
}

export default async function ProjectDetailsPage({ params }: PageProps) {
  const { project, locale } = await params;

  if (!projects[project]) {
    notFound();
  }

  const t = await getTranslations("Common");
  const projectT = await getTranslations(projects[project].projectKey);

  // Single source for both the JSON-LD trail and the visible nav below it —
  // previously BreadcrumbSchema described a path the page never rendered.
  const breadcrumbItems = [
    { name: t("home"), path: "/" },
    { name: t("projects"), path: "/projects" },
    { name: projectT("title"), path: `/projects/${project}` },
  ];

  return (
    <>
      <ProjectStructuredData
        projectData={projects[project] as ProjectData<Project>}
        locale={locale}
        projectSlug={project}
      />
      <VideoStructuredData
        projectData={projects[project] as ProjectData<Project>}
        projectSlug={project}
      />
      <ProjectFaqStructuredData
        projectData={projects[project] as ProjectData<Project>}
      />
      <BreadcrumbSchema
        items={breadcrumbItems.map(({ name, path }) => ({
          name,
          url: absoluteUrl(locale, path === "/" ? "" : path),
        }))}
      />
      <BreadcrumbNav
        items={breadcrumbItems.map(({ name, path }, index) => ({
          name,
          href: index === breadcrumbItems.length - 1 ? undefined : path,
        }))}
      />
      <ProjectDetails projectData={projects[project] as ProjectData<Project>} />
    </>
  );
}

export async function generateStaticParams() {
  return Object.keys(projects).map((project) => ({
    project,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { project, locale } = await params;

  if (!projects[project]) {
    notFound();
  }

  const t = await getTranslations(projects[project].projectKey);
  // Not every project namespace has a `meta-title` key yet (e.g. Manarat
  // Al-Hudaydah) — fall back to the plain `title` rather than rendering a
  // missing-message placeholder.
  const metaTitle = t.has("meta-title") ? t("meta-title") : t("title");
  const currentUrl = absoluteUrl(locale, `/projects/${project}`);

  return {
    title: metaTitle,
    description: t("meta-description"),
    alternates: {
      canonical: currentUrl,
      languages: hreflangAlternates(`/projects/${project}`),
    },
    openGraph: {
      type: "website",
      locale: locale === "ar" ? "ar_YE" : "en_US",
      url: currentUrl,
      title: withBrandSuffix(locale, metaTitle),
      description: t("meta-description"),
      siteName: "Jumeirah Real Estate Investment",
      images: [
        {
          url: `${siteConfig.baseUrl}/images/${project}.webp`,
          ...ogImageDimensions[project],
          alt: t("title"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: withBrandSuffix(locale, metaTitle),
      description: t("meta-description"),
      // Reuse the same real project photo as openGraph.images — the
      // per-project "-twitter.jpg" files this pointed to never existed.
      images: [`${siteConfig.baseUrl}/images/${project}.webp`],
    },
  };
}
