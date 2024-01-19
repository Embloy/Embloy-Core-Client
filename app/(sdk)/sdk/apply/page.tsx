"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Job, Session } from "@/lib/api/sdk";
import makeRequest from "@/lib/api/sdk";
import { toast } from "@/components/ui/use-toast";
import { getSession } from "@/lib/api/session";
import { redirect, useSearchParams, useRouter } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { UserSignUpForm } from "@/components/user-signup-form";
import { EmptyPlaceholder } from "@/components/empty-placeholder";

import React, { useEffect, useState } from "react";
import { ApplyButton } from "@/components/apply-button";

export default function ApplyPage() {
  const [job, setJob] = useState<Job | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [applicationText, setApplicationText] = useState("");

  const handleInputChange = (event) => {
    setApplicationText(event.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!searchParams.has("request_token")) {
        // router.push("/referrer");
        router.back();
        return;
      }

      const { session } = await getSession();
      if (!session) {
        router.push("/login");
        return;
      }

      const request_token = searchParams.get("request_token");
      console.log("request_token: ", request_token);

      if (typeof request_token === "string") {
        const requestData = await makeRequest(request_token);
        if (requestData !== null) {
          setJob(requestData.job);
          setSession(requestData.session);
        } else {
          toast({
            title: "Something went wrong.",
            description: "Your request was not processed. Please try again.",
            variant: "destructive",
          });
        }
      }
    };

    fetchData();
  }, [searchParams, router]);
  if (!job || !session) {
    return (
      <div className="container grid h-screen w-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-1 lg:px-0">
        <Link
          href="/.."
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "absolute left-4 top-4 md:left-8 md:top-8"
          )}
        >
          <>
            <Icons.chevronLeft className="mr-2 h-4 w-4" />
            Back to Homepage
          </>
        </Link>

        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "absolute right-4 top-4 md:right-8 md:top-8"
          )}
        >
          Go To Embloy
        </Link>
        <EmptyPlaceholder className="mx-auto max-w-[800px] mt-5">
          <EmptyPlaceholder.Icon name="warning" />
          <EmptyPlaceholder.Title>Uh oh! Not Found</EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            This job cound not be found. Please try again.
          </EmptyPlaceholder.Description>
          <Link
            href="/dashboard"
            className={buttonVariants({ variant: "ghost" })}
          >
            Go to Dashboard
          </Link>
        </EmptyPlaceholder>
      </div>
    );
  }
  return (
    <div className="container grid h-screen w-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
      <Link
        href="/.."
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute left-4 top-4 md:left-8 md:top-8"
        )}
      >
        <>
          <Icons.chevronLeft className="mr-2 h-4 w-4" />
          Back to Homepage
        </>
      </Link>

      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute right-4 top-4 md:right-8 md:top-8"
        )}
      >
        Go To Embloy
        </Link>
      {/* Job Information */}
      <div className="h-full lg:p-8 bg-muted flex items-center justify-center">
        <div className="mx-auto flex w-full bg-muted flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="bg-white shadow rounded-lg p-6">
            <h1 className="text-2xl font-bold mb-2 text-center">{job.title}</h1>
            {job.description && <p className="text-center">{job.description.body}</p>}
            <p className="text-sm text-gray-500 mb-1 text-center">
              Posted by user {session.user_id}
            </p>
            <p className="text-sm text-gray-500 text-center">
              Subscription type: {session.subscription_type}
            </p>
          </div>
        </div>
      </div>
      {/* Application Form */}
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <Icons.logo className="mx-auto h-6 w-6" />
            <h1 className="text-2xl font-semibold tracking-tight">
              Apply for this job
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your details below to apply
            </p>
          </div>
          <textarea
            onChange={handleInputChange}
            value={applicationText}
            className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black w-full h-32 resize-none"
            placeholder="Enter your application text here..."
          />
          <ApplyButton
            application_text={applicationText}
            request_token={searchParams.get("request_token") || ""}
            // other props...
          />
        </div>
      </div>
    </div>
  );
}
