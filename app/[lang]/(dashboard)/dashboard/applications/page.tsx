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
import { ApplicationMobileList } from "@/components/application-mobile-list";
import { useMediaQuery } from '@react-hook/media-query';
import { getDictionary } from "@/app/[lang]/dictionaries";
import { toast } from "@/components/ui/use-toast";
import { getUnreadApplications } from "@/lib/api/notifications";

export default function ApplicationsPage({ params: { lang } }) {
  const [applications, setApplications] = useState<Application[] | null>(null);
  const [unreadIDs, setUnreadIDs] = useState<number[] | null>(null);
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
      } else if (dict) {
        const {response, err} = await getApplications();

        if (err || !response) {
          return toast({
            title: dict.errors[err || "500"].title || dict.errors.generic.title,
            description: dict.errors[err || "500"].description || dict.errors.generic.description,
            variant: "destructive",
          })
        } else {
          setApplications(response);
        }
      }
      setIsLoading(false)
    };
    fetchApplications();

    const fetchUnreadApplicationNotifications = async () => {
      if (dict) {
        const {response, err} = await getUnreadApplications();

        if (err || !response) {
          return toast({
            title: dict.errors[err || "500"].title || dict.errors.generic.title,
            description: dict.errors[err || "500"].description || dict.errors.generic.description,
            variant: "destructive",
          })
        } else {
          setUnreadIDs(response);
        }
      }
    };
    fetchUnreadApplicationNotifications();
  }, [router, lang, dict] );

  if (isLoading) {
    return <ApplicationsLoading params={{lang: lang}}/>
  }

  if (!applications && !isLoading || applications && applications.length === 0 && !isLoading) {
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

  if (applications && unreadIDs && !isLoading) {
    return dict && (
      <div>
        {isMobile ? (
          <DashboardShell>
            <DashboardHeader heading={dict.dashboard.applications.title} text={dict.dashboard.applications.subtitle}/>
            <ApplicationMobileList applications={applications} params={{lang: lang}} />
          </DashboardShell>
        ) : (
          <DashboardShell>
            <div className="hidden md:flex">
              <ApplicationPanel applications={applications} params={{ lang: lang }} unreadIDs={[]} />
            </div>
          </DashboardShell>
        )}
      </div>
    );
  }
}