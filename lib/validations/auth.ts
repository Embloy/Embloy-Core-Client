import * as z from "zod"

export const userAuthSchema = z.object({
  email: z.string().email({ message: 'Email must be a valid email' }).max(150, { message: 'Email must be at most 150 characters'}),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }).max(72, { message: 'Password must be at most 72 characters'}),
})

export const userSignUpSchema = z.object({
  firstName: z.string().nonempty({ message: 'First name is required' }).max(128, { message: 'First name must be at most 128 characters'}),
  lastName: z.string().nonempty({ message: 'Last name is required' }).max(128, { message: 'Last name must be at most 128 characters'}),
  email: z.string().email({ message: 'Email must be a valid email' }).max(150, { message: 'Email must be at most 150 characters'}),
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

export const pwResetSchema = z.object({
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

export const passwordResetSchema = z.object({
  email: z.string().email({ message: 'Email must be a valid email' }).max(150, { message: 'Email must be at most 150 characters'}),
});

export const activationTokenSchema = z.object({
  email: z.string().email({ message: 'Email must be a valid email' }).max(150, { message: 'Email must be at most 150 characters'}),
});
