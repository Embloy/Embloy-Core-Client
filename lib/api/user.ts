// /lib/api/user.ts

import { siteConfig } from "@/config/site";
import { getAccessToken, clearUserSession } from "./auth";

export async function getUserData(accessToken): Promise<Record<string, any>> {
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

export async function updateUser(userJson: string): Promise<{ success: Boolean }> {
  console.log('updateUser is called');
  try {
    const accessToken = await getAccessToken();
    console.log(`accessToken=${accessToken}`)
    const response = await fetch(`${siteConfig.api_url}/user`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        "access_token": `${accessToken}`,
      },
      body: userJson
    });
  
    if (!response.ok) {
      throw new Error('Failed to delete user');
    }
    return {success: true}

  } catch (error) {
    console.error("Error deleting user:", error);
    // clearUserSession();
    return { success: false };
  }
}

export async function uploadUserImage(formData: FormData): Promise<{ success: Boolean }> {
  console.log('uploadUserImage is called');
  try {
    const accessToken = await getAccessToken();
    console.log(`accessToken=${accessToken}`)
    const response = await fetch(`${siteConfig.api_url}/user/image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'form/data',
        "access_token": `${accessToken}`,
      },
      body: formData
    });
  
    if (!response.ok) {
      throw new Error('Failed to upload user image');
    }
    return {success: true}

  } catch (error) {
    console.error("Error uploading user image:", error);
    // clearUserSession();
    return { success: false };
  }
}

export async function deleteUser(): Promise<{ success: Boolean }> {
  console.log('deleteUser is called');
  try {
    const accessToken = await getAccessToken();
    console.log(`accessToken=${accessToken}`)
    const response = await fetch(`${siteConfig.api_url}/user`, {
      method: 'DELETE',
      headers: {
        "access_token": `${accessToken}`,
      },
    });
  
    if (!response.ok) {
      throw new Error('Failed to delete user');
    }
  
    return {success: true}
  } catch (error) {
    console.error("Error deleting user:", error);
    // clearUserSession();
    return { success: false };
  }
}

export async function deleteImage(): Promise<{ success: Boolean }> {
  console.log('deleteUser is called');
  try {
    const accessToken = await getAccessToken();
    console.log(`accessToken=${accessToken}`)
    const response = await fetch(`${siteConfig.api_url}/user`, {
      method: 'DELETE',
      headers: {
        "access_token": `${accessToken}`,
      },
    });
  
    if (!response.ok) {
      throw new Error('Failed to delete user');
    }
  
    return {success: true}
  } catch (error) {
    console.error("Error deleting user:", error);
    // clearUserSession();
    return { success: false };
  }
}