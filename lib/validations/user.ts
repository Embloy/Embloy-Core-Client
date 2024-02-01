import * as z from "zod"
import { URL } from 'url';

export const userSchema = z.object({
  id: z.number(),
  password_digest: z.string(),
  activity_status: z.number(),
  image_url: z.string().url().nullable(),
  first_name: z.string().nonempty({ message: 'First name is required' }),
  last_name: z.string().nonempty({ message: 'Last name is required' }),
  email: z.string().email({ message: 'Email must be a valid email' }),
  longitude: z.number().nullable(),
  latitude: z.number().nullable(),
  country_code: z.string().nullable(),
  postal_code: z.string().nullable(),
  city: z.string().nullable(),
  address: z.string().max(500).nullable(),
  date_of_birth: z.date().nullable(),
  user_type: z.string().max(100),
  view_count: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
  applications_count: z.number(),
  jobs_count: z.number(),
  user_role: z.string().max(100),
  application_notifications: z.boolean(),
  phone: z.string().max(100).refine(
    phone => /^(\+\d{1,3}[- ]?)?(\d[- ]?)*\d$/.test(phone),
    { message: 'Phone number must be a valid phone number' }
  ).nullable(),
  degree: z.string().max(100).nullable(),
  twitter_url: z.string().url().refine(
    url => /^https?:\/\/(www\.)?twitter\.com(\/.*)?$/.test(url),
    { message: 'URL must be a Twitter URL' }
  ).nullable(),
  facebook_url: z.string().url().refine(
    url => /^https?:\/\/(www\.)?facebook\.com(\/.*)?$/.test(url),
    { message: 'URL must be a Facebook URL' }
  ).nullable(),
  instagram_url: z.string().url().refine(
    url => /^https?:\/\/(www\.)?instagram\.com(\/.*)?$/.test(url),
    { message: 'URL must be an Instagram URL' }
  ).nullable(),
  linkedin_url: z.string().url().refine(
    url => /^https?:\/\/(www\.)?linkedin\.com(\/.*)?$/.test(url),
    { message: 'URL must be a LinkedIn URL' }
  ).nullable(),
})
