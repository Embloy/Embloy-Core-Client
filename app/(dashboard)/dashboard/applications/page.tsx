"use client"

import { redirect } from "next/navigation"
import { getSession } from "@/lib/api/session"
import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { DashboardHeader } from "@/components/header"
import { StartApplyButton } from "@/components/start-apply-button"
import { DashboardShell } from "@/components/shell"
import { getApplications } from "@/lib/api/application"
import { ApplicationItem } from "@/components/ui/application-item"

export default async function ApplicationsPage() {
  const loggedIn = await getSession()

  if (!loggedIn) {
    redirect("/login");
  }

  const applications = await getApplications()

  return (
    <DashboardShell>
      <DashboardHeader heading="Applications" text="Your submitted applications.">
        <StartApplyButton />
      </DashboardHeader>
      <div>
      {applications?.length ? (
          <div className="divide-y divide-border rounded-md border">
            {applications.map((application) => (
              <ApplicationItem key={application.job_id} application={application} />
            ))}
          </div>
        ) : (
          <EmptyPlaceholder>
            <EmptyPlaceholder.Icon name="post" />
            <EmptyPlaceholder.Title>No pending applications.</EmptyPlaceholder.Title>
            <EmptyPlaceholder.Description>
              You don&apos;t have applications yet. Start applying now.
            </EmptyPlaceholder.Description>
            <StartApplyButton variant="outline" />
          </EmptyPlaceholder>
        )}
      </div>
    </DashboardShell>
  )
}
