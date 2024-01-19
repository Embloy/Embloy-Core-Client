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