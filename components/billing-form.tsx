"use client"

import * as React from "react"

import { UserSubscriptionPlan } from "types"
import { cn, formatDate } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"
import { postCheckout, Subscription } from "@/lib/api/subscription"
import { getNextBestPlan, getSubscriptionPlanBySubscription } from "@/config/subscriptions"
import { Locale } from "@/i18n-config"
import { getDictionary } from "@/app/[lang]/dictionaries"
import { useState } from "react"

interface BillingFormProps extends React.HTMLAttributes<HTMLFormElement> {
  subscription: Subscription
  params: {
    lang: Locale
  }
}

export function BillingForm({
  subscription,
  className,
  params: {lang},
  ...props
}: BillingFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [dict, setDict] = useState<Record<string, any> | null>(null);
  const nextBestPlan = getNextBestPlan(subscription)

  React.useEffect(() => {
    const fetchDictionary = async () => {
      const dictionary = await getDictionary(lang);
      setDict(dictionary);
    };

    fetchDictionary();
  }, [lang]);


  async function onSubmit(event) {
    event.preventDefault()
    setIsLoading(true)
  
    if (nextBestPlan && dict) {
      // Get a Stripe session URL.
      const {response, err} = await postCheckout(nextBestPlan?.internal_name, 'subscription')
      setIsLoading(false)
      if (err || !response) {
        return toast({
          title: dict.errors[err || "500"].title || dict.errors.generic.title,
          description: dict.errors[err || "500"].description || dict.errors.generic.description,
          variant: "destructive",
        })
      }
      if (response && response.url) {
        window.location.href = response.url
      }
    }
  }

  const subscriptionPlan = getSubscriptionPlanBySubscription(subscription) 


  return subscriptionPlan && dict && (
    <form className={cn(className)} onSubmit={onSubmit} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>{dict.dashboard.billing.subscriptionPlan}</CardTitle>
          <CardDescription>
          {dict.dashboard.billing.youAreCurrentlyOn}<strong>{dict.dashboard.billing[subscriptionPlan.internal_name].name}</strong>{dict.dashboard.billing.plan}
          </CardDescription>
        </CardHeader>
        <CardContent>{dict.dashboard.billing[subscriptionPlan.internal_name].description}</CardContent>
        <CardFooter className="flex flex-col items-start space-y-2 md:flex-row md:justify-between md:space-x-0">
          {nextBestPlan?.internal_name !== 'enterprise_2' && (
            <button
              type="submit"
              className={cn(buttonVariants())}
              disabled={isLoading}
            >
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              {`${dict.dashboard.billing.upgradeTo}${nextBestPlan?.name || 'SMART'}`}
            </button>
          )}
          <p className="rounded-full text-xs font-medium">
            {dict.dashboard.billing.yourPlanRenewsOn}
            {formatDate(lang, subscription.current_period_end)}.
          </p>
        </CardFooter>
      </Card>
    </form>
  )
}