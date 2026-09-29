"use client";

import { useNavigationProgress } from "@/components/navigation-progress";
import { getPathname, IntlLink } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import type { ComponentProps } from "react";

type IntlLinkProps = ComponentProps<typeof IntlLink>;
/** Kept in sync with the routing config rather than widened to string. */
type AppLocale = Parameters<typeof getPathname>[0]["locale"];

/** Anything with a scheme, or protocol-relative — never a client navigation. */
const EXTERNAL_HREF = /^([a-z][a-z0-9+.-]*:|\/\/)/i;

/**
 * Resolves a link's href to the pathname the browser will actually end up
 * on, so a run can be skipped when it would never complete.
 *
 * Returns `null` when the href cannot resolve to a route change at all
 * (hash-only or external). Returns `undefined` when the shape is
 * unrecognised — better to run the bar and let the safety timeout clean
 * up than to silently swallow a real navigation.
 */
function resolveTargetPathname(
  href: IntlLinkProps["href"],
  locale: AppLocale,
): string | null | undefined {
  const pathname = typeof href === "string" ? href : href?.pathname;

  // A hash-only href doesn't change the pathname, so a run started for
  // one would never be completed by the provider's pathname watcher and
  // would hang until the safety timeout fired.
  if (!pathname || pathname.startsWith("#")) return null;
  if (EXTERNAL_HREF.test(pathname)) return null;

  try {
    const resolved = getPathname({
      href:
        typeof href === "string"
          ? href
          : { pathname, query: href.query as any },
      locale,
    });

    return resolved.split(/[?#]/)[0];
  } catch {
    return undefined;
  }
}

/**
 * next-intl's `Link` plus the top-of-page progress bar. Navigation is
 * announced through `onNavigate` rather than `onClick` because Next only
 * fires it for genuine client-side navigations — never for modified or
 * middle clicks, external hrefs, or clicks an `onClick` handler has
 * already cancelled (which `navigation-links.tsx`, `section-link.tsx` and
 * `locale-switcher.tsx` all do for same-target clicks).
 */
export default function Link({ href, onNavigate, ...rest }: IntlLinkProps) {
  const { start } = useNavigationProgress();
  const locale = useLocale() as AppLocale;

  const handleNavigate = (event: { preventDefault: () => void }) => {
    let isDefaultPrevented = false;

    onNavigate?.({
      preventDefault: () => {
        isDefaultPrevented = true;
        event.preventDefault();
      },
    });

    if (isDefaultPrevented) return;

    const target = resolveTargetPathname(href, locale);

    if (target === null) return;
    if (target === window.location.pathname) return;

    start();
  };

  return <IntlLink href={href} onNavigate={handleNavigate} {...rest} />;
}
