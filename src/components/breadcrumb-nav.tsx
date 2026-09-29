import Link from "@/components/progress-link";
import { Fragment } from "react";

export interface BreadcrumbNavItem {
  name: string;
  /** Locale-relative path (e.g. "/projects"), or omitted for the current,
   * non-linked page. */
  href?: string;
}

/**
 * Visible counterpart to BreadcrumbSchema's JSON-LD trail — the two
 * previously described a navigation path that didn't actually exist
 * anywhere on the page. Render both from the same source array (see
 * projects/[project]/page.tsx) so they can't drift apart again.
 */
export default function BreadcrumbNav({ items }: { items: BreadcrumbNavItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="relative z-30 container pt-6">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-white/50">
        {items.map((item, index) => (
          <Fragment key={item.name}>
            {index > 0 && <li aria-hidden="true">/</li>}
            <li>
              {item.href ? (
                <Link
                  href={item.href}
                  className="transition-colors hover:text-white/80"
                >
                  {item.name}
                </Link>
              ) : (
                <span aria-current="page" className="text-white/80">
                  {item.name}
                </span>
              )}
            </li>
          </Fragment>
        ))}
      </ol>
    </nav>
  );
}
