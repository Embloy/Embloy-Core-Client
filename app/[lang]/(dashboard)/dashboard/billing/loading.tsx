"use client"

import { getDictionary } from "@/app/[lang]/dictionaries";
import { CardSkeleton } from "@/components/card-skeleton"
import { DashboardHeader } from "@/components/header"
import { ManageSubscriptionsButton } from "@/components/manage-subscriptions-button"
import { DashboardShell } from "@/components/shell"
import { useState, useEffect } from "react";

export default function BillingLoading({ params }) {
  const [dict, setDict] = useState<Record<string, any> | null>(null);
  const { lang } = params || {};

  useEffect(() => {
    if (!params) {
      return;
    }

    const fetchDictionary = async () => {
      const dictionary = await getDictionary(lang);
      setDict(dictionary);
    };

    fetchDictionary();
  }, [lang, params]);

  return dict && (
    <DashboardShell>
      <DashboardHeader heading={dict.dashboard.billing.title} text={dict.dashboard.billing.subtitle}>
        <ManageSubscriptionsButton text={dict.dashboard.billing.manageSubscriptions} />
      </DashboardHeader>
      <div className="grid gap-10">
        <CardSkeleton />
      </div>
    </DashboardShell>
  )
}