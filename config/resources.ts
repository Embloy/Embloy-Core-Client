import { ResourcesConfig } from "types"

export const resourcesConfig: ResourcesConfig = {
  mainNav: [
    {
      title: "Resources",
      href: "/resources",
    }
  ],
  sidebarNav: [
    {
      title: "OVERVIEW",
      items: [
        {
          title: "Introduction",
          href: "/resources",
        }
      ],
    },
    {
      title: "LEGAL RESOURCES",
      items: [
        {
          title: "Security",
          href: "/resources/security",
        },
        {
          title: "AUP",
          href: "/resources/aup",
        },
        {
          title: "Terms of Service",
          href: "/resources/terms",
        },
        {
          title: "Privacy Policy",
          href: "/resources/privacy",
        },
        {
          title: "Cookies",
          href: "/resources/cookies",
        },
        {
          title: "Imprint",
          href: "/resources/imprint",
        },
      ],
    },
    {
      title: "DOCUMENTATION",
      items: [
        {
          title: "Developer documentation",
          href: "https://developers.embloy.com",
          external: true,
        },
        {
          title: "API documentation",
          href: "https://docs.embloy.com",
          external: true,
        },
        {
          title: "Postman collection",
          href: "https://postman.com/embloy",
          external: true,
        },
        {
          title: "System Status",
          href: "https://status.embloy.com",
          external: true,
        }
      ],
    },
    {
      title: "CONTACT US",
      items: [
        {
          title: "Contact Forms",
          href: "https://about.embloy.com/en/contact",
          external: true,
        },
        {
          title: "Help overview",
          href: "https://about.embloy.com/en/contact",
          external: true,
        },
        {
          title: "GitHub",
          href: "https://github.com/embloy",
          external: true,
        },
        {
          title: "LinkedIn",
          href: "https://linkedin.com/company/embloy",
          external: true,
        },
        {
          title: "Twitter",
          href: "https://twitter.com/embloy",
          disabled: true,
          external: true,
        },
        {
          title: "Instagram",
          href: "https://instagram.com/embloy",
          disabled: true,
          external: true,
        },
      ],
    },
  ],
}