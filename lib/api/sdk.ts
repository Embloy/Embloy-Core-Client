import { siteConfig } from "@/config/site";
import { getAccessToken } from "./auth";

export interface ApplicationOption {
  id: number;
  job_id: number;
  question: string;
  question_type: string;
  required: boolean;
  options: string[];
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface Job {
  job_id: number;
  job_type: string;
  job_slug: string;
  job_type_value: number;
  job_status: number;
  status: string;
  user_id: number;
  referrer_url: string | null;
  duration: number;
  code_lang: string | null;
  title: string | null;
  position: string | null;
  description: {
    id: number;
    name: string;
    body: string;
    record_type: string;
    record_id: number;
    created_at: string;
    updated_at: string;
  } | null;
  key_skills: string | null;
  salary: number | null;
  euro_salary: number | null;
  relevance_score: number | null;
  currency: string;
  start_slot: string;
  longitude: number;
  latitude: number;
  country_code: string | null;
  postal_code: string | null;
  city: string | null;
  address: string | null;
  view_count: number;
  created_at: string;
  updated_at: string;
  applications_count: number;
  employer_rating: number;
  job_notifications: string;
  boost: number;
  cv_required: boolean;
  allowed_cv_formats: string[];
  deleted_at: string | null;
  job_value: string;
  application_options: ApplicationOption[];
  image_url: string | null;
  employer_email: string | null;
  employer_name: string | null;
  employer_phone: string | null;
  employer_image_url: string | null;
}
  
export interface Session {
    mode: string;
    job_slug: string;
    user_id: number;
    subscription_type: string;
    success_url: string | null;
    cancel_url: string | null;
}

export interface ResponseData {
session: Session;
job: Job;
}

export default async function makeRequest(requestToken: string): Promise<ResponseData | null> {
console.log('makeRequest is called');
const accessToken = await getAccessToken();

const response = await fetch(`${siteConfig.api_url}/sdk/request/handle`, {
    method: 'POST',
    headers: {
    "access_token": `${accessToken}`,
    "request_token": `${requestToken}`
    },
});

if (!response.ok) {
    return null;
}

const data = await response.json();
return {
    session: data.session,
    job: JSON.parse(data.job)
};
}