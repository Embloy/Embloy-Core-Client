"use client"

import { ApplicationPanel } from "@/components/application-panel"
import { DashboardShell } from "@/components/shell"
import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation"
import { getApplications, Application } from "@/lib/api/application"
import { getSession } from "@/lib/api/session"
import ApplicationsLoading from './loading';
import { EmptyPlaceholder } from "@/components/empty-placeholder";
import { DashboardHeader } from "@/components/header";
import { StartApplyButton } from "@/components/start-apply-button";
import { ApplicationItem } from "@/components/ui/application-item";
import { useMediaQuery } from '@react-hook/media-query';

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[] | null>(null);
  const [isLoading, setIsLoading] = useState<Boolean>(true);
  const router = useRouter()
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    const fetchApplications = async () => {
      setIsLoading(true);
      const loggedIn = (await getSession()).session;
      if (!loggedIn) {
        router.push(`/login`)
      } else {
        const apps = await getApplications();
        setApplications(apps);
      }
      setIsLoading(false);
    };

    fetchApplications();
  }, [router]);

  if (isLoading) {
    return <ApplicationsLoading/>
  }

  if (!applications && !isLoading) {
    return (
      <DashboardShell>
        <DashboardHeader heading="Applications" text="Your submitted applications.">
          <StartApplyButton />
        </DashboardHeader>
        <div>
          <EmptyPlaceholder>
            <EmptyPlaceholder.Icon name="post" />
            <EmptyPlaceholder.Title>No pending applications.</EmptyPlaceholder.Title>
            <EmptyPlaceholder.Description>
              You don&apos;t have applications yet. Start applying now.
            </EmptyPlaceholder.Description>
            <StartApplyButton variant="outline" />
          </EmptyPlaceholder>
        </div>
      </DashboardShell>
    );
  }

  if (applications && !isLoading) {
    return (
      <div>
        {isMobile ? (
          <DashboardShell>
            <DashboardHeader heading="Applications" text="Your submitted applications."/>
            <div>
              {applications.map((application) => (
                <ApplicationItem key={application.job_id} application={application} />
              ))}
            </div>
          </DashboardShell>
        ) : (
          <DashboardShell>
            <div className="hidden md:flex">
              <ApplicationPanel applications={applications} />
            </div>
          </DashboardShell>
        )}
      </div>
    );
  }
}