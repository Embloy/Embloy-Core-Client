import { siteConfig } from "@/config/site";
import { getAccessToken } from "./auth";
import { Job } from "./sdk";

export interface ApplicationAttachment {
  attachment: {
    id: number;
    user_id: number;
    job_id: number;
    created_at: string;
    updated_at: string;
  };
  url: string;
}

export interface ApplicationAnswer {
  id: number;
  job_id: number;
  user_id: number;
  application_option_id: number;
  answer: string;
}

export interface Application {
  job_id: number;
  user_id: number;
  updated_at: string;
  created_at: string;
  status: string;
  application_text: string;
  response: string;
  application_attachment: null | ApplicationAttachment;
  application_answers: null | ApplicationAnswer[];
  job: null | Job;
}
  
export async function getApplications(): Promise<Application[] | null> {
  const accessToken = await getAccessToken();
  const response = await fetch(`${siteConfig.api_url}/user/applications`, {
    method: 'GET',
    headers: {
      "access_token": `${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch application data');
  }

  const text = await response.text();
  if (!text) {
    return null;
  }

  const data = JSON.parse(text);
  return data.map((item: any) => ({
    ...item.application,
    application_attachment: item.application_attachment,
    application_answers: item.application_answers,
    job: JSON.parse(item.job),
  })) || [];
}

export async function submitApplication(
  application_text: string, 
  request_token: string | null, 
  gq_job_id: number | null,
  cv_file?: File,
  answers?: { [key: string]: any }
): Promise<Boolean> {

  const accessToken = await getAccessToken();

  const formData = new FormData();
  formData.append('application_text', application_text);

  if (answers) {
    answers.forEach((answerObj, index) => {
      formData.append(`application_answers[${index}][application_option_id]`, answerObj.application_option_id.toString());
      formData.append(`application_answers[${index}][answer]`, answerObj.answer);
    });
  }

  let response: Response;

  if (cv_file) { // If a CV file is provided, append it to the form data
    formData.append('application_attachment', cv_file);
  }

  if (request_token) {
    response = await fetch(`${siteConfig.api_url}/sdk/apply`, {
      method: 'POST',
      headers: {
        "access_token": `${accessToken}`,
        "request_token": `${request_token}`,
      },
      body: formData
    });
  } else {
    response = await fetch(`${siteConfig.api_url}/jobs/${gq_job_id}/applications`, {
      method: 'POST',
      headers: {
        "access_token": `${accessToken}`,
      },
      body: formData
    });
  }

  if (!response.ok) {
    return false;
  }

  const text = await response.text();
  if (!text) {
    return false;
  }

  return true
}