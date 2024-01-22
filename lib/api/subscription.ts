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

export async function getActiveSubscription(): Promise<Subscription | null> {
  console.log('getActiveSubscription is called');
  const accessToken = await getAccessToken();
  const response = await fetch(`${siteConfig.api_url}/client/subscriptions/active?info=0`, {
    method: 'GET',
    headers: {
      "access_token": `${accessToken}`,
    },
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  return data.subscription || null;
}

export interface SubscriptionsResponse {
  subscriptions: Subscription[];
}

export async function getAllSubscriptions(): Promise<SubscriptionsResponse> {
  console.log('getAllSubscriptions is called');
  const accessToken = await getAccessToken();
  const response = await fetch(`${siteConfig.api_url}/client/subscriptions`, {
    method: 'GET',
    headers: {
      "access_token": `${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch all subscriptions data');
  }

  const data = await response.json();
  return data;
}

export async function postCheckout(tier: string, payment_mode: string): Promise<Checkout | null> {
  console.log('postCheckout is called');
  const accessToken = await getAccessToken();
  const response = await fetch(`${siteConfig.api_url}/checkout`, {
    method: 'POST',
    headers: {
      "access_token": `${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ tier, payment_mode }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch subscription data');
  }

  const data = await response.json();
  return data || null;
}

export async function getPortalSession(): Promise<Checkout | null> {
  console.log('getPortalSession is called');
  const accessToken = await getAccessToken();
  const response = await fetch(`${siteConfig.api_url}/checkout/portal`, {
    method: 'GET',
    headers: {
      "access_token": `${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch portal data');
  }

  const data = await response.json();
  return data.portal_session || null;
}
