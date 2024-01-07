// /lib/api/session.ts
import { siteConfig } from '@/config/site';
import { getAccessToken, clearUserSession } from './auth';

// Define your own user type
export interface User {
  id: number;
  email: string;
  password_digest: string;
  activity_status: number;
  image_url: string | null;
  first_name: string;
  last_name: string;
  longitude: number | null;
  latitude: number | null;
  country_code: string | null;
  postal_code: string | null;
  city: string | null;
  address: string | null;
  date_of_birth: Date | null;
  user_type: string;
  view_count: number;
  created_at: Date;
  updated_at: Date;
  applications_count: number;
  jobs_count: number;
  user_role: string;
  application_notifications: boolean;
  twitter_url: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  phone: string | null;
  degree: string | null;
  linkedin_url: string | null;
}

export async function getSession(): Promise<{ user: User } | null> {
  const accessToken = getAccessToken();

  if (accessToken) {
    try {
      // Example: Make a GET request to the user endpoint of your external API
      const response = await fetch(`${siteConfig.api_url}/user`, {
        method: 'GET',
        headers: {
          "access_token": `${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const user: User = await response.json();
      return { user };
    } catch (error) {
      // Handle error (e.g., token expiration)
      // You might want to refresh the token and retry the request
      // For simplicity, we'll clear the session here
      clearUserSession();
      return null;
    }
  }

  return null;
}

export async function getCurrentUser(): Promise<User | null> {
  const session = await getSession();

  if (session) {
    return session.user;
  }

  return null;
}