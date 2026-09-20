"use client";

import Link from "@/components/progress-link";

type CategoriesTabBarProps = {
  tabs: { label: string; value: string }[];
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
};

export default function CategoriesTabBar({
  tabs,
  selectedTab,
  setSelectedTab,
}: CategoriesTabBarProps) {
  return (
    <nav className="border-gradient-t border-gradient-width-0.5 border-gradient-to-[#14141400] border-gradient-from-[#7A7A7A99] mx-4 flex items-center justify-start rounded-2xl bg-linear-to-t from-[#1A1A1A]/90 to-[#1A1A1A]/10 md:mx-auto md:w-fit">
      <ul
        role="tablist"
        className="no-scrollbar flex w-full items-center justify-start gap-6 overflow-x-scroll px-6 py-4 md:text-lg"
      >
        {tabs.map((tab) => (
          <li
            key={tab.label}
            role="tab"
            aria-controls={`${tab.label}-panel`}
            aria-selected={selectedTab === tab.value}
            className="hover:text-primary focus:text-primary aria-selected:text-primary text-nowrap aria-selected:font-semibold aria-selected:[&>a]:scale-105"
          >
            <Link
              href={`#${tab.value}`}
              className="flex items-center justify-center transition"
              replace
              scroll={false}
              onClick={() => setSelectedTab(tab.value)}
            >
              {tab.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
