import { DashboardHeader } from "@/components/header"
import { StartApplyButton } from "@/components/start-apply-button"
import { DashboardShell } from "@/components/shell"

export default function ApplicationsLoading() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Applications" text="Your submitted applications.">
        <StartApplyButton />
      </DashboardHeader>
      <div className="divide-border-200 divide-y rounded-md border">
      </div>
    </DashboardShell>
  )
}