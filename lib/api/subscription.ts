// @ts-nocheck
// TODO: Fix this when we turn strict mode on.
import { UserSubscriptionPlan } from "types"
import { getCurrentUser } from "@/lib/api/session"
import { freePlan, proPlan } from "@/config/subscriptions"
// import { db } from "@/lib/db"

export async function getUserSubscriptionPlan(): Promise<UserSubscriptionPlan> {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("User not found")
  }

  // Check if user is on a pro plan.
  const isPro =
    user.stripePriceId &&
    user.stripeCurrentPeriodEnd?.getTime() + 86_400_000 > Date.now()

  const plan = isPro ? proPlan : freePlan

  return {
    ...plan,
    ...user,
    stripeCurrentPeriodEnd: user.stripeCurrentPeriodEnd?.getTime(),
    isPro,
  }
}
