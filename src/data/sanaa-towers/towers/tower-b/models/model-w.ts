import modelW1Image from "@/../public/images/sanaa-towers/sanaa-towers-model-w1.webp";
import modelW2Image from "@/../public/images/sanaa-towers/sanaa-towers-model-w2.webp";
import { ModelData } from "@/data/types";

export const modelW: ModelData<"SanaaTowers"> = {
  name: "towers.tower-b.model-w.name",
  areaSqm: 424,
  layout: {
    description: "towers.tower-b.model-w.layout.description",
    images: [
      {
        image: modelW1Image,
        alt: "towers.tower-b.model-w.layout.images.image-1",
      },
      {
        image: modelW2Image,
        alt: "towers.tower-b.model-w.layout.images.image-2",
      },
    ],
  },
  details: [
    {
      images: [
        {
          image: modelW1Image,
          alt: "towers.tower-b.model-w.layout.images.image-1",
        },
        {
          image: modelW2Image,
          alt: "towers.tower-b.model-w.layout.images.image-2",
        },
      ],
      sections: [
        {
          title:
            "towers.tower-b.model-w.details.first-floor.guest-section.title",
          rooms: [
            "towers.tower-b.model-w.details.first-floor.guest-section.majlis-guest-lounge",
            "towers.tower-b.model-w.details.first-floor.guest-section.majlis-bathroom",
          ],
        },
        {
          title:
            "towers.tower-b.model-w.details.first-floor.family-wing-section.title",
          rooms: [
            "towers.tower-b.model-w.details.first-floor.family-wing-section.living-room",
            "towers.tower-b.model-w.details.first-floor.family-wing-section.balcony",
            "towers.tower-b.model-w.details.first-floor.family-wing-section.kitchen",
            "towers.tower-b.model-w.details.first-floor.family-wing-section.main-bathroom",
          ],
        },
        {
          title:
            "towers.tower-b.model-w.details.first-floor.master-bedroom-suite.title",
          rooms: [
            "towers.tower-b.model-w.details.first-floor.master-bedroom-suite.bedroom",
            "towers.tower-b.model-w.details.first-floor.master-bedroom-suite.dressing-room",
            "towers.tower-b.model-w.details.first-floor.master-bedroom-suite.bathroom",
          ],
        },
      ],
    },
    {
      images: [
        {
          image: modelW1Image,
          alt: "towers.tower-b.model-w.layout.images.image-1",
        },
        {
          image: modelW2Image,
          alt: "towers.tower-b.model-w.layout.images.image-2",
        },
      ],
      sections: [
        {
          title:
            "towers.tower-b.model-w.details.second-floor.family-wing-section.title",
          rooms: [
            "towers.tower-b.model-w.details.second-floor.family-wing-section.living-room",
            "towers.tower-b.model-w.details.second-floor.family-wing-section.balcony",
            "towers.tower-b.model-w.details.second-floor.family-wing-section.buffet-pantry",
            "towers.tower-b.model-w.details.second-floor.family-wing-section.laundry-room",
            "towers.tower-b.model-w.details.second-floor.family-wing-section.storage-room",
            "towers.tower-b.model-w.details.second-floor.family-wing-section.bedroom-1",
            "towers.tower-b.model-w.details.second-floor.family-wing-section.bedroom-2",
            "towers.tower-b.model-w.details.second-floor.family-wing-section.main-bathroom",
          ],
        },
        {
          title:
            "towers.tower-b.model-w.details.second-floor.bedroom-wing-section.title",
          rooms: [
            "towers.tower-b.model-w.details.second-floor.bedroom-wing-section.bedroom",
            "towers.tower-b.model-w.details.second-floor.bedroom-wing-section.dressing-room",
            "towers.tower-b.model-w.details.second-floor.bedroom-wing-section.bathroom",
          ],
        },
        {
          title:
            "towers.tower-b.model-w.details.second-floor.master-bedroom-suite.title",
          rooms: [
            "towers.tower-b.model-w.details.second-floor.master-bedroom-suite.bedroom",
            "towers.tower-b.model-w.details.second-floor.master-bedroom-suite.dressing-room",
            "towers.tower-b.model-w.details.second-floor.master-bedroom-suite.bathroom",
          ],
        },
      ],
    },
  ],
};
