"use client"

import { DashboardHeader } from "@/components/header"
import { StartApplyButton } from "@/components/start-apply-button"
import { DashboardShell } from "@/components/shell"
import { CardSkeleton } from "@/components/card-skeleton"
import { getDictionary } from "@/app/[lang]/dictionaries";
import { useState, useEffect } from "react";

export default function ApplicationsLoading({params}) {
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
      <DashboardHeader heading={dict.dashboard.applications.title} text={dict.dashboard.applications.subtitle}>
      <StartApplyButton params={{lang: lang}} />
      </DashboardHeader>
      <div className="divide-border-200 divide-y rounded-md border">
        <CardSkeleton />
      </div>
    </DashboardShell>
  )
}