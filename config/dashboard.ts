import { DashboardConfig } from "types"
import { siteConfig } from "./site"

export const dashboardConfig: DashboardConfig = {
  mainNav: [
    {
      title: "Employers",
      href: siteConfig.links.genius,
    },
    {
      title: "Developers",
      href: siteConfig.links.developer,
    },
    {
      title: "About",
      href: siteConfig.links.about,
    },
  ],
  sidebarNav: [
    {
      title: "Dashboard",
      href: "/dashboard",
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
