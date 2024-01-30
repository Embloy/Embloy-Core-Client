"use client"

import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation"
import { getSession } from "@/lib/api/session"
import { getActiveSubscription, Subscription } from "@/lib/api/subscription"
import { BillingForm } from "@/components/billing-form"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"
import { ManageSubscriptionsButton } from "@/components/manage-subscriptions-button"
import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { SubscribeButton } from "@/components/subscribe-button"
import BillingLoading from './loading';

export default function BillingPage() {
  const [activeSubscription, setActiveSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState<Boolean>(true);
  const router = useRouter()

  useEffect(() => {
    const fetchSubscription = async () => {
      setIsLoading(true);
      const loggedIn = (await getSession()).session;
      if (!loggedIn) {
        router.push("/login");
      } else {
        const subscription = await getActiveSubscription();
        setActiveSubscription(subscription);
      }
      setIsLoading(false);
    };

    fetchSubscription();
  }, []);

  if (isLoading) {
  return <BillingLoading/>
  }


  if (!activeSubscription && !isLoading) {
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
if (activeSubscription && !isLoading)
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