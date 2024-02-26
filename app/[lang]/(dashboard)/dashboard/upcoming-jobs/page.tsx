"use client";

import { useRouter } from "next/navigation";
import { getSession } from "@/lib/api/session";
import { getUpcomingJobs } from "@/lib/api/jobs";
import { EmptyPlaceholder } from "@/components/empty-placeholder";
import { DashboardHeader } from "@/components/header";
import { StartApplyButton } from "@/components/start-apply-button";
import { DashboardShell } from "@/components/shell";
import { useEffect, useState } from "react";
import { Job } from "@/lib/api/sdk";
import Image from "next/image";
import { getDictionary } from "@/app/[lang]/dictionaries";
import { toast } from "@/components/ui/use-toast";

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

  return dict && (
    <DashboardShell>
      <DashboardHeader heading={dict.dashboard.upcoming.title} text={dict.dashboard.upcoming.subtitle}>
        <StartApplyButton params={{lang: lang}} />
      </DashboardHeader>
      {jobs.length > 0 ? (
        jobs.map((job) => (
          <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
            <div className="grid grid-cols-3 gap-4">
              <div key={job.job_id}>
                <Image
                  className="duration-400 rounded-xl transition-transform ease-in-out hover:scale-110"
                  src="/images/mobile_button_page.png"
                  alt="Description of Image 1"
                  width={842}
                  height={842}
                />
              </div>
            </div>
          </div>
        ))
      ) : (
        <EmptyPlaceholder>
          <EmptyPlaceholder.Icon name="timer" />
          <EmptyPlaceholder.Title>{dict.dashboard.upcoming.noUpcomingJobs}</EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            {dict.dashboard.upcoming.startApply}
          </EmptyPlaceholder.Description>
          <StartApplyButton params={{lang: lang}} variant="outline" />
        </EmptyPlaceholder>
      )}
    </DashboardShell>
  );
}
