/**
 * Single source of truth for site identity: the values shared across
 * metadata, JSON-LD structured data, and the sitemap (canonical URL,
 * legal/display name, contact details, social profiles, etc).
 *
 * `absoluteUrl` centralizes the `localePrefix: "as-needed"` behavior
 * defined in `src/i18n/routing.ts`: the default locale ("ar") is
 * unprefixed, "en" is prefixed with `/en`.
 */

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://jumeirahye.com";

export const siteConfig = {
  name: "Jumeirah Real Estate Investment",
  legalName: "Jumeirah Real Estate Investment and Contracting Ltd.",
  baseUrl,
  logo: `${baseUrl}/images/logo.png`,
  /** Canonical E.164 phone number. */
  phone: "+967778265522",
  email: "info@jumeirahye.com",
  address: {
    country: "YE",
    locality: "Sana'a",
    region: "Sana'a Governorate",
  },
  geo: {
    latitude: 15.3694,
    longitude: 44.191,
  },
  openingHours: {
    dayOfWeek: [
      "Saturday",
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
    ],
    opens: "08:00",
    closes: "17:00",
  },
  /**
   * Canonical social profile URLs, order: Facebook, Instagram, LinkedIn, X.
   * Keep this the single source of truth for `sameAs` claims in structured
   * data and the profiles actually linked from `socials/page.tsx`.
   */
  sameAs: [
    "https://www.facebook.com/JumeirahYemen",
    "https://www.instagram.com/JumeirahYemen",
    "https://www.linkedin.com/company/jumeirahye",
    "https://x.com/JumeirahYemen",
  ],
  organizationId: `${baseUrl}/#organization`,
} as const;

/**
 * Builds an absolute URL for the given locale + path, mirroring the
 * `localePrefix: "as-needed"` ternary previously copy-pasted across
 * `src/app/sitemap.ts` and the various `generateMetadata`/breadcrumb call
 * sites: the default locale ("ar") is unprefixed, "en" is prefixed.
 *
 * `path` should include its own leading slash (e.g. "/about"), or be
 * omitted for the locale root.
 */
export function absoluteUrl(locale: string, path = "") {
  return locale === "ar"
    ? `${siteConfig.baseUrl}${path}`
    : `${siteConfig.baseUrl}/${locale}${path}`;
}

/**
 * Builds the full `alternates.languages` map for a given path, including
 * `x-default`. The default locale ("ar") also serves the unprefixed root,
 * so it's the correct x-default target per Google's hreflang guidance.
 */
export function hreflangAlternates(path = "") {
  return {
    en: absoluteUrl("en", path),
    ar: absoluteUrl("ar", path),
    "x-default": absoluteUrl("ar", path),
  };
}

/**
 * The one place the "| Jumeirah Real Estate Investment" / "| جميرا
 * للاستثمار العقاري" disambiguation suffix is written. The root layout's
 * `title.template` (`src/app/[locale]/layout.tsx`) applies it to every
 * `<title>` automatically; call this directly for fields the template
 * doesn't reach — `openGraph.title` and `twitter.title` are set explicitly
 * per page and don't inherit it. Previously each page hand-wrote its own
 * variant of this suffix (or omitted it), so search results and shared
 * links carried three different, inconsistent brand strings.
 */
export function withBrandSuffix(locale: string, title: string) {
  return `${title} | ${locale === "ar" ? "جميرا للاستثمار العقاري" : "Jumeirah Real Estate Investment"}`;
}
