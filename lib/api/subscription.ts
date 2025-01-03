"use client"

// @ts-nocheck
// TODO: Fix this when we turn strict mode on.
import { siteConfig } from "@/config/site";
import { getAccessToken } from "./auth";

export interface Subscription {
  id: number;
  customer_id: number;
  name: string;
  processor_id: string;
  processor_plan: string;
  quantity: number;
  status: string;
  current_period_start: string;
  current_period_end: string;
  trial_ends_at: null | string;
  ends_at: null | string;
  metered: boolean;
  pause_behavior: null | string;
  pause_starts_at: null | string;
  pause_resumes_at: null | string;
  application_fee_percent: null | number;
  metadata: Record<string, unknown>;
  data: {
    subscription_items: {
      id: string;
      price: {
        id: string;
        type: string;
        active: boolean;
        object: string;
        created: number;
        product: string;
        currency: string;
        livemode: boolean;
        metadata: Record<string, unknown>;
        nickname: null | string;
        recurring: {
          interval: string;
          usage_type: string;
          interval_count: number;
          aggregate_usage: null | string;
          trial_period_days: null | number;
        };
        lookup_key: null | string;
        tiers_mode: null | string;
        unit_amount: number;
        tax_behavior: string;
        billing_scheme: string;
        custom_unit_amount: null | number;
        transform_quantity: null | number;
        unit_amount_decimal: string;
      };
      metadata: Record<string, unknown>;
      quantity: number;
    }[];
  };
  stripe_account: null | string;
  payment_method_id: string;
  created_at: string;
  updated_at: string;
  prorate: boolean;
}

type Checkout = {
  id: string;
  object: string;
  amount_subtotal: number;
  amount_total: number;
  created: number;
  currency: string;
  customer: string;
  customer_details: {
    email: string;
    tax_exempt: string;
  };
  payment_status: string;
  status: string;
  url: string;
  // ...other properties
};

export async function getActiveSubscription(): Promise<{response: Subscription | null, err: number | null}> {
  const accessToken = await getAccessToken();
  const response = await fetch(`${siteConfig.api_url}/client/subscriptions/active?info=0`, {
    method: 'GET',
    headers: {
      "Authorization": `Bearer ${accessToken}`,
    },
  });

  if (response.status === 404) {
    return { response: null, err: null };
  }

  if (!response.ok) {
    return { response: null, err: response.status };
  }

  const data = await response.json();
  return { response: data.subscription, err: null };
}

export interface SubscriptionsResponse {
  subscriptions: Subscription[];
}

export async function getAllSubscriptions(): Promise<{response: SubscriptionsResponse | null, err: number | null}> {
  const accessToken = await getAccessToken();
  const response = await fetch(`${siteConfig.api_url}/client/subscriptions`, {
    method: 'GET',
    headers: {
      "Authorization": `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    return { response: null, err: response.status };
  }

  if (response.status === 204) {
    return { response: {subscriptions: []}, err: null };
  }

  const data = await response.json();
  return { response: {subscriptions: data.Subscriptions}, err: null };
}

export async function postCheckout(tier: string, payment_mode: string): Promise<{response: Checkout | null, err: number | null}> {
  const accessToken = await getAccessToken();
  const origin = "core"
  const response = await fetch(`${siteConfig.api_url}/checkout`, {
    method: 'POST',
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ tier, payment_mode, origin }),
  });

  if (!response.ok) {
    return { response: null, err: response.status };
  }

  const data = await response.json();
  return { response: data, err: null };
}

export async function getPortalSession(): Promise<{response: Checkout | null, err: number | null}> {
  const accessToken = await getAccessToken();
  const response = await fetch(`${siteConfig.api_url}/checkout/portal?origin=core`, {
    method: 'GET',
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      
    },
  });

  if (!response.ok) {
    return { response: null, err: response.status };
  }

  const data = await response.json();
  return { response: data.portal_session, err: null };
}
