import emailIcon from "@/../public/svg/email-icon.svg";
import facebookIcon from "@/../public/svg/facebook.svg";
import instagramIcon from "@/../public/svg/instagram.svg";
import linkedinIcon from "@/../public/svg/linkedin.svg";
import xIcon from "@/../public/svg/x-icon.svg";
import Logo from "@/components/ui/logo";
import Link from "@/components/progress-link";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Globe } from "lucide-react";
import { Metadata } from "next";
import { useTranslations } from "next-intl";
import Image, { StaticImageData } from "next/image";

// A link-in-bio page for social profiles has no unique content of its own —
// keep it reachable but out of the index so it doesn't compete with the
// homepage for the site's brand-name query.
export async function generateMetadata(): Promise<Metadata> {
  return {
    robots: {
      index: false,
      follow: true,
    },
  };
}

// siteConfig.sameAs order: Facebook, Instagram, LinkedIn, X (see src/lib/site.ts).
// Sourcing hrefs from siteConfig.sameAs keeps the profiles linked here in
// sync with the profiles claimed by the sameAs JSON-LD structured data.
const [facebookUrl, instagramUrl, linkedinUrl, xUrl] = siteConfig.sameAs;

const socials = [
  {
    key: "instagram",
    href: instagramUrl,
    icon: instagramIcon,
  },
  {
    key: "facebook",
    href: facebookUrl,
    icon: facebookIcon,
  },
  {
    key: "linkedin",
    href: linkedinUrl,
    icon: linkedinIcon,
  },
  {
    key: "x",
    href: xUrl,
    icon: xIcon,
  },
  {
    key: "email",
    href: `mailto:${siteConfig.email}`,
    icon: emailIcon,
  },
  {
    key: "website",
    href: siteConfig.baseUrl,
    icon: null,
  },
] as const;

export default function SocialsPage() {
  const t = useTranslations("SocialsPage");
  const common = useTranslations("Common");

  return (
    <>
      {/* Vertical gradient: transparent at the top (reveals the hero image),
          solid background colour at the bottom. */}
      <div
        aria-hidden
        className="from-background/0 to-background pointer-events-none fixed inset-0 -z-10 bg-linear-to-b"
      />
      <main className="flex min-h-svh items-center justify-center bg-transparent px-4 py-16 pt-0! md:pt-0! lg:pt-0!">
        <div className="flex w-full max-w-sm flex-col items-center gap-10">
          {/* Logo */}
          <Link href="/" aria-label={common("home")}>
            <Logo className="w-60 md:w-72" />
          </Link>

          {/* Social Links */}
          <div className="flex w-full flex-col gap-4">
            {socials.map((social) => (
              <SocialLinkCard
                key={social.key}
                href={social.href}
                icon={social.icon}
                label={t(social.key)}
              />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}

function SocialLinkCard({
  href,
  icon,
  label,
}: {
  href: string;
  icon: StaticImageData | null;
  label: string;
}) {
  const isExternal = href.startsWith("http") || href.startsWith("mailto:");

  return (
    <a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className={cn(
        "group flex items-center justify-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-6 py-4 text-center backdrop-blur-lg",
        "transition-all duration-300 hover:border-white/40 hover:bg-white/20 hover:shadow-[0_8px_30px_rgba(0,0,0,0.25)]",
      )}
    >
      {icon ? (
        <Image
          src={icon}
          alt=""
          className="size-5 opacity-80 transition-opacity group-hover:opacity-100"
          unoptimized
        />
      ) : (
        <Globe className="size-5 opacity-80 transition-opacity group-hover:opacity-100" />
      )}
      <span className="text-base font-medium tracking-wide text-white/90 transition-colors group-hover:text-white">
        {label}
      </span>
    </a>
  );
}
