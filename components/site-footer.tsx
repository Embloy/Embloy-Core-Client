import * as React from "react"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { ModeToggle } from "@/components/mode-toggle"
import { LanguageToggle } from "./language-toggle"

interface FooterProps extends React.HTMLAttributes<HTMLElement>{
  className: string
  copyRight: string
}

export function SiteFooter({ className, copyRight }: FooterProps) {
  return (
    <footer className={cn(className)}>
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <Icons.logo />
          <p className="text-center text-sm leading-loose md:text-left">
          {copyRight}
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
          <ModeToggle />
        </div>
      </div>
    </footer>
  )
}
