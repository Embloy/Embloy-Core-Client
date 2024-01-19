import { CardSkeleton } from "@/components/card-skeleton"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"

export default function DashboardApplicationsLoading() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Applications"
        text="Manage Applications."
      />
      <div className="grid gap-10">
        <CardSkeleton />
      </div>
    </DashboardShell>
  )
}
