import modelNImage from "@/../public/images/sanaa-towers/sanaa-towers-model-n.webp";
import { ModelData } from "@/data/types";

export const modelN: ModelData<"SanaaTowers"> = {
  name: "towers.tower-b.model-n.name",
  areaSqm: 212,
  layout: {
    description: "towers.tower-b.model-n.layout.description",
    images: [
      {
        image: modelNImage,
        alt: "towers.tower-b.model-n.layout.images.image-1",
      },
    ],
  },
  details: [
    {
      images: [
        {
          image: modelNImage,
          alt: "towers.tower-b.model-n.layout.images.image-1",
        },
      ],
      sections: [
        {
          title: "towers.tower-b.model-n.details.guest-section.title",
          rooms: [
            "towers.tower-b.model-n.details.guest-section.majlis-guest-lounge",
            "towers.tower-b.model-n.details.guest-section.majlis-bathroom",
          ],
        },
        {
          title: "towers.tower-b.model-n.details.family-wing-section.title",
          rooms: [
            "towers.tower-b.model-n.details.family-wing-section.living-room",
            "towers.tower-b.model-n.details.family-wing-section.balcony",
            "towers.tower-b.model-n.details.family-wing-section.kitchen",
            "towers.tower-b.model-n.details.family-wing-section.storage-room",
            "towers.tower-b.model-n.details.family-wing-section.bedroom-1",
            "towers.tower-b.model-n.details.family-wing-section.bedroom-2",
            "towers.tower-b.model-n.details.family-wing-section.main-bathroom",
          ],
        },
        {
          title: "towers.tower-b.model-n.details.master-bedroom-suite.title",
          rooms: [
            "towers.tower-b.model-n.details.master-bedroom-suite.bedroom",
            "towers.tower-b.model-n.details.master-bedroom-suite.dressing-room",
            "towers.tower-b.model-n.details.master-bedroom-suite.bathroom",
          ],
        },
      ],
    },
  ],
};
