"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { cn } from "@/lib/utils"
import { ButtonProps, buttonVariants } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"
import { getDictionary } from "@/app/[lang]/dictionaries"
import { Locale } from "../i18n-config"

interface StartApplyButtonProps extends ButtonProps {
  params: {
    lang: Locale
  }
}

export function StartApplyButton({
  className,
  variant,
  params: {lang},
  ...props
}: StartApplyButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [dict, setDict] = React.useState<Record<string, any> | null>(null);

  React.useEffect(() => {
    const fetchDictionary = async () => {
      const dictionary = await getDictionary(lang);
      setDict(dictionary);
    };

    fetchDictionary();
  }, [lang]);

  async function onClick() {
    setIsLoading(true)

    const response = await fetch("/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "Untitled Post",
      }),
    })

    setIsLoading(false)

    if (!response?.ok) {
      if (response.status === 402) {
        return toast({
          title: "Limit of 3 posts reached.",
          description: "Please upgrade to the PRO plan.",
          variant: "destructive",
        })
      }

      return toast({
        title: "Something went wrong.",
        description: "Your application was not submitted. Please try again.",
        variant: "destructive",
      })
    }

    const post = await response.json()

    // This forces a cache invalidation.
    router.refresh()

    router.push(`/${lang}/editor/${post.id}`)
  }

  return dict && (
    <button
      onClick={onClick}
      className={cn(
        buttonVariants({ variant }),
        {
          "cursor-not-allowed opacity-60": isLoading,
        },
        className
      )}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Icons.add className="mr-2 h-4 w-4" />
      )}
      {dict.dashboard.upcoming.apply}
    </button>
  )
}
