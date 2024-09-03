import { MarketingConfig } from "types"

import { siteConfig } from "./site"

export const marketingConfig: MarketingConfig = {
  mainNav: [
    /*
    {
      title: "Why Embloy?",
      href: "https://about.embloy.com/en/why-embloy",
    },
    {
      title: "Small Business",
      href: "https://about.embloy.com/en/business/qr-applications",
    },
    {
      title: "Enterprise",
      href: "https://about.embloy.com/en/business/application-gateway",
    },
       
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
    */
    {
      title: "Job Application Portal",
      href: siteConfig.links.main,
      default: "",
    },
    {
      title: "How it works",
      href: siteConfig.links.about,
      external: true,
      default: "about",
    },
    {
      title: "For Companies",
      href: siteConfig.links.about,
      external: true,
      default: "about",
    },
    {
      title: "Resources",
      href: "/resources",
      default: "about",
    },
  ],
}
