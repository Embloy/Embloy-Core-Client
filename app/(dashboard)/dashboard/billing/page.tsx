"use client"

import { redirect } from "next/navigation"
import { getSession } from "@/lib/api/session"
import { getActiveSubscription, getAllSubscriptions, getPortalSession } from "@/lib/api/subscription"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { BillingForm } from "@/components/billing-form"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"
import { ManageSubscriptionsButton } from "@/components/manage-subscriptions-button"

export default async function BillingPage() {
  const loggedIn = await getSession()

  if (!loggedIn) {
    redirect("/login");
  }

  const activeSubscription = await getActiveSubscription();

  // const pastSubscriptions = (await getAllSubscriptions()).subscriptions;

  return activeSubscription && (
    <DashboardShell>
      <DashboardHeader heading="Billing" text="Manage your subscription plan.">
        <ManageSubscriptionsButton />
      </DashboardHeader>
      <BillingForm
        subscription={activeSubscription}
      />
    </DashboardShell>
  );
}

/*{pastSubscriptions.map((sub) => (
  <Card key={sub.id}>
    <CardHeader>Past Subscription</CardHeader>
    <CardContent>{sub.processor_plan}</CardContent>
    <Button onClick={() => handleDownloadInvoice(sub.id)}>Download Invoice</Button>
  </Card>
))}
*/