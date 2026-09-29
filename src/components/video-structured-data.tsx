import { Project, ProjectData } from "@/data/types";
import { siteConfig } from "@/lib/site";
import { getTranslations } from "next-intl/server";

interface VideoStructuredDataProps {
  projectData: ProjectData<Project>;
  projectSlug: string;
}

// Google requires `uploadDate` on VideoObject for rich-result eligibility.
// We don't have the real publish date for either project film (YouTube's
// oEmbed endpoint doesn't return it, and youtube.com/youtu.be are blocked
// from this environment) — deliberately omitted rather than invented.
// Fill it in with the actual upload date from YouTube Studio for each video
// once known: sanaa-towers -> https://youtu.be/gcCwNqkCMGk,
// alhathaa-towers -> https://youtu.be/6nRVVZ8nmEY
//
// thumbnailUrl also remains the project's portrait (4:5 or 3:4) hero photo
// rather than a proper ~16:9 video thumbnail — no such crop exists yet.
export default async function VideoStructuredData({
  projectData,
  projectSlug,
}: VideoStructuredDataProps) {
  if (!projectData.videoSection?.videoUrl) return null;

  const t = await getTranslations(projectData.projectKey);
  const { videoUrl } = projectData.videoSection;

  const videoSchema = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: t(projectData.videoSection.title),
    description: t(projectData.videoSection.description),
    thumbnailUrl: `${siteConfig.baseUrl}/images/${projectSlug}.webp`,
    // embedUrl only: contentUrl must point at the actual media file, and a
    // YouTube watch URL isn't one — the previous version set both fields
    // to the same watch URL, which is the wrong field for a video we don't
    // host ourselves. VideoObject only requires one of the two.
    embedUrl: videoUrl,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(videoSchema) }}
    />
  );
}
