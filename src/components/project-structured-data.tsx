import { ModelData, Project, ProjectData } from "@/data/types";
import { absoluteUrl, siteConfig } from "@/lib/site";
import { stripInlineMarkup } from "@/lib/utils";
import { getTranslations } from "next-intl/server";

interface ProjectStructuredDataProps {
  projectData: ProjectData<Project>;
  locale: string;
  projectSlug: string;
}

/** Model translation keys follow "towers.<tower-slug>.<model-slug>.name" —
 * pull the two slugs out for a stable, human-readable `@id` fragment. */
function modelSlugs(nameKey: string): { tower: string; model: string } {
  const match = /^towers\.([^.]+)\.([^.]+)\.name$/.exec(nameKey);
  return match
    ? { tower: match[1], model: match[2] }
    : { tower: "tower", model: nameKey };
}

/** Duplex models (e.g. Sana'a Towers' Model T/W) carry one `details` entry
 * *per floor*, not one entry overall — reading only `details[0]` silently
 * drops every room on the second floor. Flatten every entry's sections. */
function allRooms(model: ModelData<Project>): string[] {
  return (model.details ?? []).flatMap((d) => d.sections.flatMap((s) => s.rooms));
}

/** `rooms` entries are translation KEYS, not translated text (e.g.
 * "...details.family-wing-section.bedroom-1") — every project names its
 * room keys with "bedroom"/"bathroom" substrings, so counts can be derived
 * from the untranslated key itself. No translation call needed, and this
 * can never drift from what the room list actually contains.
 *
 * Matched against the key's last segment only, not the full path: section
 * names like "private-bedroom-suite" or "master-bedroom-suite" contain
 * "bedroom" too, which would otherwise count that section's *bathroom*
 * entry (e.g. "...master-bedroom-suite.bathroom") as a bedroom. */
function countRoomsMatching(rooms: string[], pattern: RegExp): number {
  return rooms.filter((key) => pattern.test(key.split(".").pop() ?? "")).length;
}

export default async function ProjectStructuredData({
  projectData,
  locale,
  projectSlug,
}: ProjectStructuredDataProps) {
  const t = await getTranslations(projectData.projectKey);

  const projectUrl = absoluteUrl(locale, `/projects/${projectSlug}`);
  const complexId = `${projectUrl}#complex`;

  const models = projectData.towersSection.flatMap((tower) =>
    tower.models.map((model) => {
      const { tower: towerSlug, model: modelSlug } = modelSlugs(model.name);
      const rooms = allRooms(model);
      const bedrooms = countRoomsMatching(rooms, /bedroom/i);
      const bathrooms = countRoomsMatching(rooms, /bathroom/i);

      return {
        "@type": "Apartment",
        "@id": `${projectUrl}#${towerSlug}-${modelSlug}`,
        name: stripInlineMarkup(t(model.name)),
        description: t(model.layout.description).trim(),
        ...(model.areaSqm && {
          floorSize: {
            "@type": "QuantitativeValue",
            value: model.areaSqm,
            unitCode: "MTK",
          },
        }),
        ...(bedrooms > 0 && { numberOfRooms: bedrooms }),
        ...(bathrooms > 0 && { numberOfBathroomsTotal: bathrooms }),
        // No `offers`/price here — no confirmed pricing data exists yet
        // (see docs/project-details-page-seo-geo-aeo-audit.md, Finding 4).
        // Fabricating a price would be worse than omitting one.
      };
    }),
  );

  const apartmentComplexSchema = {
    "@context": "https://schema.org",
    "@type": "ApartmentComplex",
    "@id": complexId,
    name: t("title"),
    description: t("meta-description"),
    url: projectUrl,
    image: `${siteConfig.baseUrl}/images/${projectSlug}.webp`,
    address: {
      "@type": "PostalAddress",
      streetAddress: projectData.location.streetAddress,
      addressLocality: projectData.location.addressLocality,
      addressRegion: projectData.location.addressRegion,
      addressCountry: siteConfig.address.country,
    },
    // No `geo` here — see ProjectLocation's doc comment in src/data/types.ts.
    numberOfAvailableAccommodationUnits: models.length,
    // Not part of the strict schema.org vocabulary for ApartmentComplex,
    // but widely tolerated and read by Google as a freshness signal; a
    // human sets this in the project's own data module, see ProjectData.
    dateModified: projectData.dateModified,
    provider: {
      "@type": "RealEstateAgent",
      "@id": siteConfig.organizationId,
      name: siteConfig.name,
      url: siteConfig.baseUrl,
    },
    ...(projectData.featuresSection && {
      amenityFeature: projectData.featuresSection.features.map((feature) => ({
        "@type": "LocationFeatureSpecification",
        name: t(feature.title),
      })),
    }),
    containsPlace: models,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(apartmentComplexSchema),
      }}
    />
  );
}
