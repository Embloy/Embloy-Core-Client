import { getDictionary } from "@/app/[lang]/dictionaries"
import { Button } from "@/components/new-york/ui/button"
import { Label } from "@/components/new-york/ui/label"
import { Switch } from "@/components/new-york/ui/switch"
import { Locale } from "@/i18n-config"
import { Application } from "@/lib/api/application"
import React from "react"

interface ApplicationResponseProps {
  application: Application
  params: {
    lang: Locale
  }
}

export function ApplicationResponse({ application, params: {lang} }: ApplicationResponseProps) {
  let statusColor: string | null ;
  const [dict, setDict] = React.useState<Record<string, any> | null>(null);
 
  React.useEffect(() => {
    const fetchDictionary = async () => {
      const dictionary = await getDictionary(lang);
      setDict(dictionary);
    };
    fetchDictionary();
  }, [lang] );


  switch (application.status) {
    case 'pending':
      statusColor =  'border-2 border-muted-foreground';
      break;
    case 'accepted':
      statusColor = "border-2 border-success";
      break;
    case 'rejected':
      statusColor = "border-2 border-destructive";
      break;
    default:
      statusColor = 'border-2 border-muted-foreground';
  }

  return dict && statusColor ? (
    <div className="md:p-4">
      <div className="grid gap-4">
        <div className="grid gap-4">
        {application.response ? (
          <div className={`rounded-lg bg-secondary p-4 text-xs sm:text-base text-secondary-foreground ${statusColor}`}>
            {application.response}
          </div>
        ) : (
          <div className={`rounded-lg bg-secondary p-4 text-xs sm:text-base text-secondary-foreground ${statusColor}`}>
            {dict.dashboard.applications.noResponseYet}
          </div>
        )}
      </div>
      <div className="flex items-center">
        <Label
          htmlFor="mute"
          className="gap-2 text-xs sm:text-base font-normal"
        >
          <Switch id="mute" aria-label="Mute thread" /> {dict.dashboard.applications.muteJobNotifications}
        </Label>
        {application.response ? (
          <Button
            onClick={(e) => e.preventDefault()}
            size="sm"
            className="ml-auto"
          >
            {dict.dashboard.applications.reviewEmployer}
          </Button>
        ) : (
          <Button
            size="sm"
            className="ml-auto"
            disabled
          >
            {dict.dashboard.applications.reviewEmployer}
          </Button>
        )}
      </div>
    </div>
  </div>        
) : null;
}