import * as z from "zod"

export const userAuthSchema = z.object({
  email: z.string().email({ message: 'Email must be a valid email' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }).max(72, { message: 'Password must be at most 72 characters'}),
})

export const userSignUpSchema = z.object({
  firstName: z.string().nonempty({ message: 'First name is required' }),
  lastName: z.string().nonempty({ message: 'Last name is required' }),
  email: z.string().email({ message: 'Email must be a valid email' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }).max(72, { message: 'Password must be at most 72 characters'}),
  passwordConfirmation: z.string().min(8, { message: 'Password must be at least 8 characters' }).max(72, { message: 'Password must be at most 72 characters'})
}).superRefine(({ passwordConfirmation, password }, ctx) => {
  if (passwordConfirmation !== password) {
    ctx.addIssue({
      code: "custom",
      message: "Passwords must match",
      path: ['passwordConfirmation']
    });
  }
});
