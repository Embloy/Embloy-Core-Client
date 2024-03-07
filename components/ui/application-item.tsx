import { cn, formatDate } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { ApplicationOperations } from "@/components/application-operations";
import { Application } from "@/lib/api/application";
import Modal from "react-modal";
import { useState } from "react";
import { buttonVariants } from "./button";
import {
  FileCheck,
  FileText,
  XOctagon,
  HelpCircle,
  CheckCircle,
} from "lucide-react";
import React from "react";
import { useTheme } from "next-themes"
import { Separator } from "./separator";
import { Locale } from "@/i18n-config";

interface ApplicationItemProps {
  application: Application;
  params: {
    lang: Locale
  }
}

export function ApplicationItem({ application, params: {lang} }: ApplicationItemProps) {
  let statusIcon;
  let statusColor;
  let statusValue;
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const Tooltip = ({ children, title }) => (
    <div className="tooltip-container">
      {children}
      <span className="tooltip-text">{title}</span>
      <style jsx>{`
        .tooltip-container {
          position: relative;
          display: inline-block;
        }
        .tooltip-text {
          visibility: hidden;
          width: 180px;
          background-color: #555;
          color: #fff;
          text-align: center;
          padding: 5px 0;
          border-radius: 6px;
          position: absolute;
          z-index: 1;
          opacity: 0;
          transition: opacity 0.3s;
        }
        .tooltip-container:hover .tooltip-text {
          visibility: visible;
          opacity: 1;
        }
      `}</style>
      </div>
    );

  switch (application.status) {
    case "-1":
      statusIcon = statusIcon = (
        <Tooltip title="Your application was rejected.">
          <XOctagon className="size-5" />
        </Tooltip>
      );
      statusColor = "bg-destructive";
      statusValue = 100;
      break;
    case "0":
      statusIcon = statusIcon = (
        <Tooltip title="Your application is being processed.">
          <HelpCircle className="size-5" />
        </Tooltip>
      );
      statusColor = "bg-muted-foreground";
      statusValue = 50;
      break;
    case "1":
      statusIcon = statusIcon = (
        <Tooltip title="Your application has been accepted.">
          <CheckCircle className="size-5" />
        </Tooltip>
      );
      statusColor = "bg-success";
      statusValue = 100;
      break;
    default:
      statusIcon = null;
      statusColor = "";
      statusValue = 0;
  }

  const responsePreview = application.response
    ? application.response.slice(0, 100) + "..."
    : "No response yet ...";

  const { resolvedTheme } = useTheme();


    return (
    <div className="my-1 flex items-center justify-between rounded-sm border bg-card p-6 shadow-sm">
      <div className="grid gap-2">
        <div className="mt-1 flex items-center space-x-2 md:space-x-4">
          <button
            onClick={() => setModalIsOpen(true)}
            className="flex items-center space-x-2 text-lg font-semibold text-primary hover:underline"
          >
            <div>{statusIcon}</div>
            <span>{application.job_id}</span>
          </button>
          <div>
            <p className="hidden md:block">{responsePreview}</p>
          </div>
        </div>
        <div>
          <div className="relative pt-1">
            <div className="mb-4 flex h-2 overflow-hidden rounded bg-ring text-xs">
              <div
                style={{ width: `${statusValue}%` }}
                className={`flex flex-col justify-center whitespace-nowrap text-center text-secondary shadow-none ${statusColor}`}
              ></div>
            </div>
          </div>
        </div>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={() => setModalIsOpen(false)}
          contentLabel="Application Details"
          style={{
            content: {
              top: "50%",
              left: "50%",
              right: "auto",
              bottom: "auto",
              marginRight: "-50%",
              transform: "translate(-50%, -50%)",
              borderRadius: "10px",
              width: "80%",
              maxWidth: "500px",
              padding: "20px",
              backgroundColor: resolvedTheme === 'dark' ? '#030711' : '#FFFFFF',
            },
            overlay: {
              backgroundColor: resolvedTheme === 'dark' ? 'rgba(0, 0, 0, 0.5)' : 'rgba(355, 355, 355, 0.5)' , // semi-transparent black
              backdropFilter: 'blur(5px)', // blur effect
            },
          }}
        >
          <h2 className="mb-4 text-2xl font-bold">Application Details</h2>
          <div className="mb-2 flex items-center">
            <FileText className="mr-2 size-5" />
            <p className="font-medium">Application Text:</p>
          </div>
          <p className="mb-4 italic">{application.application_text}</p>

          <Separator/>


          {application.application_attachment &&
            application.application_attachment.url && (
              <div className="my-4 flex items-center">
                <FileCheck className="mr-2 size-5" />
                <p className="font-medium">
                  {"CV: "}
                  <a
                    href={application.application_attachment.url} // append the file format to the URL
                    download
                    className="text-blue-500 underline"
                  >
                    Download CV
                  </a>
                </p>
              </div>
            )}

          <Separator/>

          <div className="mb-2 mt-4 flex items-center">
            {statusIcon}
            <p className="ml-2 font-medium">Application Response:</p>
          </div>
          <p className="mb-4 italic">{application.response}</p>
          <button
            onClick={() => setModalIsOpen(false)}
            className={cn(
              buttonVariants({ variant: "outline" }),
              "mt-4 p-2"
            )}
          >
            Close
          </button>
        </Modal>
        <div>
          <p className="text-muted-background text-sm">
            {formatDate(lang, application.created_at)}
          </p>
        </div>
      </div>
      <div className="flex items-center">
        <ApplicationOperations
          application={{
            job_id: application.job_id,
            application_text: application.application_text,
          }}
        />
      </div>
    </div>
  );
}

ApplicationItem.Skeleton = function ApplicationItemSkeleton() {
  return (
    <div className="rounded-lg bg-primary p-6 shadow-sm">
      <div className="space-y-3">
        <Skeleton className="h-5 w-2/5" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  );
};
