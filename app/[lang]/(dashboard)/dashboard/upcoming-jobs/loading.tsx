import { DashboardHeader } from "@/components/header"
import { StartApplyButton } from "@/components/start-apply-button"
import { DashboardShell } from "@/components/shell"
import { getDictionary } from "@/app/[lang]/dictionaries";
import React from "react";

export default function UpcomingJobsLoading({params}) {
  if (!params) {
    return null;
  }
  const { lang } = params;
  const [dict, setDict] = React.useState<Record<string, any> | null>(null);
 
  React.useEffect(() => {
    const fetchDictionary = async () => {
      const dictionary = await getDictionary(lang);
      setDict(dictionary);
    };
    fetchDictionary();
  }, [lang] );

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
