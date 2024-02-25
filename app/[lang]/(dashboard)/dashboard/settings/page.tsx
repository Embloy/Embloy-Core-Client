"use client"

import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation"
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
  const router = useRouter()

  useEffect(() => {
    const fetchDictionary = async () => {
      const dictionary = await getDictionary(lang);
      setDict(dictionary);
    };

    fetchDictionary();
    const fetchUser = async () => {
      setIsLoading(true);
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        router.push(`/${lang}/login`);
      } else {
        setUser(currentUser);
      }
      setIsLoading(false);
    };

    fetchUser();
  }, [router, lang]);

  if (isLoading) {
    return <DashboardSettingsLoading params={{lang: lang}}/>
  }

  if (!user && !isLoading) {
    return null;
  }

  if (user && !isLoading) {
    return dict && (
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