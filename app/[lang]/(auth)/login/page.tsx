"use client"

import Link from "next/link"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { UserAuthForm } from "@/components/user-auth-form"
import { useSearchParams } from "next/navigation"
import { getDictionary } from "../../dictionaries"
import { useState, useEffect } from 'react';

export default function LoginPage({ params: { lang } }) {
  const origin = useSearchParams().get("origin") as string
  const [dict, setDict] = useState<Record<string, any> | null>(null);

  useEffect(() => {
    const fetchDictionary = async () => {
      const dictionary = await getDictionary(lang);
      setDict(dictionary);
    };

    fetchDictionary();
  }, [lang]);

  return dict && (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link
          href={origin || `/${lang}`}
          className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute left-4 top-4 md:left-8 md:top-8"
        )}
      >
        <>
          <Icons.chevronLeft className="mr-2 size-4" />
          {dict.auth.login.back}
        </>
      </Link>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <Icons.logo className="mx-auto size-6" />
          <h1 className="text-2xl font-semibold tracking-tight">
            {dict.auth.login.welcomeback}
          </h1>
          <p className="text-sm text-muted-foreground">
            {dict.auth.login.enterEmail}
          </p>
        </div>
        <UserAuthForm params={{lang: lang}} />
        <p className="px-8 text-center text-sm text-muted-foreground">
          <Link
            href={origin ? `/${lang}/register?origin=${origin}` : `/${lang}/register`}
            className="hover:text-brand underline underline-offset-4"
          >
            {dict.auth.login.dontHaveAccount}
          </Link>
        </p>
        <p className="px-8 text-center text-sm text-muted-foreground">
          <Link
            href={origin ? `/${lang}/password-reset?origin=${origin}` : `/${lang}/password-reset`}
            className="hover:text-brand underline underline-offset-4"
          >
            {dict.auth.login.forgotPassword}
          </Link>
        </p>
      </div>
    </div>
  )
}