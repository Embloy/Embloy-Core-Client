import * as React from "react"
import { useEffect, useState } from "react"
import Link from "next/link"

import { MainNavItem } from "types"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { useLockBody } from "@/hooks/use-lock-body"
import { Icons } from "@/components/icons"
import { getDictionary } from "@/app/[lang]/dictionaries"

import { Locale } from "../i18n-config"

interface MobileNavProps {
  items: MainNavItem[]
  children?: React.ReactNode
  params: {
    lang: Locale
  }
  excludeLogo?: boolean
}

export function MobileNav({
  items,
  children,
  params: { lang },
  excludeLogo = false,
}: MobileNavProps) {
  useLockBody()
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
      <div
        className={cn(
          "fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-auto bg-background/80 p-6 pb-32 shadow-md backdrop-blur-sm animate-in slide-in-from-bottom-80 md:hidden"
        )}
      >
        <div className="relative z-20 grid gap-6 rounded-md border bg-popover p-4 text-popover-foreground shadow-md">
          {!excludeLogo && (
            <Link
              href={`/${lang}?noredirect=1`}
              className="flex items-center space-x-2"
            >
              <Icons.logo />
              <span className="underline-gradient text-xl font-bold">
                {siteConfig.name.toLowerCase()}
              </span>
            </Link>
          )}
          <nav className="grid grid-flow-row auto-rows-max text-sm">
            {items.map((item, index) => (
              <Link
                key={index}
                target={item.external ? "_blank" : undefined}
                href={
                  item.disabled
                    ? "#"
                    : `${item.href.startsWith("/") ? `/${lang}` : ""}${
                        item.href
                      }`
                }
                className={cn(
                  "flex w-full items-center rounded-md p-2 text-sm font-medium hover:underline",
                  item.disabled && "cursor-not-allowed opacity-60"
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
          {children}
        </div>
      </div>
    )
  )
}
