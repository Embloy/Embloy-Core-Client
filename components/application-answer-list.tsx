import { useEffect, useState } from "react"
import { Locale } from "@/i18n-config"
import { DownloadCloud } from "lucide-react"

import { Application } from "@/lib/api/application"
import { Button } from "@/components/new-york/ui/button"
import { ScrollArea } from "@/components/new-york/ui/scroll-area"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/new-york/ui/tooltip"
import { getDictionary } from "@/app/[lang]/dictionaries"

interface ApplicationAnswerListProps {
  application: Application
  params: {
    lang: Locale
  }
}

export function ApplicationAnswerList({
  application,
  params: { lang },
}: ApplicationAnswerListProps) {
  const [dict, setDict] = useState<Record<string, any> | null>(null)

  useEffect(() => {
    const fetchDictionary = async () => {
      const dictionary = await getDictionary(lang)
      setDict(dictionary)
    }
    fetchDictionary()
  }, [lang])

  return (
    dict && (
      <ScrollArea className="h-screen" style={{ height: "50vh" }}>
        <div className="space-y-4 p-4">
          {application?.job?.application_options?.map((option) => {
            const answer = application?.application_answers?.find(
              (answer) => answer.application_option_id === option.id
            )
            return (
              <div key={option.id} className="flex flex-col space-y-2">
                <div className="text-xs text-muted-foreground">
                  {option.question}
                </div>
                {answer ? (
                  <div>
                    {answer.attachment ? (
                      <div className="ml-auto flex items-center gap-2">
                        <p className="text-sm text-foreground">
                          {dict.dashboard.applications.yourSubmission}
                        </p>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              disabled={!answer.attachment?.url}
                              onClick={() =>
                                window.open(answer.attachment?.url, "_blank")
                              }
                            >
                              <DownloadCloud className="size-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {dict.dashboard.applications.downloadAttachment}
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    ) : (
                      <div
                        className="rounded-lg border bg-secondary p-2 text-sm font-semibold"
                        style={{
                          maxWidth:
                            answer?.answer && answer.answer.length < 100
                              ? "none"
                              : "1100px",
                          overflowWrap: "break-word",
                        }}
                      >
                        {answer?.answer || dict.dashboard.applications.noAnswerProvided}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="rounded-lg border bg-secondary p-2 text-sm font-light italic text-muted-foreground">
                    {dict.dashboard.applications.noAnswerProvided}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </ScrollArea>
    )
  )
}
