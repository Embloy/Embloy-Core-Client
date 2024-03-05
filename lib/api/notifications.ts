import { siteConfig } from "@/config/site";
import { getAccessToken } from "./auth";

export interface ApplicationLink {
    job_id: number;
    user_id: number;
  }
  
  export interface Params {
    job_title: string;
    application: ApplicationLink;
    job_notifications?: number;
    status?: number;
    response?: string;
    user_email?: string;
    user_first_name?: string;
  }
  
  export interface Notification {
    id: number;
    recipient_type: string;
    recipient_id: number;
    type: string;
    params: Params;
    read_at: string | null;
    created_at: string;
    updated_at: string;
  }

export async function getLatestNotifications(): Promise<{response: Notification[] | null, err: number | null}> {
    const accessToken = await getAccessToken();
    const response = await fetch(`${siteConfig.api_url}/user/notifications`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "access_token": `${accessToken}`,
      },
    });
  
    if (!response.ok) {
       return { response: null, err: response.status };
    }

    if (response.status === 204) {
        return { response: [], err: null };
    }

    let data: { notifications: any[]; };
    try {
        data = await response.json();
    } catch (error) {
        console.error('Failed to parse JSON response:', error);
        return { response: null, err: 500 };
    }

    const notifications = data.notifications.map((notification: any) => {
        return {
            ...notification,
        };
    });

    const result = notifications.length > 0 ? notifications : null

    return {response: result , err: null };
}

export async function getUnreadApplications(): Promise<{response: number[] | null, err: number | null}> {
    const accessToken = await getAccessToken();
    const response = await fetch(`${siteConfig.api_url}/user/notifications/unread`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "access_token": `${accessToken}`,
      },
    });
  
    if (!response.ok) {
       return { response: null, err: response.status };
    }

    if (response.status === 204) {
        return { response: [], err: null };
    }

    let data: { notifications: any[]; };
    try {
        data = await response.json();
    } catch (error) {
        console.error('Failed to parse JSON response:', error);
        return { response: null, err: 500 };
    }

    const notifications = data.notifications.map((notification: any) => {
        return {
            ...notification,
        };
    });

    const result = notifications.length > 0 ? notifications : null

    return {response: result , err: null };
}

export async function markAsRead(notification_id: number, status: number): Promise<number | null> {
    const accessToken = await getAccessToken();
    const response = await fetch(`${siteConfig.api_url}/user/notifications/${notification_id}/${status}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        "access_token": `${accessToken}`,
      },
    });
  
    if (!response.ok) {
       return response.status;
    }

    return null;
}
