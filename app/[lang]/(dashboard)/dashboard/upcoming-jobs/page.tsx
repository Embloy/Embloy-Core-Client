"use client";

import { useRouter } from "next/navigation";
import { getSession } from "@/lib/api/session";
import { getUpcomingJobs } from "@/lib/api/jobs";
import { EmptyPlaceholder } from "@/components/empty-placeholder";
import { DashboardHeader } from "@/components/header";
import { StartApplyButton } from "@/components/start-apply-button";
import { useEffect, useState } from "react";
import { getDictionary } from "@/app/[lang]/dictionaries";
import { toast } from "@/components/ui/use-toast";
import { JobTable } from "@/components/job-table";
import UpcomingJobsLoading from "./loading";
import { Job } from "@/types/job-schema";

export default function UpcomingJobsPage({ params: { lang } }) {
  const [isLoading, setIsLoading] = useState<Boolean>(true);
  const [jobs, setJobs] = useState<Job[]>([]);
  const router = useRouter();
  const [dict, setDict] = useState<Record<string, any> | null>(null);
  
  useEffect(() => {
    const fetchDictionary = async () => {
      const dictionary = await getDictionary(lang);
      setDict(dictionary);
    };
    fetchDictionary();

    const fetchJobs = async () => {
      setIsLoading(true);
      const loggedIn = (await getSession()).session;
      if (!loggedIn) {
        router.push(`/${lang}/login`);
      } else if (dict) {
        const {response, err} = await getUpcomingJobs()
        setIsLoading(false)
  
        if (err || !response) {
          return toast({
            title: dict.errors[err || "500"].title || dict.errors.generic.title,
            description: dict.errors[err || "500"].description || dict.errors.generic.description,
            variant: "destructive",
          })
        } else {
          setJobs(response || []);
        }
      }
      setIsLoading(false);
    };

    fetchJobs();
  }, [router, lang, dict]);

  if (isLoading) {
    return <UpcomingJobsLoading params={{lang: lang}}/>
  }

  return dict && (
    <div>
      <DashboardHeader heading={dict.dashboard.upcoming.title} text={dict.dashboard.upcoming.subtitle}>
        <StartApplyButton params={{lang: lang}} />
      </DashboardHeader>
      {jobs.length > 0 ? (
        <JobTable jobs={jobs} params={{lang: lang}} isLoading={false}/>
      ) : (
        <EmptyPlaceholder>
          <EmptyPlaceholder.Icon name="timer" />
          <EmptyPlaceholder.Title>{dict.dashboard.upcoming.noUpcomingJobs}</EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            {dict.dashboard.upcoming.startApply}
          </EmptyPlaceholder.Description>
          <StartApplyButton params={{lang: lang}}/>
        </EmptyPlaceholder>
      )}
    </div>
  );
}
