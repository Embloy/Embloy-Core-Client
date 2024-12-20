"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { setPassword } from '@/lib/api/auth'
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"
import { pwResetSchema } from "@/lib/validations/auth"
import { Locale } from "@/i18n-config"
import { getDictionary } from "@/app/[lang]/dictionaries"
import { useSearchParams, useRouter } from "next/navigation"

interface PasswordFormProps extends React.HTMLAttributes<HTMLDivElement> {
  params: {
    lang: Locale
  }
}


type FormData = z.infer<typeof pwResetSchema>

export function PasswordForm({ className, params: {lang}, ...props }: PasswordFormProps) {
  const [dict, setDict] = React.useState<Record<string, any> | null>(null);
  const searchParams = useSearchParams();
  const reset_token = searchParams.get("reset_token");
  const router = useRouter();

  React.useEffect(() => {
    if (!searchParams.has("reset_token") || !reset_token || reset_token.length <= 0) {
      router.back();
      // TODO: Redirect to other page
      return;
    }

    const fetchDictionary = async () => {
      const dictionary = await getDictionary(lang);
      setDict(dictionary);
    };

    fetchDictionary();

  }, [lang, searchParams, router, reset_token]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(pwResetSchema),
  })
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  async function onSubmit(data: FormData) {
    if (dict) {
      setIsLoading(true)
      const err = await setPassword(data.password, data.passwordConfirmation, reset_token ?? "");
      setIsLoading(false)
      
      if (err) {
        return toast({
          title: err == 400 ? dict.auth.errors.pwreset.title : dict.errors[err || "500"].title || dict.errors.generic.title,
          description: err == 400 ? dict.auth.errors.pwreset.description : dict.errors[err || "500"].description || dict.errors.generic.description,
          variant: "destructive",
        })
      }

      toast({
        title: dict.auth.success.pwresetsuccess.title,
        description: dict.auth.success.pwresetsuccess.description,
      })
    }
  }
  
  return dict && (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-2">
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
              disabled={isLoading}
              {...register("password")}
            />
          {errors?.password?.message && (
            <p className="px-1 text-xs text-red-600">
              {dict.auth.errors[errors.password.message] || errors.password.message}
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
              disabled={isLoading}
              {...register("passwordConfirmation")}
            />
          {errors?.passwordConfirmation?.message && (
            <p className="px-1 text-xs text-red-600">
              {dict.auth.errors[errors.passwordConfirmation.message] || errors.passwordConfirmation.message}
            </p>
          )}
          </div>
          <button className={cn(buttonVariants())} disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 size-4 animate-spin" />
            )}
            {dict.auth.pwreset.setPassword}
          </button>
        </div>
      </form>
    </div>
  )
}