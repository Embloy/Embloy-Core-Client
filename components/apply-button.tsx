"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { cn } from "@/lib/utils"
import { ButtonProps, buttonVariants } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"
import { submitApplication } from "@/lib/api/application"

interface ApplyButtonProps extends ButtonProps {
  application_text: string;
  request_token: string;
  cv_file?: File; // New prop for the CV file
}

export function ApplyButton({
  className,
  variant,
  application_text,
  request_token,
  cv_file, // New prop for the CV file
  ...props
}: ApplyButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  async function onClick() {
    setIsLoading(true)
  
    const response = await submitApplication(application_text, request_token, cv_file) // Pass the CV file to the submitApplication function
  
    setIsLoading(false)
    if (!response) {
      return toast({
        title: "Something went wrong.",
        description: "Your application was not submitted. Please try again.",
        variant: "destructive",
      })
    }

    // This forces a cache invalidation.
    router.refresh()

    router.push(`/dashboard/applications`)
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        buttonVariants({ variant }),
        {
          "cursor-not-allowed opacity-60": isLoading,
        },
        className
      )}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Icons.add className="mr-2 h-4 w-4" />
      )}
      New application
    </button>
  )
}