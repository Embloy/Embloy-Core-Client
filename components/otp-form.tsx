"use client"

import * as React from "react"
import { Locale } from "@/i18n-config"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { requestOTP, validateOTP } from "@/lib/api/auth"
import { cn } from "@/lib/utils"
import { emailSchema, nameSchema, otpSchema } from "@/lib/validations/auth"
import { buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"
import { getDictionary } from "@/app/[lang]/dictionaries"

import { ProgressBar } from "./progress-bar"
import { Label } from "./ui/label"

interface OTPFormProps extends React.HTMLAttributes<HTMLDivElement> {
  params: {
    lang: Locale
    requestToken?: string
    origin?: string
  }
}

type NameFormData = z.infer<typeof nameSchema>
type EmailFormData = z.infer<typeof emailSchema>
type OTPFormData = z.infer<typeof otpSchema>

export function OTPForm({
  className,
  params: { lang, requestToken, origin },
  ...props
}: OTPFormProps) {
  const [dict, setDict] = React.useState<Record<string, any> | null>(null)
  const [step, setStep] = React.useState<"name" | "email" | "otp">("name")
  const [email, setEmail] = React.useState<string>("")
  const [firstName, setFirstName] = React.useState<string>("")
  const [lastName, setLastName] = React.useState<string>("")

  React.useEffect(() => {
    const fetchDictionary = async () => {
      const dictionary = await getDictionary(lang)
      setDict(dictionary)
    }

    fetchDictionary()
  }, [lang])

  const {
    register: registerName,
    handleSubmit: handleSubmitName,
    formState: { errors: nameErrors },
  } = useForm<NameFormData>({
    resolver: zodResolver(nameSchema),
  })

  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    formState: { errors: emailErrors },
  } = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
  })

  const {
    register: registerOTP,
    handleSubmit: handleSubmitOTP,
    setValue: setOTPValue,
    formState: { errors: otpErrors },
  } = useForm<OTPFormData>({
    resolver: zodResolver(otpSchema),
  })

  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  async function onSubmitName(data: NameFormData) {
    setFirstName(data.firstName)
    setLastName(data.lastName)
    setStep("email")
  }

  async function onSubmitEmail(data: EmailFormData) {
    setIsLoading(true)
    if (dict) {
      const err = await requestOTP(
        data.email,
        requestToken,
        firstName,
        lastName
      )
      setIsLoading(false)

      if (err) {
        return toast({
          title: dict.errors[err || "500"].title || dict.errors.generic.title,
          description:
            dict.errors[err || "500"].description ||
            dict.errors.generic.description,
          variant: "destructive",
        })
      }

      toast({
        title: dict.auth.success.otp.title,
        description: dict.auth.success.otp.description,
      })
      setEmail(data.email)
      setOTPValue("email", data.email)
      setStep("otp")
    }
  }

  async function onSubmitOTP(data: OTPFormData) {
    if (data.otp_code.length !== 6) {
      return
    }

    setIsLoading(true)
    if (dict) {
      const err = await validateOTP(data.email, data.otp_code)
      setIsLoading(false)

      if (err) {
        if (err == 401) {
          return toast({
            title: dict.auth.errors.otp.title,
            description: dict.auth.errors.otp.description,
            variant: "destructive",
          })
        } else {
          return toast({
            title: dict.errors[err || "500"].title || dict.errors.generic.title,
            description:
              dict.errors[err || "500"].description ||
              dict.errors.generic.description,
            variant: "destructive",
          })
        }
      }

      window.location.href = origin
        ? `${origin}`
        : `/${lang}/dashboard/overview`
    }
  }

  const handleStepClick = (stepIndex: number) => {
    if (stepIndex === 0) setStep("name")
    if (stepIndex === 1) setStep("email")
  }

  return (
    dict && (
      <div>
        <div className={cn("grid gap-6", className)} {...props}>
          {step === "name" && (
            <form onSubmit={handleSubmitName(onSubmitName)}>
              <div className="grid gap-2">
                <div className="grid gap-1">
                  <Label className="sr-only" htmlFor="firstName">
                  {dict.auth.register.firstName}
                  </Label>
                  <Input
                    id="firstName"
                    placeholder={dict.auth.register.firstName}
                    type="text"
                    autoCapitalize="none"
                    autoComplete="given-name"
                    autoCorrect="off"
                    disabled={isLoading}
                    {...registerName("firstName")}
                  />
                  {nameErrors?.firstName?.message && (
                    <p className="px-1 text-xs text-red-600">
                      {nameErrors.firstName.message}
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
                    autoCapitalize="none"
                    autoComplete="family-name"
                    autoCorrect="off"
                    disabled={isLoading}
                    {...registerName("lastName")}
                  />
                  {nameErrors?.lastName?.message && (
                    <p className="px-1 text-xs text-red-600">
                      {nameErrors.lastName.message}
                    </p>
                  )}
                </div>
                <button className={cn(buttonVariants())} disabled={isLoading}>
                  {isLoading && (
                    <Icons.spinner className="mr-2 size-4 animate-spin" />
                  )}
                  Next
                </button>
              </div>
            </form>
          )}
          {step === "email" && (
            <form onSubmit={handleSubmitEmail(onSubmitEmail)}>
              <div className="grid gap-2">
                <div className="grid gap-1">
                  <Label className="sr-only" htmlFor="email">
                    {dict.auth.otp.email}
                  </Label>
                  <Input
                    id="email"
                    placeholder="name@example.com"
                    type="email"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    disabled={isLoading}
                    {...registerEmail("email")}
                  />
                  {emailErrors?.email?.message && (
                    <p className="px-1 text-xs text-red-600">
                      {dict.auth.errors[emailErrors.email.message] ||
                        emailErrors.email.message}
                    </p>
                  )}
                </div>
                <button className={cn(buttonVariants())} disabled={isLoading}>
                  {isLoading && (
                    <Icons.spinner className="mr-2 size-4 animate-spin" />
                  )}
                  {dict.auth.otp.requestOTP}
                </button>
              </div>
            </form>
          )}
          {step === "otp" && (
            <form onSubmit={handleSubmitOTP(onSubmitOTP)}>
              <div className="grid gap-2">
                <div className="relative grid gap-1">
                  <Label className="sr-only" htmlFor="otp_code">
                    {dict.auth.otp.otpCode}
                  </Label>
                  <Input
                    id="otp_code"
                    placeholder={dict.auth.otp.setOTP}
                    type="text"
                    autoCapitalize="none"
                    autoComplete="one-time-code"
                    autoCorrect="off"
                    maxLength={6}
                    minLength={6}
                    disabled={isLoading}
                    {...registerOTP("otp_code", {
                      setValueAs: (value) => value.trim(),
                    })}
                    onChange={(e) => {
                      const value = e.target.value.trim()
                      setOTPValue("otp_code", value)
                      if (value.length === 6) {
                        handleSubmitOTP(onSubmitOTP)()
                      }
                    }}
                  />
                  {isLoading && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <Icons.spinner className="size-4 animate-spin" />
                    </div>
                  )}
                  {otpErrors?.otp_code?.message && (
                    <p className="px-1 text-xs text-red-600">
                      {dict.auth.errors[otpErrors.otp_code.message] ||
                        otpErrors.otp_code.message}
                    </p>
                  )}
                </div>
              </div>
            </form>
          )}
        </div>
        <ProgressBar
          className="mt-12"
          currentStep={step === "name" ? 0 : step === "email" ? 1 : 2}
          steps={[dict.auth.otp.steps["Input Name"], dict.auth.otp.steps["Input Email"], dict.auth.otp.steps["Verify"], dict.auth.otp.steps["Apply"]]}
          onStepClick={handleStepClick}
        />
      </div>
    )
  )
}
