"use client";

import DataTabs from "@/app/[locale]/(main)/projects/components/project-towers-display/data-tabs";
import DetailsPanel from "@/app/[locale]/(main)/projects/components/project-towers-display/details-panel";
import MediaPanel from "@/app/[locale]/(main)/projects/components/project-towers-display/media-panel";
import ModelTabs from "@/app/[locale]/(main)/projects/components/project-towers-display/model-tabs";
import TowerTabs from "@/app/[locale]/(main)/projects/components/project-towers-display/tower-tabs";
import { TowersDisplayProvider } from "@/app/[locale]/(main)/projects/components/project-towers-display/towers-display-context";
import { Project, ProjectData } from "@/data/types";
import { useTranslations } from "next-intl";
import React, { useId } from "react";
import { useBreakpoint } from "../../../../../../hooks/use-breakpoint";

interface ProjectTowersDisplayProps {
  projectData: ProjectData<Project>;
}

const MemoizedTowerTabs = React.memo(TowerTabs);
const MemoizedModelTabs = React.memo(ModelTabs);
const MemoizedMediaPanel = React.memo(MediaPanel);
const MemoizedDetailsPanel = React.memo(DetailsPanel);
const MemoizedDataTabs = React.memo(DataTabs);

const containerClasses =
  "border-gradient-to-s [--padding-x:1rem] md:[--padding-x:1.75rem] lg:[--padding-x:2.5rem] lg:border-gradient-width-0.5 border-gradient-to-[#14141400] border-gradient-from-[#7A7A7A99] z-10 space-y-6 rounded-4xl bg-linear-[268deg] from-[#1A1A1AE5] to-[#1A1A1A12]  py-4 md:rounded-[3.5rem] md:py-7 lg:py-10 rtl:bg-linear-[100deg]";

const ProjectTowersDisplay = React.memo(
  ({ projectData }: ProjectTowersDisplayProps) => {
    const t = useTranslations(projectData.projectKey);
    const ct = useTranslations("Common");
    const breakpoint = useBreakpoint();
    const componentId = useId();
    const tabPanelId = `${componentId}-tabpanel`;
    const tabListId = `${componentId}-tablist`;

    return (
      <TowersDisplayProvider projectData={projectData}>
        <section
          className={containerClasses}
          aria-label={t("title")}
          role="region"
        >
          {projectData.towersSection.length > 1 && (
            <div
              role="tablist"
              aria-label={ct("tabs.navigation")}
              id={tabListId}
              className="relative"
            >
              <div className="w-full">
                {/* No heading here: the tablist above already carries
                    aria-label={ct("tabs.navigation")}, and the visible
                    "towersSection.title" <h2> in project-details-page.tsx
                    already introduces this section — a second, sr-only H2
                    added nothing accessible-tech couldn't already get from
                    the tablist's own label, only an extra heading in the
                    document outline. */}
                <MemoizedTowerTabs
                  projectData={projectData}
                  tabPanelId={tabPanelId}
                  tabListId={tabListId}
                />
              </div>
            </div>
          )}

          <div
            id={tabPanelId}
            role="tabpanel"
            aria-labelledby={`${componentId}-tab`}
            className="flex h-[calc(100vh-10rem)] max-w-full rounded-lg lg:h-[calc(100vh-18rem)] lg:max-h-[31rem] lg:min-h-[28rem] ltr:lg:pr-[var(--padding-x)] rtl:lg:pl-[var(--padding-x)]"
            tabIndex={0}
            aria-live="polite"
            aria-atomic="true"
          >
            <div className="flex h-full w-0 flex-1 flex-col">
              <MemoizedModelTabs
                projectData={projectData}
                aria-controls={tabPanelId}
              />
              {(!breakpoint.lg || breakpoint.ssr) && (
                <MemoizedMediaPanel
                  projectKey={projectData.projectKey}
                  className="mt-4 aspect-[10/7] md:aspect-[16/9] lg:hidden [&_img]:lg:scale-[1.2]"
                  aria-label={ct("tabs.media")}
                />
              )}
              <div
                className="description text-foreground/90 scrollbar fade-y grow overflow-y-auto py-8 max-lg:my-2 ltr:lg:mr-4 rtl:lg:ml-4 [&>*]:px-[var(--padding-x)]"
                aria-live="polite"
                aria-atomic="true"
              >
                <MemoizedDetailsPanel projectData={projectData} />
              </div>
              <div
                className="data-tabs max-w-full"
                role="tablist"
                aria-label={ct("tabs.data")}
              >
                <MemoizedDataTabs projectData={projectData} />
              </div>
            </div>
            {breakpoint.lg && (
              <MemoizedMediaPanel
                projectKey={projectData.projectKey}
                className="lg:block"
                aria-label={ct("tabs.media")}
              />
            )}
          </div>
        </section>
      </TowersDisplayProvider>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.projectData.projectKey === nextProps.projectData.projectKey
    );
  },
);

ProjectTowersDisplay.displayName = "ProjectTowersDisplay";

export default ProjectTowersDisplay;
