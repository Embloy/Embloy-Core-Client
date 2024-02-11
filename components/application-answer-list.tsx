import { ScrollArea } from "@/components/new-york/ui/scroll-area";
import { Application } from "@/lib/api/application";

interface ApplicationAnswerListProps {
  application: Application;
}

export function ApplicationAnswerList({ application }: ApplicationAnswerListProps) {
  return (
    <ScrollArea className="h-screen" style={{ height: "50vh" }}>
      <div className="space-y-4 p-4">
        {application?.job?.application_options?.map((option) => (
          <div key={option.id} className="flex flex-col space-y-2">
              <div className="semibold text-sm">{option.question}</div>
            {application?.application_answers?.find((answer) => answer.application_option_id === option.id) ? (
              <div className="rounded-lg border bg-secondary p-2 text-sm font-light">
                <div>{application.application_answers.find((answer) => answer.application_option_id === option.id)?.answer}</div>
              </div>
            ) : (
              <div className="rounded-lg border bg-secondary p-2 text-sm font-light italic text-muted-foreground">No answer provided</div>
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}