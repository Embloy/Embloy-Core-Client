import { Job } from "@/types/job-schema"
import { siteConfig } from "@/config/site"

import { getAccessToken } from "./auth"

export interface ApplicationAttachment {
  id: number
  name: string
  user_id: number
  job_id: number
  created_at: string
  updated_at: string
  url: string
}

export interface ApplicationAnswer {
  id: number
  job_id: number
  user_id: number
  application_option_id: number
  answer: string
  question: string
  attachment: null | ApplicationAttachment
  version: number
}
export interface ApplicationEvent {
  id: number
  ext_id: string
  job_id: number
  user_id: number
  event_type: string
  event_details: string
  previous_event_id: number | null
  next_event_id: number | null
  created_at: string
  updated_at: string
}

export interface Application {
  job_id: number
  user_id: number
  updated_at: string
  created_at: string
  submitted_at: string | null
  status: string
  response: string
  application_attachment: null | ApplicationAttachment
  application_answers: null | ApplicationAnswer[]
  application_events: null | ApplicationEvent[]
  job: null | Job
  version: number
}

export async function getApplications(): Promise<{
  response: Application[] | null
  err: number | null
}> {
  const accessToken = await getAccessToken()
  const response = await fetch(`${siteConfig.api_url}/user/applications`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    return { response: null, err: response.status }
  }

  if (response.status === 204) {
    return { response: [], err: null }
  }

  const text = await response.text()
  if (!text) {
    return { response: null, err: 500 }
  }

  const data = JSON.parse(text)
  const result =
    data.map((item: any) => ({
      ...item.application,
      application_attachment: item.application_attachment,
      application_answers: item.application_answers,
      application_events: item.application_events,
      job: item.job,
    })) || []

  return { response: result, err: null }
}

export async function submitApplication(
  request_token: string | null,
  gq_job_id: number | null,
  save_as_draft: boolean,
  options?: Array<{
    application_option_id: number
    answer: string
    file: File | null
  }>
): Promise<number | null> {
  const accessToken = await getAccessToken()

  const formData = new FormData()

  if (options) {
    options.forEach((optionObj, index) => {
      formData.append(
        `application_answers[${index}][application_option_id]`,
        optionObj.application_option_id.toString()
      )
      formData.append(`application_answers[${index}][answer]`, optionObj.answer)
      if (optionObj.file) {
        formData.append(`application_answers[${index}][file]`, optionObj.file)
      }
    })
  }

  let response: Response

  if (request_token) {
    response = await fetch(
      `${siteConfig.api_url}/sdk/apply${
        save_as_draft ? `?save_as_draft=1` : ""
      }`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          request_token: `${request_token}`,
        },
        body: formData,
      }
    )
  } else {
    response = await fetch(
      `${siteConfig.api_url}/jobs/${gq_job_id}/applications${
        save_as_draft ? `?save_as_draft=1` : ""
      }`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      }
    )
  }

  if (!response.ok) {
    return response.status
  }

  const text = await response.text()
  if (!text) {
    return 500
  }

  return null
}
