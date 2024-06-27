import * as z from "zod"

export const userSchema = z.object({
  // longitude: z.number().nullable().refine(value => value, { message: 'longitude' }),
  // latitude: z.number().nullable().refine(value => value, { message: 'latitude' }),
  // date_of_birth: z.date().nullable().refine(value => value, { message: 'date_of_birth' }),
  // view_count: z.number().refine(value => value, { message: 'view_count' }),
  // created_at: z.date(),
  // updated_at: z.date(),
  // applications_count: z.number().refine(value => value, { message: 'applications_count' }),
  // jobs_count: z.number().refine(value => value, { message: 'jobs_count' }),
  //image_url: z.string().url().nullable().refine(value => value, { message: 'image_url' }),
  id: z.number().refine(value => value, { message: 'id' }),
  password_digest: z.string().nonempty({ message: 'password_digest' }),
  activity_status: z.number().refine(value => value, { message: 'activity_status' }),
  country_code: z.string().nullable(),
  postal_code: z.string().nullable(),
  city: z.string().nullable(),
  user_type: z.string().max(100, { message: 'user_type' }),
  user_role: z.string().max(100, { message: 'user_role' }),
  application_notifications: z.boolean().refine(value => value, { message: 'application_notifications' }),
  first_name: z.string().nonempty({ message: 'First name is required' }).max(128, { message: 'First name must be at most 128 characters'}),
  last_name: z.string().nonempty({ message: 'Last name is required' }).max(128, { message: 'Last name must be at most 128 characters'}),
  email: z.string().email({ message: 'Email must be a valid email' }).max(150, { message: 'Email must be at most 150 characters'}),
  address: z.string().max(150, { message: 'address' }).nullable(),
  phone: z.string().max(100, { message: 'phone' }).refine(
    phone => /^(\+\d{1,3}[- ]?)?(\d[- ]?)*\d$/.test(phone) || phone === '',
    { message: 'phone' }
  ).nullable(),
  twitter_url: z.string().max(150, { message: 'twitter_url'}).refine(
    url => /^https?:\/\/(www\.)?twitter\.com(\/.*)?$/.test(url) || url === '',
    { message: 'twitter_url' }
  ).nullable(),
  facebook_url: z.string().max(150, { message: 'facebook_url'}).refine(
    url => /^https?:\/\/(www\.)?facebook\.com(\/.*)?$/.test(url) || url === '',
    { message: 'facebook_url' }
  ).nullable(),
  instagram_url: z.string().max(150, { message: 'instagram_url'}).refine(
    url => /^https?:\/\/(www\.)?instagram\.com(\/.*)?$/.test(url) || url === '',
    { message: 'instagram_url' }
  ).nullable(),
  linkedin_url: z.string().max(150, { message: 'linkedin_url'}).refine(
    url => /^https?:\/\/(www\.)?linkedin\.com(\/.*)?$/.test(url) || url === '',
    { message: 'linkedin_url' }
  ).nullable(),
})