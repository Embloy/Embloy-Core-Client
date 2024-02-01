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
      <div>
        <div className="mt-10 mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
          <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
            No active subscriptions.
          </h2>
          <p>
            You don&apos;t have an active subscriptions yet. Start using Embloy&apos;s most exclusive features now.
          </p>
          <div className="grid grid-cols-3 gap-4">
            <SubscribeButton variant="outline" subscriptionType="Free" className="duration-400 rounded-xl transition-transform ease-in-out hover:scale-110" />
            <SubscribeButton variant="outline" subscriptionType="Smart" className="duration-400 rounded-xl transition-transform ease-in-out hover:scale-110" />
            <SubscribeButton variant="outline" subscriptionType="Genius" className="duration-400 rounded-xl transition-transform ease-in-out hover:scale-110" />
          </div>
        </div>
      </div>
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