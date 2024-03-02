"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { resetPassword } from '@/lib/api/auth'; // Make sure to implement this function
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"
import { Locale } from "@/i18n-config"
import { getDictionary } from "@/app/[lang]/dictionaries"

interface PasswordResetFormProps extends React.HTMLAttributes<HTMLDivElement> {
  params: {
    lang: Locale
  }
}

const passwordResetSchema = z.object({
  email: z.string().email({ message: 'Email must be a valid email' }),
});

type FormData = z.infer<typeof passwordResetSchema>

export function PasswordResetForm({ className, params: {lang}, ...props }: PasswordResetFormProps) {
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
    resolver: zodResolver(passwordResetSchema),
  })
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  async function onSubmit(data: FormData) {
    setIsLoading(true)
    if (dict) {
      const err = await resetPassword(data.email);
      setIsLoading(false)
      
      if (err) {
        return toast({
          title: dict.errors[err || "500"].title || dict.errors.generic.title,
          description: dict.errors[err || "500"].description || dict.errors.generic.description,
          variant: "destructive",
        })
      }
      
      toast({
        title: dict.auth.success.pwreset.title,
        description: dict.auth.success.pwreset.description,
      })
    }
  }

  return dict && (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
            {dict.auth.pwreset.email}
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              {...register("email")}
            />
            {errors?.email?.message && (
              <p className="px-1 text-xs text-red-600">
                {dict.auth.errors[errors.email.message] || errors.email.message}
              </p>
            )}

          </div>
          <button className={cn(buttonVariants())} disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            {dict.auth.pwreset.reset}
          </button>
        </div>
      </form>
    </div>
  )
}