"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import {
  signInWithGithub,
  signInWithGoogle,
  signInWithLinkedin,
  signInWithMicrosoft,
  signup,
} from "@/lib/api/auth"
import { cn } from "@/lib/utils"
import { userSignUpSchema } from "@/lib/validations/auth"
import { buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"
import { getDictionary } from "@/app/[lang]/dictionaries"

import { Locale } from "../i18n-config"

interface UserSignUpFormProps extends React.HTMLAttributes<HTMLDivElement> {
  params: {
    lang: Locale
    mode?: string
  }
}

type FormData = z.infer<typeof userSignUpSchema>

export function UserSignUpForm({
  className,
  params: { lang, mode },
  ...props
}: UserSignUpFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(userSignUpSchema),
  })
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [isGitHubLoading, setIsGitHubLoading] = React.useState<boolean>(false)
  const [isGoogleLoading, setIsGoogleLoading] = React.useState<boolean>(false)
  const [isMicrosoftLoading, setIsMicrosoftLoading] =
    React.useState<boolean>(false)
  const [isLinkedinLoading, setIsLinkedinLoading] =
    React.useState<boolean>(false)
  const router = useRouter()
  const origin = useSearchParams().get("origin") as string
  const [dict, setDict] = React.useState<Record<string, any> | null>(null)

  React.useEffect(() => {
    const fetchDictionary = async () => {
      const dictionary = await getDictionary(lang)
      setDict(dictionary)
    }

    fetchDictionary()
  }, [lang])

  async function onSubmit(data: FormData) {
    setIsLoading(true)

    try {
      const err = await signup(
        data.email,
        data.firstName,
        data.lastName,
        data.password,
        data.passwordConfirmation
      )
      // Redirect to dashboard or show success message
      setIsLoading(false)
      if (err && dict) {
        return toast({
          title: dict.errors[err || "500"].title || dict.errors.generic.title,
          description:
            dict.errors[err || "500"].description ||
            dict.errors.generic.description,
          variant: "destructive",
        })
      }

      // This forces a cache invalidation.
      // router.refresh()
      // router.push(origin || `/${lang}/dashboard/overview`)
      return (
        dict &&
        toast({
          title: dict.auth.success.register.title,
          description: dict.auth.success.register.description,
        })
      )
    } catch (error) {
      setIsLoading(false)
      return (
        dict &&
        toast({
          title: dict.auth.errors.registration.title,
          description: dict.auth.errors.registration.description,
          variant: "destructive",
        })
      )
    }
  }

  async function handleGithubSignIn() {
    setIsGitHubLoading(true)

    try {
      await signInWithGithub()
      router.refresh()
      router.push(origin || `/${lang}/dashboard/overview`)
    } catch (error) {
      setIsGitHubLoading(false)
      return (
        dict &&
        toast({
          title: dict.auth.errors.loginGitHub.title,
          description: dict.auth.errors.loginGitHub.description,
          variant: "destructive",
        })
      )
    }
  }

  async function handleGoogleSignIn() {
    setIsGoogleLoading(true)

    try {
      await signInWithGoogle()
      router.refresh()
      router.push(origin || `/${lang}/dashboard/overview`)
    } catch (error) {
      setIsGoogleLoading(false)
      return (
        dict &&
        toast({
          title: dict.auth.errors.loginGoogle.title,
          description: dict.auth.errors.loginGoogle.description,
          variant: "destructive",
        })
      )
    }
  }

  async function handleMicrosoftSignIn() {
    setIsMicrosoftLoading(true)

    try {
      await signInWithMicrosoft()
      router.refresh()
      router.push(origin || `/${lang}/dashboard/overview`)
    } catch (error) {
      setIsMicrosoftLoading(false)
      return (
        dict &&
        toast({
          title: dict.auth.errors.loginMicrosoft.title,
          description: dict.auth.errors.loginMicrosoft.description,
          variant: "destructive",
        })
      )
    }
  }

  async function handleLinkedinSignIn() {
    setIsLinkedinLoading(true)

    try {
      await signInWithLinkedin()
      router.refresh()
      router.push(origin || `/${lang}/dashboard/overview`)
    } catch (error) {
      setIsLinkedinLoading(false)
      return (
        dict &&
        toast({
          title: dict.auth.errors.loginLinkedIn.title,
          description: dict.auth.errors.loginLinkedIn.description,
          variant: "destructive",
        })
      )
    }
  }

  return (
    dict && (
      <div className={cn("grid gap-6", className)} {...props}>
        {mode === undefined && (
          <>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-2">
                <div className="grid gap-1">
                  <Label className="sr-only" htmlFor="email">
                    {dict.auth.register.email}
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
                  {errors?.email?.message && (
                    <p className="px-1 text-xs text-red-600">
                      {dict.auth.errors[errors.email.message] ||
                        errors.email.message}
                    </p>
                  )}
                </div>

                <div className="grid gap-1">
                  <Label className="sr-only" htmlFor="firstName">
                    {dict.auth.register.firstName}
                  </Label>
                  <Input
                    id="firstName"
                    placeholder={dict.auth.register.firstName}
                    type="text"
                    disabled={isLoading || isGitHubLoading}
                    {...register("firstName")}
                  />
                  {errors?.firstName?.message && (
                    <p className="px-1 text-xs text-red-600">
                      {dict.auth.errors[errors.firstName.message] ||
                        errors.firstName.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-1">
                  <Label className="sr-only" htmlFor="lastName">
                    {dict.auth.register.lastName}
                  </Label>
                  <Input
                    id="lastName"
                    placeholder={dict.auth.register.lastName}
                    type="text"
                    disabled={isLoading || isGitHubLoading}
                    {...register("lastName")}
                  />
                  {errors?.lastName?.message && (
                    <p className="px-1 text-xs text-red-600">
                      {dict.auth.errors[errors.lastName.message] ||
                        errors.lastName.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-1">
                  <Label className="sr-only" htmlFor="password">
                    {dict.auth.register.password}
                  </Label>
                  <Input
                    id="password"
                    placeholder={dict.auth.register.password}
                    type="password"
                    autoCapitalize="none"
                    autoComplete="password"
                    autoCorrect="off"
                    disabled={isLoading || isGitHubLoading}
                    {...register("password")}
                  />
                  {errors?.password?.message && (
                    <p className="px-1 text-xs text-red-600">
                      {dict.auth.errors[errors.password.message] ||
                        errors.password.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-1">
                  <Label className="sr-only" htmlFor="passwordConfirmation">
                    {dict.auth.register.confirmPassword}
                  </Label>
                  <Input
                    id="passwordConfirmation"
                    placeholder={dict.auth.register.confirmPassword}
                    type="password"
                    disabled={isLoading || isGitHubLoading}
                    {...register("passwordConfirmation")}
                  />
                  {errors?.passwordConfirmation?.message && (
                    <p className="px-1 text-xs text-red-600">
                      {dict.auth.errors[errors.passwordConfirmation.message] ||
                        errors.passwordConfirmation.message}
                    </p>
                  )}
                </div>
                <button className={cn(buttonVariants())} disabled={isLoading}>
                  {isLoading && (
                    <Icons.spinner className="mr-2 size-4 animate-spin" />
                  )}
                  {dict.auth.register.signUp}
                </button>
              </div>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  {dict.auth.register.orContinueWith}
                </span>
              </div>
            </div>
          </>
        )}
        {!mode ? (
          <div className="flex justify-center space-x-4">
            <button
              type="button"
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "rounded-full border-none p-2 px-1 hover:bg-secondary"
              )}
              onClick={handleGithubSignIn}
              disabled={isLoading || isGitHubLoading}
            >
              {isGitHubLoading ? (
                <Icons.spinner className="size-8 animate-spin" />
              ) : (
                <Icons.gitHub className="size-8" />
              )}
            </button>
            <button
              type="button"
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "rounded-full border-none p-2 px-1 hover:bg-secondary"
              )}
              onClick={handleGoogleSignIn}
              disabled={isLoading || isGoogleLoading}
            >
              {isGoogleLoading ? (
                <Icons.spinner className="size-8 animate-spin" />
              ) : (
                <Icons.google className="size-8" />
              )}
            </button>
            <button
              type="button"
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "border-none p-2 px-1 hover:bg-secondary"
              )}
              onClick={handleLinkedinSignIn}
              disabled={isLoading || isLinkedinLoading}
            >
              {isLinkedinLoading ? (
                <Icons.spinner className="size-8 animate-spin" />
              ) : (
                <Icons.linkedin className="size-8" />
              )}
            </button>
            <button
              type="button"
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "border-none p-2 px-1 hover:bg-secondary"
              )}
              onClick={handleMicrosoftSignIn}
              disabled={isLoading || isMicrosoftLoading}
            >
              {isMicrosoftLoading ? (
                <Icons.spinner className="size-8 animate-spin" />
              ) : (
                <Icons.microsoft className="size-8" />
              )}
            </button>
          </div>
        ) : (
          <button
            type="button"
            className={cn(
              buttonVariants({ variant: "oauth" }),
              "size-full rounded-full py-4"
            )}
            onClick={
              mode === "linkedin"
                ? handleLinkedinSignIn
                : mode === "google"
                ? handleGoogleSignIn
                : mode === "microsoft"
                ? handleMicrosoftSignIn
                : handleGithubSignIn
            }
            disabled={
              isLoading ||
              (mode === "linkedin" && isLinkedinLoading) ||
              (mode === "google" && isGoogleLoading) ||
              (mode === "microsoft" && isMicrosoftLoading) ||
              (mode === "github" && isGitHubLoading)
            }
          >
            {(mode === "linkedin" && isLinkedinLoading) ||
            (mode === "google" && isGoogleLoading) ||
            (mode === "microsoft" && isMicrosoftLoading) ||
            (mode === "github" && isGitHubLoading) ? (
              <Icons.spinner className="size-12 animate-spin" />
            ) : mode === "linkedin" ? (
              <Icons.linkedin className="size-12 lg:size-20" />
            ) : mode === "google" ? (
              <Icons.google className="size-12 lg:size-20" />
            ) : mode === "microsoft" ? (
              <Icons.microsoft className="size-12 lg:size-20" />
            ) : (
              <Icons.gitHub className="size-12 lg:size-20" />
            )}
          </button>
        )}
      </div>
    )
  )
}
