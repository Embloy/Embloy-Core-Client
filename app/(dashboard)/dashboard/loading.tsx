import { DashboardHeader } from "@/components/header"
import { StartApplyButton } from "@/components/start-apply-button"
import { DashboardShell } from "@/components/shell"

export default function DashboardLoading() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Upcoming Jobs" text="See what's next.">
        <StartApplyButton />
      </DashboardHeader>
      <div className="divide-border-200 divide-y rounded-md border">
      </div>
    </DashboardShell>
  )
}
