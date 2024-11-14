"use client"
import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { User, getCurrentUser } from "@/lib/api/session"
import Loading from "../../../loading"
import { getDictionary } from "../../../dictionaries"
import Link from "next/link"
import { ManualProxyForm } from "@/components/manual-proxy-form"
import { MainNav } from "@/components/main-nav"
import { boardConfig } from "@/config/board"
import { Locale } from "@/i18n-config"
import { LanguageToggle } from "@/components/language-toggle"
import { Separator } from "@radix-ui/react-select"
import { ModeToggle } from "@/components/mode-toggle"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { SiteFooter } from "@/components/site-footer"
import React from "react"

interface boardLayoutProps {
    children: React.ReactNode
    params: {
      lang: Locale
    }
  }
  
export interface BoardChildComponentProps {
  excludeHeader?: boolean
  excludeFooter?: boolean
}

export default function BoardLayout({ children, params: { lang } }: boardLayoutProps) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [dict, setDict] = useState<Record<string, any> | null>(null)
    const router = useRouter()
    const searchParams = useSearchParams()
    const refreshToken = searchParams.get("refresh_token")
    const noRedirect = searchParams.get("noredirect")
    const mode = searchParams.get("mode")
    const eType = searchParams.get("eType")
    const excludeHeader = searchParams.get("exclude_header") === "true"
    const excludeFooter = searchParams.get("exclude_footer") === "true"

    useEffect(() => {
      const fetchDictionaryAndUser = async () => {
        const dictionary = await getDictionary(lang)
        setDict(dictionary)
  
        setIsLoading(true)
        const { response, err } = await getCurrentUser(refreshToken ?? undefined)
  
        if (response) {
          setUser(response)
        }
        setIsLoading(false)
      }
  
      fetchDictionaryAndUser()
    }, [lang, refreshToken])
    
    if (isLoading) {
      return <Loading />
    } 
    if (user){

    } else {
      return (dict && (
        <div className="flex min-h-screen flex-col">
          {!excludeHeader && (
            <header className="container z-40">
              <div className="flex h-16 w-full items-center justify-between py-4">
                <div className="flex w-8/12 flex-row items-center justify-start portrait:w-4/12">
                  <MainNav
                    items={boardConfig.mainNav}
                    params={{ lang: lang }}
                    retractHeader={true}
                  />
                </div>
                <div className="flex w-4/12 flex-row items-center justify-end portrait:w-8/12">
                  <div className="hidden md:flex">
                    <LanguageToggle />
                    <Separator className="mx-1" />
                    <ModeToggle params={{ lang: lang }} />
                  </div>
                  <nav className="flex items-center space-x-4">
                    <Link
                      href={`https://about.embloy.com/en/contact/`}
                      className={cn(
                        buttonVariants({ variant: "bold", size: "bold" }),
                        "ml-4 hidden px-4 text-center md:flex"
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
                        "px-4"
                      )}
                    >
                      {dict.pages.login}
                    </Link>
                  </nav>
                </div>
              </div>
            </header>
          )}
          <main className="flex-1">
            {React.cloneElement(children as React.ReactElement<any>, { excludeHeader, excludeFooter })}
          </main>
          {!excludeFooter && <SiteFooter className="" params={{ lang: lang }} />}
        </div>
      ))
  }
} 
  