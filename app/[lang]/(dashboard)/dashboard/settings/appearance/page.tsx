"use client"

import { getDictionary } from "@/app/[lang]/dictionaries";
import { Separator } from "@/components/new-york/ui/separator"
import { useEffect, useState } from "react";
import { AppearanceForm } from "./appearance-form"

export default function SettingsAppearancePage({params: {lang}}) {
  const [dict, setDict] = useState<Record<string, any> | null>(null);

  useEffect(() => {
    const fetchDictionary = async () => {
      const dictionary = await getDictionary(lang);
      setDict(dictionary);
    };

    fetchDictionary()
  }, [lang, dict]);

  return dict && (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">{dict.dashboard.settings.appearance.title}</h3>
        <p className="text-sm text-muted-foreground">
        {dict.dashboard.settings.appearance.description}
        </p>
      </div>
      <Separator />
      <AppearanceForm params={{lang: lang}} />
    </div>
  )
}
