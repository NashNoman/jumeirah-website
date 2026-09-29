import modelHImage from "@/../public/images/sanaa-towers/sanaa-towers-model-h.webp";
import { ModelData } from "@/data/types";

export const modelH: ModelData<"SanaaTowers"> = {
  name: "towers.tower-a.model-h.name",
  areaSqm: 300,
  layout: {
    description: "towers.tower-a.model-h.layout.description",
    images: [
      {
        image: modelHImage,
        alt: "towers.tower-a.model-h.layout.images.image-1",
      },
    ],
  },
  details: [
    {
      images: [
        {
          image: modelHImage,
          alt: "towers.tower-a.model-h.layout.images.image-1",
        },
      ],
      sections: [
        {
          title: "towers.tower-a.model-h.details.guest-section.title",
          rooms: [
            "towers.tower-a.model-h.details.guest-section.guest-reception-hall",
            "towers.tower-a.model-h.details.guest-section.majlis-bathroom",
            "towers.tower-a.model-h.details.guest-section.majlis-guest-lounge",
          ],
        },
        {
          title: "towers.tower-a.model-h.details.family-wing-section.title",
          rooms: [
            "towers.tower-a.model-h.details.family-wing-section.living-room",
            "towers.tower-a.model-h.details.family-wing-section.balcony",
            "towers.tower-a.model-h.details.family-wing-section.dining-room",
            "towers.tower-a.model-h.details.family-wing-section.kitchen",
            "towers.tower-a.model-h.details.family-wing-section.bedroom-1",
            "towers.tower-a.model-h.details.family-wing-section.bedroom-2",
            "towers.tower-a.model-h.details.family-wing-section.bedroom-3",
            "towers.tower-a.model-h.details.family-wing-section.main-bathroom",
          ],
        },
        {
          title: "towers.tower-a.model-h.details.master-bedroom-suite.title",
          rooms: [
            "towers.tower-a.model-h.details.master-bedroom-suite.bedroom",
            "towers.tower-a.model-h.details.master-bedroom-suite.dressing-room",
            "towers.tower-a.model-h.details.master-bedroom-suite.bathroom",
          ],
        },
      ],
    },
  ],
};
