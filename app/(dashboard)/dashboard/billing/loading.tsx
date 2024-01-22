import { CardSkeleton } from "@/components/card-skeleton"
import { DashboardHeader } from "@/components/header"
import { ManageSubscriptionsButton } from "@/components/manage-subscriptions-button"
import { DashboardShell } from "@/components/shell"

export default function BillingLoading() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Billing" text="Manage your subscription plan.">
        <ManageSubscriptionsButton />
      </DashboardHeader>
      <div className="grid gap-10">
        <CardSkeleton />
      </div>
    </DashboardShell>
  )
}
