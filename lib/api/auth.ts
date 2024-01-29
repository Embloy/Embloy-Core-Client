import { siteConfig } from "@/config/site";
import Cookies from 'js-cookie';
import { getSession } from "./session";

export async function login(email: string, password: string): Promise<void> {
  const encodedCredentials = btoa(`${email}:${password}`);

  const responseRt = await fetch(`${siteConfig.api_url}/auth/token/refresh`, {
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

  Cookies.set('refresh_token', rtResult.refresh_token, { sameSite: 'Strict', secure: false });

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

  Cookies.set('refresh_token', rtResult.refresh_token, { sameSite: 'Strict', secure: false });

  await getAccessToken();
}

export async function getAccessToken(): Promise<string | null> {
  console.log('getAccessToken is called');
  const refreshToken = Cookies.get('refresh_token');

  if (!refreshToken) {
    console.log('refresh_token is null');
    return null;
  }

  const responseAt = await fetch(`${siteConfig.api_url}/auth/token/access`, {
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
Cookies.set('access_token', accessToken, { sameSite: 'Strict', secure: false });

  return accessToken;
}

export async function logout(): Promise<void> {
  clearUserSession();
}

export function clearUserSession(): void {
  Cookies.remove('access_token', { sameSite: 'Strict', secure: false });
  Cookies.remove('refresh_token', { sameSite: 'Strict', secure: false });
}

export async function resetPassword(email: string): Promise<void> {
  const response = await fetch(`${siteConfig.api_url}/user/password/reset?email=${email}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Failed to send password reset email');
  }
}

export async function signInWithGithub() {
  const authUrl = `${siteConfig.api_root_url}/auth/github`;
  const authWindow = window.open(authUrl, '_blank');
  const checkInterval = setInterval(() => {
    if (authWindow && authWindow.closed) {
      clearInterval(checkInterval);
      return getSession();
    }
  }, 1000);
}

export async function signInWithGoogle() {
  const authUrl = `${siteConfig.api_root_url}/auth/google_oauth2`;
  const authWindow = window.open(authUrl, '_blank');
  const checkInterval = setInterval(() => {
    if (authWindow && authWindow.closed) {
      clearInterval(checkInterval);
      return getSession();
    }
  }, 1000);
}

export async function signInWithMicrosoft() {
  const authUrl = `${siteConfig.api_root_url}/auth/azure_activedirectory_v2`;
  const authWindow = window.open(authUrl, '_blank');
  const checkInterval = setInterval(() => {
    if (authWindow && authWindow.closed) {
      clearInterval(checkInterval);
      return getSession();
    }
  }, 1000);
}

export async function signInWithLinkedin() {
  const authUrl = `${siteConfig.api_root_url}/auth/linkedin`;
  const authWindow = window.open(authUrl, '_blank');
  const checkInterval = setInterval(() => {
    if (authWindow && authWindow.closed) {
      clearInterval(checkInterval);
      return getSession();
    }
  }, 1000);
}
