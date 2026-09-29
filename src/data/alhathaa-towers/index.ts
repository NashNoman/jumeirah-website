import alhathaaTowersImage from "@/../public/images/alhathaa-towers.webp";
import afterSaleSupportIcon from "@/../public/svg/after-sale-support-icon.svg";
import earthquakeResistanceIcon from "@/../public/svg/earthquake-resistance-icon.svg";
import centralParkIcon from "@/../public/svg/garden.svg";
import privateParkingIcon from "@/../public/svg/private-parking-icon.svg";
import privateWaterProject from "@/../public/svg/private-water-project-icon.svg";
import sewageIcon from "@/../public/svg/sewage-icon.svg";
import { towers } from "@/data/alhathaa-towers/towers";
import { ProjectData } from "@/data/types";

export const alhathaaTowersData: ProjectData<"Alhathaa-Towers"> = {
  projectKey: "Alhathaa-Towers",
  title: "title",
  subtitle: "subtitle",
  location: {
    streetAddress: "50th Street, Al-Hathaa area",
    addressLocality: "Sana'a",
    addressRegion: "Sana'a Governorate",
  },
  dateModified: "2026-09-04",
  towersSection: towers,
  videoSection: {
    title: "videoSection.title",
    description: "videoSection.description",
    videoUrl: "https://youtu.be/6nRVVZ8nmEY?si=7v3Y5SBQpn-M4Bdr",
    videoThumbnail: alhathaaTowersImage,
  },
  featuresSection: {
    title: "featuresSection.title",
    subtitle: "featuresSection.subtitle",
    features: [
      {
        title: "featuresSection.earthquake-resistance",
        icon: earthquakeResistanceIcon,
      },
      {
        title: "featuresSection.private-parking",
        icon: privateParkingIcon,
      },
      {
        title: "featuresSection.green-space",
        icon: centralParkIcon,
      },
      {
        title: "featuresSection.water-project",
        icon: privateWaterProject,
      },
      {
        title: "featuresSection.sanitary-system",
        icon: sewageIcon,
      },
      {
        title: "featuresSection.after-sale-support",
        icon: afterSaleSupportIcon,
      },
    ],
  },
};
