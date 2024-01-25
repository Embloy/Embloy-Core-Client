"use client"

import { siteConfig } from "@/config/site";
import { getAccessToken } from "./auth";

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

export interface Application {
  job_id: number;
  user_id: number;
  updated_at: string;
  created_at: string;
  status: string;
  application_text: string;
  application_documents: null | string;
  response: string;
  deleted_at: null | string;
  application_attachment: null | ApplicationAttachment;
}
  
export async function getApplications(): Promise<Application[] | null> {
  console.log('getApplicationData is called');
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
    application_attachment: item.application_attachment
  })) || [];
}

export async function submitApplication(
  application_text: string, 
  request_token: string, 
  cv_file?: File
): Promise<Boolean> {
  console.log('submitApplication is called');
  const accessToken = await getAccessToken();

  const formData = new FormData();
  formData.append('application_text', application_text);
  if (cv_file) { // If a CV file is provided, append it to the form data
    formData.append('application_attachment', cv_file);
  }

  const response = await fetch(`${siteConfig.api_url}/sdk/apply`, {
    method: 'POST',
    headers: {
      "access_token": `${accessToken}`,
      "request_token": `${request_token}`,
    },
    body: formData
  });

  if (!response.ok) {
    return false;
  }

  const text = await response.text();
  if (!text) {
    return false;
  }

  return true
}