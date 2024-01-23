"use client"

import * as React from "react"
import { getPortalSession, postCheckout } from "@/lib/api/subscription"

import { cn } from "@/lib/utils"
import { ButtonProps, buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"

interface SubscribeButtonProps extends ButtonProps {
  subscriptionType: string;
}

export function SubscribeButton({
  className,
  variant,
  subscriptionType,
  ...props
}: SubscribeButtonProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

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
      Subscribe to {subscriptionType.toUpperCase()}
    </button>
  )
}