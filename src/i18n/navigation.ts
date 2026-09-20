import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// `Link` is deliberately *not* exported under that name: every internal
// link should go through `@/components/progress-link`, which wraps this
// one so that clicking it drives the top-of-page navigation progress bar.
// Renaming it here makes `import { Link } from "@/i18n/navigation"` a type
// error rather than a link that silently shows no feedback.
export const {
  Link: IntlLink,
  redirect,
  usePathname,
  useRouter,
  getPathname,
} = createNavigation(routing);
