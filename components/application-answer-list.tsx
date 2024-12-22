import { useEffect, useState } from "react"
import Link from "next/link"
import { Locale } from "@/i18n-config"
import { DownloadCloud } from "lucide-react"

import { siteConfig } from "@/config/site"
import { Application } from "@/lib/api/application"
import { cn } from "@/lib/utils"
import { Button } from "@/components/new-york/ui/button"
import { ScrollArea } from "@/components/new-york/ui/scroll-area"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/new-york/ui/tooltip"
import { getDictionary } from "@/app/[lang]/dictionaries"

import { Callout } from "./callout"
import { buttonVariants } from "./ui/button"

interface ApplicationAnswerListProps {
  application: Application
  version: Number
  params: {
    lang: Locale
  }
}

export function ApplicationAnswerList({
  application,
  version,
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
        <div className="space-y-4 px-4 p-4">
          {application.submitted_at === null && application.version == version && (
            <Callout type="info">
              <span className="align-left">
                {dict.dashboard.applications.draftNotice}
              </span>
              <Link
                href={`${siteConfig.apply_url}/?eType=manual&mode=job&id=${
                  application.user_id
                }&url=${siteConfig.url}/${lang}/board/${application.user_id}/${
                  application.job
                    ? application.job.job_slug
                    : application.job_id
                }`}
                target="_blank"
                className={cn(
                  buttonVariants({ variant: "link", size: "sm" }),
                  "align-right text-sm"
                )}
              >
                {dict.dashboard.applications.editApplication}
              </Link>
            </Callout>
          )}
          {application?.job?.application_options?.map((option) => {
            const answer = application?.application_answers?.find(
              (answer) =>
                answer.application_option_id === option.id &&
                answer.version === version
            )
            return (
              <div key={option.id} className="flex flex-col space-y-2">
                <div className="text-xs text-muted-foreground">
                  {option.question}
                </div>
                {answer && answer?.answer && answer.answer !== "null" ? (
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
                            answer.answer.length < 100 ? "none" : "1100px",
                          overflowWrap: "break-word",
                        }}
                      >
                        {option.question_type === "multiple_choice"
                          ? Array.isArray(JSON.parse(answer.answer))
                            ? JSON.parse(answer.answer).join("; ")
                            : answer.answer
                          : answer.answer}{" "}
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
