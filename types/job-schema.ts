import { z } from "zod"
import { applicationOptionSchema } from "./application-schema"

export const jobSchema = z.object({
  id: z.number(),
  job_type: z.string().nullable(),
  job_slug: z.string(),
  job_type_value: z.number().nullable().optional(),
  job_status: z.string().optional(),
  activity_status: z.number().optional(),
  user_id: z.number().optional(),
  referrer_url: z.string().optional().nullable(),
  duration: z.number(),
  code_lang: z.string().nullable(),
  title: z.string().nullable(),
  position: z.string().nullable(),
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
  key_skills: z.string().nullable().optional(),
  salary: z.number().nullable(),
  euro_salary: z.number().nullable().optional(),
  currency: z.string().nullable(),
  start_slot: z.string().nullable(),
  longitude: z.number(),
  latitude: z.number(),
  country_code: z.string().nullable(),
  postal_code: z.string().nullable(),
  city: z.string().nullable(),
  address: z.string().nullable(),
  view_count: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
  applications_count: z.number(),
  job_notifications: z.string().optional(),
  deleted_at: z.string().nullable().optional(),
  application_options: z.array(applicationOptionSchema).optional(),
  image_url: z.string().nullable().optional(),
  employer: z
    .object({
      employer_email: z.string().nullable(),
      employer_name: z.string().nullable(),
      employer_phone: z.string().nullable(),
      employer_image_url: z.string().nullable(),
    })
    .nullable()
    .optional(),
})

export type Job = z.infer<typeof jobSchema>
