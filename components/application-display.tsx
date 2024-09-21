import React, { useEffect, useState } from "react"
import { Locale, parseLocale } from "@/i18n-config"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import { isBefore, isToday } from "date-fns"
import addDays from "date-fns/addDays"
import addHours from "date-fns/addHours"
import format from "date-fns/format"
import nextSaturday from "date-fns/nextSaturday"
import {
  Archive,
  Clock,
  DownloadCloud,
  MoreVertical,
  Trash2,
} from "lucide-react"

import { Application } from "@/lib/api/application"
import {
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/new-york/ui/button"
import { Calendar } from "@/components/new-york/ui/calendar"
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/new-york/ui/dropdown-menu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/new-york/ui/popover"
import { Separator } from "@/components/new-york/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/new-york/ui/tooltip"
import { getDictionary } from "@/app/[lang]/dictionaries"

import { ApplicationAnswerList } from "./application-answer-list"
import { ApplicationResponse } from "./application-response"
import { Icons } from "./icons"

interface ApplicationDisplayProps {
  application: Application | null
  defaultVersion: number
  params: {
    lang: Locale
  }
}

export function ApplicationDisplay({
  application,
  defaultVersion,
  params: { lang },
}: ApplicationDisplayProps) {
  const [deadline, setDeadline] = useState<Date | null>(null)
  const [versionMap, setVersionMap] = useState<Map<number, number>>(new Map())
  const [version, setVersion] = useState<number>(defaultVersion)
  const today = new Date()
  const disabledPastDates = (date) =>
    isBefore(date, new Date()) && !isToday(date)
  const [dict, setDict] = useState<Record<string, any> | null>(null)

  useEffect(() => {
    const fetchDictionary = async () => {
      const dictionary = await getDictionary(lang)
      setDict(dictionary)
    }
    fetchDictionary()
  }, [lang])

  useEffect(() => {
    if (application) {
      const appVersion = versionMap.get(application.job_id) || defaultVersion
      setVersion(appVersion)
    }
  }, [application, versionMap, defaultVersion])

  const downloadAttachment = (application: Application | null) => {
    if (
      application &&
      application.application_attachment &&
      application.application_attachment.url
    ) {
      const cvUrl = application.application_attachment.url
      const link = document.createElement("a")
      link.href = cvUrl
      link.setAttribute(
        "download",
        `${application.user_id}_${application.job_id}_CV}`
      )
      link.setAttribute("target", "_blank")
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const handleSetDeadline = (date: Date) => {
    setDeadline(date)
  }

  return (
    dict && (
      <div className="flex h-full flex-col">
        <div className="flex items-center p-2">
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" disabled={!!application}>
                  <Archive className="size-4" />
                  <span className="sr-only">
                    {dict.dashboard.applications.archive}
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {dict.dashboard.applications.archive}
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" disabled={!!application}>
                  <Trash2 className="size-4" />
                  <span className="sr-only">
                    {dict.dashboard.applications.moveToTrash}
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {dict.dashboard.applications.moveToTrash}
              </TooltipContent>
            </Tooltip>
            <Separator orientation="vertical" className="mx-1 h-6" />
            <Tooltip>
              <Popover>
                <PopoverTrigger asChild>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" disabled={!application}>
                      <Clock className="size-4" />
                      <span className="sr-only">
                        {dict.dashboard.applications.snooze}
                      </span>
                    </Button>
                  </TooltipTrigger>
                </PopoverTrigger>
                <PopoverContent className="flex w-[535px] p-0">
                  <div className="flex flex-col gap-2 border-r px-2 py-4">
                    <div className="px-4 text-sm font-medium">
                      {dict.dashboard.applications.setDeadline1}
                    </div>
                    <div className="grid min-w-[250px] gap-1">
                      <Button
                        variant="ghost"
                        className="justify-start font-normal"
                        onClick={() => handleSetDeadline(addHours(today, 4))}
                      >
                        Later today{" "}
                        <span className="ml-auto text-muted-foreground">
                          {format(addHours(today, 4), "E, h:m b")}
                        </span>
                      </Button>
                      <Button
                        variant="ghost"
                        className="justify-start font-normal"
                        onClick={() => handleSetDeadline(addDays(today, 1))}
                      >
                        {dict.dashboard.applications.tomorrow}
                        <span className="ml-auto text-muted-foreground">
                          {format(addDays(today, 1), "E, h:m b")}
                        </span>
                      </Button>
                      <Button
                        variant="ghost"
                        className="justify-start font-normal"
                        onClick={() => handleSetDeadline(nextSaturday(today))}
                      >
                        {dict.dashboard.applications.thisWeekend}
                        <span className="ml-auto text-muted-foreground">
                          {format(nextSaturday(today), "E, h:m b")}
                        </span>
                      </Button>
                      <Button
                        variant="ghost"
                        className="justify-start font-normal"
                        onClick={() => handleSetDeadline(addDays(today, 7))}
                      >
                        {dict.dashboard.applications.nextWeek}
                        <span className="ml-auto text-muted-foreground">
                          {format(addDays(today, 7), "E, h:m b")}
                        </span>
                      </Button>
                    </div>
                  </div>
                  <div className="p-2">
                    <Calendar
                      onDayClick={handleSetDeadline}
                      disabled={disabledPastDates}
                    />
                  </div>
                </PopoverContent>
              </Popover>
              <TooltipContent>
                {dict.dashboard.applications.setDeadline2}
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={!application?.application_attachment?.url}
                  onClick={() => downloadAttachment(application)}
                >
                  <DownloadCloud className="size-4" />
                  <span className="sr-only">
                    {dict.dashboard.applications.downloadAttachment}
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {dict.dashboard.applications.downloadAttachment}
              </TooltipContent>
            </Tooltip>
          </div>
          <Separator orientation="vertical" className="mx-2 h-6" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" disabled={!application}>
                <MoreVertical className="size-4" />
                <span className="sr-only">More</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem disabled>
                {dict.dashboard.applications.markAsUnread}
              </DropdownMenuItem>
              <DropdownMenuItem disabled>
                {dict.dashboard.applications.starJob}
              </DropdownMenuItem>
              <DropdownMenuItem disabled>
                {dict.dashboard.applications.addLabel}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Separator />
        {application ? (
          <div className="flex flex-1 flex-col overflow-auto">
            <div className="flex items-start p-4">
              <div className="flex items-start gap-4 text-sm">
                {
                  <Avatar>
                    {application.job?.employer_image_url ? (
                      <AvatarImage
                        alt="Picture"
                        src={application.job?.employer_image_url}
                        className="size-12 rounded-full border-2 border-muted-foreground text-muted-foreground"
                      />
                    ) : (
                      <AvatarFallback>
                        <Icons.user className="size-12 rounded-full border-2 border-muted-foreground text-muted-foreground" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                }
                <div className="grid gap-1">
                  <div className="font-semibold">
                    {application.job?.employer_name ||
                      `User#${application.job?.user_id}`}
                  </div>
                  <div className="line-clamp-1 text-xs">
                    {application.job?.employer_email ||
                      application.job?.employer_phone ||
                      dict.dashboard.applications.noContact}
                  </div>
                  <div className="line-clamp-1 text-xs">
                    <span className="font-medium text-muted-foreground">
                      {application.job?.job_slug || `Job#${application.job_id}`}
                    </span>
                  </div>
                </div>
              </div>
              {application.updated_at && (
                <div className="ml-auto text-xs text-muted-foreground">
                  {format(new Date(application.updated_at), "PPpp", {
                    locale: parseLocale(lang),
                  })}
                </div>
              )}
            </div>
            <Separator />
            <div className="flex-1 space-y-2 whitespace-pre-wrap p-4 text-sm">
              <p className="text-xs text-muted-foreground">
                {dict.dashboard.applications.selectApplication}
                {Array.from({ length: application.version }, (_, i) => (
                  <Button
                    variant={i + 1 == version ? "default" : "outline"}
                    size="sm"
                    className="mx-2"
                    key={i}
                    onClick={() => {
                      setVersionMap((prevVersionMap) => {
                        const newVersionMap = new Map(prevVersionMap)
                        newVersionMap.set(application.job_id, i + 1)
                        return newVersionMap
                      })
                      setVersion(i + 1)
                    }}
                  >
                    {dict.dashboard.applications.applicationNr} #{i + 1}
                  </Button>
                ))}
              </p>
            </div>
            <Separator />
            <ApplicationAnswerList
              application={application}
              version={version}
              params={{ lang: lang }}
            />
            <Separator className="mt-auto" />
            <ApplicationResponse
              application={application}
              params={{ lang: lang }}
            />
          </div>
        ) : (
          <div className="p-8 text-center text-muted-foreground">
            {dict.dashboard.applications.noMessageSelected}
          </div>
        )}
      </div>
    )
  )
}
