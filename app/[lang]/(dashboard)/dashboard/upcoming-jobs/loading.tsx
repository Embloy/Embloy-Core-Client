"use client"

import { DashboardHeader } from "@/components/header"
import { StartApplyButton } from "@/components/start-apply-button"
import { DashboardShell } from "@/components/shell"
import { getDictionary } from "@/app/[lang]/dictionaries";
import React, { useEffect, useState } from "react";

export default function UpcomingJobsLoading({params}) {
  const { lang } = params || {};
  const [dict, setDict] = useState<Record<string, any> | null>(null);
 
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
      <DashboardHeader heading={dict.dashboard.upcoming.title} text={dict.dashboard.upcoming.subtitle}>
      <StartApplyButton params={{lang: lang}} />
      </DashboardHeader>
      <div className="divide-border-200 divide-y rounded-md border">
      </div>
    </DashboardShell>
  )
}