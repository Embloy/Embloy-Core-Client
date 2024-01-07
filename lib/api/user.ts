// /lib/api/user.ts

import { siteConfig } from "@/config/site";

export async function getUserData(accessToken): Promise<Record<string, any>> {
    // Example: Make a GET request to the user endpoint of your external API with the user ID
    console.log('getUserData is called');
    const response = await fetch(`${siteConfig.api_url}/user`, {
      method: 'GET',
      headers: {
        "access_token": `${accessToken}`,
      },
    });
  
    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }
  
    return response.json();
}