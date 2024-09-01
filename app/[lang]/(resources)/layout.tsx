"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Locale } from "@/i18n-config"
import { Separator } from "@radix-ui/react-dropdown-menu"

import { marketingConfig } from "@/config/marketing"
import { resourcesConfig } from "@/config/resources"
import { User, getCurrentUser } from "@/lib/api/session"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { LanguageToggle } from "@/components/language-toggle"
import { MainNav } from "@/components/main-nav"
import { ManualProxyForm } from "@/components/manual-proxy-form"
import { ModeToggle } from "@/components/mode-toggle"
import NotificationBell from "@/components/notification-bell"
import { ResourcesSidebarNav } from "@/components/sidebar-nav"
import { SiteFooter } from "@/components/site-footer"
import { UserAccountNav } from "@/components/user-account-nav"

import { getDictionary } from "../dictionaries"
import Loading from "../loading"

interface ResourcesLayoutProps {
  children: React.ReactNode
  params: {
    lang: Locale
  }
}

export default function ResourcesLayout({
  children,
  params: { lang },
}: ResourcesLayoutProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [dict, setDict] = useState<Record<string, any> | null>(null)
  const searchParams = useSearchParams()
  const mode = searchParams.get("mode")
  const eType = searchParams.get("eType")
  console.log({ mode, eType })

  useEffect(() => {
    const fetchDictionaryAndUser = async () => {
      const dictionary = await getDictionary(lang)
      setDict(dictionary)

      setIsLoading(true)
      const { response } = await getCurrentUser()
      setIsLoading(false)

      if (response) {
        setUser(response)
      }
    }

    fetchDictionaryAndUser()
  }, [lang, dict])

  if (isLoading) {
    return <Loading />
  }

  if (user) {
    return (
      dict && (
        <div className="flex min-h-screen flex-col">
          <header className="sticky top-0 z-40 w-full border-b bg-background">
            <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
              <MainNav items={marketingConfig.mainNav} params={{ lang: lang }}>
                <ResourcesSidebarNav
                  items={resourcesConfig.sidebarNav}
                  params={{ lang: lang }}
                />
              </MainNav>
              <div className="flex items-center">
                <div className="mx-6 md:flex">
                  <div className="hidden md:flex">
                    {
                      //TODO: Uncomment to enable language modes
                      /*
                      <LanguageToggle />
                      */
                    }
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
            </div>
          </header>
          <div className="container flex-1">{children}</div>
          <SiteFooter className="border-t" params={{ lang: lang }} />
        </div>
      )
    )
  } else {
    return (
      dict && (
        <div className="flex min-h-screen flex-col">
          <header className="sticky top-0 z-40 w-full border-b bg-background">
            <div className="container flex h-16 items-center justify-between space-x-4 sm:space-x-0">
              <MainNav
                items={marketingConfig.mainNav}
                params={{ lang: lang }}
              />
              <div className="flex items-center">
                <div className="mx-6 hidden md:flex">
                  {
                    //TODO: Uncomment to enable language modes
                    /*
                    <LanguageToggle />
                    */
                  }
                  <Separator className="mx-1" />
                  <ModeToggle params={{ lang: lang }} />
                </div>
                <nav>
                  <ManualProxyForm
                    params={{
                      lang: lang,
                      mode: mode,
                      eType: eType,
                    }}
                  />
                  <Link
                    href={`/${lang}/login`}
                    className={cn(
                      buttonVariants({ variant: "bold", size: "bold" }),
                      "ml-4 px-4"
                    )}
                  >
                    {dict.pages.login}
                  </Link>
                </nav>
              </div>
            </div>
          </header>
          <div className="container flex-1">{children}</div>
          <SiteFooter className="border-t" params={{ lang: lang }} />
        </div>
      )
    )
  }
}
