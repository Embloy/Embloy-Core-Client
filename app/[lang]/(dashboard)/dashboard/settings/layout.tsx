"use client"

import { useState, useEffect } from 'react';
import { getDictionary } from '@/app/[lang]/dictionaries';
import { SettingsNav } from "@/components/settings-nav"
import { Locale } from '@/i18n-config';
import { DashboardHeader } from '@/components/header';
import { DashboardShell } from '@/components/shell';
import { Card, CardContent } from '@/components/ui/card';

const sidebarNavItems = [
  {
    title: "Profile",
    href: "/dashboard/settings",
    disabled: false,
  },
  {
    title: "Account",
    href: "/dashboard/settings/account",
    disabled: true,
  },
  {
    title: "Appearance",
    href: "/dashboard/settings/appearance",
    disabled: false,
  },
  {
    title: "Notifications",
    href: "/dashboard/settings/notifications",
    disabled: false,
  },
  {
    title: "Security",
    href: "/dashboard/settings/password",
    disabled: false,
  },
]

interface SettingsLayoutProps {
  children: React.ReactNode
  params: {
    lang: Locale
  }
}

export default function SettingsLayout({ children, params: { lang } }: SettingsLayoutProps) {
  const [dict, setDict] = useState<Record<string, any> | null>(null);

  useEffect(() => {
    const fetchDictionary = async () => {
      const dictionary = await getDictionary(lang);
      setDict(dictionary);
    };

    fetchDictionary()
  }, [lang, dict]);

  return dict && (
    <>
      <DashboardShell>
        <DashboardHeader
          heading={dict.dashboard.settings.title}
          text={dict.dashboard.settings.subtitle}
        />
        <Card>
          <CardContent className="mt-4">
            <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
              <aside className="-mx-4 lg:w-1/5">
                <SettingsNav items={sidebarNavItems} params={{lang: lang}} />
              </aside>
              <div className="flex-1 lg:max-w-3xl">{children}</div>
            </div>
          </CardContent>
        </Card>
      </DashboardShell>
    </>
  )
}
