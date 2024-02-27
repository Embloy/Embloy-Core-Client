"use client"

import Link from "next/link"
import { Resource } from "contentlayer/generated"

import { resourcesConfig } from "@/config/resources"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { Locale } from "@/i18n-config"
import { useEffect, useState } from "react"
import { getDictionary } from "@/app/[lang]/dictionaries"

interface ResourcesPagerProps {
  resource: Resource
  params: {
    lang: Locale
  }
}

export function ResourcesPager({ resource, params: {lang} }: ResourcesPagerProps) {
  const pager = getPagerForResource(resource)
  const [dict, setDict] = useState<Record<string, any> | null>(null);
  
  useEffect(() => {
    const fetchDictionary = async () => {
      const dictionary = await getDictionary(lang);
      setDict(dictionary);
    };

    fetchDictionary();
  }, [lang]);

  if (!pager) {
    return null
  }

  return dict && (
    <div className="flex flex-row items-center justify-between">
      {pager?.prev && !pager.prev.disabled && (
        <Link
          href={pager.prev.href}
          className={cn(buttonVariants({ variant: "ghost" }))}
        >
          <Icons.chevronLeft className="mr-2 h-4 w-4" />
          {dict.resources[pager.prev.title].title}
        </Link>
      )}
      {pager?.next && !pager.next.disabled && (
        <Link
          href={pager.next.href}
          className={cn(buttonVariants({ variant: "ghost" }), "ml-auto")}
        >
          {dict.resources[pager.next.title].title}
          <Icons.chevronRight className="ml-2 h-4 w-4" />
        </Link>
      )}
    </div>
  )
}

export function getPagerForResource(resource: Resource) {
  const flattenedLinks = [null, ...flatten(resourcesConfig.sidebarNav), null]
  const activeIndex = flattenedLinks.findIndex(
    (link) => resource.slug === link?.href
  )
  const prev = activeIndex !== 0 ? flattenedLinks[activeIndex - 1] : null
  const next =
    activeIndex !== flattenedLinks.length - 1
      ? flattenedLinks[activeIndex + 1]
      : null
  return {
    prev,
    next,
  }
}

export function flatten(links: { items? }[]) {
  return links.reduce((flat, link) => {
    return flat.concat(link.items ? flatten(link.items) : link)
  }, [])
}