import modelMImage from "@/../public/images/sanaa-towers/sanaa-towers-model-m.webp";
import { ModelData } from "@/data/types";

export const modelM: ModelData<"SanaaTowers"> = {
  name: "towers.tower-b.model-m.name",
  areaSqm: 230,
  layout: {
    description: "towers.tower-b.model-m.layout.description",
    images: [
      {
        image: modelMImage,
        alt: "towers.tower-b.model-m.layout.images.image-1",
      },
    ],
  },
  details: [
    {
      images: [
        {
          image: modelMImage,
          alt: "towers.tower-b.model-m.layout.images.image-1",
        },
      ],
      sections: [
        {
          title: "towers.tower-b.model-m.details.guest-section.title",
          rooms: [
            "towers.tower-b.model-m.details.guest-section.guest-reception-hall",
            "towers.tower-b.model-m.details.guest-section.majlis-bathroom",
            "towers.tower-b.model-m.details.guest-section.majlis-guest-lounge",
          ],
        },
        {
          title: "towers.tower-b.model-m.details.family-wing-section.title",
          rooms: [
            "towers.tower-b.model-m.details.family-wing-section.living-room",
            "towers.tower-b.model-m.details.family-wing-section.balcony",
            "towers.tower-b.model-m.details.family-wing-section.kitchen",
            "towers.tower-b.model-m.details.family-wing-section.storage-room",
            "towers.tower-b.model-m.details.family-wing-section.bedroom-1",
            "towers.tower-b.model-m.details.family-wing-section.bedroom-2",
            "towers.tower-b.model-m.details.family-wing-section.main-bathroom",
          ],
        },
        {
          title: "towers.tower-b.model-m.details.master-bedroom-suite.title",
          rooms: [
            "towers.tower-b.model-m.details.master-bedroom-suite.bedroom",
            "towers.tower-b.model-m.details.master-bedroom-suite.dressing-room",
            "towers.tower-b.model-m.details.master-bedroom-suite.bathroom",
          ],
        },
      ],
    },
  ],
};
