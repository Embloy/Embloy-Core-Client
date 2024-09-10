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

interface SandboxBannerProps {
  params: {
    lang: Locale
  }
}

export function SandboxBanner({ params: { lang } }: SandboxBannerProps) {
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
      <div className="inverted-border-radius inset-x-0 top-0 flex items-center justify-between text-ellipsis bg-sandbox px-4 py-1 text-sandbox-foreground">
        <div className="w-full truncate text-left font-bold lg:w-1/6">
          {dict.pages.sandbox.title}
        </div>
        <div className="mr-20 hidden w-4/6 items-center justify-center truncate text-center font-light lg:block">
          <span className="truncate">{dict.pages.sandbox.header}</span>
          <Link
            href={`/${siteConfig.links.developer}/docs/sandbox`}
            target="_blank"
            className="ml-2 hidden font-light"
          >
            <Icons.externalLink />
          </Link>
        </div>
        <div className="mt-1 w-1/6 text-right">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="hover:text-sandbox-foreground-dark text-sandbox-foreground"
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
              <TooltipContent className="w-64 bg-sandbox text-left text-sandbox-foreground">
                {dict.pages.sandbox.description}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    )
  )
}
