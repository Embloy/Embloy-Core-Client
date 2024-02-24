"use client"

import { CardSkeleton } from "@/components/card-skeleton"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"
import { getDictionary } from "@/app/[lang]/dictionaries";
import { useState, useEffect } from "react";

export default function DashboardSettingsLoading({ params }) {
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

  return dict && (
    <DashboardShell>
      <DashboardHeader
        heading={dict.dashboard.settings.title}
        text={dict.dashboard.settings.subtitle}
      />
      <div className="grid gap-10">
        <CardSkeleton />
      </div>
    </DashboardShell>
  )
}
