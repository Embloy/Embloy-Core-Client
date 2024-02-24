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
import { getDictionary } from "@/app/[lang]/dictionaries";

export default function ApplicationsPage({ params: { lang } }) {
  const [applications, setApplications] = useState<Application[] | null>(null);
  const [isLoading, setIsLoading] = useState<Boolean>(true);
  const [dict, setDict] = useState<Record<string, any> | null>(null);
  const router = useRouter()
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    const fetchDictionary = async () => {
      const dictionary = await getDictionary(lang);
      setDict(dictionary);
    };
    fetchDictionary();

    const fetchApplications = async () => {
      setIsLoading(true);
      const loggedIn = (await getSession()).session;
      if (!loggedIn) {
        router.push(`/${lang}/login`)
      } else {
        const apps = await getApplications();
        setApplications(apps);
      }
      setIsLoading(false);
    };

    fetchApplications();
  }, [router, lang] );

  if (isLoading) {
    return <ApplicationsLoading params={lang}/>
  }

  if (!applications && !isLoading) {
    return dict && (
      <DashboardShell>
        <DashboardHeader heading={dict.dashboard.applications.title} text={dict.dashboard.applications.subtitle}>
        <StartApplyButton params={{lang: lang}} />
        </DashboardHeader>
        <div>
          <EmptyPlaceholder>
            <EmptyPlaceholder.Icon name="post" />
            <EmptyPlaceholder.Title>{dict.dashboard.applications.noPending}</EmptyPlaceholder.Title>
            <EmptyPlaceholder.Description>
              {dict.dashboard.applications.startApply}  
            </EmptyPlaceholder.Description>
            <StartApplyButton params={{lang: lang}} variant="outline" />
          </EmptyPlaceholder>
        </div>
      </DashboardShell>
    );
  }

  if (applications && !isLoading) {
    return dict && (
      <div>
        {isMobile ? (
          <DashboardShell>
            <DashboardHeader heading={dict.dashboard.applications.title} text={dict.dashboard.applications.subtitle}/>
            <div>
              {applications.map((application) => (
                <ApplicationItem key={application.job_id} application={application} params={{lang: lang}} />
              ))}
            </div>
          </DashboardShell>
        ) : (
          <DashboardShell>
            <div className="hidden md:flex">
              <ApplicationPanel applications={applications} params={{lang: lang}} />
            </div>
          </DashboardShell>
        )}
      </div>
    );
  }
}