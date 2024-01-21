"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { signup } from '@/lib/api/auth';
import { cn } from "@/lib/utils"
import { userSignUpSchema } from "@/lib/validations/auth"
import { buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"
import { useRouter, useSearchParams } from "next/navigation"

interface UserSignUpFormProps extends React.HTMLAttributes<HTMLDivElement> {}

type FormData = z.infer<typeof userSignUpSchema>

export function UserSignUpForm({ className, ...props }: UserSignUpFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(userSignUpSchema),
  })
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [isGitHubLoading, setIsGitHubLoading] = React.useState<boolean>(false)
  const router = useRouter()
  const origin = useSearchParams().get("origin") as string

  async function onSubmit(data: FormData) {
    setIsLoading(true)

    try {
      await signup(data.email, data.firstName, data.lastName, data.password, data.passwordConfirmation);
      // Redirect to dashboard or show success message
      setIsLoading(false)
      // This forces a cache invalidation.
      router.refresh()
      router.push(origin || '/dashboard')  
      return toast({
        title: "Welcome to Embloy!",
        description: "You have successfully created a new account.",
      })
  
    } catch (error) {
      setIsLoading(false)
      return toast({
        title: "Something went wrong.",
        description: "Your sign in request failed. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading || isGitHubLoading}
              {...register("email")}
            />
            {errors?.email && (
              <p className="px-1 text-xs text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="firstName">
              First Name
            </Label>
            <Input
              id="firstName"
              placeholder="First Name"
              type="text"
              disabled={isLoading || isGitHubLoading}
              {...register("firstName")}
            />
            {errors?.firstName && (
              <p className="px-1 text-xs text-red-600">
                {errors.firstName.message}
              </p>
            )}
          </div>
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="lastName">
              Last Name
            </Label>
            <Input
              id="lastName"
              placeholder="Last Name"
              type="text"
              disabled={isLoading || isGitHubLoading}
              {...register("lastName")}
            />
            {errors?.lastName && (
              <p className="px-1 text-xs text-red-600">
                {errors.lastName.message}
              </p>
            )}
          </div>
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="password">
              Password
            </Label>
            <Input
              id="password"
              placeholder="Password"
              type="password"
              autoCapitalize="none"
              autoComplete="password"
              autoCorrect="off"
              disabled={isLoading || isGitHubLoading}
              {...register("password")}
            />
            {errors?.password && (
              <p className="px-1 text-xs text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="passwordConfirmation">
              Confirm Password
            </Label>
            <Input
              id="passwordConfirmation"
              placeholder="Confirm Password"
              type="password"
              disabled={isLoading || isGitHubLoading}
              {...register("passwordConfirmation")}
            />
            {errors?.passwordConfirmation && (
              <p className="px-1 text-xs text-red-600">
                {errors.passwordConfirmation.message}
              </p>
            )}
          </div>
          <button className={cn(buttonVariants())} disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sign In
          </button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <button
        type="button"
        className={cn(buttonVariants({ variant: "outline" }), 'cursor-not-allowed')}
        /*onClick={() => {
          setIsGitHubLoading(true)
          signIn("github")
        }}*/
      >
        {isGitHubLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.gitHub className="mr-2 h-4 w-4" />
        )}{" "}
        Github
    </button>
  </div>
  )
}
