import * as React from "react"
import { cn } from "@/lib/utils"

interface ProgressBarProps {
  currentStep: number
  steps: string[]
  className?: string
  onStepClick: (step: number) => void
}

export function ProgressBar({ currentStep, steps, className, onStepClick }: ProgressBarProps) {
  const progressPercentage = ((currentStep + 1) / steps.length) * 100

  return (
    <div className={cn("mb-6", className)}>
      <div className="relative h-2 rounded-full bg-muted">
        <div
          className="absolute h-2 rounded-full bg-primary transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      <div className="mt-4 flex justify-between">
        {steps.map((step, index) => (
          <div
            key={index}
            className={cn(
              "flex flex-1 flex-col items-center",
              index < currentStep && "cursor-pointer"
            )}
            onClick={() => index < currentStep && onStepClick(index)}
          >
            <div
              className={cn(
                "mb-2 flex size-8 items-center justify-center rounded-full",
                index <= currentStep ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              )}
            >
              {index + 1}
            </div>
            <p
              className={cn(
                "text-sm",
                index <= currentStep ? "text-primary" : "text-muted-foreground"
              )}
            >
              {step}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}