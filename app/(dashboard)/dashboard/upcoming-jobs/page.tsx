"use client";

import { useRouter } from "next/navigation";
import { getSession } from "@/lib/api/session";
import { getActiveSubscription } from "@/lib/api/jobs";
import { EmptyPlaceholder } from "@/components/empty-placeholder";
import { DashboardHeader } from "@/components/header";
import { StartApplyButton } from "@/components/start-apply-button";
import { DashboardShell } from "@/components/shell";
import { useEffect, useState } from "react";
import { Job } from "@/lib/api/sdk";
import Image from "next/image";

export default function UpcomingJobsPage() {
  const [isLoading, setIsLoading] = useState<Boolean>(true);
  const [jobs, setJobs] = useState<Job[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      const loggedIn = (await getSession()).session;
      if (!loggedIn) {
        router.push("/login");
      } else {
        // Fetch jobs here and update the jobs state
        const fetchedJobs = await getActiveSubscription();
        setJobs(fetchedJobs || []);
      }
      setIsLoading(false);
    };

    fetchJobs();
  }, [router]);

  return (
    <DashboardShell>
      <DashboardHeader heading="Upcoming Jobs" text="See what's next.">
        <StartApplyButton />
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
          <EmptyPlaceholder.Title>No upcoming jobs.</EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            You don&apos;t have jobs yet. Start applying now.
          </EmptyPlaceholder.Description>
          <StartApplyButton variant="outline" />
        </EmptyPlaceholder>
      )}
    </DashboardShell>
  );
}
