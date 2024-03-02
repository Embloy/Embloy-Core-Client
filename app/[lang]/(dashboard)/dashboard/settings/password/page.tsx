"use client"

import Link from "next/link"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { getDictionary } from "../../../../dictionaries"
import { getCurrentUser, User } from "@/lib/api/session"
import DashboardSettingsLoading from "../loading"
import { PasswordSettingsForm } from "@/components/password-settings-form"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

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
    <>
      <Card>
        <CardHeader>
          <CardTitle>{dict.auth.pwupdate.title}</CardTitle>
            <CardDescription>
              {dict.auth.pwupdate.enterPassword}
            </CardDescription>
          </CardHeader>
        <CardContent className="space-y-4">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
            <div className="flex flex-col space-y-2 text-center">
            <PasswordSettingsForm params={{lang: lang}} />
            <p className="px-8 text-center text-sm text-muted-foreground">
              <Link
                href={origin ? `/${lang}/password-reset?origin=${origin}` : `/${lang}/password-reset?origin=/dashboard/settings`}
                className="hover:text-brand underline underline-offset-4"
              >
                {dict.auth.pwupdate.oauthReset}
              </Link>
            </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}