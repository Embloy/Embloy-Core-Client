"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"

import { SidebarNavItem } from "types"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { getDictionary } from "@/app/[lang]/dictionaries"

import { Locale } from "../i18n-config"
import { ManualProxyForm } from "./manual-proxy-form"

interface DashboardNavProps {
  items: SidebarNavItem[]
  params: {
    lang: Locale
  }
}

export function DashboardNav({ items, params: { lang } }: DashboardNavProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const mode = searchParams.get("mode")
  const eType = searchParams.get("eType")

  const [dict, setDict] = useState<Record<string, any> | null>(null)

  useEffect(() => {
    const fetchDictionary = async () => {
      const dictionary = await getDictionary(lang)
      setDict(dictionary)
    }

    fetchDictionary()
  }, [lang])

  if (!items?.length) {
    return null
  }

  return (
    dict && (
      <nav className="grid items-start gap-2">
        {items.map((item, index) => {
          const Icon = Icons[item.icon || "arrowRight"]
          return (
            item.href && (
              <Link
                key={index}
                href={
                  item.disabled
                    ? "#"
                    : `${item.href.startsWith("/") ? `/${lang}` : ""}${
                        item.href
                      }`
                }
              >
                <span
                  className={cn(
                    "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                    ("/" + pathname.split("/").slice(2).join("/")).startsWith(
                      item.href
                    )
                      ? "bg-accent"
                      : "transparent",
                    item.disabled && "cursor-not-allowed opacity-80"
                  )}
                >
                  <Icon className="mr-2 size-4" />
                  <span>{dict.nav.side[item.title.toLowerCase()]}</span>
                </span>
              </Link>
            )
          )
        })}
        <ManualProxyForm params={{ lang: lang, mode: mode, eType: eType }} />
      </nav>
    )
  )
}
