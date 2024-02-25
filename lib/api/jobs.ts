import { siteConfig } from "@/config/site";
import { getAccessToken } from "./auth";
import { Job } from "./sdk";

export async function getActiveSubscription(): Promise<Job[] | null> {
    console.log('getActiveSubscription is called');
    const accessToken = await getAccessToken();
    const response = await fetch(`${siteConfig.api_url}/user/upcoming`, {
      method: 'GET',
      headers: {
        "access_token": `${accessToken}`,
      },
    });
  
    if (!response.ok) {
      return null;
    }
  
    let data: { jobs: any[]; };
    try {
      data = await response.json();
    } catch (error) {
      console.error('Failed to parse JSON response:', error);
      return null;
    }
  
    // Parse each job in data.jobs
    const jobs = data.jobs.map((job: any) => {
      return {
        ...job,
      };
    });

    return jobs.length > 0 ? jobs : null;
}