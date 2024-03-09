import { z } from "zod";

export const applicationOptionSchema = z.object({
  id: z.number(),
  job_id: z.number(),
  question: z.string(),
  question_type: z.string(),
  required: z.boolean(),
  options: z.array(z.string()),
  created_at: z.string(),
  updated_at: z.string(),
  deleted_at: z.string().nullable(),
});

export const jobSchema = z.object({
  job_id: z.number(),
  job_type: z.string().optional(),
  job_slug: z.string(),
  job_type_value: z.number(),
  job_status: z.string().optional(),
  activity_status: z.number(),
  user_id: z.number(),
  referrer_url: z.string().optional(),
  duration: z.number(),
  code_lang: z.string().nullable(),
  title: z.string().nullable(),
  position: z.string().nullable(),
  description: z.object({
    id: z.number(),
    name: z.string(),
    body: z.string(),
    record_type: z.string(),
    record_id: z.number(),
    created_at: z.string(),
    updated_at: z.string(),
  }).nullable(),
  key_skills: z.string().nullable(),
  salary: z.number().nullable(),
  euro_salary: z.number().nullable(),
  relevance_score: z.number().nullable(),
  currency: z.string(),
  start_slot: z.string(),
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
  employer_rating: z.number(),
  job_notifications: z.string(),
  boost: z.number(),
  cv_required: z.boolean(),
  allowed_cv_formats: z.array(z.string()),
  deleted_at: z.string().nullable(),
  job_value: z.string(),
  application_options: z.array(applicationOptionSchema),
  image_url: z.string().nullable(),
  employer_email: z.string().nullable(),
  employer_name: z.string().nullable(),
  employer_phone: z.string().nullable(),
  employer_image_url: z.string().nullable(),
});

export type ApplicationOption = z.infer<typeof applicationOptionSchema>;
export type Job = z.infer<typeof jobSchema>;