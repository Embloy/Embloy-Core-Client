"use client"

import { siteConfig } from "@/config/site";
import { getAccessToken } from "./auth";

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
    return data.applications || [];
}

export async function submitApplication(application_text: string, request_token: string): Promise<Boolean> {
    console.log('submitApplication is called');
    const accessToken = await getAccessToken();
  
    // Create form data
    const formData = new FormData();
    formData.append('application_text', (application_text));
  
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



// Update this to show the job information on one side, and on the other, an application 