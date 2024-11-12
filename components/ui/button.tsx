import * as React from "react"
import { VariantProps, cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input hover:bg-accent bg-accent/50 hover:text-accent-foreground",
        bold: "border border-2 border-ring dark:border-primary-foreground rounded rounded-xl text-ring dark:text-primary-foreground bg-background hover:text-embloy-foreground hover:border-embloy-foreground dark:hover:text-embloy-foreground dark:hover:border-embloy-foreground",
        filled:
          "border border-2 rounded rounded-xl border-foreground bg-foreground text-background hover:border-embloy-foreground hover:bg-embloy-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "underline-offset-4 hover:underline text-primary",
        oauth: "bg-high hover:bg-high/90 border-high border-8",
        transparent: "bg-transparent hover:bg-transparent text-primary",
      },
      size: {
        default: "h-10 py-2 px-4",
        bold: "h-9 px-6 rounded-full lg:w-40 xl:w-auto",
        boldLg:
          "h-12 md:h-6 lg:h-10 xl:h-11 2xl:h-12 w-auto 2xl:w-60 lg:px-6 rounded-full text-2xl md:text-sm lg:text-lg 2xl:text-2xl whitespace-nowrap",
        sm: "h-9 px-3 rounded-md",
        lg: "h-11 px-8 rounded-md",
        xl: "h-20 px-20 rounded-lg text-3xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
