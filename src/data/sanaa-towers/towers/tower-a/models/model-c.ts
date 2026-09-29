import modelCImage from "@/../public/images/sanaa-towers/sanaa-towers-model-c.webp";
import { ModelData } from "@/data/types";

export const modelC: ModelData<"SanaaTowers"> = {
  name: "towers.tower-a.model-c.name",
  areaSqm: 346,
  layout: {
    description: "towers.tower-a.model-c.layout.description",
    images: [
      {
        image: modelCImage,
        alt: "towers.tower-a.model-c.layout.images.image-1",
      },
    ],
  },
  details: [
    {
      images: [
        {
          image: modelCImage,
          alt: "towers.tower-a.model-c.layout.images.image-1",
        },
      ],
      sections: [
        {
          title: "towers.tower-a.model-c.details.guest-section.title",
          rooms: [
            "towers.tower-a.model-c.details.guest-section.guest-reception-hall",
            "towers.tower-a.model-c.details.guest-section.majlis-bathroom",
            "towers.tower-a.model-c.details.guest-section.majlis-guest-lounge",
          ],
        },
        {
          title: "towers.tower-a.model-c.details.family-wing-section.title",
          rooms: [
            "towers.tower-a.model-c.details.family-wing-section.living-room",
            "towers.tower-a.model-c.details.family-wing-section.balcony",
            "towers.tower-a.model-c.details.family-wing-section.kitchen",
            "towers.tower-a.model-c.details.family-wing-section.storage-room",
            "towers.tower-a.model-c.details.family-wing-section.maid-room",
            "towers.tower-a.model-c.details.family-wing-section.maid-bathroom",
            "towers.tower-a.model-c.details.family-wing-section.bedroom-1",
            "towers.tower-a.model-c.details.family-wing-section.bedroom-2",
            "towers.tower-a.model-c.details.family-wing-section.main-bathroom",
          ],
        },
        {
          title: "towers.tower-a.model-c.details.private-bedroom-suite.title",
          rooms: [
            "towers.tower-a.model-c.details.private-bedroom-suite.bedroom",
            "towers.tower-a.model-c.details.private-bedroom-suite.bathroom",
          ],
        },
        {
          title: "towers.tower-a.model-c.details.master-bedroom-suite.title",
          rooms: [
            "towers.tower-a.model-c.details.master-bedroom-suite.bedroom",
            "towers.tower-a.model-c.details.master-bedroom-suite.dressing-room",
            "towers.tower-a.model-c.details.master-bedroom-suite.balcony",
            "towers.tower-a.model-c.details.master-bedroom-suite.bathroom",
          ],
        },
      ],
    },
  ],
};
