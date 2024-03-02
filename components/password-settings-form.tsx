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

interface PasswordSettingsFormProps extends React.HTMLAttributes<HTMLDivElement> {
  params: {
    lang: Locale
  }
}


type FormData = z.infer<typeof pwResetSchema>

export function PasswordSettingsForm({ className, params: {lang}, ...props }: PasswordSettingsFormProps) {
  const [dict, setDict] = React.useState<Record<string, any> | null>(null);

  React.useEffect(() => {
    const fetchDictionary = async () => {
      const dictionary = await getDictionary(lang);
      setDict(dictionary);
    };

    fetchDictionary();
  }, [lang]);

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
      const err = await setPassword(data.password, data.passwordConfirmation, null);
      setIsLoading(false)
 
      if (err) {
        return toast({
          title: dict.errors[err || "500"].title || dict.errors.generic.title,
          description: dict.errors[err || "500"].description || dict.errors.generic.description,
          variant: "destructive",
        })
      }
      
      toast({
        title: dict.auth.success.pwupdatesuccess.title,
        description: dict.auth.success.pwupdatesuccess.description,
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
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            {dict.auth.pwupdate.setPassword}
          </button>
        </div>
      </form>
    </div>
  )
}