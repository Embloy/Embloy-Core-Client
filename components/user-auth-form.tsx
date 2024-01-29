"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { login, signInWithGoogle, signInWithLinkedin, signInWithMicrosoft } from '@/lib/api/auth';
import { cn } from "@/lib/utils"
import { userAuthSchema } from "@/lib/validations/auth"
import { buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"
import { useRouter, useSearchParams } from "next/navigation"
import { signInWithGithub } from '@/lib/api/auth'; // Import the signInWithGithub function

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

type FormData = z.infer<typeof userAuthSchema>

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(userAuthSchema),
  })
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [isGitHubLoading, setIsGitHubLoading] = React.useState<boolean>(false)
  const [isGoogleLoading, setIsGoogleLoading] = React.useState<boolean>(false)
  const [isMicrosoftLoading, setIsMicrosoftLoading] = React.useState<boolean>(false)
  const [isLinkedinLoading, setIsLinkedinLoading] = React.useState<boolean>(false)
  const router = useRouter()
  const origin = useSearchParams().get("origin") as string

  async function onSubmit(data: FormData) {
    setIsLoading(true)

    try {
      await login(data.email, data.password);
      // Redirect to dashboard or show success message
      setIsLoading(false)
      // This forces a cache invalidation.
      router.refresh()
      router.push(origin || '/dashboard')  
    } catch (error) {
      setIsLoading(false)
      return toast({
        title: "Something went wrong.",
        description: "Your sign in request failed. Please try again.",
        variant: "destructive",
      })
    }
  }

  async function handleGithubSignIn() {
    setIsGitHubLoading(true);

    try {
      await signInWithGithub();
      // This forces a cache invalidation.
      router.refresh();
      router.push(origin || '/dashboard');
    } catch (error) {
      setIsGitHubLoading(false);
      return toast({
        title: "Something went wrong.",
        description: "Your sign in with GitHub request failed. Please try again.",
        variant: "destructive",
      });
    }
  }

  async function handleGoogleSignIn() {
    setIsGoogleLoading(true);

    try {
      await signInWithGoogle();
      // This forces a cache invalidation.
      router.refresh();
      router.push(origin || '/dashboard');
    } catch (error) {
      setIsGoogleLoading(false);
      return toast({
        title: "Something went wrong.",
        description: "Your sign in with Google request failed. Please try again.",
        variant: "destructive",
      });
    }
  }

  async function handleMicrosoftSignIn() {
    setIsMicrosoftLoading(true);

    try {
      await signInWithMicrosoft();
      // This forces a cache invalidation.
      router.refresh();
      router.push(origin || '/dashboard');
    } catch (error) {
      setIsMicrosoftLoading(false);
      return toast({
        title: "Something went wrong.",
        description: "Your sign in with Microsoft request failed. Please try again.",
        variant: "destructive",
      });
    }
  }

  async function handleLinkedinSignIn() {
    setIsLinkedinLoading(true);

    try {
      await signInWithLinkedin();
      // This forces a cache invalidation.
      router.refresh();
      router.push(origin || '/dashboard');
    } catch (error) {
      setIsLinkedinLoading(false);
      return toast({
        title: "Something went wrong.",
        description: "Your sign in with Linkedin request failed. Please try again.",
        variant: "destructive",
      });
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
            <Label className="sr-only" htmlFor="password">
              Password
            </Label>
            <Input
              id="password"
              placeholder="password"
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
        className={cn(buttonVariants({ variant: "outline" }))}
        onClick={handleGithubSignIn}
        disabled={isLoading || isGitHubLoading}
      >
        {isGitHubLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.gitHub className="mr-2 h-4 w-4" />
        )}{" "}
        Github
      </button>
      <button
        type="button"
        className={cn(buttonVariants({ variant: "outline" }))}
        onClick={handleGoogleSignIn}
        disabled={isLoading || isGoogleLoading}
      >
        {isGoogleLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.google className="mr-2 h-4 w-4" />
        )}{" "}
        Google
      </button>
      <button
        type="button"
        className={cn(buttonVariants({ variant: "outline" }))}
        onClick={handleLinkedinSignIn}
        disabled={isLoading || isLinkedinLoading}
      >
        {isLinkedinLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.linkedin className="mr-2 h-4 w-4" />
        )}{" "}
        LinkedIn
      </button>      
      <button
        type="button"
        className={cn(buttonVariants({ variant: "outline" }))}
        onClick={handleMicrosoftSignIn}
        disabled={isLoading || isMicrosoftLoading}
      >
        {isMicrosoftLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.microsoft className="mr-2 h-4 w-4" />
        )}{" "}
        Microsoft
      </button>
    </div>
  )
}

