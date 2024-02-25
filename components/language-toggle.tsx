"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Icons } from "@/components/icons"
import { useLanguage } from "@/hooks/use-language"

export function LanguageToggle() {
  const [language, setLanguage] = useLanguage()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 px-0">
          <Icons.globe className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Icons.globe className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Change Language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {[
          { code: "en-US", label: "English" },
          { code: "de", label: "Deutsch" },
          { code: "fr", label: "Française" },
          { code: "it", label: "Italiano" },
          { code: "jp", label: "日本語" },
        ].map(({ code, label }) => (
          <DropdownMenuItem key={code} onClick={() => setLanguage(code)}>
            <Icons.flag className="mr-2 h-4 w-4" />
            <span>{label}</span>
            {language === code && <Icons.check className="ml-2 h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}