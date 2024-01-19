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

import React, { useEffect, useState } from "react";

export default function ApplyPage() {
  const [job, setJob] = useState<Job | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      if (!searchParams.has("request_token")) {
        // router.push("/referrer");
        router.back()
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
    toast({
      title: "Something went wrong.",
      description: "Your request was not processed. Please try again.",
      variant: "destructive",
    });
    return null; // or return a loading spinner, or some placeholder content
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
      <div className="hidden h-full bg-muted lg:block" />
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <Icons.logo className="mx-auto h-6 w-6" />
            <h1 className="text-2xl font-semibold tracking-tight">
              Create an account
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your name and email below to create your account
            </p>
          </div>
          <div>
      <h1>{job.title}</h1>
      job.description &&(<p> job.description</p>)
      <p>Posted by user {session.user_id}</p>
      <p>Subscription type: {session.subscription_type}</p>
      {/* ... rest of your JSX ... */}
    </div>

          <UserSignUpForm />
          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{" "}
            <Link
              href="/terms"
              className="hover:text-brand underline underline-offset-4"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="hover:text-brand underline underline-offset-4"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
