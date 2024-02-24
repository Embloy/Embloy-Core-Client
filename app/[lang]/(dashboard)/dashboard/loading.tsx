"use client"

import { DashboardHeader } from "@/components/header"
import { StartApplyButton } from "@/components/start-apply-button"
import { DashboardShell } from "@/components/shell"
import { getDictionary } from "../../dictionaries";
import { useState, useEffect } from "react";

export default function DashboardLoading({params}) {
  const [dict, setDict] = useState<Record<string, any> | null>(null);
  if (!params) {
    return null;
  }
  const { lang } = params;

  useEffect(() => {
    const fetchDictionary = async () => {
      const dictionary = await getDictionary(lang);
      setDict(dictionary);
    };

    fetchDictionary();
  }, [lang]);

  return (
    <DashboardShell>
      <DashboardHeader heading="Upcoming Jobs" text="See what's next.">
        <StartApplyButton params={{lang: lang}} />
      </DashboardHeader>
      <div className="divide-border-200 divide-y rounded-md border">
      </div>
    </DashboardShell>
  )
}
