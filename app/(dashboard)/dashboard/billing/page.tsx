"use client"

import { redirect } from "next/navigation"
import { getSession } from "@/lib/api/session"
import { getActiveSubscription } from "@/lib/api/subscription"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { BillingForm } from "@/components/billing-form"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"
import { ManageSubscriptionsButton } from "@/components/manage-subscriptions-button"
import { toast } from "@/components/ui/use-toast"
import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { SubscribeButton } from "@/components/subscribe-button"

export default async function BillingPage() {
  const loggedIn = await getSession()

  if (!loggedIn) {
    redirect("/login");
  }

  const activeSubscription = await getActiveSubscription();

  return (
    <DashboardShell>
      <DashboardHeader heading="Billing" text="Manage your subscription plan.">
        <ManageSubscriptionsButton />
      </DashboardHeader>
      <div>
      {activeSubscription ? (
        <BillingForm
          subscription={activeSubscription}
        />
      ) : (
          <EmptyPlaceholder>
            <EmptyPlaceholder.Icon name="billing" />
            <EmptyPlaceholder.Title>No active subscriptions.</EmptyPlaceholder.Title>
            <EmptyPlaceholder.Description>
              You don&apos;t have an active subscriptions yet. Start using Embloy&apos;s most exclusive features now.
            </EmptyPlaceholder.Description>
            <SubscribeButton variant="outline" />
          </EmptyPlaceholder>
        )}
      </div>
    </DashboardShell>
  )
}

/*{pastSubscriptions.map((sub) => (
  <Card key={sub.id}>
    <CardHeader>Past Subscription</CardHeader>
    <CardContent>{sub.processor_plan}</CardContent>
    <Button onClick={() => handleDownloadInvoice(sub.id)}>Download Invoice</Button>
  </Card>
))}
*/