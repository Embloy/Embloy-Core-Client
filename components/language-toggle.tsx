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
import Image from 'next/image';

export function LanguageToggle() {
  const [language, setLanguage] = useLanguage()

  const handleLanguageChange = (code) => {
    setLanguage(code);
    location.reload();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="size-8 px-0">
          <Icons.globe className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Icons.globe className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Change Language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {[
          { code: "en-US", label: "English", src: "/flags/usFlag.svg" },
          { code: "de", label: "Deutsch", src: "/flags/deFlag.svg" },
          { code: "fr", label: "Française", src: "/flags/frFlag.svg" },
          { code: "it", label: "Italiano", src: "/flags/itFlag.svg" },
          { code: "jp", label: "日本語", src: "/flags/jpFlag.svg" },
        ].map(({ code, label, src }) => (
          <DropdownMenuItem key={code} onClick={() => handleLanguageChange(code)}>
            <Image src={src} alt="flag" className="mr-2 size-4" width="10" height="10"/>
            <span>{label}</span>
            {language === code && <Icons.check className="ml-2 size-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}