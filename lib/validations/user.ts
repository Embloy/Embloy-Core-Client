import * as z from "zod"

export const userSchema = z.object({
  id: z.number().refine(value => value, { message: 'id' }),
  password_digest: z.string().nonempty({ message: 'password_digest' }),
  activity_status: z.number().refine(value => value, { message: 'activity_status' }),
  image_url: z.string().url().nullable().refine(value => value, { message: 'image_url' }),
  longitude: z.number().nullable().refine(value => value, { message: 'longitude' }),
  latitude: z.number().nullable().refine(value => value, { message: 'latitude' }),
  country_code: z.string().nullable(),
  postal_code: z.string().nullable(),
  city: z.string().nullable(),
  date_of_birth: z.date().nullable().refine(value => value, { message: 'date_of_birth' }),
  user_type: z.string().max(100, { message: 'user_type' }),
  view_count: z.number().refine(value => value, { message: 'view_count' }),
  created_at: z.date(),
  updated_at: z.date(),
  applications_count: z.number().refine(value => value, { message: 'applications_count' }),
  jobs_count: z.number().refine(value => value, { message: 'jobs_count' }),
  user_role: z.string().max(100, { message: 'user_role' }),
  application_notifications: z.boolean().refine(value => value, { message: 'application_notifications' }),
  first_name: z.string().nonempty({ message: 'first_name' }),
  last_name: z.string().nonempty({ message: 'last_name' }),
  email: z.string().email({ message: 'email' }),
  address: z.string().max(500, { message: 'address' }).nullable(),
  phone: z.string().max(100, { message: 'phone' }).refine(
    phone => /^(\+\d{1,3}[- ]?)?(\d[- ]?)*\d$/.test(phone) || phone === '',
    { message: 'phone' }
  ).nullable(),
  twitter_url: z.string().url({message: 'twitter_url'}).refine(
    url => /^https?:\/\/(www\.)?twitter\.com(\/.*)?$/.test(url),
    { message: 'twitter_url' }
  ).nullable(),
  facebook_url: z.string().url({message: 'facebook_url'}).refine(
    url => /^https?:\/\/(www\.)?facebook\.com(\/.*)?$/.test(url),
    { message: 'facebook_url' }
  ).nullable(),
  instagram_url: z.string().url({message: 'instagram_url'}).refine(
    url => /^https?:\/\/(www\.)?instagram\.com(\/.*)?$/.test(url),
    { message: 'instagram_url' }
  ).nullable(),
  linkedin_url: z.string().url({message: 'linkedin_url'}).refine(
    url => /^https?:\/\/(www\.)?linkedin\.com(\/.*)?$/.test(url),
    { message: 'linkedin_url' }
  ).nullable(),
})