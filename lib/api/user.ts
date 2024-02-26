import { siteConfig } from "@/config/site";
import { getAccessToken } from "./auth";

// TODO: ERROR HANDLING
export async function getUserData(accessToken): Promise<Record<string, any>> {
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

// TODO: ERROR HANDLING
export async function updateUser(userJson: string): Promise<{ success: Boolean }> {
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
      throw new Error('Failed to update user');
    }
    return {success: true}

  } catch (error) {
    console.error("Error updating user:", error);
    return { success: false };
  }
}

// TODO: ERROR HANDLING
export async function uploadUserImage(selectedImage: File): Promise<{ success: Boolean }> {
  const formData = new FormData();
  formData.append("image_url", selectedImage);
  try {
    const accessToken = await getAccessToken();
    const response = await fetch(`${siteConfig.api_url}/user/image`, {
      method: 'POST',
      headers: {
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
    return { success: false };
  }
}

// TODO: ERROR HANDLING
export async function deleteUser(): Promise<{ success: Boolean }> {
  try {
    const accessToken = await getAccessToken();
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
    return { success: false };
  }
}

// TODO: ERROR HANDLING
export async function deleteImage(): Promise<{ success: Boolean }> {
  try {
    const accessToken = await getAccessToken();
    const response = await fetch(`${siteConfig.api_url}/user/image`, {
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
    return { success: false };
  }
}