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

interface BillingFormProps extends React.HTMLAttributes<HTMLFormElement> {
  subscription: Subscription
}

export function BillingForm({
  subscription,
  className,
  ...props
}: BillingFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  const nextBestPlan = getNextBestPlan(subscription)

  async function onSubmit(event) {
    event.preventDefault()
    setIsLoading(true)
  
    if (nextBestPlan) {
      // Get a Stripe session URL.
      const response = await postCheckout(nextBestPlan?.internal_name, 'subscription')
    
      if (!response) {
        setIsLoading(false)
        return toast({
          title: "Something went wrong.",
          description: "Please refresh the page and try again.",
          variant: "destructive",
        })
      }
    
      // Redirect to the Stripe session.
      // This could be a checkout page for initial upgrade.
      // Or portal to manage existing subscription.
      if (response.url) {
       window.location.href = response.url
      }
    }
  }

  const subscriptionPlan = getSubscriptionPlanBySubscription(subscription) 


  return subscriptionPlan && (
    <form className={cn(className)} onSubmit={onSubmit} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Subscription Plan</CardTitle>
          <CardDescription>
            You are currently on the <strong>{subscriptionPlan.name}</strong>{" "}
            plan.
          </CardDescription>
        </CardHeader>
        <CardContent>{subscriptionPlan.description}</CardContent>
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
              {`Upgrade to ${nextBestPlan?.name || 'SMART'}`}
            </button>
          )}
          <p className="rounded-full text-xs font-medium">
            {"Your plan renews on "}
            {formatDate(subscription.current_period_end)}.
          </p>
        </CardFooter>
      </Card>
    </form>
  )
}