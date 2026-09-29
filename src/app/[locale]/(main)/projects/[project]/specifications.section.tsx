import { ModelData, Project, ProjectData } from "@/data/types";
import { stripInlineMarkup } from "@/lib/utils";
import { useTranslations } from "next-intl";

/**
 * Every apartment model's floor area, layout description, and full
 * room-by-room dimension breakdown, always present in server-rendered
 * HTML — the interactive tower/model/media browser above only ever
 * server-renders the first model of the first tower (client state picks
 * the rest), so eleven of twelve Sana'a Towers models and all 151
 * room-dimension lines across the three projects previously reached no
 * crawler at all. `<details>` keeps every model's content in the DOM
 * (crawlable and screen-reader-navigable) while staying visually compact;
 * nothing here depends on JavaScript.
 */
export default function SpecificationsSection({
  projectData,
}: {
  projectData: ProjectData<Project>;
}) {
  const t = useTranslations(projectData.projectKey);
  const ct = useTranslations("Common");
  const { towersSection } = projectData;

  return (
    <section aria-labelledby="specifications-heading" className="container">
      <h2
        id="specifications-heading"
        className="mb-2 text-center text-3xl md:text-4xl"
      >
        {ct("specifications.title")}
      </h2>
      <p className="mx-auto mb-8 max-w-[60ch] text-center text-sm font-light text-[#9C9C9C] md:mb-10 md:text-lg">
        {ct("specifications.subtitle")}
      </p>

      <div className="space-y-10">
        {towersSection.map((tower, towerIndex) => (
          <div key={towerIndex}>
            {towersSection.length > 1 && (
              <h3 className="mb-4 text-xl font-semibold md:text-2xl">
                {stripInlineMarkup(t(tower.name))}
              </h3>
            )}
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {tower.models.map((model, modelIndex) => (
                <ModelSpecCard
                  key={modelIndex}
                  model={model}
                  projectKey={projectData.projectKey}
                  areaLabel={ct("specifications.area")}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className="mt-8 text-center text-xs text-white/40">
        {ct("specifications.updated")}: {projectData.dateModified}
      </p>
    </section>
  );
}

function ModelSpecCard({
  model,
  projectKey,
  areaLabel,
}: {
  model: ModelData<Project>;
  projectKey: Project;
  areaLabel: string;
}) {
  const t = useTranslations(projectKey);
  // Duplex models (e.g. Sana'a Towers' Model T/W) carry one `details` entry
  // per floor — flattening every entry keeps both floors' rooms in the
  // spec sheet instead of silently dropping the second one.
  const sections = (model.details ?? []).flatMap((d) => d.sections);

  return (
    <details className="group rounded-2xl border border-white/10 bg-white/5 p-4 open:bg-white/[0.07] lg:p-5">
      <summary className="flex cursor-pointer list-none items-baseline justify-between gap-3 font-semibold marker:content-none">
        <span>{stripInlineMarkup(t(model.name))}</span>
        {model.areaSqm && (
          <span className="text-primary shrink-0 text-sm font-normal whitespace-nowrap">
            {areaLabel}: {model.areaSqm} m&sup2;
          </span>
        )}
      </summary>
      <div className="mt-3 space-y-4 text-sm leading-relaxed text-white/80">
        <p>{t(model.layout.description).trim()}</p>
        {sections.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            <h4 className="mb-1 font-semibold text-white">
              {t(section.title)}
            </h4>
            <ul className="list-disc space-y-0.5 ps-5">
              {section.rooms.map((room) => (
                <li key={room}>{t(room)}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </details>
  );
}
