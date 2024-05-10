"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { Locale, parseLocale } from "@/i18n-config"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import { Separator } from "@radix-ui/react-dropdown-menu"
import { format } from "date-fns"
import { DownloadCloud } from "lucide-react"

import { Application } from "@/lib/api/application"
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer"
import { Badge } from "@/components/new-york/ui/badge"
import { getDictionary } from "@/app/[lang]/dictionaries"

import { getBadgeVariantFromLabel, getTextFromLabel } from "../application-list"
import { ApplicationResponse } from "../application-response"
import { Icons } from "../icons"
import { Button } from "../new-york/ui/button"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../new-york/ui/carousel"
import { Card, CardContent } from "./card"

interface ApplicationItemProps {
  applications: Application[]
  params: {
    lang: Locale
  }
}

export function ApplicationMobileList({
  applications,
  params: { lang },
}: ApplicationItemProps) {
  const [dict, setDict] = React.useState<Record<string, any> | null>(null)
  const [openApplication, setOpenApplication] =
    React.useState<Application | null>(null)
  const searchParams = useSearchParams()
  const jobSlug = searchParams.get("slug")

  React.useEffect(() => {
    if (searchParams.has("slug") && applications) {
      const application = applications.find(
        (app) => app.job?.job_slug === jobSlug
      )

      if (application) {
        setOpenApplication(application)
      }

      return
    }

    const fetchDictionary = async () => {
      const dictionary = await getDictionary(lang)
      setDict(dictionary)
    }
    fetchDictionary()
  }, [lang, searchParams, jobSlug, applications])

  const downloadAttachment = (application: Application | null) => {
    if (
      application &&
      application.application_attachment &&
      application.application_attachment.url
    ) {
      const cvUrl = application.application_attachment.url
      const link = document.createElement("a")
      const extension = cvUrl.split(".").pop()

      console.log("CVURL = ", cvUrl)
      console.log("Extension = ", extension)
      link.href = cvUrl
      console.log(
        "Filename = ",
        `application_${application.job_id}.${extension}`
      )
      link.setAttribute(
        "download",
        `application_${application.job_id}.${extension}`
      ) // Set the download attribute with the correct extension
      link.setAttribute("target", "_blank")
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    dict && (
      <div className="h-full space-y-2 overflow-y-auto">
        {applications.map((application, index) => (
          <div className="mt-5 overflow-y-auto">
            <Drawer key={index}>
              <DrawerTrigger asChild>
                <Card>
                  <CardContent className="flex items-center justify-between overflow-x-hidden px-2 py-4">
                    <div className="grid grid-cols-3 items-center">
                      <div className="col-span-1 mr-2">
                        <Avatar>
                          {application.job?.employer_image_url ? (
                            <div className="size-12 overflow-hidden rounded-full">
                              <AvatarImage
                                alt="Picture"
                                src={application.job?.employer_image_url}
                                className="size-12 rounded-full border-2 border-muted-foreground text-muted-foreground"
                              />
                            </div>
                          ) : (
                            <AvatarFallback>
                              <Icons.user className="size-12 rounded-full border-2 border-muted-foreground text-muted-foreground" />
                            </AvatarFallback>
                          )}
                        </Avatar>
                      </div>
                      <p className="col-span-2 text-sm">
                        {application.job?.title}
                      </p>
                    </div>
                    <Badge
                      className="ml-2"
                      key={application.status}
                      variant={getBadgeVariantFromLabel(application.status)}
                    >
                      {getTextFromLabel(application.status, dict)}
                    </Badge>
                  </CardContent>
                </Card>
              </DrawerTrigger>
              <DrawerContent>
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start p-4">
                    <div className="flex items-start gap-4 text-sm">
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
                          {application.updated_at && (
                            <div className="ml-auto text-xs text-muted-foreground">
                              {format(
                                new Date(application.updated_at),
                                "PPpp",
                                {
                                  locale: parseLocale(lang),
                                }
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="ml-auto flex items-center gap-2 p-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={!application?.application_attachment?.url}
                        onClick={() => downloadAttachment(application)}
                      >
                        <DownloadCloud className="size-6" />
                        <span className="sr-only">
                          {dict.dashboard.applications.downloadAttachment}
                        </span>
                      </Button>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex-1 space-y-2 whitespace-pre-wrap p-4 text-sm">
                    <p className="text-xs text-muted-foreground">
                      {dict.dashboard.applications.youWrote}
                    </p>
                    {application.application_text}
                  </div>
                  <Separator className="mt-auto" />
                  <div className="overflow-auto p-2">
                    <ApplicationResponse
                      application={application}
                      params={{ lang: lang }}
                    />
                  </div>
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        ))}
      </div>
    )
  )
}
