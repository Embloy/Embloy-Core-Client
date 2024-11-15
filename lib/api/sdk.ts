import { Job } from "@/types/job-schema"
import { siteConfig } from "@/config/site"

import { getAccessToken } from "./auth"

export interface Session {
  mode: string
  job_slug: string
  user_id: number
  subscription_type: string
  success_url: string | null
  cancel_url: string | null
}

export interface ResponseData {
  session: Session
  job: Job
}

// TODO: ERROR HANDLING
export async function makeRequest(
  requestToken: string
): Promise<ResponseData | Error> {
  const accessToken = await getAccessToken()

  const response = await fetch(`${siteConfig.api_url}/sdk/request/handle`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      request_token: `${requestToken}`,
    },
  })

  if (response.status === 401) {
    return new Error("Invalid request token")
  }

  if (!response.ok) {
    return new Error("Request failed")
  }

  const data = await response.json()
  return {
    session: data.session,
    job: data.job,
  }
}

// TODO: ERROR HANDLING
export async function applyWithGQ(gq: string): Promise<ResponseData | null> {
  const response = await fetch(`${siteConfig.api_url}/resource/${gq}`, {
    method: "GET",
  })

  if (!response.ok) {
    return null
  }

  const data = await response.json()
  const job = data.job
  return {
    session: {
      mode: "job",
      job_slug: job.job_slug,
      user_id: job.user_id,
      subscription_type: "gq",
      success_url: job.referrer_url,
      cancel_url: job.referrer_url,
    },
    job: job,
  }
}
