import { DashboardConfig } from "types"
import { siteConfig } from "./site"

export const dashboardConfig: DashboardConfig = {
  mainNav: [
    {
      title: "Employers",
      href: siteConfig.links.genius,
      external: true,
    },
    {
      title: "Developers",
      href: siteConfig.links.developer,
      external: true,
    },
    {
      title: "Resources",
      href: "/resources",
    },
    {
      title: "About",
      external: true,
      href: siteConfig.links.about,
    },
  ],
  sidebarNav: [
    {
      title: "Dashboard",
      href: "/dashboard/overview",
      icon: "laptop",
    },
    {
      title: "Upcoming Jobs",
      href: "/dashboard/upcoming-jobs",
      icon: "timer",
    },
    {
      title: "Applications",
      href: "/dashboard/applications",
      icon: "post",
    },
    {
      title: "Billing",
      href: "/dashboard/billing",
      icon: "billing",
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: "settings",
    },
  ],
}
