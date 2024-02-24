import * as React from "react"
import {
  Search,
} from "lucide-react"

import { Separator } from "@/components/new-york/ui/separator"
import { Input } from "@/components/new-york/ui/input"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/new-york/ui/tabs"
import { TooltipProvider } from "@/components/new-york/ui/tooltip"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/new-york/ui/resizable"
import { useApplication } from "@/app/[lang]/(dashboard)/dashboard/applications/use-application"
import { ApplicationList } from "./application-list"
import { Application } from "@/lib/api/application"
import { ApplicationDisplay } from "./application-display"
import { Locale } from "@/i18n-config"
import { getDictionary } from "@/app/[lang]/dictionaries"

interface ApplicationPanelProps {
  applications: Application[]
  params: {
    lang: Locale
  }
}

export function ApplicationPanel({
  applications,
  params: {lang}
}: ApplicationPanelProps) {
  const [application] = useApplication(applications)
  const [searchQuery, setSearchQuery] = React.useState<string>("")
  const [dict, setDict] = React.useState<Record<string, any> | null>(null);
  
  React.useEffect(() => {
    const fetchDictionary = async () => {
      const dictionary = await getDictionary(lang);
      setDict(dictionary);
    };
    fetchDictionary();
  }, [lang] );

  const filteredApplications = applications.filter(application =>
    application.application_text.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (application.application_answers && application.application_answers.some(answer =>
      answer.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )) ||
    (application.job && JSON.stringify(application.job).toLowerCase().includes(searchQuery.toLowerCase()))
  )


  return dict && (
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
        <ResizablePanel defaultSize={[270, 440][0]} minSize={30}>
          <Tabs defaultValue="all">
            <div className="flex items-center px-4 py-2">
              <h1 className="text-xl font-bold">{dict.dashboard.applications.submittedApplications}</h1>
              <TabsList className="ml-auto">
                <TabsTrigger value="all" className="text-zinc-600 dark:text-zinc-200">{dict.dashboard.applications.all}</TabsTrigger>
                <TabsTrigger value="accepted" className="text-zinc-600 dark:text-zinc-200">{dict.dashboard.applications.accepted}</TabsTrigger>
              </TabsList>
            </div>
            <Separator />
            <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <form>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
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
              <ApplicationList items={filteredApplications} params={{lang: lang}}/>
            </TabsContent>
            <TabsContent value="accepted" className="m-0">
              <ApplicationList items={filteredApplications.filter((item) => item.status === 'accepted')} params={{lang: lang}}/>
            </TabsContent>
          </Tabs>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={[265, 440][1]}>
          <ApplicationDisplay
            application={filteredApplications.find((item) => item.job_id === application.selected) || null}
            params={{lang: lang}} 
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  )
}