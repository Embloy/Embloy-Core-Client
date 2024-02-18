import addDays from "date-fns/addDays"
import addHours from "date-fns/addHours"
import format from "date-fns/format"
import nextSaturday from "date-fns/nextSaturday"
import {
  Archive,
  Clock,
  DownloadCloud,
  MoreVertical,
  Trash2,
} from "lucide-react"

import {
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/new-york/ui/button"
import { Calendar } from "@/components/new-york/ui/calendar"
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/new-york/ui/dropdown-menu"
import { Label } from "@/components/new-york/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/new-york/ui/popover"
import { Separator } from "@/components/new-york/ui/separator"
import { Switch } from "@/components/new-york/ui/switch"
import { Textarea } from "@/components/new-york/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/new-york/ui/tooltip"
import { Application } from "@/lib/api/application"
import { useState } from "react"
import { isBefore, isToday } from "date-fns"
import { ApplicationAnswerList } from "./application-answer-list"
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar"
import { Icons } from "./icons"
import { ApplicationResponse } from "./application-response"

interface ApplicationDisplayProps {
  application: Application | null
}

export function ApplicationDisplay({ application }: ApplicationDisplayProps) {
  const [deadline, setDeadline] = useState<Date | null>(null);
  const today = new Date()
  const disabledPastDates = (date) => isBefore(date, new Date()) && !isToday(date);
  
  const downloadAttachment = (application: Application | null) => {
    if (application && application.application_attachment && application.application_attachment.url) {
      const cvUrl = application.application_attachment.url;
      const link = document.createElement('a');
      link.href = cvUrl;
      link.setAttribute('download', `${application.user_id}_${application.job_id}_CV}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleSetDeadline = (date: Date) => {
    setDeadline(date);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center p-2">
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" disabled={!!application}>
                <Archive className="h-4 w-4" />
                <span className="sr-only">Archive</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Archive</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" disabled={!!application}>
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Move to trash</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Move to trash</TooltipContent>
          </Tooltip>
          <Separator orientation="vertical" className="mx-1 h-6" />
          <Tooltip>
            <Popover>
              <PopoverTrigger asChild>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" disabled={!application}>
                    <Clock className="h-4 w-4" />
                    <span className="sr-only">Snooze</span>
                  </Button>
                </TooltipTrigger>
              </PopoverTrigger>
              <PopoverContent className="flex w-[535px] p-0">
                <div className="flex flex-col gap-2 border-r px-2 py-4">
                  <div className="px-4 text-sm font-medium">Set deadline for employer</div>
                  <div className="grid min-w-[250px] gap-1">
                    <Button
                      variant="ghost"
                      className="justify-start font-normal"
                      onClick={() => handleSetDeadline(addHours(today, 4))}
                    >
                      Later today{" "}
                      <span className="ml-auto text-muted-foreground">
                        {format(addHours(today, 4), "E, h:m b")}
                      </span>
                    </Button>
                    <Button
                      variant="ghost"
                      className="justify-start font-normal"
                      onClick={() => handleSetDeadline(addDays(today, 1))}
                    >
                      Tomorrow
                      <span className="ml-auto text-muted-foreground">
                        {format(addDays(today, 1), "E, h:m b")}
                      </span>
                    </Button>
                    <Button
                      variant="ghost"
                      className="justify-start font-normal"
                      onClick={() => handleSetDeadline(nextSaturday(today))}
                    >
                      This weekend
                      <span className="ml-auto text-muted-foreground">
                        {format(nextSaturday(today), "E, h:m b")}
                      </span>
                    </Button>
                    <Button
                      variant="ghost"
                      className="justify-start font-normal"
                      onClick={() => handleSetDeadline(addDays(today, 7))}
                    >
                      Next week
                      <span className="ml-auto text-muted-foreground">
                        {format(addDays(today, 7), "E, h:m b")}
                      </span>
                    </Button>
                  </div>
                </div>
                <div className="p-2">
                  <Calendar onDayClick={handleSetDeadline} disabled={disabledPastDates} />
                </div>
              </PopoverContent>
            </Popover>
            <TooltipContent>Set employer deadline</TooltipContent>
          </Tooltip>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              disabled={!application?.application_attachment?.url}
              onClick={() => downloadAttachment(application)}
            >
              <DownloadCloud className="h-4 w-4" />
              <span className="sr-only">Download Attachment</span>
            </Button>
                </TooltipTrigger>
            <TooltipContent>Download Attachment</TooltipContent>
          </Tooltip>
        </div>
        <Separator orientation="vertical" className="mx-2 h-6" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" disabled={!application}>
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">More</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem disabled>Mark as unread</DropdownMenuItem>
            <DropdownMenuItem disabled>Star job</DropdownMenuItem>
            <DropdownMenuItem disabled>Add label</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Separator />
      {application ? (
        <div className="flex flex-1 flex-col">
          <div className="flex items-start p-4">
            <div className="flex items-start gap-4 text-sm">
              {
              <Avatar >
              {application.job?.employer_image_url ? (
                <AvatarImage alt="Picture" src={application.job?.employer_image_url} className="h-12 w-12 rounded-full border-2 border-muted-foreground text-muted-foreground"/>
              ) : (
                <AvatarFallback>
                  <Icons.user className="h-12 w-12 rounded-full border-2 border-muted-foreground text-muted-foreground" />
                </AvatarFallback>
              )}
            </Avatar>
            }
              <div className="grid gap-1">
                <div className="font-semibold">{application.job?.employer_name || `User#${application.job?.user_id}`}</div>
                <div className="line-clamp-1 text-xs">{application.job?.employer_email || application.job?.employer_phone || 'No contact information provided.'}</div>
                <div className="line-clamp-1 text-xs">
                  <span className="font-medium text-muted-foreground">{application.job?.job_slug || `Job#${application.job_id}`}</span>
                </div>
              </div>
            </div>
            {application.updated_at && (
              <div className="ml-auto text-xs text-muted-foreground">
                {format(new Date(application.updated_at), "PPpp")}
              </div>
            )}
          </div>
          <Separator />
          <div className="flex-1 space-y-2 whitespace-pre-wrap p-4 text-sm">
            {application.application_text}
          </div>
          <Separator />
          <ApplicationAnswerList application={application}/>
          <Separator className="mt-auto" />
          <ApplicationResponse application={application}/>
        </div>
      ) : (
        <div className="p-8 text-center text-muted-foreground">
          No message selected
        </div>
      )}
    </div>
  )
}