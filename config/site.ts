export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "timeline-planner",
  description: "Planner based on timeline, made with Next.js + HeroUI.",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Entities",
      href: "/entities",
    },
    {
      label: "Events",
      href: "/events",
    }
  ],
  links: {
    github: "https://github.com/lz947/timeline-planner"
  },
};
