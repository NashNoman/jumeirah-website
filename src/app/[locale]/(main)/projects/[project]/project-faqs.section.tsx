import { Project, ProjectData } from "@/data/types";
import { projectFaqKeys } from "@/data/project-faqs";
import { useTranslations } from "next-intl";

/**
 * Per-project FAQ content — the homepage has one (src/components/faqs-section.tsx),
 * project pages had none, despite being where the actual buying questions
 * (location, price, delivery date) live. Native <details> keeps every
 * answer in server-rendered HTML with no JavaScript required, matching
 * FAQPage schema emitted by project-faq-structured-data.tsx.
 */
export default function ProjectFaqsSection({
  projectData,
}: {
  projectData: ProjectData<Project>;
}) {
  const t = useTranslations(projectData.projectKey);
  const ct = useTranslations("Common");

  return (
    <section className="container">
      <h2 className="mb-6 text-center text-3xl md:mb-8 md:text-4xl">
        {ct("faqs.title")}
      </h2>
      <ul className="mx-auto max-w-3xl space-y-3">
        {projectFaqKeys.map((key) => (
          <li key={key}>
            <details className="group rounded-2xl border border-white/10 bg-white/5 p-4 open:bg-white/[0.07] lg:p-6">
              <summary className="cursor-pointer list-none font-semibold marker:content-none">
                {t(`faqs.${key}.question`)}
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-white/70 lg:text-base">
                {t(`faqs.${key}.answer`)}
              </p>
            </details>
          </li>
        ))}
      </ul>
    </section>
  );
}
