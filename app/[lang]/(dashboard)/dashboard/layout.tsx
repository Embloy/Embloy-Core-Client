"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Separator } from "@radix-ui/react-select"

import { dashboardConfig } from "@/config/dashboard"
import { siteConfig } from "@/config/site"
import { User, getCurrentUser } from "@/lib/api/session"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"
import { LanguageToggle } from "@/components/language-toggle"
import { MainNav } from "@/components/main-nav"
import { ModeToggle } from "@/components/mode-toggle"
import { DashboardNav } from "@/components/nav"
import NotificationBell from "@/components/notification-bell"
import { SiteFooter } from "@/components/site-footer"
import { UserAccountNav } from "@/components/user-account-nav"

import { Locale } from "../../../../i18n-config"
import { getDictionary } from "../../dictionaries"

interface DashboardLayoutProps {
  children?: React.ReactNode
  params: {
    lang: Locale
  }
}

export default function DashboardLayout({
  children,
  params: { lang },
}: DashboardLayoutProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [dict, setDict] = useState<Record<string, any> | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchDictionaryAndUser = async () => {
      const dictionary = await getDictionary(lang)
      setDict(dictionary)

      setIsLoading(true)
      const { response, err } = await getCurrentUser()
      setIsLoading(false)

      if (dict && (err || !response)) {
        router.push(`/${lang}/login`)
        return toast({
          title: dict.errors[err || "500"].title || dict.errors.generic.title,
          description:
            dict.errors[err || "500"].description ||
            dict.errors.generic.description,
          variant: "destructive",
        })
      } else {
        setUser(response)
      }
    }

    fetchDictionaryAndUser()
  }, [lang, dict, router])

  if (isLoading) {
    return null
  }

  return (
    dict &&
    user && (
      <div className="flex min-h-screen flex-col space-y-6">
        <header className="sticky top-0 z-40  bg-background">
          <div className="container flex h-16 items-center justify-between py-4">
            <div className="flex items-center">
              <Link
                href={`/${lang}?noredirect=1`}
                className="mb-1 hidden items-center space-x-1  md:flex"
              >
                <Icons.logo />
                <span className="underline-gradient mb-1 hidden text-xl font-bold sm:inline-block">
                  {siteConfig.name.toLowerCase()}
                </span>
              </Link>
            </div>
            <div className="flex flex-1 justify-center">
              <MainNav
                items={dashboardConfig.mainNav}
                params={{ lang: lang }}
                excludeLogo={true}
              />
            </div>
            <div className="ml-auto flex items-center">
              <div className="mx-6 md:flex">
                <div className="hidden md:flex">
                  <LanguageToggle />
                  <Separator className="mx-1" />
                  <ModeToggle params={{ lang: lang }} />
                </div>
                <Separator className="mx-1" />
                <NotificationBell params={{ lang: lang }} />
              </div>
              <UserAccountNav
                user={{
                  first_name: `${user.first_name}`,
                  last_name: `${user.last_name}`,
                  image_url: user.image_url,
                  email: user.email,
                }}
                params={{ lang: lang }}
              />
            </div>
          </div>{" "}
        </header>
        <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr]">
          <aside className="hidden w-[200px] flex-col md:flex">
            <DashboardNav
              items={dashboardConfig.sidebarNav}
              params={{ lang: lang }}
            />
          </aside>
          <main className="flex w-full flex-1 flex-col overflow-hidden">
            {children}
          </main>
        </div>
        <SiteFooter id="footer" className="border-t" params={{ lang: lang }} />
      </div>
    )
  )
}
