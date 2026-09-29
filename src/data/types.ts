import type { Messages } from "next-intl";
import { StaticImageData } from "next/image";

export type Project = "SanaaTowers" | "Alhathaa-Towers" | "ManaratAlHudaydah";

// Utility type to get only leaf dot-path keys of a nested object
type LeafPaths<T> = T extends object
  ? {
      [K in keyof T & string]: T[K] extends object
        ? `${K}.${LeafPaths<T[K]>}`
        : K;
    }[keyof T & string]
  : never;

type BaseTranslation<T extends Project> = LeafPaths<Messages[T]>;

export type ModelDetailsSection<T extends Project> = {
  title: BaseTranslation<T>;
  rooms: BaseTranslation<T>[];
};

export type ImageData<T extends Project> = {
  image: StaticImageData;
  alt: BaseTranslation<T>;
};

export type ModelDetails<T extends Project> = {
  images: ImageData<T>[];
  sections: ModelDetailsSection<T>[];
};

export type ModelData<T extends Project> = {
  name: BaseTranslation<T>;
  layout: {
    description: BaseTranslation<T>;
    images: ImageData<T>[];
  };
  /**
   * Total floor area in square meters, for schema.org `floorSize` and the
   * specifications table. Only set where the model's own layout
   * description already states an exact figure (e.g. "a total area of 310
   * square meters") — omit rather than estimate for models whose copy
   * doesn't give one (e.g. Manarat Al-Hudaydah's models).
   */
  areaSqm?: number;
  videos?: string[];
  photos?: ImageData<T>[];
  details: ModelDetails<T>[];
};

export type TowerData<T extends Project> = {
  name: BaseTranslation<T>;
  models: ModelData<T>[];
};

export type FeatureData<T extends Project> = {
  title: BaseTranslation<T>;
  icon: StaticImageData;
};

export type ServiceData<T extends Project> = {
  title: BaseTranslation<T>;
  icon: StaticImageData;
  backgroundImage: StaticImageData;
};

export type ImageGallery<T extends Project> = {
  src: StaticImageData;
  alt: BaseTranslation<T>;
};

/**
 * A project's own physical location — distinct from `siteConfig.address`
 * (the company's sales office). Each project previously borrowed the
 * office's address and geo coordinates in structured data, which is wrong
 * for any project that isn't literally at the office (all three, as it
 * happens): Manarat Al-Hudaydah published "Sana'a" as its locality. `geo`
 * is deliberately not part of this type — no project's precise building
 * coordinates are confirmed yet, and an approximate/office substitute is
 * worse than omitting the field. Add `geo` back here once real per-project
 * coordinates are known.
 */
export type ProjectLocation = {
  streetAddress: string;
  addressLocality: string;
  addressRegion: string;
};

export type ProjectData<T extends Project> = {
  projectKey: T;
  title: BaseTranslation<T>;
  subtitle: BaseTranslation<T>;
  location: ProjectLocation;
  /**
   * ISO date (YYYY-MM-DD) a human sets when this project's facts (price,
   * availability, specs, amenities) materially change — never the build
   * timestamp. Surfaced in structured data and visibly on the page as a
   * freshness signal; an inaccurate "always today" date is worse than none.
   */
  dateModified: string;
  videoSection?: {
    title: BaseTranslation<T>;
    description: BaseTranslation<T>;
    videoUrl?: string;
    videoThumbnail: StaticImageData;
  };
  towersSection: TowerData<T>[];
  featuresSection?: {
    title: BaseTranslation<T>;
    subtitle: BaseTranslation<T>;
    features: FeatureData<T>[];
  };
  servicesSection?: {
    title: BaseTranslation<T>;
    subtitle: BaseTranslation<T>;
    services: ServiceData<T>[];
  };
  imageGallerySection?: {
    title: BaseTranslation<T>;
    headingTitle: BaseTranslation<T>;
    headingSubtitle: BaseTranslation<T>;
    images: ImageGallery<T>[];
  }[];
};
