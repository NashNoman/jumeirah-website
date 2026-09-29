import facebookLogo from "@/../public/svg/facebook.svg";
import instagramLogo from "@/../public/svg/instagram.svg";
import linkedInLogo from "@/../public/svg/linkedin.svg";
import xLogo from "@/../public/svg/x-icon.svg";
import { glide } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { m, Variants } from "motion/react";
import { useTranslations } from "next-intl";
import Image from "next/image";

interface SocialLinksProps {
  className?: string;
  iconClassName?: string;
  anchorClassName?: string;
  animated?: boolean;
  isOpen?: boolean;
  stagger?: number;
}

export function SocialLinks({
  className,
  iconClassName,
  anchorClassName,
  animated = false,
  isOpen = true,
  stagger = 0.08,
}: SocialLinksProps) {
  const t = useTranslations("Common");

  const socials = [
    {
      href: "https://www.linkedin.com/company/jumeirahye",
      icon: linkedInLogo,
      label: t("linkedin"),
    },
    {
      href: "https://www.instagram.com/JumeirahYemen",
      icon: instagramLogo,
      label: t("instagram"),
    },
    { href: "https://www.x.com/JumeirahYemen", icon: xLogo, label: t("x") },
    {
      href: "https://www.facebook.com/JumeirahYemen",
      icon: facebookLogo,
      label: t("facebook"),
    },
  ] as const;

  // Fades in after the navigation links have started rising.
  const listVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: stagger, delayChildren: 0.32 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { y: glide(0.6), opacity: { duration: 0.45, ease: "easeOut" } },
    },
  };

  if (animated) {
    return (
      <m.div
        className={className}
        variants={listVariants}
        initial="hidden"
        animate={isOpen ? "visible" : "hidden"}
      >
        {socials.map((social) => (
          <m.a
            key={social.href}
            href={social.href}
            className={cn(
              "rounded-full p-3 transition-colors hover:bg-white/20",
              anchorClassName,
            )}
            target="_blank"
            rel="noopener noreferrer"
            variants={itemVariants}
          >
            <Image
              src={social.icon}
              className={iconClassName || "size-5"}
              unoptimized
              alt={social.label}
            />
            <span className="sr-only">{social.label}</span>
          </m.a>
        ))}
      </m.div>
    );
  }

  return (
    <div className={className}>
      {socials.map((social) => (
        <a
          key={social.href}
          href={social.href}
          className={cn(
            "rounded-full p-3 transition-colors hover:bg-white/20",
            anchorClassName,
          )}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src={social.icon}
            className={iconClassName || "size-5"}
            unoptimized
            alt={social.label}
          />
          <span className="sr-only">{social.label}</span>
        </a>
      ))}
    </div>
  );
}
