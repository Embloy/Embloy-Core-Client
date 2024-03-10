import { getDictionary } from "@/app/[lang]/dictionaries";
import { ScrollArea } from "@/components/new-york/ui/scroll-area";
import { Locale } from "@/i18n-config";
import { Application } from "@/lib/api/application";
import { useState, useEffect } from "react";

interface ApplicationAnswerListProps {
  application: Application;
  params: {
    lang: Locale
  }
}

export function ApplicationAnswerList({ application, params: {lang} }: ApplicationAnswerListProps) {
  const [dict, setDict] = useState<Record<string, any> | null>(null);
  
  useEffect(() => {
    const fetchDictionary = async () => {
      const dictionary = await getDictionary(lang);
      setDict(dictionary);
    };
    fetchDictionary();
  }, [lang] );

  return dict && (
    <ScrollArea className="h-screen" style={{ height: "50vh" }}>
      <div className="space-y-4 p-4">
        {application?.job?.application_options?.map((option) => (
          <div key={option.id} className="flex flex-col space-y-2">
              <div className="text-xs text-muted-foreground">{option.question}</div>
            {application?.application_answers?.find((answer) => answer.application_option_id === option.id) ? (
              <div className="rounded-lg border bg-secondary p-2 text-sm font-semibold">
                <div>{application.application_answers.find((answer) => answer.application_option_id === option.id)?.answer}</div>
              </div>
            ) : (
              <div className="rounded-lg border bg-secondary p-2 text-sm font-light italic text-muted-foreground">{dict.dashboard.applications.noAnswerProvided}</div>
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}