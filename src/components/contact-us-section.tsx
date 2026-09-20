import footerImage from "@/../public/images/footer-image.webp";
import emailIcon from "@/../public/svg/email-icon.svg";
import facebookIcon from "@/../public/svg/facebook.svg";
import instagramIcon from "@/../public/svg/instagram.svg";
import linkedinIcon from "@/../public/svg/linkedin.svg";
import locationIcon from "@/../public/svg/location-icon.svg";
import mapImageAr from "@/../public/svg/map-ar.svg";
import mapImageEn from "@/../public/svg/map-en.svg";
import phoneIcon from "@/../public/svg/phone-icon.svg";
import xIcon from "@/../public/svg/x-icon.svg";
import ContactUsForm from "@/components/contact-us-form";
import GlassCard from "@/components/ui/glass-card";
import Logo from "@/components/ui/logo";
import Link from "@/components/progress-link";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import Image, { StaticImageData } from "next/image";
import { PropsWithChildren } from "react";

type ContactUsSectionProps = {
  isFooter?: boolean;
};

export default function ContactUsSection({
  isFooter = true,
}: ContactUsSectionProps) {
  const t = useTranslations("ContactUs");
  const common = useTranslations("Common");
  const projects = useTranslations("ProjectTitles");
  const locale = useLocale();

  return (
    <section className="relative pb-4">
      <div className="container grid grid-cols-1 gap-5 lg:grid-cols-2">
        <GlassCard
          disableGlow
          className="rounded-4xl backdrop-blur-lg lg:rounded-[3rem] lg:px-6 lg:py-5"
        >
          <ContactUsForm />
        </GlassCard>
        <div className="flex flex-col gap-5">
          <Card className="flex flex-col items-start justify-between gap-5 text-lg only:flex-grow [&_p]:text-[#9C9C9C]">
            <div className="flex flex-col gap-5 lg:flex-row lg:gap-5">
              <div className="flex items-center gap-3">
                <Icon src={phoneIcon} alt="Phone Icon" />
                <a
                  href={`tel:${siteConfig.phone}`}
                  dir="ltr"
                  className="text-nowrap text-[#9C9C9C]"
                >
                  {siteConfig.phone}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Icon src={emailIcon} alt="Email Icon" />
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="text-[#9C9C9C]"
                >
                  {siteConfig.email}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Icon src={locationIcon} alt="Location Icon" />
              <p>{t("location")}</p>
            </div>
            {!isFooter && (
              <Image
                src={locale === "ar" ? mapImageAr : mapImageEn}
                alt={common("jumeirah-map-location")}
                className="relative z-20 flex-grow rounded-4xl border border-[#4a4a4a] object-cover lg:rounded-[3rem]"
              />
            )}
          </Card>
          {isFooter && (
            <Card className="flex flex-grow flex-col justify-between gap-8 [&_li]:text-sm">
              <footer className="inline-flex flex-col items-center self-start text-center">
                <Logo wideLogo className="w-40 md:w-60 lg:w-52" />
              </footer>
              <nav className="grid grid-cols-2 gap-y-8 lg:grid-cols-4">
                <div className="flex-1 space-y-4">
                  <p className="font-semibold">{common("company")}</p>
                  <ul className="space-y-2 text-[#D2D2D2]">
                    <FooterLink href="/about">{common("about")}</FooterLink>
                    <FooterLink href="/contact">
                      {common("contact-us")}
                    </FooterLink>
                  </ul>
                </div>
                <div className="flex-1 space-y-4">
                  <p className="font-semibold">{common("projects")}</p>
                  <ul className="space-y-2 text-[#D2D2D2]">
                    <FooterLink href="/projects">
                      {common("all-projects")}
                    </FooterLink>
                    <FooterLink href="/projects/manarat-al-hudaydah">
                      {projects("manarat-al-hudaydah")}
                    </FooterLink>
                    <FooterLink href="/projects/sanaa-towers">
                      {projects("sanaa-towers")}
                    </FooterLink>
                    <FooterLink href="/projects/alhathaa-towers">
                      {projects("alhathaa-towers")}
                    </FooterLink>
                  </ul>
                </div>
                <div className="col-span-2 space-y-4">
                  <p className="font-semibold">{common("subscribe")}</p>
                  <p className="text-sm text-[#9C9C9C]">
                    {common("subscribe-description")}
                  </p>
                  <div className="flex items-center justify-center gap-3 pt-2 lg:justify-start lg:pt-12">
                    <SocialLink
                      href="https://www.linkedin.com/company/jumeirahye"
                      icon={linkedinIcon}
                      alt="LinkedIn"
                    />
                    <SocialLink
                      href="https://www.instagram.com/JumeirahYemen"
                      icon={instagramIcon}
                      alt="Instagram"
                    />
                    <SocialLink
                      href="https://www.x.com/JumeirahYemen"
                      icon={xIcon}
                      alt="X"
                    />
                    <SocialLink
                      href="https://www.facebook.com/JumeirahYemen"
                      icon={facebookIcon}
                      alt="Facebook"
                    />
                  </div>
                </div>
              </nav>
            </Card>
          )}
        </div>
      </div>
      {isFooter && (
        <>
          <Image
            src={footerImage}
            alt=""
            fill
            className="-z-[9999] object-cover object-bottom"
          />
          <div className="from-background absolute top-0 right-0 left-0 -z-50 h-full bg-linear-to-b via-90% to-[#00010100]" />
        </>
      )}
    </section>
  );
}

function Card({
  children,
  className,
}: { className?: string } & PropsWithChildren) {
  return (
    <GlassCard
      className={cn(
        "rounded-4xl p-6 backdrop-blur lg:rounded-[3rem] lg:p-8",
        className,
      )}
    >
      {children}
    </GlassCard>
  );
}

function Icon({ src, alt }: { src: StaticImageData; alt: string }) {
  return (
    <Image src={src} width={32} height={32} className="size-6" alt={alt} />
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link href={href} className="transition-colors hover:text-white">
        {children}
      </Link>
    </li>
  );
}

function SocialLink({
  href,
  icon,
  alt,
}: {
  href: string;
  icon: StaticImageData;
  alt: string;
}) {
  return (
    <Link
      href={href}
      aria-label={alt}
      className="inline-flex size-9 items-center justify-center rounded-full bg-white/10 backdrop-blur-lg transition hover:bg-white/30"
    >
      <Image src={icon} alt={alt} width={16} height={16} className="size-4" />
    </Link>
  );
}
