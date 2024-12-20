"use client"

import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation"
import { getSession } from "@/lib/api/session"
import { getActiveSubscription, Subscription } from "@/lib/api/subscription"
import { BillingForm } from "@/components/billing-form"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"
import { ManageSubscriptionsButton } from "@/components/manage-subscriptions-button"
import { SubscribeButton } from "@/components/subscribe-button"
import BillingLoading from './loading';
import { getDictionary } from '@/app/[lang]/dictionaries';
import { toast } from '@/components/ui/use-toast';

export default function BillingPage({ params: { lang } }) {
  const [activeSubscription, setActiveSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState<Boolean>(true);
  const router = useRouter()
  const [dict, setDict] = useState<Record<string, any> | null>(null);

  useEffect(() => {
    const fetchDictionary = async () => {
      const dictionary = await getDictionary(lang);
      setDict(dictionary);
    };

    fetchDictionary();

    const fetchSubscription = async () => {
      setIsLoading(true);
      const loggedIn = (await getSession()).session;
      if (!loggedIn) {
        router.push(`/${lang}/login`);
      } else if (dict) {
        const {response, err} = await getActiveSubscription();
        setIsLoading(false);
        setActiveSubscription(response);
        if (err) {
          return toast({
            title: dict.errors[err || "500"].title || dict.errors.generic.title,
            description: dict.errors[err || "500"].description || dict.errors.generic.description,
            variant: "destructive",
          })
        }
      }
      setIsLoading(false);
    };

    fetchSubscription();
  }, [router, lang, dict]);

  if (isLoading) {
    return <BillingLoading params={{ lang }}/>
  }


  if (!activeSubscription && !isLoading) {
    return dict && (
      <div>
        <div className="mx-auto mt-10 flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
          <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
            {dict.dashboard.billing.noActiveSubscriptions}
          </h2>
          <p>
          {dict.dashboard.billing.noActiveSubscriptionsText}
          </p>
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-3">
            <SubscribeButton variant="default" subscriptionType="Free" params={{lang: lang}} className="duration-400 rounded-xl transition-transform ease-in-out hover:scale-110" />
            <SubscribeButton variant="default" subscriptionType="Smart" params={{lang: lang}} className="duration-400 rounded-xl transition-transform ease-in-out hover:scale-110" />
            <SubscribeButton variant="default" subscriptionType="Genius" params={{lang: lang}} className="duration-400 rounded-xl transition-transform ease-in-out hover:scale-110" />
          </div>
        </div>
      </div>
    );
  }
if (activeSubscription && !isLoading)
  return dict && (
    <DashboardShell>
      <DashboardHeader heading={dict.dashboard.billing.title} text={dict.dashboard.billing.subtitle}>
        <ManageSubscriptionsButton text={dict.dashboard.billing.manageSubscriptions} params={{lang: lang}}/>
      </DashboardHeader>
      <div>
        <BillingForm
          subscription={activeSubscription}
          params={{lang: lang}}
        />
      </div>
    </DashboardShell>
  )
}