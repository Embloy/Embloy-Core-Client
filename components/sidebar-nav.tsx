"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { SidebarNavItem } from "types"
import { cn } from "@/lib/utils"
import { Locale } from "@/i18n-config"
import { useEffect, useState } from "react"
import { getDictionary } from "@/app/[lang]/dictionaries"

export interface ResourcesSidebarNavProps {
  items: SidebarNavItem[]
  params: {
    lang: Locale
  }
}

export function ResourcesSidebarNav({ items, params: { lang } }: ResourcesSidebarNavProps) {
  const pathname = usePathname()
  const [dict, setDict] = useState<Record<string, any> | null>(null);
  
  useEffect(() => {
    const fetchDictionary = async () => {
      const dictionary = await getDictionary(lang);
      setDict(dictionary);
    };

    fetchDictionary();
  }, [lang]);

  return dict && items.length ? (
    <div className="w-full">
      {items.map((item, index) => (
        <div key={index} className={cn("pb-8")}>
          <h4 className="mb-1 rounded-md px-2 py-1 text-sm font-medium">
            {dict.resources.sidebar[item.title].title}
          </h4>
          {item.items ? (
            <ResourcesSidebarNavItems items={item.items} parentItem={item.title} pathname={pathname} params={{lang: lang}}/>
          ) : null}
        </div>
      ))}
    </div>
  ) : null
}

interface ResourcesSidebarNavItemsProps {
  items: SidebarNavItem[]
  pathname: string | null
  parentItem: string
  params: {
    lang: Locale
  }
}

export function ResourcesSidebarNavItems({
  items,
  parentItem,
  pathname,
  params: { lang }
}: ResourcesSidebarNavItemsProps) {
  const [dict, setDict] = useState<Record<string, any> | null>(null);
  
  useEffect(() => {
    const fetchDictionary = async () => {
      const dictionary = await getDictionary(lang);
      setDict(dictionary);
    };

    fetchDictionary();
  }, [lang]);

  return dict && items?.length ? (
    <div className="grid grid-flow-row auto-rows-max text-sm">
      {items.map((item) =>
        !item.disabled && item.href ? (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex w-full items-center rounded-md p-2 hover:underline",
              {
                "bg-muted": pathname === item.href,
              }
            )}
            target={item.external ? "_blank" : ""}
            rel={item.external ? "noreferrer" : ""}
          >
            {dict.resources.sidebar[parentItem][item.title]}
          </Link>
        ) : (
          <span key={item.href} className="flex w-full cursor-not-allowed items-center rounded-md p-2 opacity-60">
            {dict.resources.sidebar[parentItem][item.title]}
          </span>
        )
      )}
    </div>
  ) : null
}