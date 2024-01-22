"use client"

import * as React from "react"
import { getPortalSession } from "@/lib/api/subscription"

import { cn } from "@/lib/utils"
import { ButtonProps, buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"

interface ManageSubscriptionsButtonProps extends ButtonProps {}

export function ManageSubscriptionsButton({
  className,
  variant,
  ...props
}: ManageSubscriptionsButtonProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  const handleManageSubscriptions = async () => {
    setIsLoading(true);
    const portalSession = await getPortalSession();
    setIsLoading(false);
    if (portalSession && portalSession.url) {
      window.location.href = portalSession.url;
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
      Manage subscriptions
    </button>
  )
}
