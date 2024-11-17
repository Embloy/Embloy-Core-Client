import React, { ComponentProps } from "react"
import { Locale, parseLocale } from "@/i18n-config"
import formatDistanceToNow from "date-fns/formatDistanceToNow"

import { Application } from "@/lib/api/application"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/new-york/ui/badge"
import { ScrollArea } from "@/components/new-york/ui/scroll-area"
import { useApplication } from "@/app/[lang]/(dashboard)/dashboard/applications/use-application"
import { getDictionary } from "@/app/[lang]/dictionaries"

interface ApplicationListProps {
  applications: Application[]
  unreadIDs: number[]
  params: {
    lang: Locale
  }
}

export function ApplicationList({
  applications,
  unreadIDs,
  params: { lang },
}: ApplicationListProps) {
  const [application, setApplication] = useApplication(applications)
  const [dict, setDict] = React.useState<Record<string, any> | null>(null)

  React.useEffect(() => {
    const fetchDictionary = async () => {
      const dictionary = await getDictionary(lang)
      setDict(dictionary)
    }
    fetchDictionary()
  }, [lang])

  return (
    dict && (
      <>
        <ScrollArea className="h-screen" style={{ height: "70vh" }}>
          <div className="flex flex-col gap-2 p-4 pt-0">
            {applications
              .sort(
                (a, b) =>
                  new Date(b.updated_at).getTime() -
                  new Date(a.updated_at).getTime()
              )
              .map((item) => (
                <button
                  key={item.job_id}
                  className={cn(
                    "applications-start flex flex-col gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
                    application.selected === item.job_id && "bg-muted"
                  )}
                  onClick={() =>
                    setApplication({
                      ...application,
                      selected: item.job_id,
                    })
                  }
                >
                  <div className="flex w-full flex-col gap-1">
                    <div className="applications-center flex">
                      <div className="applications-center flex gap-2">
                        <div className="font-semibold">
                          {item.job?.title ||
                            item.job?.job_slug ||
                            `Job#${item.job_id}`}
                        </div>
                        {unreadIDs.includes(item.job_id) && (
                          <span className="flex size-2 rounded-full bg-blue-600" />
                        )}
                      </div>
                      <div
                        className={cn(
                          "ml-auto text-xs",
                          application.selected === item.job_id
                            ? "text-foreground"
                            : "text-muted-foreground"
                        )}
                      >
                        {formatDistanceToNow(new Date(item.updated_at), {
                          addSuffix: true,
                          locale: parseLocale(lang),
                        })}
                      </div>
                    </div>
                    <div className="text-xs font-medium">
                      {item.job?.employer?.employer_name ||
                        item.job?.employer?.employer_email ||
                        `User#${item.job?.user_id}`}
                    </div>
                  </div>
                  <div className="line-clamp-2 text-xs text-muted-foreground">
                    {item.job?.position?.substring(0, 300)}
                  </div>
                  <div className="applications-center flex gap-2">
                    <Badge
                      key={item.status}
                      variant={getBadgeVariantFromLabel(item.status)}
                    >
                      {getTextFromLabel(item.status, dict)}
                    </Badge>
                  </div>
                </button>
              ))}
          </div>
        </ScrollArea>
      </>
    )
  )
}

export function getBadgeVariantFromLabel(
  label: string
): ComponentProps<typeof Badge>["variant"] {
  if (["accepted"].includes(label.toLowerCase())) {
    return "success"
  }

  if (["rejected"].includes(label.toLowerCase())) {
    return "destructive"
  }

  if (["pending"].includes(label.toLowerCase())) {
    return "outline"
  }

  return "secondary"
}

export function getTextFromLabel(label: string, dict: Record<string, any>) {
  if (["rejected"].includes(label.toLowerCase())) {
    return dict.dashboard.applications.status.rejected
  }

  if (["accepted"].includes(label.toLowerCase())) {
    return dict.dashboard.applications.status.accepted
  }

  if (["pending"].includes(label.toLowerCase())) {
    return dict.dashboard.applications.status.pending
  }

  return "secondary"
}
