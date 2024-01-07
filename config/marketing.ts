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
      title: "Genius",
      href: siteConfig.links.genius,
    },
    {
      title: "Blog",
      href: `${ siteConfig.links.developer }/blog`,
    },
    {
      title: "Developer",
      href: siteConfig.links.developer,
    },
  ],
}
