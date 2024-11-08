import type { Icon } from "lucide-react"
import { Subscription } from "@/lib/api/subscription"
import { Icons } from "@/components/icons"

export type NavItem = {
  title: string
  href: string
  external?: boolean
  disabled?: boolean
  default?: string
}

export type MainNavItem = NavItem

export type SidebarNavItem = {
  title: string
  disabled?: boolean
  external?: boolean
  icon?: keyof typeof Icons
} & (
  | {
      href: string
      items?: never
    }
  | {
      href?: string
      items: NavLink[]
    }
)

export type SiteConfig = {
  name: string
  description: string
  url: string
  api_root_url: string
  api_url: string
  ogImage: string
  links: {
    twitter: string
    linkedin: string
    github: string
    developer: string
    about: string
    genius: string
    calendy: string,
    main: string,
    help: string,
    signup: string,
  }
}

export type MarketingConfig = {
  mainNav: MainNavItem[]
}

export type BoardConfig = {
  mainNav: MainNavItem[]
}

export type DashboardConfig = {
  mainNav: MainNavItem[]
  sidebarNav: SidebarNavItem[]
  sandboxSidebarNav: SidebarNavItem[]
}

export type SubscriptionPlan = {
  name: string
  internal_name: string
  description: string
  stripePriceId: string
}

export type ResourcesConfig = {
  mainNav: MainNavItem[]
  sidebarNav: SidebarNavItem[]
}

export type UserSubscriptionPlan = SubscriptionPlan & Subscription