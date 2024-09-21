"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams, useSelectedLayoutSegment } from "next/navigation"

import { MainNavItem } from "types"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { MobileNav } from "@/components/mobile-nav"
import { getDictionary } from "@/app/[lang]/dictionaries"

import { Locale } from "../i18n-config"
import { ManualProxyForm } from "./manual-proxy-form"

interface MainNavProps {
  items?: MainNavItem[]
  children?: React.ReactNode
  params: {
    lang: Locale
  }
  excludeLogo?: boolean
  retractHeader?: boolean
}

export function MainNav({
  items,
  children,
  params: { lang },
  excludeLogo = false,
  retractHeader = false,
}: MainNavProps) {
  const segment = useSelectedLayoutSegment()
  const [showMobileMenu, setShowMobileMenu] = React.useState<boolean>(false)
  const [dict, setDict] = useState<Record<string, any> | null>(null)
  const searchParams = useSearchParams()
  const mode = searchParams.get("mode")
  const eType = searchParams.get("eType")

  useEffect(() => {
    const fetchDictionary = async () => {
      const dictionary = await getDictionary(lang)
      setDict(dictionary)
    }

    fetchDictionary()
  }, [lang])

  return (
    dict && (
      <div className={cn("flex md:gap-10", cn)}>
        {!excludeLogo && (
          <Link
            href={`/${lang}?noredirect=1`}
            className={cn(
              "mb-1 hidden justify-center space-x-1 portrait:justify-start",
              retractHeader ? "xl:flex" : "md:flex"
            )}
          >
            <Icons.logo />
            <span className="underline-gradient mb-1 hidden text-xl font-bold sm:inline-block">
              {siteConfig.name.toLowerCase()}
            </span>
          </Link>
        )}
        {items?.length ? (
          <nav
            className={cn(
              "mb-1 hidden gap-6",
              retractHeader ? "xl:flex" : "md:flex"
            )}
          >
            {items?.map((item, index) => (
              <Link
                key={index}
                target={
                  item.external || item.href.startsWith("mailto:")
                    ? "_blank"
                    : undefined
                }
                href={
                  item.disabled
                    ? "#"
                    : `${item.href.startsWith("/") ? `/${lang}` : ""}${
                        item.href
                      }`
                }
                className={cn(
                  "text-md flex items-center transition-colors hover:rounded hover:bg-muted ",
                  item.href.startsWith(`/${segment}`)
                    ? "rounded bg-muted p-1 text-accent-foreground"
                    : "p-1 text-foreground",
                  item.disabled && "cursor-not-allowed opacity-80"
                )}
              >
                {dict.nav.main[item.title.toLowerCase()]}
                {excludeLogo && item.external && (
                  <Icons.externalLink className="ml-1" />
                )}
              </Link>
            ))}
          </nav>
        ) : null}
        <button
          className={cn(
            "flex items-center space-x-2",
            retractHeader ? "xl:hidden" : "md:hidden"
          )}
          onClick={() => setShowMobileMenu(!showMobileMenu)}
        >
          {showMobileMenu ? <Icons.close /> : <Icons.logo />}
          <span className="font-bold">{dict.nav.menu}</span>
        </button>
        {showMobileMenu && items && (
          <MobileNav
            items={items}
            params={{ lang: lang }}
            excludeLogo={excludeLogo}
            retractHeader={retractHeader}
          >
            {children}
            <ManualProxyForm
              params={{ lang: lang, mode: mode, eType: eType }}
            />
          </MobileNav>
        )}
      </div>
    )
  )
}
