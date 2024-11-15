import React, { useEffect, useState } from "react"
import Link from "next/link"

import { siteConfig } from "@/config/site"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { getDictionary } from "@/app/[lang]/dictionaries"

import { Locale } from "../i18n-config"
import { Icons } from "./icons"

interface CompanyBannerProps {
  params: {
    lang: Locale
  }
}

export function CompanyBanner({ params: { lang } }: CompanyBannerProps) {
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
      <div className="inverted-border-radius-company inset-x-0 top-0 flex items-center justify-between text-ellipsis bg-company px-4 py-1 text-company-foreground">
        <div className="w-full truncate text-left font-bold lg:w-1/6">
          {dict.pages.company.title}
        </div>
        <div className="mr-20 hidden w-4/6 items-center justify-center truncate text-center font-light lg:block">
          <Link href={siteConfig.links.genius} passHref>
            <span className="truncate">{dict.pages.company.header}</span>
          </Link>
        </div>
        <div className="mt-1 w-1/6 text-right">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="hover:text-company-foreground-dark text-company-foreground"
                  aria-label="Info"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
                    />
                  </svg>
                </button>
              </TooltipTrigger>
              <TooltipContent className="w-64 bg-company text-left text-company-foreground">
                {dict.pages.company.description}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    )
  )
}
