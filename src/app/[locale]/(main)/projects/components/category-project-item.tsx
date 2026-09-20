import GotoIcon from "@/components/goto-icon";
import Link from "@/components/progress-link";
import Image, { StaticImageData } from "next/image";

type CategoryProjectItemProps = {
  title: string;
  status: string;
  img: StaticImageData;
  href: string;
};

export default function CategoryProjectItem({
  title,
  status,
  img,
  href,
}: CategoryProjectItemProps) {
  return (
    <Link href={href}>
      <figure className="relative">
        <div className="relative h-[28rem] overflow-hidden rounded-[3rem] md:rounded-[3.5rem]">
          <div className="absolute inset-0 top-0 right-0 bottom-0 left-0 z-10 size-full bg-linear-[17deg] from-[#000101] to-[#000101]/0 opacity-20 transition-opacity hover:opacity-20 lg:opacity-60 rtl:bg-linear-[343deg]" />
          <Image
            src={img}
            className="-z-10 object-cover"
            alt={title}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            fill
          />
        </div>
        <figcaption className="mt-4">
          <div className="flex items-center justify-center gap-2 px-8 lg:px-2">
            <GotoIcon className="size-9 lg:size-11 lg:p-1.5" alt="" />
            <div className="border-gradient-to-e border-gradient-from-[#7A7A7A99] border-gradient-to-[#14141400] border-gradient-width-0.5 grow rounded-2xl bg-linear-to-r from-[#1A1A1AE6] to-[#1A1A1A10] p-2 text-center text-lg lg:text-xl rtl:bg-linear-to-r">
              <h3 className="first-letter-primary-or-clip mx-auto w-fit">
                {title}
              </h3>
            </div>
          </div>
          <p className="bg-glass absolute start-7 top-5 z-20 self-start rounded-2xl border border-white/30 bg-black/20 px-3 py-1 text-xs text-[#dadada]">
            {status}
          </p>
        </figcaption>
      </figure>
    </Link>
  );
}
