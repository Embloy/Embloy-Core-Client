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
import { Input } from "@/components/ui/input";
import { z } from 'zod';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import LoadingScreen from "./loading";
import { submitApplication } from "@/lib/api/application";

export default function ApplyPage({ params: { lang } }) {
  const [job, setJob] = useState<Job | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [applicationText, setApplicationText] = useState("");
  const pathName = usePathname() as string;
  const origin = useSearchParams();
  const [cvFile, setCvFile] = useState<File | undefined>();
  const [isLoading, setIsLoading] = React.useState<boolean>(true)
  const [errorMessages, setErrorMessages] = useState<{ [key: number]: string | null }>({});
  const textSchema = z.string().nonempty({ message: 'Input cannot be empty' });
  const idSchema = z.number().int().positive({ message: 'ID must be a positive integer' });
  const [options, setOptions] = useState<
  Array<{ application_option_id: number; answer: string }>
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      if (!searchParams.has("request_token")) {
        router.back();
        return;
      }

      const loggedIn = (await getSession()).session;
      if (!loggedIn) {
        router.push(origin ? `/${lang}/login?origin=${pathName}?${origin}` : `/${lang}/login`);
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

      setIsLoading(false)
    };

    fetchData();
  }, [searchParams, router, origin, pathName, lang]);

  function validateFields() {
    let isValid = true;

    if (applicationText.trim() === '') {
      setErrorMessages((prevMessages) => ({ ...prevMessages, 'applicationText': 'This field is required' }));
      isValid = false;
    }

    job?.application_options.forEach((option) => {
      const optionExists = options.some(opt => opt.application_option_id === option.id && opt.answer !== '');
      if (optionExists || option.required) {
        const optionExists = options.some(opt => opt.application_option_id === option.id && opt.answer !== '');
        switch (option.question_type) {
          case 'yes_no':
          case 'single_choice':
          case 'multiple_choice':
            if (!optionExists) {
              setErrorMessages((prevMessages) => ({ ...prevMessages, [option.id]: 'This field is required' }));
              isValid = false;
            }
            break;
          case 'link':
            if (!optionExists) {
              setErrorMessages((prevMessages) => ({ ...prevMessages, [option.id]: 'This field is required' }));
              isValid = false;
            } else {
              try {
                new URL(options.find(opt => opt.application_option_id === option.id)?.answer || '');
              } catch (_) {
                setErrorMessages((prevMessages) => ({ ...prevMessages, [option.id]: 'This field must be a valid URL' }));
                isValid = false;
              }
            }
            break;
          case 'text':
            if (!optionExists) {
              setErrorMessages((prevMessages) => ({ ...prevMessages, [option.id]: 'This field is required' }));
              isValid = false;
            }
            break;
          default:
            break;
        }
      }
    });
    return isValid;
  }

  async function onClick() {
    if (!validateFields()) {
      return;
    }
    
    setIsLoading(true)
  
    const response = await submitApplication(applicationText, searchParams.get("request_token") || "", cvFile, options)
  
    setIsLoading(false)
    if (!response) {
      return toast({
        title: "Something went wrong.",
        description: "Your application was not submitted. Please try again.",
        variant: "destructive",
      })
    }
  
    // This forces a cache invalidation.
    router.refresh()
  
    router.push(`/${lang}/dashboard/applications`)
  }

  const handleInputChange = (event) => {
    const value = event.target.value;
    if (value.trim() === '') {
      setErrorMessages((prevMessages) => ({ ...prevMessages, 'applicationText': 'This field is required' }));
    } else {
      setErrorMessages((prevMessages) => ({ ...prevMessages, 'applicationText': null }));
    }
    setApplicationText(value);
  };

  const handleFileChange = (event) => {
    // New handler for the file input change
    setCvFile(event.target.files[0]);
  };

  const handleBackClick = (e) => {
    e.preventDefault();
    if (session && session.cancel_url) {
      window.location.href = session.cancel_url;
    } else {
      router.back();
    }
  };



  // Update function for text and link question types
  const handleTextChange = (id: number, value: string, required: boolean) => {
    try {
      setErrorMessages((prevMessages) => {
        const newMessages = { ...prevMessages };
        delete newMessages[id];
        return newMessages;
      });

      if (required) {
        idSchema.parse(id);
        if (required && value.trim() === '') {
          throw new Error('This field is required');
        }
        textSchema.parse(value);
      }
  
      setOptions((prevOptions) => {
        const index = prevOptions.findIndex(
          (option) => option.application_option_id === id
        );
        if (index !== -1) {
          const newOptions = [...prevOptions];
          newOptions[index].answer = value;
          return newOptions;
        } else {
          return [...prevOptions, { application_option_id: id, answer: value }];
        }
      });
    } catch (error) {
      setErrorMessages((prevMessages) => ({ ...prevMessages, [id]: error.message }));
    }
  };

  // Update function for yes_no and single_choice question types
  const handleSingleChoiceChange = (id: number, value: string) => {
    try {
      setOptions((prevOptions) => {
        const index = prevOptions.findIndex(
          (option) => option.application_option_id === id
        );
        if (index !== -1) {
          const newOptions = [...prevOptions];
          newOptions[index].answer = value;
          return newOptions;
        } else {
          return [...prevOptions, { application_option_id: id, answer: value }];
        }
      });

      setErrorMessages((prevMessages) => ({ ...prevMessages, [id]: null }));
    } catch (error) {
      setErrorMessages((prevMessages) => ({ ...prevMessages, [id]: error.message }));
    }
  };

  // Update function for multiple_choice question type
  const handleMultipleChoiceChange = (
    id: number,
    value: string,
    isChecked: boolean,
  ) => {
    try {
      setOptions((prevOptions) => {
        const index = prevOptions.findIndex(
          (option) => option.application_option_id === id
        );
        if (index !== -1) {
          const newOptions = [...prevOptions];
          if (isChecked) {
            newOptions[index].answer += `, ${value}`;
          } else {
            newOptions[index].answer = newOptions[index].answer.replace(
              `, ${value}`,
              ""
            );
          }
          return newOptions;
        } else {
          return [
            ...prevOptions,
            { application_option_id: id, answer: isChecked ? value : "" },
          ];
        }
      });

      setErrorMessages((prevMessages) => ({ ...prevMessages, [id]: null }));
    } catch (error) {
      setErrorMessages((prevMessages) => ({ ...prevMessages, [id]: error.message }));
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isLoading && (!job || !session)) {
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
          href={`/${lang}`}
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
            href={`/${lang}/dashboard`}
            className={buttonVariants({ variant: "ghost" })}
          >
            Go to Dashboard
          </Link>
        </EmptyPlaceholder>
      </div>
    );
  }
  if (!isLoading && job && session) {
  return (
    <div className="container grid h-screen w-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-3 lg:px-0">
      <Link
        href="/.."
        onClick={handleBackClick}
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
        href={`/${lang}`}
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute right-4 top-4 md:right-8 md:top-8"
        )}
      >
        Go To Embloy
      </Link>
      <Image
        src="/images/banner-5.png"
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
            maxLength={500}
            onChange={handleInputChange}
            value={applicationText}
            className="h-32 w-full resize-none rounded-md border bg-secondary p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="* Enter your application text here... (max. 500 characters)"
          />
          {errorMessages['applicationText'] && <div className="text-sm text-red-500">{errorMessages['applicationText']}</div>}
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
                      onChange={(event) =>
                        handleTextChange(option.id, event.target.value, option.required)
                      }
                    />
                    {errorMessages[option.id] && <div className="text-sm text-red-500">{errorMessages[option.id]}</div>}
                  </div>
                );
              case "text":
                return (
                  <div>
                    <legend className="text-lg font-semibold">{label}</legend>
                      <textarea
                        key={index}
                        required={option.required}  
                        onChange={(event) =>
                          handleTextChange(option.id, event.target.value, option.required)
                        }
                        maxLength={200}
                        style={{ resize: 'none', overflow: 'auto' }}
                        className="h-20 w-full rounded-md border bg-secondary p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Enter your response (max. 200 characters)"
                      />
                    {errorMessages[option.id] && <div className="text-sm text-red-500">{errorMessages[option.id]}</div>}
                  </div>
                );
                case "yes_no":
                  return (
                    <div>
                      <Select
                        key={index}
                        required={option.required}
                        onValueChange={(value) => {
                          handleSingleChoiceChange(option.id, value);
                        }}
                      >
                        <SelectTrigger>{label}</SelectTrigger>
                        <SelectContent>
                          <SelectItem key="1" value={"Yes"}>
                            {"Yes"}
                          </SelectItem>
                          <SelectItem key="2" value={"No"}>
                            {"No"}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      {errorMessages[option.id] && <div className="text-sm text-red-500">{errorMessages[option.id]}</div>}
                    </div>
                  );
                case "single_choice":
                  return (
                    <div>
                      <Select
                        key={index}
                        required={option.required}
                        onValueChange={(value) => {
                          handleSingleChoiceChange(option.id, value);
                        }}
                      >
                        <SelectTrigger>{label}</SelectTrigger>
                        <SelectContent>
                          {option.options.map((opt, optIndex) => (
                            <SelectItem key={optIndex} value={opt}>
                              {opt}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errorMessages[option.id] && <div className="text-sm text-red-500">{errorMessages[option.id]}</div>}
                    </div>
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
                            onCheckedChange={(isChecked) => {
                              handleMultipleChoiceChange(
                                option.id,
                                opt,
                                !!isChecked,
                              );
                            }}
                          />{" "}
                          <span>{opt}</span>
                        </label>
                      ))}
                      {errorMessages[option.id] && <div className="text-sm text-red-500">{errorMessages[option.id]}</div>}
                    </fieldset>
                  );
              default:
                return null;
            }
          })}
          <p className="mt-2 text-sm text-gray-500">
            Fields marked with an * are required.
          </p>
          <button
            onClick={onClick}
            className={cn(
              buttonVariants({ variant: "default" }),
              { "cursor-not-allowed opacity-60": isLoading || Object.values(errorMessages).some(message => message !== null),},
            )}
            disabled={isLoading || Object.values(errorMessages).some(message => message !== null)}
          >
            {isLoading ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Icons.add className="mr-2 h-4 w-4" />
            )}
            New application
          </button>
        </div>
      </div>
    </div>
  );
}}


