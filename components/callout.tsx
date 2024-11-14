import { cn } from "@/lib/utils"

interface CalloutProps {
  icon?: string
  children?: React.ReactNode
  type?: "default" | "embloy" | "warning" | "danger"
}

export function Callout({
  children,
  icon,
  type = "default",
  ...props
}: CalloutProps) {
  return (
    <div
      className={cn("my-6 flex items-start rounded-md border border-l-4 p-4", {
        "border-x-4 border-primary bg-embloy-foreground text-primary duration-300 hover:bg-primary hover:text-embloy-foreground dark:border-embloy-foreground dark:text-background dark:hover:text-primary-foreground portrait:text-sm": type === "embloy",
        "border-red-900 bg-red-50": type === "danger",
        "border-danger bg-yellow-50": type === "warning",
      })}
      {...props}
    >
      {icon && <span className="mr-4 text-2xl">{icon}</span>}
      <div>{children}</div>
    </div>
  )
}
