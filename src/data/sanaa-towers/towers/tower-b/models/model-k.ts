import modelKImage from "@/../public/images/sanaa-towers/sanaa-towers-model-k.webp";
import { ModelData } from "@/data/types";

export const modelK: ModelData<"SanaaTowers"> = {
  name: "towers.tower-b.model-k.name",
  areaSqm: 272,
  layout: {
    description: "towers.tower-b.model-k.layout.description",
    images: [
      {
        image: modelKImage,
        alt: "towers.tower-b.model-k.layout.images.image-1",
      },
    ],
  },
  details: [
    {
      images: [
        {
          image: modelKImage,
          alt: "towers.tower-b.model-k.layout.images.image-1",
        },
      ],
      sections: [
        {
          title: "towers.tower-b.model-k.details.guest-section.title",
          rooms: [
            "towers.tower-b.model-k.details.guest-section.guest-reception-hall",
            "towers.tower-b.model-k.details.guest-section.majlis-bathroom",
            "towers.tower-b.model-k.details.guest-section.majlis-guest-lounge",
          ],
        },
        {
          title: "towers.tower-b.model-k.details.family-wing-section.title",
          rooms: [
            "towers.tower-b.model-k.details.family-wing-section.living-room",
            "towers.tower-b.model-k.details.family-wing-section.balcony",
            "towers.tower-b.model-k.details.family-wing-section.kitchen",
            "towers.tower-b.model-k.details.family-wing-section.storage-room",
            "towers.tower-b.model-k.details.family-wing-section.bedroom-1",
            "towers.tower-b.model-k.details.family-wing-section.bedroom-2",
            "towers.tower-b.model-k.details.family-wing-section.bedroom-3",
            "towers.tower-b.model-k.details.family-wing-section.main-bathroom",
          ],
        },
        {
          title: "towers.tower-b.model-k.details.master-bedroom-suite.title",
          rooms: [
            "towers.tower-b.model-k.details.master-bedroom-suite.bedroom",
            "towers.tower-b.model-k.details.master-bedroom-suite.dressing-room",
            "towers.tower-b.model-k.details.master-bedroom-suite.bathroom",
          ],
        },
      ],
    },
  ],
};
