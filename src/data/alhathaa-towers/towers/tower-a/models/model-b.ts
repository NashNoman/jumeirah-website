import modelBImage from "@/../public/images/alhathaa-towers/alhathaa-towers-model-3d-b.webp";
import modelBNumberedImage from "@/../public/images/alhathaa-towers/alhathaa-towers-numbered-model-3d-b.webp";
import { ModelData } from "@/data/types";

export const modelB: ModelData<"Alhathaa-Towers"> = {
  name: "towers.tower-a.model-b.name",
  areaSqm: 210,
  layout: {
    description: "towers.tower-a.model-b.layout.description",
    images: [
      {
        image: modelBImage,
        alt: "towers.tower-a.model-b.layout.images.image-1",
      },
    ],
  },
  details: [
    {
      images: [
        {
          image: modelBNumberedImage,
          alt: "towers.tower-a.model-b.layout.images.image-1",
        },
      ],
      sections: [
        {
          title: "towers.tower-a.model-b.details.guest-section.title",
          rooms: [
            "towers.tower-a.model-b.details.guest-section.guest-reception-hall",
            "towers.tower-a.model-b.details.guest-section.majlis-guest-lounge",
            "towers.tower-a.model-b.details.guest-section.majlis-bathroom",
          ],
        },
        {
          title: "towers.tower-a.model-b.details.family-wing-section.title",
          rooms: [
            "towers.tower-a.model-b.details.family-wing-section.living-room",
            "towers.tower-a.model-b.details.family-wing-section.storage-room",
            "towers.tower-a.model-b.details.family-wing-section.balcony",
            "towers.tower-a.model-b.details.family-wing-section.kitchen",
            "towers.tower-a.model-b.details.family-wing-section.bedroom-1",
            "towers.tower-a.model-b.details.family-wing-section.main-bathroom",
          ],
        },
        {
          title: "towers.tower-a.model-b.details.master-bedroom-suite.title",
          rooms: [
            "towers.tower-a.model-b.details.master-bedroom-suite.bedroom",
            "towers.tower-a.model-b.details.master-bedroom-suite.bathroom",
          ],
        },
      ],
    },
  ],
};
