"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Separator } from "@radix-ui/react-select"
import { Icons } from "@/components/icons"
import { marketingConfig } from "@/config/marketing"
import { User, getCurrentUser } from "@/lib/api/session"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { LanguageToggle } from "@/components/language-toggle"
import { MainNav } from "@/components/main-nav"
import { ManualProxyForm } from "@/components/manual-proxy-form"
import { ModeToggle } from "@/components/mode-toggle"
import NotificationBell from "@/components/notification-bell"
import { SiteFooter } from "@/components/site-footer"
import { UserAccountNav } from "@/components/user-account-nav"
import { siteConfig } from "@/config/site"
import { Locale } from "../../../i18n-config"
import { getDictionary } from "../dictionaries"
import Loading from "../loading"

interface MarketingLayoutProps {
  children: React.ReactNode
  params: {
    lang: Locale
  }
}

export default function MarketingLayout({
  children,
  params: { lang },
}: MarketingLayoutProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [dict, setDict] = useState<Record<string, any> | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const refreshToken = searchParams.get("refresh_token")
  const noRedirect = searchParams.get("noredirect")
  const mode = searchParams.get("mode")
  const eType = searchParams.get("eType")

  useEffect(() => {
    const fetchDictionaryAndUser = async () => {
      const dictionary = await getDictionary(lang)
      setDict(dictionary)

      setIsLoading(true)
      const { response, err } = await getCurrentUser(refreshToken ?? undefined)

      if (response) {
        setUser(response)
        if (!noRedirect) {
          router.push(`/${lang}/dashboard/overview?mode=${mode}&eType=${eType}`)
        }
      }
      setIsLoading(false)
    }

    fetchDictionaryAndUser()
  }, [lang, refreshToken, noRedirect, router, mode, eType])

  if (isLoading) {
    return <Loading />
  }

  if (user) {
    return (
      dict && (
        <div className="flex min-h-screen flex-col">
          <header className="container top-0 z-40">
            <div className="flex h-16 items-center justify-between py-6">
              <MainNav
                items={marketingConfig.mainNav}
                params={{ lang: lang }}
              />
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
          <main className="flex-1">{children}</main>
          <SiteFooter className="border-t" params={{ lang: lang }} />
        </div>
      )
    )
  } else {
    return (
      dict && (
        <div className="flex min-h-screen flex-col">
          <header className="container z-40">
            <div className="flex h-16 w-full items-center justify-between py-4">
            <div className="flex w-8/12 flex-row items-center justify-start portrait:w-4/12">
            <Link
              href={`/${lang}?noredirect=1`}
              className=" mb-1 hidden w-2/12 items-center justify-start  space-x-1 md:flex"
            >
              <Icons.logo />
              <span className="underline-gradient mb-1 hidden text-xl font-bold sm:inline-block">
                {siteConfig.name.toLowerCase()}
              </span>
              
            </Link>
            <MainNav
                items={marketingConfig.mainNav}
                params={{ lang: lang }}
                className="w-9/12 items-center justify-start portrait:w-4/12 portrait:justify-start"
              />
            </div >
              
            <div className="flex w-4/12 flex-row items-center justify-end portrait:w-8/12">
                <div className="hidden md:flex">
                {
                  //TODO: Uncomment to enable language modes
                  /*
                  <LanguageToggle />
                  <Separator className="mx-1" />
                  */
                }
                  <ModeToggle params={{ lang: lang }} />
                  
                  
                </div>
                <nav>
                  {
                  //TODO: put inot marketing page
                  /*
                    <ManualProxyForm
                    params={{ lang: lang, mode: mode || "", eType: eType || "manual" }}
                  />
                  */}
                  
                  
                  <Link
                    href={`https://about.embloy.com/en/contact/`}
                    className={cn(
                      buttonVariants({ variant: "bold", size: "bold" }),
                      "ml-4 px-4 portrait:hidden"
                    )}
                  >
                    {dict.pages.add}
                  </Link>
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
          <main className="flex-1">{children}</main>
          <SiteFooter className="" params={{ lang: lang }} />
        </div>
      )
    )
  }
}
