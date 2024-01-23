"use client"

import { redirect } from "next/navigation"
import { getSession } from "@/lib/api/session"
import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { DashboardHeader } from "@/components/header"
import { StartApplyButton } from "@/components/start-apply-button"
import { DashboardShell } from "@/components/shell"

export default async function DashboardPage() {
  const { session } = await getSession()

  if (!session) {
    redirect("/login");
  }

  const jobs = []

  return (
    <DashboardShell>
      <DashboardHeader heading="Upcoming Jobs" text="See what's next.">
        <StartApplyButton />
      </DashboardHeader>
      <div>
          <EmptyPlaceholder>
            <EmptyPlaceholder.Icon name="timer" />
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
