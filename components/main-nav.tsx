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
import { ReportAnIssue } from "./report-an-issue"

interface MainNavProps {
  items?: MainNavItem[]
  children?: React.ReactNode
  params: {
    lang: Locale
  }
  excludeLogo?: boolean
}

export function MainNav({
  items,
  children,
  params: { lang },
  excludeLogo = false,
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
            className="mb-1 hidden items-center space-x-1 md:flex"
          >
            <Icons.logo />
            <span className="underline-gradient mb-1 hidden text-xl font-bold sm:inline-block">
              {siteConfig.name.toLowerCase()}
            </span>
          </Link>
        )}
        {items?.length ? (
          <nav className="mb-1 hidden gap-6 md:flex">
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
                  <svg
                    width="24px"
                    height="24px"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="Interface / External_Link">
                      <path
                        id="Vector"
                        d="M10.0002 5H8.2002C7.08009 5 6.51962 5 6.0918 5.21799C5.71547 5.40973 5.40973 5.71547 5.21799 6.0918C5 6.51962 5 7.08009 5 8.2002V15.8002C5 16.9203 5 17.4801 5.21799 17.9079C5.40973 18.2842 5.71547 18.5905 6.0918 18.7822C6.5192 19 7.07899 19 8.19691 19H15.8031C16.921 19 17.48 19 17.9074 18.7822C18.2837 18.5905 18.5905 18.2839 18.7822 17.9076C19 17.4802 19 16.921 19 15.8031V14M20 9V4M20 4H15M20 4L13 11"
                        stroke="#000000"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </g>
                  </svg>
                )}
              </Link>
            ))}
          </nav>
        ) : null}
        <button
          className="flex items-center space-x-2 md:hidden"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
        >
          {showMobileMenu ? <Icons.close /> : <Icons.logo />}
          <span className="font-bold">{dict.nav.menu}</span>
        </button>
        {showMobileMenu && items && (
          <MobileNav items={items} params={{ lang: lang }}>
            {children}
            <ManualProxyForm
              params={{ lang: lang, mode: mode, eType: eType }}
            />
            <ReportAnIssue />
          </MobileNav>
        )}
      </div>
    )
  )
}
