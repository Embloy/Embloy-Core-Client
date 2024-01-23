import { getAccessToken, clearUserSession } from './auth';
import { getUserData } from './user';

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

export async function getSessionUser(): Promise<{ user: User } | null> {
  console.log('getSession is called');
  try {
    const accessToken = await getAccessToken();
    console.log(`accessToken=${accessToken}`)
    if (accessToken) {
      const userData = await getUserData(accessToken);
      console.log(`user=${userData.user}`)
      return { user: userData.user };
    }
  } catch (error) {
    console.error("Error getting user data:", error);
    clearUserSession();
    return null;
  }
  return null;
}

export async function getCurrentUser(): Promise<User | null> {
  console.log('getCurrentUser is called');
  let session: { user: User; } | null;
  try {
    session = await getSessionUser();
  } catch (error) {
    console.error("Error getting session:", error);
    return null;
  }

  if (session) {
    return session.user;
  }

  return null;
}

export async function getSession(): Promise<{ session: Boolean }> {
  console.log('getSession is called');
  try {
    const accessToken = await getAccessToken();
    console.log(`accessToken=${accessToken}`)
    if (accessToken) {
      return { session: true };
    }
  } catch (error) {
    console.error("Error getting user data:", error);
    clearUserSession();
    return { session: false };
  }
  return { session: false };
}
