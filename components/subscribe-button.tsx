"use client"

import * as React from "react"
import { getPortalSession, postCheckout } from "@/lib/api/subscription"

import { cn } from "@/lib/utils"
import { ButtonProps, buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { getDictionary } from "@/app/[lang]/dictionaries"
import { useEffect, useState } from "react"
import { Locale } from "@/i18n-config"

interface SubscribeButtonProps extends ButtonProps {
  subscriptionType: string
  params: {
    lang: Locale
  }
}

export function SubscribeButton({
  className,
  variant,
  subscriptionType,
  params: { lang },
  ...props
}: SubscribeButtonProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [dict, setDict] = useState<Record<string, any> | null>(null);

  useEffect(() => {
    const fetchDictionary = async () => {
      const dictionary = await getDictionary(lang);
      setDict(dictionary);
    };

    fetchDictionary();
  }, [lang]);

  const handleManageSubscriptions = async () => {
    setIsLoading(true);

    const subscriptionTypeMap = {
      "free": "basic",
      "smart": "premium",
      "genius": "enterprise_1"
    };

    const mappedSubscriptionType = subscriptionTypeMap[subscriptionType.toLowerCase()];

    const checkout = await postCheckout(mappedSubscriptionType, "subscription");
    setIsLoading(false);
    if (checkout && checkout.url) {
      window.location.href = checkout.url;
    }
  };

  return dict && (
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
      {dict.dashboard.billing.subscribeTo}{subscriptionType.toUpperCase()}
    </button>
  )
}