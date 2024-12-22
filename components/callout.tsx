import { cn } from "@/lib/utils"

interface CalloutProps {
  icon?: string
  children?: React.ReactNode
  type?: "default" | "embloy" | "warning" | "danger" | "info"
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
        "border-red-900 bg-red-50 dark:border-red-400 dark:bg-red-900": type === "danger",
        "border-yellow-900 bg-yellow-50 dark:border-yellow-400 dark:bg-yellow-900": type === "warning",
        "border-gray-900 bg-gray-50 dark:border-gray-400 dark:bg-gray-900": type === "default",
        "border-blue-900 bg-blue-50 dark:border-primary dark:bg-border": type === "info",
        "border-x-4 border-primary bg-embloy-foreground text-primary duration-300 hover:bg-primary hover:text-embloy-foreground dark:border-embloy-foreground dark:text-background dark:hover:text-primary-foreground portrait:text-sm": type === "embloy",
      })}
      {...props}
    >
      {icon && <span className="mr-4 text-2xl">{icon}</span>}
      <div>{children}</div>
    </div>
  )
}