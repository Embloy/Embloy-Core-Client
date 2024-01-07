// /lib/api/user.ts

import { siteConfig } from "@/config/site";
import { getAccessToken } from "./auth";

export async function getUserData(): Promise<Record<string, any>> {
    // Example: Make a GET request to the user endpoint of your external API with the user ID
    const response = await fetch(`${siteConfig.api_url}/user`, {
      method: 'GET',
      headers: {
        "access_token": `${getAccessToken()}`,
      },
    });
  
    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }
  
    return response.json();
}