import Link from "@/components/progress-link";
import { usePathname } from "@/i18n/navigation";
import { luxuryPresets } from "@/lib/luxury-presets";
import { cn } from "@/lib/utils";
import { m, Variants } from "motion/react";
import { useTranslations } from "next-intl";

interface NavigationLinksProps {
  /** Fired only when the tap doesn't navigate, i.e. the link points at
   * the page already being viewed. */
  onSamePageClick?: () => void;
  className?: string;
  liClassName?: string;
  linkClassName?: string;
  activeLinkClassName?: string;
  animated?: boolean;
  isOpen?: boolean;
  stagger?: number;
}

const links = [
  { key: "home", href: "/" },
  { key: "projects", href: "/projects" },
  { key: "about-us", href: "/about" },
  { key: "contact-us", href: "/contact" },
] as const;

export function NavigationLinks({
  onSamePageClick,
  className,
  liClassName,
  linkClassName,
  activeLinkClassName,
  animated = false,
  isOpen = true,
  stagger = 0.06,
}: NavigationLinksProps) {
  const t = useTranslations("Common");
  const pathname = usePathname();

  const isActive = (href: string) => {
    return href === "/" ? pathname === href : pathname.startsWith(href);
  };

  const handleLinkClick = (e: React.MouseEvent, href: string) => {
    if (pathname !== href) return;
    // Already here: scroll back to the top instead of navigating. Since
    // no navigation follows, nothing else would close the mobile menu.
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
    onSamePageClick?.();
  };

  // Use a refined preset for professional motion
  const baseContainer = luxuryPresets.cascade.container;
  const baseItem = luxuryPresets.cascade.item;

  const listVariants: Variants = {
    hidden: baseContainer.hidden || { opacity: 0 },
    visible: {
      ...(baseContainer.visible as object),
      transition: {
        ...(baseContainer.visible?.transition as object),
        staggerChildren: stagger,
        delayChildren: 0.12,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { ...(baseItem.hidden as object) },
    visible: {
      ...(baseItem.visible as object),
      // Slightly reduce travel for nav links
      y: 0,
      transition: {
        ...(baseItem.visible?.transition as object),
        duration: 0.4,
      },
    },
  };

  return (
    <>
      {animated ? (
        <m.ul
          className={cn(
            "flex items-center gap-8 text-base font-medium text-white",
            className,
          )}
          variants={listVariants}
          initial="hidden"
          animate={isOpen ? "visible" : "hidden"}
        >
          {links.map((link) => (
            <m.li
              key={link.key}
              className={liClassName}
              variants={itemVariants}
            >
              <Link
                href={link.href}
                className={cn(
                  "hover:text-primary transition-colors",
                  linkClassName,
                  isActive(link.href) &&
                    cn(
                      "text-primary font-serif text-lg font-medium",
                      activeLinkClassName,
                    ),
                )}
                onClick={(e) => handleLinkClick(e, link.href)}
              >
                {t(link.key)}
              </Link>
            </m.li>
          ))}
        </m.ul>
      ) : (
        <ul
          className={cn(
            "flex items-center gap-8 text-base font-medium text-white",
            className,
          )}
        >
          {links.map((link) => (
            <li key={link.key} className={liClassName}>
              <Link
                href={link.href}
                className={cn(
                  "hover:text-primary transition-colors",
                  linkClassName,
                  isActive(link.href) &&
                    cn(
                      "text-primary font-serif text-lg font-medium",
                      activeLinkClassName,
                    ),
                )}
                onClick={(e) => handleLinkClick(e, link.href)}
              >
                {t(link.key)}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
