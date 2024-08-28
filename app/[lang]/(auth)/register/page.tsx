"use client"

import Link from "next/link"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { UserSignUpForm } from "@/components/user-signup-form"
import { useSearchParams } from "next/navigation"
import Image from 'next/image';
import { useState, useEffect } from "react"
import { getDictionary } from "../../dictionaries"

export default function RegisterPage({ params: { lang } }) {
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
    <div className="container grid h-screen w-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
      <Link
        href={origin ? `/${lang}/login?origin=${origin}` : `/${lang}/login`}
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute right-4 top-4 md:right-8 md:top-8"
        )}
      >
        {dict.auth.register.login}
      </Link>
      <Image 
        src="/images/register.png" 
        alt="Description of the image" 
        width={842}
        height={842}
        className="hidden size-full object-cover dark:hidden lg:block" 
      />
      <Image 
        src="/images/register-dark.jpg" 
        alt="Description of the image" 
        width={842}
        height={842}
        className="hidden size-full object-cover dark:lg:block" 
      />
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <Icons.logo className="mx-auto size-6" />
            <h1 className="text-2xl font-semibold tracking-tight">
              {dict.auth.register.createAccount}
            </h1>
            <p className="text-sm text-muted-foreground">
            {dict.auth.register.enterDetails}
            </p>
          </div>
          <UserSignUpForm params={{lang: lang}} />
          <p className="px-8 text-center text-sm text-muted-foreground">
          {dict.auth.register.agreeToTerms}
            <Link
              href={`/${lang}/resources/terms`}
              target="_blank"
              className="hover:text-brand underline underline-offset-4"
            >
              {dict.auth.register.terms}
            </Link>{dict.auth.register.and}
            <Link
              href={`/${lang}/resources/privacy`}
              target="_blank"
              className="hover:text-brand underline underline-offset-4"
            >
              {dict.auth.register.privacyPolicy}
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
