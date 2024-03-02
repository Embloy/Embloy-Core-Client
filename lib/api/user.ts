import { siteConfig } from "@/config/site";
import { getAccessToken } from "./auth";

export async function getUserData(accessToken: string): Promise<{response: Record<string, any> | null, err: number | null}> {
    const apiResponse = await fetch(`${siteConfig.api_url}/user`, {
      method: 'GET',
      headers: {
        "access_token": `${accessToken}`,
      },
    });
  
    if (!apiResponse.ok) {
      return { response: null, err: apiResponse.status };
    }

  
    return { response: await apiResponse.json(), err: null };
}

export async function updateUser(userJson: string): Promise<number | null > {
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
    return response.status
  }
  return null
}

// TODO: ERROR HANDLING
export async function uploadUserImage(selectedImage: File): Promise<number | null> {
  const formData = new FormData();
  formData.append("image_url", selectedImage);
    const accessToken = await getAccessToken();
    const response = await fetch(`${siteConfig.api_url}/user/image`, {
      method: 'POST',
      headers: {
        "access_token": `${accessToken}`,
      },
      body: formData
    });
  
    if (!response.ok) {
      return response.status
    }
    return null
}

export async function deleteUser(): Promise<number | null> {
    const accessToken = await getAccessToken();
    const response = await fetch(`${siteConfig.api_url}/user`, {
      method: 'DELETE',
      headers: {
        "access_token": `${accessToken}`,
      },
    });
  
    if (!response.ok) {
      return response.status
    }
  
    return null
}

export async function deleteImage(): Promise<number | null> {
    const accessToken = await getAccessToken();
    const response = await fetch(`${siteConfig.api_url}/user/image`, {
      method: 'DELETE',
      headers: {
        "access_token": `${accessToken}`,
      },
    });
  
    if (!response.ok) {
      return response.status
    }

    return null
}