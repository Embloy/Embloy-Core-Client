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
      <div className="flex justify-between mt-4">
        {steps.map((step, index) => (
          <div
            key={index}
            className={cn(
              "flex flex-col items-center flex-1",
              index < currentStep && "cursor-pointer"
            )}
            onClick={() => index < currentStep && onStepClick(index)}
          >
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center mb-2",
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