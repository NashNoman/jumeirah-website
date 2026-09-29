import modelAImage from "@/../public/images/alhathaa-towers/alhathaa-towers-model-3d-a.webp";
import modelANumberedImage from "@/../public/images/alhathaa-towers/alhathaa-towers-numbered-model-3d-a.webp";
import { ModelData } from "@/data/types";

export const modelA: ModelData<"Alhathaa-Towers"> = {
  name: "towers.tower-a.model-a.name",
  areaSqm: 326,
  layout: {
    description: "towers.tower-a.model-a.layout.description",
    images: [
      {
        image: modelAImage,
        alt: "towers.tower-a.model-a.layout.images.image-1",
      },
    ],
  },
  details: [
    {
      images: [
        {
          image: modelANumberedImage,
          alt: "towers.tower-a.model-a.layout.images.image-1",
        },
      ],
      sections: [
        {
          title: "towers.tower-a.model-a.details.guest-section.title",
          rooms: [
            "towers.tower-a.model-a.details.guest-section.guest-reception-hall",
            "towers.tower-a.model-a.details.guest-section.majlis-guest-lounge",
            "towers.tower-a.model-a.details.guest-section.majlis-bathroom",
          ],
        },
        {
          title: "towers.tower-a.model-a.details.family-wing-section.title",
          rooms: [
            "towers.tower-a.model-a.details.family-wing-section.living-room",
            "towers.tower-a.model-a.details.family-wing-section.balcony",
            "towers.tower-a.model-a.details.family-wing-section.maid-room",
            "towers.tower-a.model-a.details.family-wing-section.kitchen",
            "towers.tower-a.model-a.details.family-wing-section.bedroom-1",
            "towers.tower-a.model-a.details.family-wing-section.bedroom-2",
            "towers.tower-a.model-a.details.family-wing-section.bedroom-3",
            "towers.tower-a.model-a.details.family-wing-section.main-bathroom",
            "towers.tower-a.model-a.details.family-wing-section.storage-room",
          ],
        },
        {
          title: "towers.tower-a.model-a.details.master-bedroom-suite.title",
          rooms: [
            "towers.tower-a.model-a.details.master-bedroom-suite.bedroom",
            "towers.tower-a.model-a.details.master-bedroom-suite.dressing-room",
            "towers.tower-a.model-a.details.master-bedroom-suite.bathroom",
          ],
        },
      ],
    },
  ],
};
