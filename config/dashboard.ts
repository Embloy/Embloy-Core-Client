import { DashboardConfig } from "types"

import { siteConfig } from "./site"

export const dashboardConfig: DashboardConfig = {
  mainNav: [
    {
      title: "Resources",
      href: "/resources",
      external: false,
    },
    {
      title: "Report an Issue",
      href: "/dashboard/report-an-issue",
      external: false,
    },
    {
      title: "Help",
      href: siteConfig.links.help,
      external: true,
    },
    {
      title: "Developers",
      href: siteConfig.links.developer,
      external: true,
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
