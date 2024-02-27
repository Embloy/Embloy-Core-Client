"use client"

import { getDictionary } from "@/app/[lang]/dictionaries"
import { Locale } from "@/i18n-config"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

interface ResourcePageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  heading: string
  text?: string
  params: {
    lang: Locale
  }
}

export function ResourcePageHeader({
  heading,
  text,
  className,
  params: {lang},
  ...props
}: ResourcePageHeaderProps) {
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
      <div className={cn("space-y-4", className)} {...props}>
        <h1 className="inline-block font-heading text-4xl lg:text-5xl">
          {dict.resources[heading].title}
        </h1>
        {text && <p className="text-xl text-muted-foreground">{text}</p>}
      </div>
      <hr className="my-4" />
    </>
  )
}