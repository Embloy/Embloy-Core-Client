"use client"

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
import { useApplication } from "@/app/(dashboard)/dashboard/applications/use-application"
import { ApplicationList } from "./application-list"
import { Application } from "@/lib/api/application"
import { ApplicationDisplay } from "./application-display"

interface ApplicationPanelProps {
  applications: Application[]
}

export function ApplicationPanel({
  applications,
}: ApplicationPanelProps) {
  const [application] = useApplication(applications)

  return (
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
        <ResizablePanel defaultSize={[265, 440][0]} minSize={30}>
          <Tabs defaultValue="all">
            <div className="flex items-center px-4 py-2">
              <h1 className="text-xl font-bold">Submitted Applications</h1>
              <TabsList className="ml-auto">
                <TabsTrigger value="all" className="text-zinc-600 dark:text-zinc-200">All</TabsTrigger>
                <TabsTrigger value="unread" className="text-zinc-600 dark:text-zinc-200">Unread</TabsTrigger>
              </TabsList>
            </div>
            <Separator />
            <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <form>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search" className="pl-8" />
                </div>
              </form>
            </div>
            <TabsContent value="all" className="m-0">
              <ApplicationList items={applications} />
            </TabsContent>
            <TabsContent value="unread" className="m-0">
              <ApplicationList items={applications.filter((item) => !true)} />
            </TabsContent>
          </Tabs>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={[265, 440][1]}>
          <ApplicationDisplay
            application={applications.find((item) => item.job_id === application.selected) || null}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  )
}
