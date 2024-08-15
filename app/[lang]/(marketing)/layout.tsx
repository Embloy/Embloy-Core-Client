"use client"

import { useEffect, useState } from 'react';
import { getCurrentUser, User } from '@/lib/api/session';
import { UserAccountNav } from "@/components/user-account-nav"

import Link from "next/link"
import { useSearchParams } from "next/navigation";
import { marketingConfig } from "@/config/marketing"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { MainNav } from "@/components/main-nav"
import { SiteFooter } from "@/components/site-footer"
import Loading from "../(sdk)/sdk/apply/loading";
import { getDictionary } from "../dictionaries";
import {Locale} from "../../../i18n-config";
import { Separator } from "@radix-ui/react-select";
import { LanguageToggle } from "@/components/language-toggle";
import { ModeToggle } from "@/components/mode-toggle";
import NotificationBell from "@/components/notification-bell";


interface MarketingLayoutProps {
  children: React.ReactNode;
  params: {
    lang: Locale;
  };
}

export default function MarketingLayout({ children, params: { lang } }: MarketingLayoutProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dict, setDict] = useState<Record<string, any> | null>(null);
  const refreshToken = useSearchParams().get('refresh_token');

  useEffect(() => {
    const fetchDictionaryAndUser = async () => {
      const dictionary = await getDictionary(lang);
      setDict(dictionary);

      setIsLoading(true);  
      const {response, err} = await getCurrentUser(refreshToken ?? undefined);
      setIsLoading(false);  

      if (response) setUser(response)

    };

    fetchDictionaryAndUser();
  }, [lang, dict, refreshToken]);

  if (isLoading) {
    return <Loading/>;
  }

  if (user) {
    return dict && user && (
      <div className="flex min-h-screen flex-col">
        <header className="container top-0 z-40">
          <div className="flex h-16 items-center justify-between py-6">
            <MainNav items={marketingConfig.mainNav} params={{lang: lang}} />
            <div className="flex items-center">
              <div className="mx-6 md:flex">
                <div className="hidden md:flex">
                  <LanguageToggle />
                  <Separator className="mx-1"/>
                  <ModeToggle params={{lang: lang}}/>
                </div>
                  <Separator className="mx-1"/>
                  <NotificationBell params={{lang: lang}}/>
              </div>
              <UserAccountNav
                user={{
                  first_name: `${user.first_name}`,
                  last_name: `${user.last_name}`,
                  image_url: user.image_url,
                  email: user.email,
                }}
                params={{lang: lang}}
              />
            </div>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <SiteFooter className="border-t" params={{lang: lang}} />
      </div>
    )
  } else {
    return dict && (
      <div className="flex min-h-screen flex-col">
        <header className="container z-40">
        <div className="flex h-16 items-center justify-between py-4">
          <MainNav items={marketingConfig.mainNav} params={{lang: lang}} />
          <div className="flex items-center">
            <div className="mx-6 hidden md:flex">
              <LanguageToggle />
              <Separator className="mx-1"/>
              <ModeToggle params={{lang: lang}}/>
            </div>
            <nav>
              <Link
                href={`/${lang}/login`}
                className={cn(
                  buttonVariants({ variant: "secondary", size: "sm" }),
                  "px-4"
                )}
              >
                {dict.pages.login}
              </Link>
            </nav>
          </div>
        </div>
      </header>
        <main className="flex-1">{children}</main>
        <SiteFooter className="" params={{lang: lang}} />
      </div>
    )
  }
}
