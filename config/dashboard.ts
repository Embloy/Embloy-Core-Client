import { DashboardConfig } from "types"
import { siteConfig } from "./site"

export const dashboardConfig: DashboardConfig = {
  mainNav: [
    {
      title: "Developer",
      href: siteConfig.links.developer,
    },
    {
      title: "Support",
      href: "/support",
      disabled: true,
    },
  ],
  sidebarNav: [
    {
      title: "Upcoming Jobs",
      href: "/dashboard",
      icon: "post",
    },
    {
      title: "Applications",
      href: "/dashboard",
      icon: "post",
    },
    {
      title: "Preferences",
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
