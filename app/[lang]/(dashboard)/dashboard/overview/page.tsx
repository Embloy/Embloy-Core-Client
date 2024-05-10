"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { addDays } from "date-fns"
import { saveAs } from "file-saver"
import { Search } from "lucide-react"
import { DateRange } from "react-day-picker"

import { Job } from "@/types/job-schema"
import { getUpcomingJobs } from "@/lib/api/jobs"
import { User, getCurrentUser } from "@/lib/api/session"
import { toast } from "@/components/ui/use-toast"
import { CalendarDateRangePicker } from "@/components/date-range-picker"
import { JobTable } from "@/components/job-table"
import { Button } from "@/components/new-york/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/new-york/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/new-york/ui/tabs"
import { Overview } from "@/components/overview"
import { UpcomingJobs } from "@/components/upcoming-jobs"

import { getDictionary } from "../../../dictionaries"
import DashboardLoading from "./loading"

export default function DashboardPage({ params: { lang } }) {
  const [isLoading, setIsLoading] = useState<Boolean>(true)
  const [user, setUser] = useState<User | null>(null)
  const [jobs, setJobs] = useState<Job[]>([])
  const router = useRouter()
  const [dict, setDict] = useState<Record<string, any> | null>(null)
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<
    DateRange | undefined
  >({
    from: new Date(),
    to: addDays(new Date(), 14),
  })

  const exportJobs = () => {
    let filteredJobs = jobs

    if (window.innerWidth > 768) {
      filteredJobs = jobs.filter((job) => {
        const jobDate = new Date(job?.start_slot ?? new Date())
        return (
          jobDate >= (selectedTimeFrame?.from ?? new Date()) &&
          jobDate <= (selectedTimeFrame?.to ?? addDays(new Date(), 14))
        )
      })
    }

    const blob = new Blob([JSON.stringify(filteredJobs)], {
      type: "text/plain;charset=utf-8",
    })
    saveAs(blob, "jobs.json")
  }

  useEffect(() => {
    const fetchDictionary = async () => {
      const dictionary = await getDictionary(lang)
      setDict(dictionary)
    }
    fetchDictionary()

    const fetchJobs = async () => {
      setIsLoading(true)

      const res = await getCurrentUser()
      if (!res.response) {
        router.push(`/${lang}/login`)
      } else if (dict) {
        setUser(res.response)
        const { response, err } = await getUpcomingJobs()

        if (err || !response) {
          return toast({
            title: dict.errors[err || "500"].title || dict.errors.generic.title,
            description:
              dict.errors[err || "500"].description ||
              dict.errors.generic.description,
            variant: "destructive",
          })
        } else {
          setJobs(response || [])
        }
      }
      setIsLoading(false)
    }

    fetchJobs()
  }, [router, lang, dict])

  if (isLoading || !jobs) {
    return <DashboardLoading params={{ lang: lang }} />
  } else {
    return (
      !isLoading &&
      jobs &&
      dict && (
        <>
          <div className="flex flex-col">
            <div className="flex-1 space-y-4 pt-6 md:p-8">
              <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">
                  {dict.dashboard.dashboard.dashboard}
                </h2>
                <div className="flex items-center space-x-2">
                  <Search className="hidden md:block" />
                  <CalendarDateRangePicker
                    className="hidden md:block"
                    onSelect={setSelectedTimeFrame}
                  />
                  <Button onClick={exportJobs}>
                    {dict.dashboard.dashboard.export}
                  </Button>
                </div>
              </div>
              <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="overview">
                    {dict.dashboard.dashboard.overview}
                  </TabsTrigger>
                  <TabsTrigger value="analytics" disabled>
                    {dict.dashboard.dashboard.analytics}
                  </TabsTrigger>
                  <TabsTrigger value="notifications" disabled>
                    {dict.dashboard.dashboard.integrations}
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="analytics" className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <Card className="col-span-4">
                      <CardHeader>
                        <CardTitle>
                          {dict.dashboard.dashboard.overview}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pl-2">
                        <Overview />
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                <TabsContent value="overview" className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          {dict.dashboard.dashboard.summary.yourJobs}
                        </CardTitle>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          className="size-4 text-muted-foreground"
                        >
                          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        </svg>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{jobs.length}</div>
                        <p className="text-xs text-muted-foreground">
                          {dict.dashboard.dashboard.summary.yourJobsDescription}
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          {dict.dashboard.dashboard.summary.applications}
                        </CardTitle>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          className="size-4 text-muted-foreground"
                        >
                          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {user?.applications_count ?? "N/A"}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {
                            dict.dashboard.dashboard.summary
                              .applicationsDescription
                          }
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          {dict.dashboard.dashboard.summary.acceptanceRate}
                        </CardTitle>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          className="size-4 text-muted-foreground"
                        >
                          <rect width="20" height="14" x="2" y="5" rx="2" />
                          <path d="M2 10h20" />
                        </svg>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {user?.applications_count
                            ? jobs.length / user?.applications_count
                            : "N/A"}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {
                            dict.dashboard.dashboard.summary
                              .acceptanceRateDescription
                          }
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          {dict.dashboard.dashboard.summary.profileViews}
                        </CardTitle>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          className="size-4 text-muted-foreground"
                        >
                          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                        </svg>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {user?.view_count ?? "N/A"}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {
                            dict.dashboard.dashboard.summary
                              .profileViewsDescription
                          }
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="grid grid-cols-2 gap-4 2xl:grid-cols-7">
                    <Card className="col-span-4 hidden md:block">
                      <CardHeader>
                        <CardTitle>
                          {dict.dashboard.dashboard.upcomingJobs}
                        </CardTitle>
                        <CardDescription>
                          <JobTable
                            jobs={jobs}
                            params={{ lang: lang }}
                            isLoading={false}
                          />
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pl-2"></CardContent>
                    </Card>
                    <Card className="col-span-3">
                      <CardHeader>
                        <CardTitle>
                          {dict.dashboard.dashboard.nextJob}
                        </CardTitle>
                        <CardDescription>
                          {dict.dashboard.dashboard.youHaveUpcomingJobs.replace(
                            "{number}",
                            jobs.length
                          )}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <UpcomingJobs jobs={jobs} params={{ lang: lang }} />
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </>
      )
    )
  }
}
