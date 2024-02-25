"use client"

import { redirect } from "next/navigation"
import { dashboardConfig } from "@/config/dashboard"
import { useEffect, useState } from 'react';
import { getCurrentUser, User } from '@/lib/api/session';
import { MainNav } from "@/components/main-nav"
import { DashboardNav } from "@/components/nav"
import { SiteFooter } from "@/components/site-footer"
import { UserAccountNav } from "@/components/user-account-nav"
import { getDictionary } from "../../dictionaries";
import {Locale} from "../../../../i18n-config";
import { ModeToggle } from "@/components/mode-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { Separator } from "@radix-ui/react-select";

interface DashboardLayoutProps {
  children?: React.ReactNode
  params: {
    lang: Locale
  }
}

export default function DashboardLayout({ children, params: { lang } }: DashboardLayoutProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dict, setDict] = useState<Record<string, any> | null>(null);

  useEffect(() => {
    const fetchDictionary = async () => {
      const dictionary = await getDictionary(lang);
      setDict(dictionary);
    };

    fetchDictionary();

    const fetchUser = async () => {
      const currentUser = await getCurrentUser();
      setIsLoading(false);  
      if (currentUser) {
        setUser(currentUser);
      }
    };

    fetchUser();
  }, [lang]);

  if (isLoading) {
    // You can return a loading spinner here
    return null;
  }

  if (!user) {
    redirect(`/${lang}/login`);
  }


  return dict && (
    <div className="flex min-h-screen flex-col space-y-6">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <MainNav items={dashboardConfig.mainNav} params={{lang: lang}} />
          <div className="flex items-center">
            <div className="mx-6 hidden md:flex">
              <LanguageToggle />
              <Separator className="mx-1"/>
              <ModeToggle params={{lang: lang}}/>
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
      <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr]">
        <aside className="hidden w-[200px] flex-col md:flex">
          <DashboardNav items={dashboardConfig.sidebarNav} params={{lang: lang}} />
        </aside>
        <main className="flex w-full flex-1 flex-col overflow-hidden">
          {children}
        </main>
      </div>
      <SiteFooter id="footer" className="border-t" params={{lang: lang}} />
    </div>
  )
}
