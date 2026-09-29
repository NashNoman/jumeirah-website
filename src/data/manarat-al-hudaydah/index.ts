import manaratAlHudaydahImage from "@/../public/images/manarat-al-hudaydah.webp";
import apartmentA from "@/../public/images/manarat-al-hudaydah/A.webp";
import apartmentB from "@/../public/images/manarat-al-hudaydah/B.webp";
import apartmentC from "@/../public/images/manarat-al-hudaydah/C.webp";
import apartmentD from "@/../public/images/manarat-al-hudaydah/D.webp";
import apartmentF from "@/../public/images/manarat-al-hudaydah/F.webp";
import apartmentG from "@/../public/images/manarat-al-hudaydah/G.webp";
import apartmentH from "@/../public/images/manarat-al-hudaydah/H.webp";
import earthquakeResistanceIcon from "@/../public/svg/earthquake-resistance-icon.svg";
import gardenIcon from "@/../public/svg/garden.svg";
import jacuzziIcon from "@/../public/svg/jacuzzi-icon.svg";
import locationIcon from "@/../public/svg/location-icon.svg";
import privateParkingIcon from "@/../public/svg/private-parking-icon.svg";
import trustedSecurityIcon from "@/../public/svg/trusted-security-icon.svg";
import { imageGallerySection } from "./gallery";
import { ProjectData } from "@/data/types";

const modelAImage = apartmentA;
const modelBImage = apartmentB;
const modelCImage = apartmentC;
const modelDImage = apartmentD;
const modelFImage = apartmentF;
const modelGImage = apartmentG;
const modelHImage = apartmentH;

export const manaratAlHudaydahData: ProjectData<"ManaratAlHudaydah"> = {
  projectKey: "ManaratAlHudaydah",
  title: "title",
  subtitle: "subtitle",
  location: {
    streetAddress: "30th Street & 16th Street",
    addressLocality: "Al-Hudaydah",
    addressRegion: "Al-Hudaydah Governorate",
  },
  dateModified: "2026-09-04",
  videoSection: {
    title: "videoSection.title",
    description: "videoSection.description",
    videoThumbnail: manaratAlHudaydahImage,
  },
  towersSection: [
    {
      name: "towers.tower-a.title",
      models: [
        {
          name: "towers.tower-a.model-a.name",
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
                  image: modelAImage,
                  alt: "towers.tower-a.model-a.layout.images.image-1",
                },
              ],
              sections: [
                {
                  title: "towers.tower-a.model-a.details.guest-section.title",
                  rooms: [
                    "towers.tower-a.model-a.details.guest-section.guest-reception-hall",
                    "towers.tower-a.model-a.details.guest-section.majlis-bathroom",
                    "towers.tower-a.model-a.details.guest-section.majlis-guest-lounge",
                  ],
                },
                {
                  title: "towers.tower-a.model-a.details.family-wing-section.title",
                  rooms: [
                    "towers.tower-a.model-a.details.family-wing-section.living-room",
                    "towers.tower-a.model-a.details.family-wing-section.balcony",
                    "towers.tower-a.model-a.details.family-wing-section.kitchen",
                    "towers.tower-a.model-a.details.family-wing-section.bedroom-1",
                    "towers.tower-a.model-a.details.family-wing-section.bedroom-2",
                    "towers.tower-a.model-a.details.family-wing-section.main-bathroom",
                  ],
                },
                {
                  title: "towers.tower-a.model-a.details.master-bedroom-suite.title",
                  rooms: [
                    "towers.tower-a.model-a.details.master-bedroom-suite.bedroom",
                    "towers.tower-a.model-a.details.master-bedroom-suite.bathroom",
                  ],
                },
              ],
            },
          ],
        },
        {
          name: "towers.tower-a.model-b.name",
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
                  image: modelBImage,
                  alt: "towers.tower-a.model-b.layout.images.image-1",
                },
              ],
              sections: [
                {
                  title: "towers.tower-a.model-b.details.family-wing-section.title",
                  rooms: [
                    "towers.tower-a.model-b.details.family-wing-section.living-room",
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
        },
        {
          name: "towers.tower-a.model-c.name",
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
                    "towers.tower-a.model-c.details.family-wing-section.bedroom-1",
                    "towers.tower-a.model-c.details.family-wing-section.bedroom-2",
                    "towers.tower-a.model-c.details.family-wing-section.main-bathroom",
                  ],
                },
                {
                  title: "towers.tower-a.model-c.details.master-bedroom-suite.title",
                  rooms: [
                    "towers.tower-a.model-c.details.master-bedroom-suite.bedroom",
                    "towers.tower-a.model-c.details.master-bedroom-suite.bathroom",
                  ],
                },
              ],
            },
          ],
        },
        {
          name: "towers.tower-a.model-d.name",
          layout: {
            description: "towers.tower-a.model-d.layout.description",
            images: [
              {
                image: modelDImage,
                alt: "towers.tower-a.model-d.layout.images.image-1",
              },
            ],
          },
          details: [
            {
              images: [
                {
                  image: modelDImage,
                  alt: "towers.tower-a.model-d.layout.images.image-1",
                },
              ],
              sections: [
                {
                  title: "towers.tower-a.model-d.details.family-wing-section.title",
                  rooms: [
                    "towers.tower-a.model-d.details.family-wing-section.entrance-hall",
                    "towers.tower-a.model-d.details.family-wing-section.living-room",
                    "towers.tower-a.model-d.details.family-wing-section.balcony",
                    "towers.tower-a.model-d.details.family-wing-section.kitchen",
                    "towers.tower-a.model-d.details.family-wing-section.bedroom-1",
                    "towers.tower-a.model-d.details.family-wing-section.main-bathroom",
                  ],
                },
                {
                  title: "towers.tower-a.model-d.details.master-bedroom-suite.title",
                  rooms: [
                    "towers.tower-a.model-d.details.master-bedroom-suite.bedroom",
                    "towers.tower-a.model-d.details.master-bedroom-suite.bathroom",
                  ],
                },
              ],
            },
          ],
        },
        {
          name: "towers.tower-a.model-f.name",
          layout: {
            description: "towers.tower-a.model-f.layout.description",
            images: [
              {
                image: modelFImage,
                alt: "towers.tower-a.model-f.layout.images.image-1",
              },
            ],
          },
          details: [
            {
              images: [
                {
                  image: modelFImage,
                  alt: "towers.tower-a.model-f.layout.images.image-1",
                },
              ],
              sections: [
                {
                  title: "towers.tower-a.model-f.details.family-wing-section.title",
                  rooms: [
                    "towers.tower-a.model-f.details.family-wing-section.entrance-hall",
                    "towers.tower-a.model-f.details.family-wing-section.living-room",
                    "towers.tower-a.model-f.details.family-wing-section.balcony",
                    "towers.tower-a.model-f.details.family-wing-section.kitchen",
                    "towers.tower-a.model-f.details.family-wing-section.bedroom-1",
                    "towers.tower-a.model-f.details.family-wing-section.main-bathroom",
                  ],
                },
              ],
            },
          ],
        },
        {
          name: "towers.tower-a.model-g.name",
          layout: {
            description: "towers.tower-a.model-g.layout.description",
            images: [
              {
                image: modelGImage,
                alt: "towers.tower-a.model-g.layout.images.image-1",
              },
            ],
          },
          details: [
            {
              images: [
                {
                  image: modelGImage,
                  alt: "towers.tower-a.model-g.layout.images.image-1",
                },
              ],
              sections: [
                {
                  title: "towers.tower-a.model-g.details.family-wing-section.title",
                  rooms: [
                    "towers.tower-a.model-g.details.family-wing-section.entrance-hall",
                    "towers.tower-a.model-g.details.family-wing-section.living-room",
                    "towers.tower-a.model-g.details.family-wing-section.balcony",
                    "towers.tower-a.model-g.details.family-wing-section.kitchen",
                    "towers.tower-a.model-g.details.family-wing-section.bedroom-1",
                    "towers.tower-a.model-g.details.family-wing-section.main-bathroom",
                  ],
                },
              ],
            },
          ],
        },
        {
          name: "towers.tower-a.model-h.name",
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
                  title: "towers.tower-a.model-h.details.family-wing-section.title",
                  rooms: [
                    "towers.tower-a.model-h.details.family-wing-section.entrance-hall",
                    "towers.tower-a.model-h.details.family-wing-section.living-room",
                    "towers.tower-a.model-h.details.family-wing-section.balcony",
                    "towers.tower-a.model-h.details.family-wing-section.kitchen",
                    "towers.tower-a.model-h.details.family-wing-section.bedroom-1",
                    "towers.tower-a.model-h.details.family-wing-section.main-bathroom",
                  ],
                },
                {
                  title: "towers.tower-a.model-h.details.master-bedroom-suite.title",
                  rooms: [
                    "towers.tower-a.model-h.details.master-bedroom-suite.bedroom",
                    "towers.tower-a.model-h.details.master-bedroom-suite.bathroom",
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  featuresSection: {
    title: "featuresSection.title",
    subtitle: "featuresSection.subtitle",
    features: [
      {
        title: "featuresSection.prime-location",
        icon: locationIcon,
      },
      {
        title: "featuresSection.sea-view",
        icon: gardenIcon,
      },
      {
        title: "featuresSection.earthquake-resistance",
        icon: earthquakeResistanceIcon,
      },
      {
        title: "featuresSection.jacuzzi",
        icon: jacuzziIcon,
      },
      {
        title: "featuresSection.private-parking",
        icon: privateParkingIcon,
      },
      {
        title: "featuresSection.security",
        icon: trustedSecurityIcon,
      },
    ],
  },
  imageGallerySection,
};
