"use client"

import { useRouter } from "next/navigation"
import { getSession } from "@/lib/api/session"
import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { DashboardHeader } from "@/components/header"
import { StartApplyButton } from "@/components/start-apply-button"
import { DashboardShell } from "@/components/shell"
import { getActiveSubscription } from "@/lib/api/subscription"
import { useEffect, useState } from "react"

export default async function DashboardPage() {
  const [isLoading, setIsLoading] = useState<Boolean>(true);
  const router = useRouter()
  const jobs = []


  useEffect(() => {
    const fetchSubscription = async () => {
      setIsLoading(true);
      const loggedIn = (await getSession()).session;
      if (!loggedIn) {
        router.push("/login");
      } else {
      }
      setIsLoading(false);
    };

    fetchSubscription();
  }, []);

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
