import modelD1Image from "@/../public/images/alhathaa-towers/alhathaa-towers-model-3d-d1.webp";
import modelD2Image from "@/../public/images/alhathaa-towers/alhathaa-towers-model-3d-d2.webp";
import modelD1NumberedImage from "@/../public/images/alhathaa-towers/alhathaa-towers-numbered-model-3d-d1.webp";
import modelD2NumberedImage from "@/../public/images/alhathaa-towers/alhathaa-towers-numbered-model-3d-d2.webp";
import { ModelData } from "@/data/types";

export const modelD: ModelData<"Alhathaa-Towers"> = {
  name: "towers.tower-a.model-d.name",
  areaSqm: 740,
  layout: {
    description: "towers.tower-a.model-d.layout.description",
    images: [
      {
        image: modelD1Image,
        alt: "towers.tower-a.model-d.layout.images.image-1",
      },
      {
        image: modelD2Image,
        alt: "towers.tower-a.model-d.layout.images.image-2",
      },
    ],
  },
  details: [
    {
      images: [
        {
          image: modelD1NumberedImage,
          alt: "towers.tower-a.model-d.layout.images.image-1",
        },
        {
          image: modelD2NumberedImage,
          alt: "towers.tower-a.model-d.layout.images.image-2",
        },
      ],
      sections: [
        {
          title:
            "towers.tower-a.model-d.details.first-floor.guest-section.title",
          rooms: [
            "towers.tower-a.model-d.details.first-floor.guest-section.guest-reception-hall",
            "towers.tower-a.model-d.details.first-floor.guest-section.majlis-guest-lounge",
            "towers.tower-a.model-d.details.first-floor.guest-section.majlis-bathroom",
          ],
        },
        {
          title:
            "towers.tower-a.model-d.details.first-floor.family-wing-section.title",
          rooms: [
            "towers.tower-a.model-d.details.first-floor.family-wing-section.living-room",
            "towers.tower-a.model-d.details.first-floor.family-wing-section.storage-room",
            "towers.tower-a.model-d.details.first-floor.family-wing-section.balcony",
            "towers.tower-a.model-d.details.first-floor.family-wing-section.kitchen",
            "towers.tower-a.model-d.details.first-floor.family-wing-section.bedroom-1",
            "towers.tower-a.model-d.details.first-floor.family-wing-section.main-bathroom",
          ],
        },
        {
          title:
            "towers.tower-a.model-d.details.first-floor.master-bedroom-suite.title",
          rooms: [
            "towers.tower-a.model-d.details.first-floor.master-bedroom-suite.bedroom",
            "towers.tower-a.model-d.details.first-floor.master-bedroom-suite.bathroom",
          ],
        },
      ],
    },
    {
      images: [
        {
          image: modelD1NumberedImage,
          alt: "towers.tower-a.model-d.layout.images.image-1",
        },
        {
          image: modelD2NumberedImage,
          alt: "towers.tower-a.model-d.layout.images.image-2",
        },
      ],
      sections: [
        {
          title:
            "towers.tower-a.model-d.details.second-floor.family-wing-section.title",
          rooms: [
            "towers.tower-a.model-d.details.second-floor.family-wing-section.family-entrance",
            "towers.tower-a.model-d.details.second-floor.family-wing-section.living-room",
            "towers.tower-a.model-d.details.second-floor.family-wing-section.bedroom-1",
            "towers.tower-a.model-d.details.second-floor.family-wing-section.bedroom-2",
            "towers.tower-a.model-d.details.second-floor.family-wing-section.main-bathroom",
          ],
        },
        {
          title:
            "towers.tower-a.model-d.details.second-floor.master-bedroom-suite.title",
          rooms: [
            "towers.tower-a.model-d.details.second-floor.master-bedroom-suite.bedroom",
            "towers.tower-a.model-d.details.second-floor.master-bedroom-suite.balcony",
            "towers.tower-a.model-d.details.second-floor.master-bedroom-suite.dressing-room",
            "towers.tower-a.model-d.details.second-floor.master-bedroom-suite.bathroom",
          ],
        },
      ],
    },
  ],
};
