import * as React from "react"
import { Locale } from "@/i18n-config"
import { Search } from "lucide-react"

import { Application } from "@/lib/api/application"
import { Input } from "@/components/new-york/ui/input"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/new-york/ui/resizable"
import { Separator } from "@/components/new-york/ui/separator"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/new-york/ui/tabs"
import { TooltipProvider } from "@/components/new-york/ui/tooltip"
import { useApplication } from "@/app/[lang]/(dashboard)/dashboard/applications/use-application"
import { getDictionary } from "@/app/[lang]/dictionaries"

import { ApplicationDisplay } from "./application-display"
import { ApplicationList } from "./application-list"

interface ApplicationPanelProps {
  applications: Application[]
  unreadIDs: number[]
  params: {
    lang: Locale
  }
}

export function ApplicationPanel({
  applications,
  unreadIDs,
  params: { lang },
}: ApplicationPanelProps) {
  const [application] = useApplication(applications)
  const [searchQuery, setSearchQuery] = React.useState<string>("")
  const [dict, setDict] = React.useState<Record<string, any> | null>(null)

  React.useEffect(() => {
    const fetchDictionary = async () => {
      const dictionary = await getDictionary(lang)
      setDict(dictionary)
    }
    fetchDictionary()
  }, [lang])

  const filteredApplications = applications.filter(
    (application) =>
      (application.application_answers &&
        application.application_answers.some(
          (answer) =>
            answer?.answer &&
            answer.answer.toLowerCase().includes(searchQuery.toLowerCase())
        )) ||
      (application.job &&
        JSON.stringify(application.job)
          .toLowerCase()
          .includes(searchQuery.toLowerCase()))
  )

  return (
    dict && (
      <TooltipProvider delayDuration={0}>
        <ResizablePanelGroup
          direction="horizontal"
          onLayout={(sizes: number[]) => {
            document.cookie = `react-resizable-panels:layout=${JSON.stringify(
              sizes
            )}`
          }}
          className="h-full max-h-[800px] items-stretch"
        >
          <ResizablePanel defaultSize={[270, 440][0]} minSize={26}>
            <Tabs defaultValue="all">
              <div className="flex items-center px-4 py-2">
                <h1 className="text-xl font-bold">
                  {dict.dashboard.applications.submittedApplications}
                </h1>
                <TabsList className="ml-auto">
                  <TabsTrigger
                    value="all"
                    className="text-zinc-600 dark:text-zinc-200"
                  >
                    {dict.dashboard.applications.all}
                  </TabsTrigger>
                  <TabsTrigger
                    value="accepted"
                    className="text-zinc-600 dark:text-zinc-200"
                  >
                    {dict.dashboard.applications.accepted}
                  </TabsTrigger>
                </TabsList>
              </div>
              <Separator />
              <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <form>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
                    <Input
                      placeholder={dict.dashboard.applications.search}
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </form>
              </div>
              <TabsContent value="all" className="m-0">
                <ApplicationList
                  items={filteredApplications}
                  params={{ lang: lang }}
                  unreadIDs={unreadIDs}
                />
              </TabsContent>
              <TabsContent value="accepted" className="m-0">
                <ApplicationList
                  items={filteredApplications.filter(
                    (item) => item.status === "accepted"
                  )}
                  params={{ lang: lang }}
                  unreadIDs={unreadIDs}
                />
              </TabsContent>
            </Tabs>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={[265, 440][1]}>
            <ApplicationDisplay
              application={
                filteredApplications.find(
                  (item) => item.job_id === application.selected
                ) || null
              }
              params={{ lang: lang }}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </TooltipProvider>
    )
  )
}
