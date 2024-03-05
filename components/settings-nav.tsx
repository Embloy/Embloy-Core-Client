"use client"

import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { cn } from "@/lib/utils"
import { buttonVariants } from "./ui/button"
import { usePathname } from "next/navigation"
import { Locale } from "@/i18n-config"
import { useEffect, useState } from "react"
import { getDictionary } from "@/app/[lang]/dictionaries"

interface SettingsNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string
    title: string
    disabled: boolean
  }[]
  params: {
    lang: Locale
  }
}

export function SettingsNav({ className, items, params: {lang}, ...props }: SettingsNavProps) {
  const pathname = usePathname()
  const [dict, setDict] = useState<Record<string, any> | null>(null);
  
  useEffect(() => {
    const fetchDictionary = async () => {
      const dictionary = await getDictionary(lang);
      setDict(dictionary);
    };
    fetchDictionary();
  }, [lang]);

  return dict && (
    <>
      <div className="lg:hidden">
        <Select
          onValueChange={(value) => window.location.href = value}
          defaultValue={("/"+pathname.split('/').slice(2).join('/'))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a page" />
          </SelectTrigger>
          <SelectContent>
            {items.map((item) => (
              <SelectItem
                key={item.href}
                value={item.href}
                disabled={item.disabled}
              >
                {dict.dashboard.settings.nav[item.title]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <nav
        className={cn(
          "hidden space-x-2 lg:flex lg:flex-col lg:space-x-0 lg:space-y-1",
          className
        )}
        {...props}
      >
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.disabled ? "/dashboard/settings" : item.href}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              ("/"+pathname.split('/').slice(2).join('/')) === item.href
                ? "bg-accent" : "transparent",
                "justify-start",
                item.disabled ? "cursor-not-allowed opacity-50" : ""
            )}
            aria-disabled={item.disabled}>
              {dict.dashboard.settings.nav[item.title]}
          </Link>
        ))}
      </nav>
    </>
  )
}