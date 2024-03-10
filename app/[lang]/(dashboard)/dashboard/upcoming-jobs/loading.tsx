"use client"

import * as React from "react";
import { DashboardHeader } from "@/components/header";
import { JobTable } from "@/components/job-table";
import { StartApplyButton } from "@/components/start-apply-button";
import { getDictionary } from "@/app/[lang]/dictionaries";

export default function UpcomingJobsLoading({params}) {
  const { lang } = params || {};
  const [dict, setDict] = React.useState<Record<string, any> | null>(null);
 
  React.useEffect(() => {
    if (!params) {
      return;
    }

    const fetchDictionary = async () => {
      const dictionary = await getDictionary(lang);
      setDict(dictionary);
    };
    fetchDictionary();
  }, [lang, params]);

  return (
    <>
      <DashboardHeader heading={dict?.dashboard.upcoming.title} text={dict?.dashboard.upcoming.subtitle}>
        <StartApplyButton params={{ lang: lang }} />
      </DashboardHeader>
      <JobTable jobs={[]} params={{ lang: lang }} isLoading={true}/>
    </>
  );
}