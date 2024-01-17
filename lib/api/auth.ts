// /lib/api/auth.ts

import { siteConfig } from "@/config/site";
import Cookies from 'js-cookie';

export async function login(email: string, password: string): Promise<void> {
  const encodedCredentials = btoa(`${email}:${password}`);

  const responseRt = await fetch(`${siteConfig.api_url}/user/auth/token/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${encodedCredentials}`
    },
    body: JSON.stringify({ email: email, password: password })
  })

  const rtResult = await responseRt.json()

  if (!rtResult || !rtResult?.refresh_token) {
    throw new Error('Authentication failed');
  }

  Cookies.set('refresh_token', rtResult.refresh_token, { sameSite: 'Strict', secure: true });

  await getAccessToken();
}

export async function signup(email: string, firstName: string, lastName: string, password: string, passwordConfirmation: string): Promise<void> {
  const response = await fetch(`${siteConfig.api_url}/user`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user: {
        email: email,
        first_name: firstName,
        last_name: lastName,
        password: password,
        password_confirmation: passwordConfirmation
      }
    })
  })

  if (!response.ok) {
    throw new Error('Account Creation Failed');
  }

  await verify(email, password);
}

export async function verify(email: string, password: string): Promise<void> {
  const encodedCredentials = btoa(`${email}:${password}`);

  const responseRt = await fetch(`${siteConfig.api_url}/user/verify`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${encodedCredentials}`
    },
  })

  const rtResult = await responseRt.json()

  if (!rtResult || !rtResult?.refresh_token) {
    throw new Error('Authentication failed');
  }

  Cookies.set('refresh_token', rtResult.refresh_token, { sameSite: 'Strict', secure: true });

  await getAccessToken();
}

export async function getAccessToken(): Promise<string | null> {
  console.log('getAccessToken is called');
  const refreshToken = Cookies.get('refresh_token');

  if (!refreshToken) {
    console.log('refresh_token is null');
    return null;
  }

  const responseAt = await fetch(`${siteConfig.api_url}/user/auth/token/access`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'refresh_token': refreshToken
    },
  })

  const atResult = await responseAt.json()

  if (!atResult || !atResult?.access_token) {
    throw new Error('Failed to refresh access token');
  }

  const accessToken = atResult.access_token;
Cookies.set('access_token', accessToken, { sameSite: 'Strict', secure: true });

  return accessToken;
}

export async function logout(): Promise<void> {
  clearUserSession();
}

export function clearUserSession(): void {
  // Implement logic to clear user session (e.g., clear local storage, cookies, or state)
  Cookies.remove('access_token', { sameSite: 'Strict', secure: true });
  Cookies.remove('refresh_token', { sameSite: 'Strict', secure: true });
}