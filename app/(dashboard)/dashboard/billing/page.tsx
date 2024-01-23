"use client"

import { useState, useEffect } from 'react';
import { redirect } from "next/navigation"
import { getSession } from "@/lib/api/session"
import { getActiveSubscription, Subscription } from "@/lib/api/subscription"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { BillingForm } from "@/components/billing-form"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"
import { ManageSubscriptionsButton } from "@/components/manage-subscriptions-button"
import { toast } from "@/components/ui/use-toast"
import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { SubscribeButton } from "@/components/subscribe-button"

export default function BillingPage() {
  const [activeSubscription, setActiveSubscription] = useState<Subscription | null>(null);

  useEffect(() => {
    const fetchSubscription = async () => {
      const loggedIn = (await getSession()).session;
      if (!loggedIn) {
        redirect("/login");
      } else {
        const subscription = await getActiveSubscription();
        setActiveSubscription(subscription);
      }
    };

    fetchSubscription();
  }, []);

  if (!activeSubscription) {
    return (
      <EmptyPlaceholder>
        <EmptyPlaceholder.Icon name="billing" />
        <EmptyPlaceholder.Title>No active subscriptions.</EmptyPlaceholder.Title>
        <EmptyPlaceholder.Description>
          You don&apos;t have an active subscriptions yet. Start using Embloy&apos;s most exclusive features now.
        </EmptyPlaceholder.Description>
        <SubscribeButton variant="outline" subscriptionType="Free" />
        <SubscribeButton variant="outline" subscriptionType="Smart" />
        <SubscribeButton variant="outline" subscriptionType="Genius" />
      </EmptyPlaceholder>
    );
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Billing" text="Manage your subscription plan.">
        <ManageSubscriptionsButton />
      </DashboardHeader>
      <div>
        <BillingForm
          subscription={activeSubscription}
        />
      </div>
    </DashboardShell>
  )
}