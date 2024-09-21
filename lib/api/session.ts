import Cookies from "js-cookie"

import { siteConfig } from "@/config/site"

import { clearUserSession, getAccessToken } from "./auth"
import { getUserData } from "./user"

// Define your own user type
export interface User {
  id: number
  email: string
  password_digest: string
  activity_status: number
  image_url: string | null
  first_name: string
  last_name: string
  longitude: number | null
  latitude: number | null
  country_code: string | null
  postal_code: string | null
  city: string | null
  address: string | null
  date_of_birth: Date | null
  user_type: string
  view_count: number
  created_at: Date
  updated_at: Date
  applications_count: number
  jobs_count: number
  user_role: string
  application_notifications: boolean
  marketing_notifications: boolean
  communication_notifications: boolean
  security_notifications: boolean
  twitter_url: string | null
  facebook_url: string | null
  instagram_url: string | null
  github_url: string | null
  portfolio_url: string | null
  phone: string | null
  degree: string | null
  linkedin_url: string | null
}

export async function getSessionUser(): Promise<{
  response: User | null
  err: number | null
}> {
  const accessToken = await getAccessToken()
  if (accessToken) {
    const { response, err } = await getUserData(accessToken)
    if (err || !response) {
      clearUserSession()
      return { response: null, err: err || 500 }
    }
    return { response: response.user, err: null }
  } else {
    return { response: null, err: 401 }
  }
}

export async function getCurrentUser(
  refreshToken?: string
): Promise<{ response: User | null; err: number | null }> {
  if (refreshToken) {
    Cookies.set("refresh_token", refreshToken, {
      sameSite: "Strict",
      secure: siteConfig.url.startsWith("https://"),
      domain: siteConfig.url.startsWith("https://") ? ".embloy.com" : "",
      path: "/",
    })
  }
  const { response, err } = await getSessionUser()
  if (err || !response) {
    clearUserSession()
    return { response: null, err: err || 500 }
  }

  return { response: response, err: null }
}

export async function getSession(
  refreshToken?: string
): Promise<{ session: Boolean }> {
  try {
    if (refreshToken) {
      Cookies.set("refresh_token", refreshToken, {
        sameSite: "Strict",
        secure: siteConfig.url.startsWith("https://"),
        domain: siteConfig.url.startsWith("https://") ? ".embloy.com" : "",
        path: "/",
      })
    }
    const accessToken = await getAccessToken()
    if (accessToken) {
      return { session: true }
    }
  } catch (error) {
    console.error("Error getting user data:", error)
    clearUserSession()
    return { session: false }
  }
  return { session: false }
}
