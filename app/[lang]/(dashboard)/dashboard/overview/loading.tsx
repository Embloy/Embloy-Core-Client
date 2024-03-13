"use client";
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
import { useEffect, useState } from "react";
import { getDictionary } from "../../../dictionaries";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarDateRangePicker } from "@/components/date-range-picker";
import { Search } from "lucide-react";
import { JobTable } from "@/components/job-table";

export default function DashboardLoading({params}) {
  const [dict, setDict] = useState<Record<string, any> | null>(null);
  const { lang } = params || {};

  useEffect(() => {
    if (!params) {
      return;
    }

    const fetchDictionary = async () => {
      const dictionary = await getDictionary(lang);
      setDict(dictionary);
    };

    fetchDictionary();
  }, [lang, params]);

  return dict && (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">{dict.dashboard.dashboard.dashboard}</h2>
          <div className="flex items-center space-x-2">
            <Search className="hidden md:block"/>
            <CalendarDateRangePicker className="hidden md:block"/>
            <Button>{dict.dashboard.dashboard.export}</Button>
          </div>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">{dict.dashboard.dashboard.overview}</TabsTrigger>
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
                    <CardTitle>{dict.dashboard.dashboard.overview}</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <Skeleton />
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
                  <div className="text-2xl font-bold"> <Skeleton className="my-1 h-10 w-full" /></div>
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
                  <div className="text-2xl font-bold"> <Skeleton className="my-1 h-10 w-full" /></div>
                    <p className="text-xs text-muted-foreground">
                      {dict.dashboard.dashboard.summary.applicationsDescription}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{dict.dashboard.dashboard.summary.acceptanceRate}</CardTitle>
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
                  <div className="text-2xl font-bold"> <Skeleton className="my-1 h-10 w-full" /></div>
                    <p className="text-xs text-muted-foreground">
                      {dict.dashboard.dashboard.summary.acceptanceRateDescription}
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
                    <div className="text-2xl font-bold"> <Skeleton className="my-1 h-10 w-full" /></div>
                    <p className="text-xs text-muted-foreground">
                      {dict.dashboard.dashboard.summary.profileViewsDescription}
                    </p>
                  </CardContent>
                </Card>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 hidden md:block">
                <CardHeader>
                  <CardTitle>{dict.dashboard.dashboard.upcomingJobs}</CardTitle>
                  <CardDescription>
                    <JobTable jobs={[]} params={{lang: lang}} isLoading={true}/>
                  </CardDescription>
                </CardHeader>
                  <CardContent className="pl-2">
                  </CardContent>
                </Card>
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>{dict.dashboard.dashboard.nextJob}</CardTitle>
                    <CardDescription>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="my-4 h-10 w-full" />
                    <Skeleton className="my-4 h-10 w-full" />
                    <Skeleton className="my-4 h-10 w-full" />
                    <Skeleton className="my-4 h-10 w-full" />
                    <Skeleton className="my-4 h-10 w-full" />
                    <Skeleton className="my-4 h-10 w-full" />
                    <Skeleton className="my-4 h-10 w-full" />
                    <Skeleton className="my-4 h-10 w-full" />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}