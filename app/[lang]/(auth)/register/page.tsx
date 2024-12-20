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
import { EmbloySpacer } from "@/components/ui/stuff"



export default function RegisterPage({ params: { lang }, mode}) {
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
    <div className={mode === undefined ? "container grid h-screen w-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0" : "flex flex-col items-center justify-center rounded-lg border-2 bg-low lg:px-16 "}>
      {mode === undefined && 
        <>
        <Link
          href={origin ? `/login?origin=${origin}` : `/login`}
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
      </>
      }
      
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          {mode === undefined ? <div className="flex flex-col space-y-2 text-center">
            <Icons.logo className="mx-auto size-6" />
            <h1 className="text-2xl font-semibold tracking-tight">
              {dict.auth.register.createAccount}
            </h1>
            <p className="text-sm text-muted-foreground">
            {dict.auth.register.enterDetails}
            </p>
          </div>:
          <h1 className="text-2xl font-semibold tracking-tight text-high lg:text-5xl">
            {dict.marketing.signup.head}
          </h1>
          }
          
         {mode !== undefined && <EmbloySpacer className={"h-3"} />}
          <UserSignUpForm params={{lang: lang, mode:mode}}  />
          <p className={mode=== undefined ? "px-8 text-center text-sm text-muted-foreground" : "px-8 text-center text-sm text-black dark:text-muted-foreground"}>
          {dict.auth.register.agreeToTerms}
            <Link
              href={`/resources/terms`}
              target="_blank"
              className="hover:text-brand underline underline-offset-4"
            >
              {dict.auth.register.terms}
            </Link>{dict.auth.register.and}
            <Link
              href={`/resources/privacy`}
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
