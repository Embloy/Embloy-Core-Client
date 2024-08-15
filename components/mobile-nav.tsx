import * as React from "react"
import Link from "next/link"

import { MainNavItem } from "types"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { useLockBody } from "@/hooks/use-lock-body"
import { Icons } from "@/components/icons"
import {Locale} from "../i18n-config";
import { getDictionary } from "@/app/[lang]/dictionaries"
import { useEffect, useState } from "react"

interface MobileNavProps {
  items: MainNavItem[]
  children?: React.ReactNode
  params: {
    lang: Locale;
  };
}

export function MobileNav({ items, children, params: { lang } }: MobileNavProps) {
  useLockBody()
  const [dict, setDict] = useState<Record<string, any> | null>(null);

  useEffect(() => {
    const fetchDictionary = async () => {
      const dictionary = await getDictionary(lang);
      setDict(dictionary);
    };

    fetchDictionary();
  }, [lang]);

  return dict && (
    <div
      className={cn(
        "fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-auto p-6 pb-32 shadow-md animate-in slide-in-from-bottom-80 md:hidden"
      )}
    >
      <div className="relative z-20 grid gap-6 rounded-md bg-popover p-4 text-popover-foreground shadow-md">
      <Link href={`/${lang}`} className="flex items-center space-x-2">
        <Icons.logo />
        <span className="underline-gradient text-xl font-bold">
          {siteConfig.name.toLowerCase()}
        </span>
      </Link>
        <nav className="grid grid-flow-row auto-rows-max text-sm">
          {items.map((item, index) => (
            <Link
              key={index}
              target={item.external ? "_blank" : undefined}
              href={item.disabled ? "#" : `${item.href.startsWith('/') ? `/${lang}` : ''}${item.href}`}
              className={cn(
                "flex w-full items-center rounded-md p-2 text-sm font-medium hover:underline",
                item.disabled && "cursor-not-allowed opacity-60"
              )}
            >
              {dict.nav.main[item.title.toLowerCase()]}
            </Link>
          ))}
        </nav>
        {children}
      </div>
    </div>
  )
}
