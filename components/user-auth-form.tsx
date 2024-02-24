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
import { getDictionary } from "@/app/[lang]/dictionaries"
import { Locale } from "../i18n-config"

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  params: {
    lang: Locale
  }
}

type FormData = z.infer<typeof userAuthSchema>

export function UserAuthForm({ className, params: {lang}, ...props }: UserAuthFormProps) {
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
  const [dict, setDict] = React.useState<Record<string, any> | null>(null);

  React.useEffect(() => {
    const fetchDictionary = async () => {
      const dictionary = await getDictionary(lang);
      setDict(dictionary);
    };

    fetchDictionary();
  }, [lang]);

  async function onSubmit(data: FormData) {
    setIsLoading(true)

    try {
      await login(data.email, data.password);
      setIsLoading(false)
      router.refresh()
      router.push(origin || `/${lang}/dashboard`)  
    } catch (error) {
      setIsLoading(false)
      return dict && toast({
        title: dict.auth.errors.login.title,
        description: dict.auth.errors.login.description,
        variant: "destructive",
      })
    }
  }

  async function handleGithubSignIn() {
    setIsGitHubLoading(true);
  
    try {
      await signInWithGithub();
      router.refresh();
      router.push(origin || `/${lang}/dashboard`);
    } catch (error) {
      setIsGitHubLoading(false);
      return dict && toast({
        title: dict.auth.errors.loginGitHub.title,
        description: dict.auth.errors.loginGitHub.description,
        variant: "destructive",
      });
    }
  }
  
  async function handleGoogleSignIn() {
    setIsGoogleLoading(true);
  
    try {
      await signInWithGoogle();
      router.refresh();
      router.push(origin || `/${lang}/dashboard`);
    } catch (error) {
      setIsGoogleLoading(false);
      return dict && toast({
        title: dict.auth.errors.loginGoogle.title,
        description: dict.auth.errors.loginGoogle.description,
        variant: "destructive",
      });
    }
  }
  
  async function handleMicrosoftSignIn() {
    setIsMicrosoftLoading(true);
  
    try {
      await signInWithMicrosoft();
      router.refresh();
      router.push(origin || `/${lang}/dashboard`);
    } catch (error) {
      setIsMicrosoftLoading(false);
      return dict && toast({
        title: dict.auth.errors.loginMicrosoft.title,
        description: dict.auth.errors.loginMicrosoft.description,
        variant: "destructive",
      });
    }
  }

  async function handleLinkedinSignIn() {
    setIsLinkedinLoading(true);
  
    try {
      await signInWithLinkedin();
      router.refresh();
      router.push(origin || `/${lang}/dashboard`);
    } catch (error) {
      setIsLinkedinLoading(false);
      return dict && toast({
        title: dict.auth.errors.loginLinkedIn.title,
        description: dict.auth.errors.loginLinkedIn.description,
        variant: "destructive",
      });
    }
  }

  return dict && (
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
              <Icons.spinner className="mr-2 h-8 w-8 animate-spin" />
            )}
            {dict.auth.login.signIn}
          </button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
          {dict.auth.login.orContinueWith}
          </span>
        </div>
      </div>
      <div className="flex justify-center space-x-4">
        <button
          type="button"
          className={cn(buttonVariants({ variant: "outline" }), "rounded-full border-none p-2 px-1 hover:bg-secondary")}
          onClick={handleGithubSignIn}
          disabled={isLoading || isGitHubLoading}
        >
          {isGitHubLoading ? (
            <Icons.spinner className="h-8 w-8 animate-spin" />
          ) : (
            <Icons.gitHub className="h-8 w-8" />
          )}
        </button>
        <button
          type="button"
          className={cn(buttonVariants({ variant: "outline" }), "rounded-full border-none p-2 px-1 hover:bg-secondary")}
          onClick={handleGoogleSignIn}
          disabled={isLoading || isGoogleLoading}
        >
          {isGoogleLoading ? (
            <Icons.spinner className="h-8 w-8 animate-spin" />
          ) : (
            <Icons.google className="h-8 w-8" />
          )}
        </button>
        <button
          type="button"
          className={cn(buttonVariants({ variant: "ghost" }), "border-none p-2 px-1 hover:bg-secondary")}
          onClick={handleLinkedinSignIn}
          disabled={isLoading || isLinkedinLoading}
        >
          {isLinkedinLoading ? (
            <Icons.spinner className="h-8 w-8 animate-spin" />
          ) : (
            <Icons.linkedin className="h-8 w-8" />
          )}
        </button>      
        <button
          type="button"
          className={cn(buttonVariants({ variant: "outline" }), "border-none p-2 px-1 hover:bg-secondary")}
          onClick={handleMicrosoftSignIn}
          disabled={isLoading || isMicrosoftLoading}
        >
          {isMicrosoftLoading ? (
            <Icons.spinner className="h-8 w-8 animate-spin" />
          ) : (
            <Icons.microsoft className="h-8 w-8" />
          )}
        </button>
      </div>    
    </div>
  )
}

