import { useEffect, useState } from "react"
import { CalendarIcon } from "@radix-ui/react-icons"
import { parseISO } from "date-fns"
import { createEvent } from "ics"
import { ExternalLink } from "lucide-react"

import { Job } from "@/types/job-schema"
import { formatDate } from "@/lib/utils"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/new-york/ui/avatar"
import { getDictionary } from "@/app/[lang]/dictionaries"

import { Separator } from "./new-york/ui/separator"
import { jobTypeColorClasses } from "./table-data"

interface UpcomingJobsProps {
  jobs: Job[]
  params: { lang: any }
}
export const exportToCalendar = (startSlot: string, jobTitle: string) => {
  const startDate = parseISO(startSlot)
  const endDate = new Date(startDate)
  endDate.setDate(startDate.getDate() + 1) // Adding 1 day

  createEvent(
    {
      start: [
        startDate.getFullYear(),
        startDate.getMonth() + 1,
        startDate.getDate(),
      ],
      end: [endDate.getFullYear(), endDate.getMonth() + 1, endDate.getDate()],
      title: jobTitle,
    },
    (error, value) => {
      if (error) {
        console.error(error)
        return
      }
      const filename = "Embloy" + jobTitle.replace(/\s/g, "_") + ".ics"
      const blob = new Blob([value], { type: "text/calendar" })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
    }
  )
}

export function UpcomingJobs({ jobs, params: { lang } }: UpcomingJobsProps) {
  const [dict, setDict] = useState<Record<string, any> | null>(null)

  useEffect(() => {
    const fetchDictionary = async () => {
      const dictionary = await getDictionary(lang)
      setDict(dictionary)
    }
    fetchDictionary()
  }, [lang, dict])

  return (
    dict && (
      <Accordion type="single" collapsible className="w-full">
        {jobs.map((job) => (
          <AccordionItem value={job.id.toString()} key={job.id}>
            <AccordionTrigger>
              <div className="flex items-center justify-start">
                <Avatar className="size-9">
                  <AvatarImage
                    src={job?.employer?.employer_image_url || "/avatars/01.png"}
                    alt="Avatar"
                  />
                  <AvatarFallback>
                    {job?.employer?.employer_name?.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1 text-left">
                  <p className="text-sm font-medium leading-none">
                    {job?.employer?.employer_name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {job?.employer?.employer_email}
                  </p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="ml-4 items-center justify-start space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {job.position}
                  </p>
                  {/*<p className="ml-auto font-medium">+{job.currency} {job.salary}</p>
              </div>      
              <div className="flex space-x-2">*/}
                  {job.job_type &&
                    (() => {
                      let colorClasses = jobTypeColorClasses[job.job_type]
                      if (!colorClasses) {
                        colorClasses =
                          "cursor-text px-4 py-1 bg-gray-100 dark:bg-gray-950 rounded-full border border-gray-600 dark:border-gray-500 font-normal text-gray-600 dark:text-gray-500 text-xs"
                      }
                      return (
                        <span
                          className={`items-left inline-flex rounded-full px-3 py-0.5 text-sm font-medium ${colorClasses}`}
                        >
                          {job.job_type}
                        </span>
                      )
                    })()}
                </div>
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="size-5 text-gray-400" />
                  <p className="text-sm text-muted-foreground">
                    {formatDate(
                      lang,
                      job.start_slot ?? new Date().toISOString()
                    )}
                  </p>
                  <button
                    className="text-sm text-blue-500 underline"
                    onClick={() =>
                      exportToCalendar(
                        job.start_slot ?? new Date().toISOString(),
                        job.position ??
                          job.title ??
                          job?.employer?.employer_name ??
                          job.job_slug
                      )
                    }
                  >
                    {dict.dashboard.upcoming.t.rowActions.calendar}
                  </button>
                </div>
                <Separator className="bg-muted" />
                {job.referrer_url && (
                  <div className="flex items-center space-x-2">
                    <ExternalLink className="size-5 text-gray-400" />
                    <a
                      href={job.referrer_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-500 underline"
                    >
                      {dict.dashboard.upcoming.t.columns.employerURL}
                    </a>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    )
  )
}
