"use client"

import { useState, useEffect } from 'react';
import { getCurrentUser, User } from "@/lib/api/session"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"
import { UserForm } from "@/components/user-form"
import DashboardSettingsLoading from './loading';
import { getDictionary } from '@/app/[lang]/dictionaries';

export default function SettingsPage({ params: { lang } }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<Boolean>(true);
  const [dict, setDict] = useState<Record<string, any> | null>(null);

  useEffect(() => {
    const fetchDictionaryAndUser = async () => {
      const dictionary = await getDictionary(lang);
      setDict(dictionary);

      setIsLoading(true);  
      const {response} = await getCurrentUser();
      setIsLoading(false);  

      if (response) {
        setUser(response);
      }
    };

    fetchDictionaryAndUser();
  }, [lang, dict]);

  if (isLoading) {
    return <DashboardSettingsLoading params={{lang: lang}}/>
  }

  if (user && !isLoading) {
    return dict && user && (
      <DashboardShell>
        <DashboardHeader
          heading={dict.dashboard.settings.title}
          text={dict.dashboard.settings.subtitle}
        />
        <div className="gri d gap-10">
          <UserForm user={user} params={{lang: lang}} />
        </div>
      </DashboardShell>
    )
  }
}