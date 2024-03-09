"use client"

import Link from "next/link"

import { useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { getDictionary } from "../../../../dictionaries"
import { getCurrentUser, User } from "@/lib/api/session"
import DashboardSettingsLoading from "../loading"
import { PasswordSettingsForm } from "@/components/password-settings-form"
import { Separator } from "@/components/new-york/ui/separator"

export default function PasswordResetPage({ params: { lang } }) {
  const origin = useSearchParams().get("origin") as string
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

  return dict && user && (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">{dict.auth.pwupdate.title}</h3>
        <p className="text-sm text-muted-foreground">
        {dict.auth.pwupdate.enterPassword}
        </p>
      </div>
      <Separator/>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
        <div className="flex flex-col space-y-2 text-center">
          <PasswordSettingsForm params={{lang: lang}} />
          <p className="px-8 text-center text-sm text-muted-foreground">
            <Link
              href={origin ? `/${lang}/password-reset?origin=${origin}` : `/${lang}/password-reset?origin=/dashboard/settings`}
              className="hover:text-brand underline underline-offset-4"
            >
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}