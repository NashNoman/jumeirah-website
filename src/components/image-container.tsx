import SettleImage from "@/components/settle-image";
import { cn } from "@/lib/utils";
import Image, { StaticImageData } from "next/image";
import { PropsWithChildren } from "react";

type ImageContainerProps = {
  className?: string;
  containerTag?: React.ElementType;
  imageClassName?: string;
  src: StaticImageData;
  alt?: string;
  fetchPriority?: "high" | "low";
  sizes?: string;
  /** Let the photo settle into the frame when the surrounding card reveals. */
  settle?: boolean;
} & PropsWithChildren;

export default function ImageContainer({
  className,
  containerTag: Tag = "div",
  imageClassName,
  src,
  alt = "",
  fetchPriority,
  sizes,
  settle = false,
  children,
}: ImageContainerProps) {
  const Img = settle ? SettleImage : Image;

  return (
    <Tag
      className={cn(
        "relative overflow-hidden rounded-4xl md:rounded-[3.5rem]",
        className,
      )}
    >
      <figure className="h-full">
        <Img
          src={src}
          alt={alt}
          aria-hidden
          className={cn(
            "top-0 right-0 bottom-0 left-0 -z-10 object-cover",
            imageClassName,
          )}
          sizes={
            sizes ??
            "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1536px) 40vw, 33vw"
          }
          loading={fetchPriority === "high" ? "eager" : "lazy"}
          fetchPriority={fetchPriority}
          priority={fetchPriority === "high"}
          // placeholder="blur"
          fill
        />
        <div
          aria-hidden
          className="!pointer-events-none absolute inset-0 -z-10 bg-linear-[208deg] from-zinc-900/0 to-zinc-900 opacity-60 rtl:bg-linear-[152deg]"
        />
        {children && <figcaption className="size-full">{children}</figcaption>}
      </figure>
    </Tag>
  );
}
