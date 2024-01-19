import * as z from "zod"

export const userSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  password_digest: z.string(),
  activity_status: z.number(),
  image_url: z.string().url().nullable(),
  first_name: z.string().min(3).max(32),
  last_name: z.string().min(3).max(32),
  longitude: z.number().nullable(),
  latitude: z.number().nullable(),
  country_code: z.string().nullable(),
  postal_code: z.string().nullable(),
  city: z.string().nullable(),
  address: z.string().nullable(),
  date_of_birth: z.string().nullable(), // Assuming date is in ISO string format
  user_type: z.string(),
  view_count: z.number(),
  created_at: z.string(), // Assuming date is in ISO string format
  updated_at: z.string(), // Assuming date is in ISO string format
  applications_count: z.number(),
  jobs_count: z.number(),
  user_role: z.string(),
  application_notifications: z.boolean(),
  twitter_url: z.string().url().nullable(),
  facebook_url: z.string().url().nullable(),
  instagram_url: z.string().url().nullable(),
  phone: z.string().nullable(),
  degree: z.string().nullable(),
  linkedin_url: z.string().url().nullable(),
})