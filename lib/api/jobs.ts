import { siteConfig } from "@/config/site";
import { getAccessToken } from "./auth";
import { Job } from "./sdk";

export async function getUpcomingJobs(): Promise<{response: Job[] | null, err: number | null}> {
    const accessToken = await getAccessToken();
    const response = await fetch(`${siteConfig.api_url}/user/upcoming`, {
      method: 'GET',
      headers: {
        "access_token": `${accessToken}`,
      },
    });
  
    if (!response.ok) {
      return { response: null, err: response.status };
    }

    if (response.status === 204) {
      return { response: [], err: null };
    }
  
    let data: { jobs: any[]; };
    try {
      data = await response.json();
    } catch (error) {
      console.error('Failed to parse JSON response:', error);
      return { response: null, err: 500 };
    }
  
    // Parse each job in data.jobs
    const jobs = data.jobs.map((job: any) => {
      return {
        ...job,
      };
    });

    const result = jobs.length > 0 ? jobs : null

    return {response: result , err: null };
}