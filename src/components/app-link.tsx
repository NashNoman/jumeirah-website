import Link from "@/components/progress-link";
import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import React from "react";

// One transition list for both variants (tailwind-merge used to drop the
// scale transition from the outline variant, so its press snapped). Press
// goes down fast and releases slowly.
const appLinkVariants = cva(
  "rounded-full z-40 px-5 py-3 transition-[color,background-color,filter,scale] duration-350 ease-glide active:scale-[0.97] active:duration-120 active:ease-out lg:px-7 lg:py-3",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-black hover:brightness-110 focus:brightness-110 hover:drop-shadow-md hover:drop-shadow-[0_0_5px_#ffcb05] focus:drop-shadow-[0_0_5px_#ffcb05] hover:text-black/70 focus:text-black/70",
        outline:
          "bg-glass border border-white/30 bg-white/5 !backdrop-blur-lg hover:bg-white/20 focus:bg-white/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export default function AppLink({
  href,
  children,
  variant,
  className,
}: React.ComponentProps<typeof Link> & VariantProps<typeof appLinkVariants>) {
  return (
    <Link href={href} scroll>
      <div className={cn(appLinkVariants({ variant }), className)}>
        {children}
      </div>
    </Link>
  );
}
