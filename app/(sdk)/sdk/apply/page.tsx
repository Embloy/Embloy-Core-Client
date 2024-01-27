"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Job, Session } from "@/lib/api/sdk";
import makeRequest from "@/lib/api/sdk";
import { toast } from "@/components/ui/use-toast";
import { getSession } from "@/lib/api/session";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { EmptyPlaceholder } from "@/components/empty-placeholder";
import { ApplyButton } from "@/components/apply-button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

export default function ApplyPage() {
  const [job, setJob] = useState<Job | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [applicationText, setApplicationText] = useState("");
  const pathName = usePathname() as string;
  const origin = useSearchParams();
  const [cvFile, setCvFile] = useState<File | undefined>();

  const handleInputChange = (event) => {
    setApplicationText(event.target.value);
  };

  const handleFileChange = (event) => {
    // New handler for the file input change
    setCvFile(event.target.files[0]);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!searchParams.has("request_token")) {
        router.back();
        return;
      }

      const loggedIn = (await getSession()).session;
      if (!loggedIn) {
        router.push(origin ? `/login?origin=${pathName}?${origin}` : "/login");
        return;
      }

      const request_token = searchParams.get("request_token");

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
  }, [searchParams, router, origin, pathName]);

  const [options, setOptions] = useState<{ [key: string]: any }>({});

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
        <EmptyPlaceholder className="mx-auto mt-5 max-w-[800px]">
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
    <div className="container grid h-screen w-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-3 lg:px-0">
      <Link
        href="/.."
        className={cn(
          buttonVariants({ variant: "outline" }),
          "absolute left-4 top-4 text-white md:left-8 md:top-8"
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
      <Image
        src="/images/banner-3.png"
        alt="Description of the image"
        width={842}
        height={842}
        className="hidden h-full w-full lg:col-span-1 lg:block"
      />
      <div className="mt-10 lg:col-span-2 lg:p-8">
        {/* Job Information 
        <div className="flex h-full items-center justify-center lg:p-8 mb-10">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 bg-muted sm:w-[350px]">
            <div className="rounded-lg bg-muted p-6 shadow">
              <h1 className="mb-2 text-center text-2xl font-bold">{job.title}</h1>
              {job.description && <p className="text-center">{job.description.body}</p>}
              <p className="mb-1 text-center text-sm text-gray-500">
                Posted by user {session.user_id}
              </p>
              <p className="text-center text-sm text-gray-500">
                Subscription type: {session.subscription_type}
              </p>
            </div>
          </div>
        </div>*/}
        {/* Application Form */}
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[650px]">
          <div className="flex flex-col space-y-2 text-center">
            <Icons.logo className="mx-auto h-6 w-6" />
            <h1 className="text-2xl font-semibold tracking-tight">
              Apply for {job.title ?? "this job"}
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your details below to apply
            </p>
          </div>
          <textarea
            onChange={handleInputChange}
            value={applicationText}
            className="h-32 w-full resize-none rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Enter your application text here..."
          />
          {job.cv_required && (
            <div>
              <legend className="text-lg font-semibold">
                Upload your CV *
              </legend>
              <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pb-6 pt-5">
                <div className="space-y-1 text-center">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept={job.allowed_cv_formats.join(",")}
                    className="w-full focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  <p className="text-xs text-gray-500">
                    Allowed formats: {job.allowed_cv_formats.join(", ")}
                  </p>
                </div>
              </div>
            </div>
          )}
          {job.application_options.map((option, index) => {
            const label = option.required
              ? `${option.question} *`
              : option.question;

            switch (option.question_type) {
              case "link":
                return (
                  <div>
                    <legend className="text-lg font-semibold">{label}</legend>
                    <Input
                      key={index}
                      type="text"
                      required={option.required}
                      placeholder="https://example.com"
                      className="text-blue-500 underline"
                      onClick={() => console.log("Input clicked")}
                    />
                  </div>
                );
              case "text":
                return (
                  <div>
                    <legend className="text-lg font-semibold">{label}</legend>
                    <Input
                      key={index}
                      type="text"
                      required={option.required}
                      placeholder="Enter your response (max. 200 characters)"
                      onClick={() => console.log("Input clicked")}
                    />
                  </div>
                );
              case "yes_no":
                return (
                  <Select key={index} required={option.required}>
                    <SelectTrigger>{label}</SelectTrigger>
                    <SelectContent>
                      <SelectItem
                        key="1"
                        value={"Yes"}
                        onChange={(value) =>
                          setOptions({ ...options, [option.question]: value })
                        }
                      >
                        {"Yes"}
                      </SelectItem>
                      <SelectItem key="2" value={"No"}>
                        {"No"}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                );
              case "single_choice":
                return (
                  <Select key={index} required={option.required}>
                    <SelectTrigger>{label}</SelectTrigger>
                    <SelectContent>
                      {option.options.map((opt, optIndex) => (
                        <SelectItem
                          key={optIndex}
                          value={opt}
                          onChange={(value) =>
                            setOptions({ ...options, [option.question]: value })
                          }
                        >
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                );
              case "multiple_choice":
                return (
                  <fieldset key={index} className="flex flex-col space-y-2">
                    <legend className="text-lg font-semibold">{label}</legend>
                    {option.options.map((opt, optIndex) => (
                      <label
                        key={optIndex}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          value={opt}
                          onChange={(isChecked) =>
                            setOptions({
                              ...options,
                              [option.question]: {
                                ...options[option.question],
                                [opt]: isChecked,
                              },
                            })
                          }
                        />{" "}
                        <span>{opt}</span>
                      </label>
                    ))}
                  </fieldset>
                );
              default:
                return null;
            }
          })}
          <p className="mt-2 text-sm text-gray-500">
            Fields marked with an * are required.
          </p>

          <ApplyButton
            application_text={applicationText}
            request_token={searchParams.get("request_token") || ""}
            cv_file={cvFile}
            options={options}
          />
        </div>
      </div>
    </div>
  );
}
