import { MarketingConfig } from "types"
import { siteConfig } from "./site"

export const marketingConfig: MarketingConfig = {
  mainNav: [
    {
      title: "Features",
      href: "/#features",
    },
    {
      title: "Pricing",
      href: "/pricing",
    },
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
}
