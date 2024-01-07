import { SubscriptionPlan } from "types"

export const freePlan: SubscriptionPlan = {
  name: "Free",
  description:
    "The free plan is limited to 3 posts. Upgrade to the PRO plan for unlimited posts.",
  stripePriceId: "price_1OUuTgKMiBrigNb6R7xzRzTL",
}

export const proPlan: SubscriptionPlan = {
  name: "Premium",
  description: "The PRO plan has unlimited posts.",
  stripePriceId: "price_1OUqrPKMiBrigNb6lia8VWiD" || "",
}
 