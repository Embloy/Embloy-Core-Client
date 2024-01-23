import { Subscription } from "@/lib/api/subscription"
import { SubscriptionPlan } from "types"

export const freePlan: SubscriptionPlan = {
  name: "EMBLOY FREE",
  internal_name: "basic",
  description:
    "One-Click-Application, apply to as many jobs as you want and no ads",
  stripePriceId: "price_1OUuTgKMiBrigNb6R7xzRzTL",
}

export const smartPlan: SubscriptionPlan = {
  name: "EMBLOY SMART",
  internal_name: "premium",
  description:
    "Unlimited job postings and client token customization.",
  stripePriceId: "price_1OUqrPKMiBrigNb6lia8VWiD",
}

export const geniusPlan: SubscriptionPlan = {
  name: "EMBLOY GENIUS",
  internal_name: "enterprise_1",
  description: "Coming soon.",
  stripePriceId: "price_1OUuVBKMiBrigNb6J9xmLWg8",
}
 
export const enterprise2: SubscriptionPlan = {
  name: "EMBLOY PREMIUM",
  internal_name: "enterprise_2",
  description: "Coming soon.",
  stripePriceId: "price_1OUuVgKMiBrigNb6XVIqsydL",
}
 
export const enterprise3: SubscriptionPlan = {
  name: "EMBLOY ENTERPRISE",
  internal_name: "enterprise_3",
  description: "Coming soon.",
  stripePriceId: "price_1OUuWFKMiBrigNb6lfAf7ptj",
}
 
export const getSubscriptionPlanBySubscription = (subscription: Subscription): SubscriptionPlan | null => {
  const plans: SubscriptionPlan[] = [freePlan, smartPlan, geniusPlan, enterprise2, enterprise3];

  for (let plan of plans) {
    if (plan.stripePriceId === subscription.processor_plan) {
      return plan;
    }
  }

  return null;
}

export const getNextBestPlan = (subscription: Subscription): SubscriptionPlan | null => {
  const plans: SubscriptionPlan[] = [freePlan, smartPlan, geniusPlan, enterprise2, enterprise3];

  const currentPlanIndex = plans.findIndex(plan => plan.stripePriceId === subscription.processor_plan);

  // If the current plan is not found or it's the last plan in the array, return null
  if (currentPlanIndex === -1 || currentPlanIndex === plans.length - 1) {
    return null;
  }

  // Return the next plan in the array
  return plans[currentPlanIndex + 1];
}