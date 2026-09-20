import heroBackgroundImage from "@/../public/images/hero-background-image.webp";
import FacebookPixel from "@/components/facebook-pixel";
import GoogleAnalytics from "@/components/google-analytics";
import LazyMotionProvider from "@/components/lazy-motion-provider";
import Navbar from "@/components/navbar";
import { NavigationProgressProvider } from "@/components/navigation-progress";
import ParallaxScrollEffect from "@/components/parallax-scroll-effect";
import { PostHogProvider } from "@/components/providers";
import ScreenSizeIndicator from "@/components/screen-size-indicator";
import StructuredData from "@/components/structured-data";
import { aeonikFont, montserratArabicFont } from "@/fonts";
import { routing } from "@/i18n/routing";
import {
  absoluteUrl,
  hreflangAlternates,
  siteConfig,
  withBrandSuffix,
} from "@/lib/site";
import { Metadata, Viewport } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { notFound } from "next/navigation";
import "../globals.css";

export const viewport: Viewport = {
  width: "device-width",
  // initialScale: 1.0,
  // maximumScale: 1.0,
  // userScalable: false,
  themeColor: "#000101",
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  let font = aeonikFont;

  if (locale === "ar") {
    font = montserratArabicFont;
  }

  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      className={font.className}
    >
      <PostHogProvider>
        <body className="bg-background text-foreground relative min-h-svh max-w-svw font-sans not-supports-[overflow:clip]:overflow-x-hidden supports-[overflow:clip]:overflow-x-clip md:pt-4 lg:pt-10">
          {process.env.NEXT_PUBLIC_GA_ID && (
            <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
          )}
          {process.env.NEXT_PUBLIC_FB_PIXEL_ID && (
            <FacebookPixel pixelId={process.env.NEXT_PUBLIC_FB_PIXEL_ID} />
          )}
          <StructuredData locale={locale} />
          <div className="space-sections">
            <LazyMotionProvider>
              <BackgroundImage />
              {process.env.NODE_ENV === "test" && <ScreenSizeIndicator />}
              <NextIntlClientProvider locale={locale}>
                {/* Inside LazyMotionProvider so the bar's `m.*` elements
                    resolve, and inside NextIntlClientProvider because the
                    links it tracks resolve their target with useLocale().
                    `children` is passed through as a prop, so it stays
                    server-rendered. */}
                <NavigationProgressProvider>
                  <Navbar />
                  {children}
                </NavigationProgressProvider>
              </NextIntlClientProvider>
            </LazyMotionProvider>
          </div>
        </body>
      </PostHogProvider>
    </html>
  );
}

function BackgroundImage() {
  return (
    <div className="absolute top-0 right-0 left-0 -z-9999 mb-0! h-full max-h-160 overflow-hidden md:max-h-200 lg:max-h-240">
      <ParallaxScrollEffect
        aria-hidden
        className="pointer-events-none relative size-full"
      >
        <Image
          src={heroBackgroundImage}
          className="-z-50 h-full w-full object-cover object-top-right md:object-top ltr:rotate-y-180 rtl:max-md:object-top-left"
          alt="Jumeirah Real Estate Investment luxury residential towers in Yemen"
          placeholder="blur"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
          priority
          fetchPriority="high"
          fill
        />
        <div className="to-background absolute start-0 top-0 -z-40 h-full w-4/6 bg-linear-to-l from-[#00010100] opacity-60 rtl:bg-linear-to-r" />
        <div className="absolute -end-32 top-0 -z-40 h-full w-[150svw] bg-linear-to-tr from-black/0 from-50% to-[#2F3A43]/60 md:w-full rtl:bg-linear-to-tl" />
      </ParallaxScrollEffect>
    </div>
  );
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const t = await getTranslations("Metadata");
  const { locale } = await params;

  const currentUrl = absoluteUrl(locale);

  return {
    // Child routes set a plain string `title` (never `{ absolute }`), so
    // this template is the single place the brand suffix is written —
    // previously every page hand-appended its own variant ("| Jumeirah",
    // "| جميرا", "| جميرا للاستثمار العقاري", or nothing at all).
    title: {
      default: t("title"),
      template: withBrandSuffix(locale, "%s"),
    },
    description: t("description"),
    authors: [{ name: "Jumeirah Real Estate Investment" }],
    creator: "Jumeirah Real Estate Investment",
    publisher: "Jumeirah Real Estate Investment",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: currentUrl,
      languages: hreflangAlternates(),
    },
    openGraph: {
      type: "website",
      locale: locale === "ar" ? "ar_YE" : "en_US",
      url: currentUrl,
      title: t("title"),
      description: t("description"),
      siteName: "Jumeirah Real Estate Investment",
      images: [
        {
          url: `${siteConfig.baseUrl}/images/${locale === "ar" ? "og-image-ar" : "og-image"}.png`,
          width: 1200,
          height: 630,
          alt: t("og-image-alt"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: [
        `${siteConfig.baseUrl}/images/${locale === "ar" ? "og-image-ar" : "og-image"}.png`,
      ],
      creator: "@JumeirahYemen",
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
    },
  };
}
