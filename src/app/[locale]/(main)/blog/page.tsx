import PageHeader from "@/components/page-header";
import { Metadata } from "next";
import { useTranslations } from "next-intl";

export default function BlogPage() {
  const t = useTranslations("Common");

  return (
    <>
      <PageHeader title={t("blog")} subTitle="">
        <></>
      </PageHeader>
      <main className="bg-background">
        <div className="container"></div>
      </main>
    </>
  );
}

// No posts are published yet — keep the page live but out of the index
// until there's real content to rank.
export async function generateMetadata(): Promise<Metadata> {
  return {
    robots: {
      index: false,
      follow: true,
    },
  };
}
