import { ComponentProps } from "react";
import formatDistanceToNow from "date-fns/formatDistanceToNow";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/new-york/ui/badge";
import { ScrollArea } from "@/components/new-york/ui/scroll-area";
import { Application } from "@/lib/api/application";
import { useApplication } from "@/app/(dashboard)/dashboard/applications/use-application";

interface ApplicationListProps {
  items: Application[];
}

export function ApplicationList({ items }: ApplicationListProps) {
  const [application, setApplication] = useApplication(items);

  return (
    <>
      <ScrollArea className="h-screen" style={{ height: "70vh" }}>
        <div className="flex flex-col gap-2 p-4 pt-0">
          {items.map((item) => (
            <button
              key={item.job_id}
              className={cn(
                "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
                application.selected === item.job_id && "bg-muted"
              )}
              onClick={() =>
                setApplication({
                  ...application,
                  selected: item.job_id,
                })
              }
            >
              <div className="flex w-full flex-col gap-1">
                <div className="flex items-center">
                  <div className="flex items-center gap-2">
                    <div className="font-semibold">{item.job_id}</div>
                    {!true && (
                      <span className="flex h-2 w-2 rounded-full bg-blue-600" />
                    )}
                  </div>
                  <div
                    className={cn(
                      "ml-auto text-xs",
                      application.selected === item.job_id
                        ? "text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {formatDistanceToNow(new Date(item.updated_at), {
                      addSuffix: true,
                    })}
                  </div>
                </div>
                <div className="text-xs font-medium">{item.job_id}</div>
              </div>
              <div className="line-clamp-2 text-xs text-muted-foreground">
                {item.application_text.substring(0, 300)}
              </div>
                <div className="flex items-center gap-2">
                    <Badge key={item.status} variant={getBadgeVariantFromLabel(item.status)}>
                      {getTextFromLabel(item.status)}
                    </Badge>
                </div>
            </button>
          ))}
        </div>
      </ScrollArea>
    </>
  );
}

function getBadgeVariantFromLabel(
  label: string
): ComponentProps<typeof Badge>["variant"] {
  if (["-1"].includes(label.toLowerCase())) {
    return "default";
  }

  if (["1"].includes(label.toLowerCase())) {
    return "destructive";
  }


  if (["0"].includes(label.toLowerCase())) {
    return "outline";
  }

  return "secondary";
}

function getTextFromLabel(
  label: string
) {
  if (["-1"].includes(label.toLowerCase())) {
    return "rejected";
  }

  if (["1"].includes(label.toLowerCase())) {
    return "accepted";
  }


  if (["0"].includes(label.toLowerCase())) {
    return "pending";
  }

  return "secondary";
}
