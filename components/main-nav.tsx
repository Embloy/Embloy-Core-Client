"use client"

import * as React from "react"
import Link from "next/link"
import { useSelectedLayoutSegment } from "next/navigation"

import { MainNavItem } from "types"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { MobileNav } from "@/components/mobile-nav"
import {Locale} from "../i18n-config";
import { getDictionary } from "@/app/[lang]/dictionaries"
import { useEffect, useState } from "react"

interface MainNavProps {
  items?: MainNavItem[]
  children?: React.ReactNode
  params: {
    lang: Locale;
  };
}

export function MainNav({ items, children, params: { lang } }: MainNavProps) {
  const segment = useSelectedLayoutSegment()
  const [showMobileMenu, setShowMobileMenu] = React.useState<boolean>(false)
  const [dict, setDict] = useState<Record<string, any> | null>(null);

  useEffect(() => {
    const fetchDictionary = async () => {
      const dictionary = await getDictionary(lang);
      setDict(dictionary);
    };

    fetchDictionary();
  }, [lang]);

  return dict && (
    <div className="flex md:gap-10">
    <Link href={`/${lang}`} className="mb-1 hidden items-center space-x-1  md:flex">
      <Icons.logo />
      <span className="underline-gradient mb-1 hidden text-xl font-bold sm:inline-block">
        {siteConfig.name.toLowerCase()}
      </span>
    </Link>
      {items?.length ? (
        <nav className="mb-1 hidden gap-6 md:flex">
          {items?.map((item, index) => (
            <Link
              key={index}
              target={item.external ? "_blank" : undefined}
              href={item.disabled ? "#" : `${item.href.startsWith('/') ? `/${lang}` : ''}${item.href}`}
              className={cn(
                "text-md flex items-center transition-colors hover:rounded hover:bg-muted ",
                item.href.startsWith(`/${segment}`)
                  ? "rounded bg-muted p-1 font-bold text-foreground"
                  : "p-1 text-foreground",
                item.disabled && "cursor-not-allowed opacity-80"
              )}
            >
              {dict.nav.main[item.title.toLowerCase()]}
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
        <MobileNav items={items} params={{lang: lang}}>{children}</MobileNav>
      )}
    </div>
  )
}