import * as z from "zod"

export const userNameSchema = z.object({
  first_name: z.string().min(3).max(32),
  last_name: z.string().min(3).max(32),
})
