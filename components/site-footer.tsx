import * as React from "react"
import { useEffect, useState } from "react"
import { Locale } from "@/i18n-config"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { ModeToggle } from "@/components/mode-toggle"
import { getDictionary } from "@/app/[lang]/dictionaries"

import { LanguageToggle } from "./language-toggle"

interface FooterProps extends React.HTMLAttributes<HTMLElement> {
  className: string
  params: {
    lang: Locale
  }
}

export function SiteFooter({ className, params: { lang } }: FooterProps) {
  const [dict, setDict] = useState<Record<string, any> | null>(null)

  useEffect(() => {
    const fetchDictionary = async () => {
      const dictionary = await getDictionary(lang)
      setDict(dictionary)
    }
    fetchDictionary()
  }, [lang])

  return (
    dict && (
      <footer className={cn(className)}>
        <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-16 md:flex-row md:py-0">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <Icons.logo />
            <p className="text-center text-sm leading-loose md:text-left">
              {dict.marketing.copyright}
            </p>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              gap: "10px",
            }}
          >
            <p className="m-1 text-center text-sm leading-loose md:text-left">
              <a href={`/${lang}/resources/terms#cookies`} className="text-muted-foreground hover:text-foreground">
              {dict.resources["Cookies"].title}
              </a>
            </p>
            <p className="m-1 text-center text-sm leading-loose md:text-left">
              <a href={`/${lang}/resources/privacy`} className="text-muted-foreground hover:text-foreground">
              {dict.resources["Privacy Policy"].title}
              </a>
            </p>
            <p className="m-1 text-center text-sm leading-loose md:text-left">
              <a href={`/${lang}/resources/terms`} className="text-muted-foreground hover:text-foreground">
              {dict.resources["Terms of Service"].title}
              </a>
            </p>
            <p className="m-1 text-center text-sm leading-loose md:text-left">
              <a href={siteConfig.links.about} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground">
              {dict.resources.aboutEmbloy}
              </a>
            </p>
            <LanguageToggle />
            <ModeToggle params={{ lang: lang }} />
          </div>
        </div>
      </footer>
    )
  )
}
