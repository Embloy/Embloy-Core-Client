"use client"

import * as React from "react"
import { getPortalSession } from "@/lib/api/subscription"

import { cn } from "@/lib/utils"
import { ButtonProps, buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { toast } from "./ui/use-toast"
import { Locale } from "@/i18n-config"
import { useState } from "react"
import { getDictionary } from "@/app/[lang]/dictionaries"

interface ManageSubscriptionsButtonProps extends ButtonProps {
  text: string
  params: {
    lang: Locale
  }
}

export function ManageSubscriptionsButton({
  className,
  variant,
  text,
  params: { lang },
  ...props
}: ManageSubscriptionsButtonProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [dict, setDict] = useState<Record<string, any> | null>(null);

  React.useEffect(() => {
    const fetchDictionary = async () => {
      const dictionary = await getDictionary(lang);
      setDict(dictionary);
    };

    fetchDictionary();
  }, [lang]);

  const handleManageSubscriptions = async () => {
    if (dict) {
      setIsLoading(true);    
      const {response, err} = await getPortalSession()
      setIsLoading(false)

      if (err || !response) {
        return toast({
          title: dict.errors[err || "500"].title || dict.errors.generic.title,
          description: dict.errors[err || "500"].description || dict.errors.generic.description,
          variant: "destructive",
        })
      } else {
        if (response && response.url) {
          window.location.href = response.url;
        }
      }
    }
  };

  return (
    <button
      onClick={handleManageSubscriptions}
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
        <Icons.laptop className="mr-2 h-4 w-4" />
      )}
      {text}
    </button>
  )
}
