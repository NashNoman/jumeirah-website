"use client";

import { Project, ProjectData } from "@/data/types";
import { cn } from "@/lib/utils";
import { EmblaCarouselType, EmblaEventType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import GalleryFullscreenModal from "../components/gallery-fullscreen-modal";

const TWEEN_FACTOR_BASE = 0.2341;

const numberWithinRange = (number: number, min: number, max: number): number =>
  Math.min(Math.max(number, min), max);

export default function ImageGallerySection({
  projectData,
}: {
  projectData: ProjectData<Project>;
}) {
  const locale = useLocale();
  const t = useTranslations<Project>(projectData.projectKey);
  const ct = useTranslations("Common");
  const { imageGallerySection: imgs } = projectData;

  const initialGallery = useMemo(() => imgs?.[0], [imgs]);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
  const shouldScrollTabs = (imgs?.length ?? 0) > 2;
  const currentGallery = imgs?.[activeGalleryIndex];
  const [activeImage, setActiveImage] = useState(
    () => initialGallery?.images[0],
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    duration: 30,
    dragFree: true,
    align: "center",
    loop: true,
    direction: locale === "ar" ? "rtl" : "ltr",
    breakpoints: {
      "(min-width: 1024px)": {
        dragFree: false,
        loop: false,
        slidesToScroll: 1,
        align: "center",
        containScroll: false,
        skipSnaps: true,
      },
    },
  });

  // Reset carousel position and active image when switching galleries
  useEffect(() => {
    if (!currentGallery) return;
    setActiveImage(currentGallery.images[0]);

    if (emblaApi) {
      emblaApi.reInit();
      emblaApi.scrollTo(0, true);
    }
  }, [currentGallery, emblaApi]);

  const handleGalleryChange = (index: number) => {
    setActiveGalleryIndex(index);
  };

  useEffect(() => {
    if (initialGallery) {
      setActiveImage(initialGallery.images[0]);
    }
  }, [initialGallery]);

  const tweenFactor = useRef(0);
  const tweenNodes = useRef<HTMLElement[]>([]);

  const onSelect = useCallback(
    (emblaApi: EmblaCarouselType) => {
      if (!currentGallery) return;
      const index = emblaApi.selectedScrollSnap();
      setActiveImage(currentGallery.images[index]);
    },
    [currentGallery],
  );

  const setTweenNodes = useCallback((emblaApi: EmblaCarouselType): void => {
    tweenNodes.current = emblaApi.slideNodes().map((slideNode) => {
      return slideNode.querySelector(".embla__slide__number") as HTMLElement;
    });
  }, []);

  const setTweenFactor = useCallback((emblaApi: EmblaCarouselType) => {
    tweenFactor.current = TWEEN_FACTOR_BASE * emblaApi.scrollSnapList().length;
  }, []);

  const tweenScale = useCallback(
    (emblaApi: EmblaCarouselType, eventName?: EmblaEventType) => {
      const engine = emblaApi.internalEngine();
      const scrollProgress = emblaApi.scrollProgress();
      const slidesInView = emblaApi.slidesInView();
      const isScrollEvent = eventName === "scroll";

      emblaApi.scrollSnapList().forEach((scrollSnap, snapIndex) => {
        let diffToTarget = scrollSnap - scrollProgress;
        const slidesInSnap = engine.slideRegistry[snapIndex];

        slidesInSnap.forEach((slideIndex) => {
          if (isScrollEvent && !slidesInView.includes(slideIndex)) return;

          if (engine.options.loop) {
            engine.slideLooper.loopPoints.forEach((loopItem) => {
              const target = loopItem.target();

              if (slideIndex === loopItem.index && target !== 0) {
                const sign = Math.sign(target);

                if (sign === -1) {
                  diffToTarget = scrollSnap - (1 + scrollProgress);
                }
                if (sign === 1) {
                  diffToTarget = scrollSnap + (1 - scrollProgress);
                }
              }
            });
          }

          const tweenValue = 1 - Math.abs(diffToTarget * tweenFactor.current);
          const scale = numberWithinRange(tweenValue, 0.8, 1).toString();
          const tweenNode = tweenNodes.current[slideIndex];
          if (tweenNode) {
            tweenNode.style.transform = `scale(${scale})`;
          }
        });
      });
    },
    [],
  );

  useEffect(() => {
    if (!emblaApi) return;

    setTweenNodes(emblaApi);
    setTweenFactor(emblaApi);
    tweenScale(emblaApi);
    onSelect(emblaApi);

    emblaApi
      .on("reInit", setTweenNodes)
      .on("reInit", setTweenFactor)
      .on("reInit", tweenScale)
      .on("scroll", tweenScale)
      .on("slideFocus", tweenScale)
      .on("select", onSelect);
  }, [emblaApi, tweenScale, onSelect]);

  if (!imgs || imgs.length === 0 || !currentGallery || !activeImage) {
    return null;
  }

  return (
    <section className="relative overflow-hidden py-10">
      {/* Background Preview — decorative, below the fold; never the LCP
          candidate, so it must not compete with the real one for priority. */}
      <Image
        src={activeImage.src}
        alt={t(activeImage.alt)}
        fill
        sizes="100vw"
        className="object-cover opacity-40 transition-all duration-700"
      />
      <div className="from-background to-background/20 via-background/80 absolute inset-0 bg-linear-to-t" />

      {/* Gallery Tabs */}
      <div className="container">
        <div className="relative z-40 mx-auto mb-8 rounded-2xl bg-black/60 p-2 backdrop-blur-lg lg:mb-12 lg:inline-block">
          {shouldScrollTabs ? (
            <div
              className="fade-x w-full lg:px-3 lg:mask-none"
              style={{ "--fade-start": "3%", "--fade-end": "97%" } as React.CSSProperties}
            >
              <div className="flex w-full gap-2 overflow-x-auto px-2 no-scrollbar lg:gap-4 lg:px-0">
                {imgs!.map((gallery, index) => (
                  <button
                    key={gallery.title}
                    onClick={() => handleGalleryChange(index)}
                    className={cn(
                      "z-10 shrink-0 cursor-pointer whitespace-nowrap rounded-xl px-4 py-2 font-bold transition-all",
                      activeGalleryIndex === index
                        ? "bg-[#616161] text-white"
                        : "text-[#D9D9D9] hover:bg-white/10 hover:text-white",
                    )}
                  >
                    {t(gallery.title)}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex w-full gap-4">
              {imgs!.map((gallery, index) => (
                <button
                  key={gallery.title}
                  onClick={() => handleGalleryChange(index)}
                  className={cn(
                    "z-10 flex-1 shrink-0 cursor-pointer rounded-xl px-4 py-2 font-bold transition-all lg:whitespace-nowrap",
                    activeGalleryIndex === index
                      ? "bg-[#616161] text-white"
                      : "text-[#D9D9D9] hover:bg-white/10 hover:text-white",
                  )}
                >
                  {t(gallery.title)}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col-reverse gap-12">
        {/* Gallery Header */}
        <div className="lg:start from-background to-background/0 via-background/5 z-30 lg:pointer-events-none lg:absolute lg:flex lg:size-full lg:items-center lg:bg-linear-to-r lg:pt-28 lg:rtl:bg-linear-to-l">
          <div className="container mx-3 space-y-2 text-center lg:text-start">
            <h2 className="text-3xl font-bold lg:max-w-xs lg:text-4xl lg:leading-tight">
              {t.rich(currentGallery.headingTitle, {
                span: (s) => <span className="text-primary">{s}</span>,
              })}
            </h2>
            <p className="text-[#a0a0a0] lg:max-w-sm lg:text-lg">
              {t(currentGallery.headingSubtitle)}
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-primary pointer-events-auto mt-6 cursor-pointer rounded-full px-6 py-2 text-lg font-bold text-black transition-all hover:brightness-75 active:scale-95 active:brightness-75 lg:mt-8"
            >
              {ct("view-gallery")}
            </button>
          </div>
        </div>

        {/* Image Thumbnails Carousel */}
        <div className="embla__viewport relative z-10 w-full" ref={emblaRef}>
          <div className="embla__container flex">
            {currentGallery.images.map((img, index) => (
              <div
                key={img.alt}
                className="embla__slide relative -m-2 min-w-0 shrink-0 justify-center"
              >
                <div className="embla__slide__number flex items-center justify-center will-change-transform">
                  <Image
                    className="aspect-9/16 w-60 overflow-hidden rounded-4xl border-2 border-white/10 object-cover shadow-2xl"
                    src={img.src}
                    alt={t(img.alt)}
                    sizes="(min-width: 1280px) 270px, (min-width: 1024px) 240px, (min-width: 768px) 200px, 70vw"
                    // width={240}
                    // height={427}
                    placeholder="blur"
                    loading={index < 3 ? "eager" : "lazy"}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gallery Modal */}
      {isModalOpen && (
        <GalleryFullscreenModal
          sections={imgs.map((gallery) => ({
            title: t(gallery.title),
            images: gallery.images.map((img) => ({
              image: img.src,
              alt: t(img.alt),
            })),
          }))}
          initialSectionIndex={activeGalleryIndex}
          initialImageIndex={0}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </section>
  );
}
