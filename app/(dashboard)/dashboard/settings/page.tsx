"use client"

import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/api/session"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"
import { UserForm } from "@/components/user-form"

export default async function SettingsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Settings"
        text="Manage account and website settings."
      />
      <div className="grid gap-10">
        <UserForm user={user} />
      </div>
    </DashboardShell>
  )
}
