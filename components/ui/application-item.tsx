import Link from "next/link"

import { formatDate } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { ApplicationOperations } from "@/components/application-operations"
import { Application } from "@/lib/api/application"

interface ApplicationItemProps {
    application: Application
}

export function ApplicationItem({ application }: ApplicationItemProps) {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="grid gap-1">
        <Link
          href={`/editor/${application.job_id}`}
          className="font-semibold hover:underline"
        >
          {application.job_id}
        </Link>
        <div>
          <p className="text-sm text-muted-foreground">
            {formatDate(application.created_at)}
          </p>
        </div>
      </div>
      <ApplicationOperations application={{ job_id: application.job_id, application_text: application.application_text }} />
    </div>
  )
}

ApplicationItem.Skeleton = function ApplicationItemSkeleton() {
  return (
    <div className="p-4">
      <div className="space-y-3">
        <Skeleton className="h-5 w-2/5" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  )
}