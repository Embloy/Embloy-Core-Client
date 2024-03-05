"use client"

import { getCurrentUser, User } from "@/lib/api/session"
import DashboardSettingsLoading from './../loading';
import { getDictionary } from "@/app/[lang]/dictionaries";
import { Separator } from "@/components/new-york/ui/separator"
import { useEffect, useState } from "react";
import { NotificationsForm } from "./notifications-form"

export default function SettingsNotificationsPage({ params: {lang} }) {
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
  return dict && (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">{dict.dashboard.settings.notifications.title}</h3>
        <p className="text-sm text-muted-foreground">
          {dict.dashboard.settings.notifications.description}
        </p>
      </div>
      <Separator />
      <NotificationsForm params={{ lang: lang }} user={user}/>
    </div>
  )
}
