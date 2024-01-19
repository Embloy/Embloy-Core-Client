"use client"

import { redirect } from "next/navigation"
import { getSession } from "@/lib/api/session"
import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { DashboardHeader } from "@/components/header"
import { StartApplyButton } from "@/components/start-apply-button"
import { DashboardShell } from "@/components/shell"

export default async function DashboardPage() {
  const loggedIn = await getSession()

  if (!loggedIn) {
    redirect("/login");
  }

  const jobs = []

  return (
    <DashboardShell>
      <DashboardHeader heading="Jobs" text="Upcoming jobs.">
        <StartApplyButton />
      </DashboardHeader>
      <div>
          <EmptyPlaceholder>
            <EmptyPlaceholder.Icon name="post" />
            <EmptyPlaceholder.Title>No upcoming jobs.</EmptyPlaceholder.Title>
            <EmptyPlaceholder.Description>
              You don&apos;t have jobs yet. Start applying now.
            </EmptyPlaceholder.Description>
            <StartApplyButton variant="outline" />
          </EmptyPlaceholder>
      </div>
    </DashboardShell>
  )
}
