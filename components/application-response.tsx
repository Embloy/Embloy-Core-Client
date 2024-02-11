import { Button } from "@/components/new-york/ui/button"
import { Label } from "@/components/new-york/ui/label"
import { Switch } from "@/components/new-york/ui/switch"
import { Application } from "@/lib/api/application"

interface ApplicationResponseProps {
  application: Application;
}

export function ApplicationResponse({ application }: ApplicationResponseProps) {
  let statusColor: string | null ;

  switch (application.status) {
    case '0':
      statusColor =  'border-2 border-muted';
      break;
    case '1':
      statusColor = "border-2 border-success";
      break;
    case '-1':
      statusColor = "border-2 border-destructive";
      break;
    default:
      statusColor = 'border-2 border-gray-500';
  }

  return statusColor ? (
    <div className="p-4">
      <div className="grid gap-4">
        <div className="grid gap-4">
        {application.response ? (
          <div className={`rounded-lg bg-secondary p-4 text-primary ${statusColor}`}>
            {application.response}
          </div>
        ) : (
          <div className={`rounded-lg bg-secondary p-4 text-primary ${statusColor}`}>
            No response yet ...
          </div>
        )}
      </div>
      <div className="flex items-center">
        <Label
          htmlFor="mute"
          className="flex items-center gap-2 text-xs font-normal"
        >
          <Switch id="mute" aria-label="Mute thread" /> Mute all job notifications
        </Label>
        {application.response ? (
          <Button
            onClick={(e) => e.preventDefault()}
            size="sm"
            className="ml-auto"
          >
            Review employer
          </Button>
        ) : (
          <Button
            size="sm"
            className="ml-auto"
            disabled
          >
            Review employer
          </Button>
        )}
      </div>
    </div>
  </div>        
) : null;
}
