import * as React from "react"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { ModeToggle } from "@/components/mode-toggle"
import { LanguageToggle } from "./language-toggle"
import { Locale } from "@/i18n-config"
import { useEffect, useState } from "react"
import { getDictionary } from "@/app/[lang]/dictionaries"

interface FooterProps extends React.HTMLAttributes<HTMLElement>{
  className: string
  params: {
    lang: Locale
  }
}

export function SiteFooter({ className, params: { lang } }: FooterProps) {
  const [dict, setDict] = useState<Record<string, any> | null>(null);

  useEffect(() => {
    const fetchDictionary = async () => {
      const dictionary = await getDictionary(lang);
      setDict(dictionary);
    };
    fetchDictionary();
  }, [lang]);

  return dict && (
    <footer className={cn(className)}>
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <Icons.logo />
          <p className="text-center text-sm leading-loose md:text-left">
          {dict.marketing.copyright}
            <a
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              GitHub
            </a>
            .
          </p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '10px' }}>
          <LanguageToggle/>
          <ModeToggle params={{lang: lang}}/>
        </div>
      </div>
    </footer>
  )
}
