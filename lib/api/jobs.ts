import { siteConfig } from "@/config/site";
import { Job } from "@/types/job-schema";
import { getAccessToken } from "./auth";
import { Company } from "@/app/[lang]/(board)/board/[slug]/utils";

export async function getListedJob(company_id, job_slug): Promise<{response: {job: Job, company: Company} | null, err: number | null}> {
  const response = await fetch(`${siteConfig.api_url}/company/${company_id}/board/${job_slug}`, {
    method: 'GET',
  });
  if (!response.ok) {
    return { response: null, err: response.status };
  }
  let data: {company:any, job: any; };
  try {
    data = await response.json();
  } catch (error) {
    console.error('Failed to parse JSON response:', error);
    return { response: null, err: 500 };
  }

  return {response: {job: data.job, company: data.company} , err: null };
}

export async function getListedJobs(company_id): Promise<{response: {jobs: Job[], company:Company} | null, err: number | null}> {
  const response = await fetch(`${siteConfig.api_url}/company/${company_id}/board`, {
    method: 'GET',
  });
  if (!response.ok) {
    return { response: null, err: response.status };
  }
  let data: {company:any, jobs: any[]; };
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

  return {response: {jobs: jobs, company: data.company} , err: null };
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