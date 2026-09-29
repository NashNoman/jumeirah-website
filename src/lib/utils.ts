import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * `name` fields in the data layer (e.g. "Model <span>A</span>", or
 * "Model T <i>(Duplex)</i>" for duplex units) carry inline markup meant for
 * `t.rich()` — a `span` for the letter-highlight style, sometimes an `i`
 * for an annotation. Anywhere that only needs plain text (schema.org
 * fields, the specifications sheet's <summary>/<h3>), strip every tag
 * rather than just "span": a partial strip leaves the rest as literal,
 * React-escaped text ("Model T &lt;i&gt;(Duplex)&lt;/i&gt;" on the page).
 */
export function stripInlineMarkup(value: string): string {
  return value.replace(/<\/?[a-z]+>/gi, "").trim();
}
