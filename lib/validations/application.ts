import * as z from "zod"

export const applicationSchema = z.object({
  job_id: z.number(),
  user_id: z.number(),
  application_message: z.string().min(10).max(1000),
  response: z.string().nullable(), // Assuming date is in ISO string format
  created_at: z.string(), // Assuming date is in ISO string format
  updated_at: z.string(), // Assuming date is in ISO string format
})
