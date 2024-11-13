import { siteConfig } from "@/config/site";
import { Job } from "@/types/job-schema";
import { getAccessToken } from "./auth";

export async function getListedJob(company_id, job_slug): Promise<{response: {job: Job | null} | null, err: number | null}> {
  const response = await fetch(`${siteConfig.api_url}/company/${company_id}/board/${job_slug}`, {
    method: 'GET',
  });
  if (!response.ok) {
    return { response: null, err: response.status };
  }
  if (response.status === 204) {
    return { response: {job:null}, err: null };
  }
  let data: {job: any; };
  try {
    data = await response.json();
  } catch (error) {
    console.error('Failed to parse JSON response:', error);
    return { response: null, err: 500 };
  }
  const jobs = data.job

  const result = jobs
  return {response: result , err: null };
}

export async function getListedJobs(company_id): Promise<{response: {jobs: Job[], company:Object} | null, err: number | null}> {
  const response = await fetch(`${siteConfig.api_url}/company/${company_id}/board`, {
    method: 'GET',
  });
  if (!response.ok) {
    return { response: null, err: response.status };
  }
  if (response.status === 204) {
    return { response: {jobs:[], company:{}}, err: null };
  }
  let data: {company:Object, jobs: any[]; };
  try {
    data = await response.json();
    
  } catch (error) {
    console.error('Failed to parse JSON response:', error);
    return { response: null, err: 500 };
  }
  const jobs = data.jobs.map((job: any) => {
    return {
      ...job,
    };
  });
  const company = data.company


  const result = jobs.length > 0 ? {jobs, company} : null
  return {response: result , err: null };
}

export async function getUpcomingJobs(): Promise<{response: Job[] | null, err: number | null}> {
    const accessToken = await getAccessToken();
    const response = await fetch(`${siteConfig.api_url}/user/upcoming`, {
      method: 'GET',
      headers: {
        "Authorization": `Bearer ${accessToken}`,
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
  
    const jobs = data.jobs.map((job: any) => {
      return {
        ...job,
      };
    });

    const result = jobs.length > 0 ? jobs : null

    return {response: result , err: null };
}