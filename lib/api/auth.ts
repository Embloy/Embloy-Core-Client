import { siteConfig } from "@/config/site";
import Cookies from 'js-cookie';
import { getSession } from "./session";
import { decode } from 'jsonwebtoken';

export async function login(email: string, password: string): Promise<number | null> {
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
    return responseRt.status;
  }

  Cookies.set('refresh_token', rtResult.refresh_token, { sameSite: 'Strict', secure: false });

  await getAccessToken();

  return null;
}

export async function signup(email: string, firstName: string, lastName: string, password: string, passwordConfirmation: string): Promise<number | null> {
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
    return response.status;
  }

  return await verify(email, password);
}

export async function verify(email: string, password: string): Promise<number | null> {
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
    return rtResult.status;
  }

  return null;
}

export async function activationToken(email: string): Promise<number | null> {
  const response = await fetch(`${siteConfig.api_url}/user/activate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      "email": email,
    })
  })

  if (!response.ok) {
    return response.status;
  }

  return null;
}

// TODO: ERROR HANDLING
export async function getAccessToken(): Promise<string | null> {
  
  // Check if a valid access token is already set
  const existingAccessToken = Cookies.get('access_token');
  if (existingAccessToken) {
    // Verify if the access token is expired
    const isExpired = checkIfTokenExpired(existingAccessToken);
    if (!isExpired) {
      return existingAccessToken;
    }
  }

  const refreshToken = Cookies.get('refresh_token');

  if (!refreshToken) {
    return null;
  }

  // Verify if the refresh token is expired
  const isRefreshTokenExpired = checkIfTokenExpired(refreshToken);
  if (isRefreshTokenExpired) {
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

// Function to check if the token is expired
function checkIfTokenExpired(token: string): boolean {
  try {
    const decodedToken: any = decode(token);
    if (Date.now() >= decodedToken.exp * 1000) {
      return true;
    } else {
      return false;
    }
  } catch {
    return true;
  }
}

export async function logout(): Promise<void> {
  clearUserSession();
}

export function clearUserSession(): void {
  Cookies.remove('access_token', { sameSite: 'Strict', secure: false });
  Cookies.remove('refresh_token', { sameSite: 'Strict', secure: false });
}

export async function resetPassword(email: string): Promise<number | null> {
  const response = await fetch(`${siteConfig.api_url}/user/password/reset?email=${email}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    return response.status
  }

  return null
}

export async function setPassword(password: string, password_confirmation: string, reset_token: string| null): Promise<number | null> {
  const route = reset_token ? `${siteConfig.api_url}/user/password/reset?token=${reset_token}` : `${siteConfig.api_url}/user/password`
  const response = await fetch(route, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'access-token': reset_token ? '' :  await getAccessToken() || ''
    },
    body: JSON.stringify({
      user: {
        password: password,
        password_confirmation: password_confirmation
      }
    })
  })

  if (!response.ok) {
    return response.status
  }

  return null
}

export function signInWithGithub() {
  return new Promise<void>((resolve, reject) => {
    const authUrl = `${siteConfig.api_root_url}/auth/github`;
    const authWindow = window.open(authUrl);
    const checkInterval = setInterval(() => {
      if (authWindow && authWindow.closed) {
        clearInterval(checkInterval);
        getSession().then(isAuthenticated => {
          if (isAuthenticated) {
            resolve();
          } else {
            reject(new Error('User is not authenticated'));
          }
        });
      }
    }, 1000);
  });
}

export function signInWithGoogle() {
  return new Promise<void>((resolve, reject) => {
    const authUrl = `${siteConfig.api_root_url}/auth/google_oauth2`;
    const authWindow = window.open(authUrl);
    const checkInterval = setInterval(() => {
      if (authWindow && authWindow.closed) {
        clearInterval(checkInterval);
        getSession().then(isAuthenticated => {
          if (isAuthenticated) {
            resolve();
          } else {
            reject(new Error('User is not authenticated'));
          }
        });
      }
    }, 1000);
  });
}

export function signInWithMicrosoft() {
  return new Promise<void>((resolve, reject) => {
    const authUrl = `${siteConfig.api_root_url}/auth/azure_activedirectory_v2`;
    const authWindow = window.open(authUrl);
    const checkInterval = setInterval(() => {
      if (authWindow && authWindow.closed) {
        clearInterval(checkInterval);
        getSession().then(isAuthenticated => {
          if (isAuthenticated) {
            resolve();
          } else {
            reject(new Error('User is not authenticated'));
          }
        });
      }
    }, 1000);
  });
}

export function signInWithLinkedin() {
  return new Promise<void>((resolve, reject) => {
    const authUrl = `${siteConfig.api_root_url}/auth/linkedin`;
    const authWindow = window.open(authUrl);
    const checkInterval = setInterval(() => {
      if (authWindow && authWindow.closed) {
        clearInterval(checkInterval);
        getSession().then(session => {
          if (session.session) {
            resolve();
          } else {
            reject(new Error('User is not authenticated'));
          }
        });
      }
    }, 1000);
  });
}