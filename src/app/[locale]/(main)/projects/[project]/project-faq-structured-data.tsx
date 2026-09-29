import { Project, ProjectData } from "@/data/types";
import { projectFaqKeys } from "@/data/project-faqs";
import { getTranslations } from "next-intl/server";

interface ProjectFaqStructuredDataProps {
  projectData: ProjectData<Project>;
}

/** Per-project counterpart to src/components/faq-structured-data.tsx. */
export default async function ProjectFaqStructuredData({
  projectData,
}: ProjectFaqStructuredDataProps) {
  const t = await getTranslations(projectData.projectKey);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: projectFaqKeys.map((key) => ({
      "@type": "Question",
      name: t(`faqs.${key}.question`),
      acceptedAnswer: {
        "@type": "Answer",
        text: t(`faqs.${key}.answer`),
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
    />
  );
}
