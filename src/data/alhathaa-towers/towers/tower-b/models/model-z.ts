import modelZImage from "@/../public/images/alhathaa-towers/alhathaa-towers-model-3d-z2.webp";
import modelZNumberedImage from "@/../public/images/alhathaa-towers/alhathaa-towers-numbered-model-3d-z2.webp";
import { ModelData } from "@/data/types";

export const modelZ: ModelData<"Alhathaa-Towers"> = {
  name: "towers.tower-b.model-z.name",
  areaSqm: 245,
  layout: {
    description: "towers.tower-b.model-z.layout.description",
    images: [
      {
        image: modelZImage,
        alt: "towers.tower-b.model-z.layout.images.image-1",
      },
    ],
  },
  details: [
    {
      images: [
        {
          image: modelZNumberedImage,
          alt: "towers.tower-b.model-z.layout.images.image-1",
        },
      ],
      sections: [
        {
          title: "towers.tower-b.model-z.details.guest-section.title",
          rooms: [
            "towers.tower-b.model-z.details.guest-section.guest-reception-hall",
            "towers.tower-b.model-z.details.guest-section.majlis-guest-lounge",
            "towers.tower-b.model-z.details.guest-section.majlis-bathroom",
          ],
        },
        {
          title: "towers.tower-b.model-z.details.family-wing-section.title",
          rooms: [
            "towers.tower-b.model-z.details.family-wing-section.living-room",
            "towers.tower-b.model-z.details.family-wing-section.balcony",
            "towers.tower-b.model-z.details.family-wing-section.maid-room",
            "towers.tower-b.model-z.details.family-wing-section.kitchen",
            "towers.tower-b.model-z.details.family-wing-section.bedroom-1",
            "towers.tower-b.model-z.details.family-wing-section.bedroom-2",
            "towers.tower-b.model-z.details.family-wing-section.main-bathroom",
          ],
        },
        {
          title: "towers.tower-b.model-z.details.master-bedroom-suite.title",
          rooms: [
            "towers.tower-b.model-z.details.master-bedroom-suite.bedroom",
            "towers.tower-b.model-z.details.master-bedroom-suite.bathroom",
          ],
        },
      ],
    },
  ],
};
