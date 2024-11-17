import { z } from "zod"

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
})

export type ApplicationOption = z.infer<typeof applicationOptionSchema>
