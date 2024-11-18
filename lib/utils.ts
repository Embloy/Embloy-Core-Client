import { ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

import { env } from "@/env.mjs"
import { Locale } from "@/i18n-config"


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(locale: Locale, input: string | number): string {
  const date = new Date(input)
  return date.toLocaleDateString(locale, {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

export function absoluteUrl(path: string) {
  return `${env.NEXT_PUBLIC_APP_URL}${path}`
}

export function encode_job_slug(slug: string) {
  return slug.replace(/\//g, "-")
}

export function replaceNumberWithString(message: string, replacement: string | null | undefined): string {
  if (!message) {
      return "";
  }
  if (replacement === null || replacement === undefined) {
      return message;
  }
  return message.replace(/\{.*?\}/, replacement);
}

