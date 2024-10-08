"use client"

import { useState, useEffect } from 'react';
import { getCurrentUser, User } from "@/lib/api/session"
import { UserForm } from "@/components/user-form"
import { getDictionary } from '@/app/[lang]/dictionaries';
import DashboardSettingsLoading from './loading';

export default function SettingsProfilePage({ params: {lang} }) {
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

  return user && !isLoading && dict && (
    <div className="space-y-6">
      <UserForm user={user} params={{ lang: lang }} />
    </div>
  )
}
