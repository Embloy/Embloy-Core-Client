import { z } from "zod"

import { applicationOptionSchema } from "./application-schema"

export const jobSchema = z.object({
  id: z.number(),
  user_id: z.number().optional(),
  title: z.string().nullable(),
  position: z.string().nullable(),
  key_skills: z.string().nullable(),
  job_type: z.string().nullable(),
  job_slug: z.string(),
  job_status: z.string().optional(),
  activity_status: z.number().optional(),
  referrer_url: z.string().nullable(),
  salary: z.number().nullable(),
  currency: z.string().nullable(),
  euro_salary: z.number().nullable(),
  start_slot: z.string().nullable(),
  duration: z.number(),
  code_lang: z.string().nullable(),
  longitude: z.number(),
  latitude: z.number(),
  country_code: z.string().nullable(),
  postal_code: z.string().nullable(),
  city: z.string().nullable(),
  address: z.string().nullable(),
  view_count: z.number(),
  applications_count: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
  job_notifications: z.string().optional(),
  image_url: z.string().nullable().optional(),
  description: z
    .object({
      id: z.number(),
      name: z.string(),
      body: z.string().nullable(),
      record_type: z.string(),
      record_id: z.number(),
      created_at: z.string(),
      updated_at: z.string(),
    })
    .nullable()
    .optional(),
  employer: z
    .object({
      employer_email: z.string().nullable(),
      employer_name: z.string().nullable(),
      employer_phone: z.string().nullable(),
      employer_image_url: z.string().nullable(),
    })
    .nullable()
    .optional(),
  application_options: z.array(applicationOptionSchema).optional(),
})

export type Job = z.infer<typeof jobSchema>
