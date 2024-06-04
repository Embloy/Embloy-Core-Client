"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Separator } from "@radix-ui/react-select"
import { z } from "zod"

import { submitApplication } from "@/lib/api/application"
import { Job, Session, applyWithGQ, makeRequest } from "@/lib/api/sdk"
import { getSession } from "@/lib/api/session"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { Icons } from "@/components/icons"
import { getDictionary } from "@/app/[lang]/dictionaries"

import LoadingScreen from "./loading"

export default function ApplyPage({ params: { lang } }) {
  const [job, setJob] = useState<Job | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const searchParams = useSearchParams()
  const router = useRouter()
  const [applicationText, setApplicationText] = useState("")
  const pathName = usePathname() as string
  const origin = useSearchParams()
  const [cvFile, setCvFile] = useState<File | undefined>()
  const [isLoading, setIsLoading] = React.useState<boolean>(true)
  const [errorMessages, setErrorMessages] = useState<{
    [key: number]: string | null
  }>({})
  const textSchema = z.string().nonempty({ message: "Input cannot be empty" })
  const idSchema = z
    .number()
    .int()
    .positive({ message: "ID must be a positive integer" })
  const [options, setOptions] = useState<
    Array<{ application_option_id: number; answer: string; file: File | null }>
  >([])
  const [dict, setDict] = useState<Record<string, any> | null>(null)
  const mimeTypes = {
    pdf: "application/pdf",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    txt: "text/plain",
    rtf: "application/rtf",
    odt: "application/vnd.oasis.opendocument.text",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    bmp: "image/bmp",
    tiff: "image/tiff",
    tif: "image/tiff",
    svg: "image/svg+xml",
    mp4: "video/mp4",
    avi: "video/x-msvideo",
    mov: "video/quicktime",
    wmv: "video/x-ms-wmv",
    flv: "video/x-flv",
    mkv: "video/x-matroska",
    webm: "video/webm",
    ogg: "audio/ogg",
    mp3: "audio/mpeg",
    wav: "audio/wav",
    wma: "audio/x-ms-wma",
    aac: "audio/aac",
    m4a: "audio/mp4",
    zip: "application/zip",
    rar: "application/x-rar-compressed",
    tar: "application/x-tar",
    "7z": "application/x-7z-compressed",
    gz: "application/gzip",
    bz2: "application/x-bzip2",
    xls: "application/vnd.ms-excel",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ods: "application/vnd.oasis.opendocument.spreadsheet",
    ppt: "application/vnd.ms-powerpoint",
    pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  }
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      const dictionary = await getDictionary(lang)
      setDict(dictionary)
      if (!searchParams.has("request_token") && !searchParams.has("gq")) {
        router.back()
        return
      }

      const loggedIn = (await getSession()).session
      if (!loggedIn) {
        router.push(
          origin
            ? `/${lang}/login?origin=${pathName}?${origin}`
            : `/${lang}/login`
        )
        return
      }

      const request_token = searchParams.get("request_token")
      const gq = searchParams.get("gq")

      if (typeof gq === "string" && dict) {
        const requestData = await applyWithGQ(gq)
        if (requestData !== null) {
          setJob(requestData.job)
          setSession(requestData.session)
        } else {
          setIsLoading(false)
          return toast({
            title: dict.sdk.errors.request.title,
            description: dict.sdk.errors.request.description,
            variant: "destructive",
          })
        }
      } else {
        if (typeof request_token === "string" && dict) {
          const requestData = await makeRequest(request_token)
          if (requestData !== null) {
            setJob(requestData.job)
            setSession(requestData.session)
            validateFields()
          } else {
            setIsLoading(false)
            return toast({
              title: dict.sdk.errors.request.title,
              description: dict.sdk.errors.request.description,
              variant: "destructive",
            })
          }
        }
      }
      setIsLoading(false)
    }

    fetchData()
  }, [searchParams, router, origin, pathName, lang, dict])

  function validateFields() {
    let isValid = true

    if (job?.cv_required && !cvFile && dict) {
      setErrorMessages((prevMessages) => ({
        ...prevMessages,
        cvFile: dict.sdk.required,
      }))
      isValid = false
    }

    if (applicationText.trim() === "" && dict) {
      setErrorMessages((prevMessages) => ({
        ...prevMessages,
        applicationText: dict.sdk.required,
      }))
      isValid = false
    }

    job?.application_options.forEach((option) => {
      const userOption = options.find(
        (opt) => opt.application_option_id === option.id
      )
      if (
        (option.question_type == "file" && userOption?.file) ||
        option.required
      ) {
        switch (option.question_type) {
          case "yes_no":
          case "date":
          case "location":
          case "short_text":
          case "long_text":
          case "number":
          case "single_choice":
          case "multiple_choice":
            if ((!userOption?.answer || userOption.answer == "") && dict) {
              setErrorMessages((prevMessages) => ({
                ...prevMessages,
                [option.id]: dict.sdk.required,
              }))
              isValid = false
            }
            break
          case "file":
            if (!userOption?.file && option.required && dict) {
              setErrorMessages((prevMessages) => ({
                ...prevMessages,
                [option.id]: dict.sdk.required,
              }))
              isValid = false
            } else if (
              userOption?.file &&
              userOption?.file.size > 2 * 1024 * 1024
            ) {
              setErrorMessages((prevMessages) => ({
                ...prevMessages,
                [option.id]: dict?.sdk.errors.invalidFileSize.description,
              }))
              isValid = false
            } else if (userOption?.file) {
              const fileExtension = Object.keys(mimeTypes).find(
                (key) => mimeTypes[key] === userOption?.file?.type
              )

              if (!fileExtension || !option.options.includes(fileExtension)) {
                console.log("file type", userOption?.file.type)
                setErrorMessages((prevMessages) => ({
                  ...prevMessages,
                  [option.id]:
                    dict?.sdk.errors.invalidFileType.description.replace(
                      "{formats}",
                      fileExtension || "unknown"
                    ),
                }))
                isValid = false
              }
            }
            break
          case "link":
            if (userOption?.answer && dict) {
              setErrorMessages((prevMessages) => ({
                ...prevMessages,
                [option.id]: dict.sdk.required,
              }))
              isValid = false
            } else {
              try {
                new URL(
                  options.find((opt) => opt.application_option_id === option.id)
                    ?.answer || ""
                )
              } catch (_) {
                setErrorMessages((prevMessages) => ({
                  ...prevMessages,
                  [option.id]: dict?.sdk.validURL,
                }))
                isValid = false
              }
            }
          default:
            break
        }
      }
    })
    return isValid
  }

  async function onClick() {
    if (!validateFields()) {
      return
    }

    setIsLoading(true)

    const err = await submitApplication(
      applicationText,
      searchParams.get("request_token"),
      job?.job_id || 0,
      cvFile,
      options
    )

    if (err && dict) {
      setIsLoading(false)
      return toast({
        title: dict.errors[err || "500"].title || dict.errors.generic.title,
        description:
          dict.errors[err || "500"].description ||
          dict.errors.generic.description,
        variant: "destructive",
      })
    } else {
      // This forces a cache invalidation.
      router.refresh()
      router.push(`/${lang}/dashboard/applications`)
    }
  }

  const handleInputChange = (event) => {
    const value = event.target.value
    if (value.trim() === "" && dict) {
      setErrorMessages((prevMessages) => ({
        ...prevMessages,
        applicationText: dict.sdk.required,
      }))
    } else {
      setErrorMessages((prevMessages) => ({
        ...prevMessages,
        applicationText: null,
      }))
    }
    setApplicationText(value)
  }

  const handleCVChange = (event) => {
    try {
      setErrorMessages((prevMessages) => {
        const newMessages = { ...prevMessages }
        delete newMessages["cvFile"]
        return newMessages
      })

      if (job && dict) {
        const file = event.target.files[0]
        const validTypes = job.allowed_cv_formats
        const validSize = 2 * 1024 * 1024 // 2MB in bytes

        const fileExtension = "." + file.name.split(".").pop()

        console.log("fileExtension=", fileExtension)
        console.log("validTypes=", validTypes)

        if (!validTypes.includes(fileExtension)) {
          toast({
            title: dict.sdk.errors.invalidFileType.title,
            description: dict.sdk.errors.invalidFileType.description.replace(
              "{formats}",
              job.allowed_cv_formats.join(", ")
            ),
            variant: "destructive",
          })
          return
        }

        if (file.size > validSize) {
          toast({
            title: dict.sdk.errors.invalidFileSize.title,
            description: dict.sdk.errors.invalidFileSize.description,
            variant: "destructive",
          })
          return
        }

        setCvFile(file)
      }
    } catch (error) {
      setErrorMessages((prevMessages) => ({
        ...prevMessages,
        ["cvFile"]: error.message,
      }))
    }
  }

  const handleBackClick = (e) => {
    e.preventDefault()
    if (session && session.cancel_url) {
      window.location.href = session.cancel_url
    } else {
      router.back()
    }
  }

  // Update function for text and link question types
  const handleTextChange = (id: number, value: string, required: boolean) => {
    try {
      setErrorMessages((prevMessages) => {
        const newMessages = { ...prevMessages }
        delete newMessages[id]
        return newMessages
      })

      if (required) {
        idSchema.parse(id)
        if (required && value.trim() === "" && dict) {
          throw new Error(dict.sdk.required)
        }
        textSchema.parse(value)
      }

      setOptions((prevOptions) => {
        const index = prevOptions.findIndex(
          (option) => option.application_option_id === id
        )
        if (index !== -1) {
          const newOptions = [...prevOptions]
          newOptions[index].answer = value
          return newOptions
        } else {
          return [
            ...prevOptions,
            { application_option_id: id, answer: value, file: null },
          ]
        }
      })
    } catch (error) {
      setErrorMessages((prevMessages) => ({
        ...prevMessages,
        [id]: error.message,
      }))
    }
  }

  // Update function for yes_no and single_choice question types
  const handleSingleChoiceChange = (id: number, value: string) => {
    try {
      setOptions((prevOptions) => {
        const index = prevOptions.findIndex(
          (option) => option.application_option_id === id
        )
        if (index !== -1) {
          const newOptions = [...prevOptions]
          newOptions[index].answer = value
          return newOptions
        } else {
          return [
            ...prevOptions,
            { application_option_id: id, answer: value, file: null },
          ]
        }
      })

      setErrorMessages((prevMessages) => ({ ...prevMessages, [id]: null }))
    } catch (error) {
      setErrorMessages((prevMessages) => ({
        ...prevMessages,
        [id]: error.message,
      }))
    }
  }

  // Update function for multiple_choice question type
  const handleMultipleChoiceChange = (
    id: number,
    value: string,
    isChecked: boolean
  ) => {
    try {
      setOptions((prevOptions) => {
        const index = prevOptions.findIndex(
          (option) => option.application_option_id === id
        )
        if (index !== -1) {
          const newOptions = [...prevOptions]
          if (isChecked) {
            newOptions[index].answer += `||| ${value}`
          } else {
            newOptions[index].answer = newOptions[index].answer.replace(
              `||| ${value}`,
              ""
            )
          }
          return newOptions
        } else {
          return [
            ...prevOptions,
            {
              application_option_id: id,
              answer: isChecked ? value : "",
              file: null,
            },
          ]
        }
      })

      setErrorMessages((prevMessages) => ({ ...prevMessages, [id]: null }))
    } catch (error) {
      setErrorMessages((prevMessages) => ({
        ...prevMessages,
        [id]: error.message,
      }))
    }
  }

  const handleFileChange = (id: number, file: File | null) => {
    try {
      setOptions((prevOptions) => {
        const index = prevOptions.findIndex(
          (option) => option.application_option_id === id
        )
        if (index !== -1) {
          const newOptions = [...prevOptions]
          newOptions[index].file = file
          return newOptions
        } else {
          return [
            ...prevOptions,
            { application_option_id: id, answer: "", file: file },
          ]
        }
      })

      setErrorMessages((prevMessages) => ({ ...prevMessages, [id]: null }))
    } catch (error) {
      setErrorMessages((prevMessages) => ({
        ...prevMessages,
        [id]: error.message,
      }))
    }
  }

  if (isLoading) {
    return <LoadingScreen />
  }

  if (!isLoading) {
    return (
      dict &&
      job &&
      session && (
        <div className="container grid h-screen w-screen flex-col items-center justify-center pt-10 lg:max-w-none lg:grid-cols-3 lg:px-0 lg:pt-0">
          <Link
            href={job.referrer_url || "/.."}
            onClick={handleBackClick}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "absolute left-4 top-4 md:left-8 md:top-8 md:text-white"
            )}
          >
            <>
              <Icons.chevronLeft className="mr-2 size-4" />
              {dict.sdk.backToHomepage}
            </>
          </Link>
          <Link
            href={`/${lang}`}
            className={cn(
              buttonVariants({ variant: "outline" }),
              "absolute right-4 top-4 md:right-8 md:top-8"
            )}
          >
            {dict.sdk.goToEmbloy}
          </Link>
          <Image
            src="/images/banner-5c.png"
            alt="Description of the image"
            width={842}
            height={842}
            className="hidden size-full lg:col-span-1 lg:block"
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
                <Icons.logo className="mx-auto size-6" />
                <h1 className="text-2xl font-semibold tracking-tight">
                  {dict.sdk.applyFor}
                  {job.title ?? dict.sdk.thisJob}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {dict.sdk.enterDetails}
                </p>
              </div>
              <textarea
                maxLength={500}
                onChange={handleInputChange}
                value={applicationText}
                className="border-input-border flex h-32 w-full rounded-md border bg-secondary px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder={dict.sdk.enterApplicationText}
              />
              {errorMessages["applicationText"] && (
                <div className="text-sm text-red-500">
                  {errorMessages["applicationText"]}
                </div>
              )}
              {job.cv_required && (
                <div>
                  <legend className="text-lg font-semibold">
                    {dict.sdk.uploadCV}
                  </legend>
                  <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pb-6 pt-5">
                    <div className="space-y-1 text-center">
                      <input
                        type="file"
                        onChange={handleCVChange}
                        accept={job.allowed_cv_formats.join(",")}
                        className="w-full focus:border-indigo-500 focus:ring-indigo-500"
                      />
                      <p className="text-xs text-gray-500">
                        {dict.sdk.allowedFormats}
                        {job.allowed_cv_formats.join(", ")}
                      </p>
                    </div>
                  </div>
                  {errorMessages["cvFile"] && (
                    <div className="text-sm text-red-500">
                      {errorMessages["cvFile"]}
                    </div>
                  )}
                </div>
              )}
              {job.application_options.map((option, index) => {
                const label = option.required
                  ? `${option.question} *`
                  : option.question

                switch (option.question_type) {
                  case "link":
                    return (
                      <div className="flex flex-col space-y-2">
                        <legend className="text-lg font-semibold">
                          {label}
                        </legend>
                        <Input
                          key={index}
                          type="text"
                          required={option.required}
                          placeholder="https://example.com"
                          className="h-12 text-blue-500 underline"
                          onChange={(event) =>
                            handleTextChange(
                              option.id,
                              event.target.value,
                              option.required
                            )
                          }
                        />
                        {errorMessages[option.id] && (
                          <div className="text-sm text-red-500">
                            {errorMessages[option.id]}
                          </div>
                        )}
                      </div>
                    )
                  case "short_text":
                    return (
                      <div className="flex flex-col space-y-2">
                        <legend className="text-lg font-semibold">
                          {label}
                        </legend>
                        <Input
                          key={index}
                          required={option.required}
                          onChange={(event) =>
                            handleTextChange(
                              option.id,
                              event.target.value,
                              option.required
                            )
                          }
                          type="text"
                          maxLength={200}
                          style={{ resize: "none", overflow: "auto" }}
                          className="h-12 w-full rounded-md border bg-secondary p-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary-foreground"
                          placeholder={dict.sdk.enterShortText}
                        />
                        {errorMessages[option.id] && (
                          <div className="text-sm text-red-500">
                            {errorMessages[option.id]}
                          </div>
                        )}
                      </div>
                    )
                  case "long_text":
                    return (
                      <div className="flex flex-col space-y-2">
                        <legend className="text-lg font-semibold">
                          {label}
                        </legend>
                        <textarea
                          key={index}
                          required={option.required}
                          onChange={(event) =>
                            handleTextChange(
                              option.id,
                              event.target.value,
                              option.required
                            )
                          }
                          maxLength={1000}
                          style={{ resize: "none", overflow: "auto" }}
                          className="flex h-32 w-full rounded-md border border-input bg-secondary px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder={dict.sdk.enterLongText}
                        />
                        {errorMessages[option.id] && (
                          <div className="text-sm text-red-500">
                            {errorMessages[option.id]}
                          </div>
                        )}
                      </div>
                    )
                  case "number":
                    return (
                      <div className="flex flex-col space-y-2">
                        <legend className="text-lg font-semibold">
                          {label}
                        </legend>
                        <Input
                          type="number"
                          key={index}
                          maxLength={100}
                          required={option.required}
                          onKeyPress={(event) => {
                            if (!/[0-9]/.test(event.key)) {
                              event.preventDefault()
                            }
                          }}
                          onChange={(event) => {
                            const value = event.target.value
                            if (/^(0|[1-9][0-9]*)$/.test(value)) {
                              handleTextChange(
                                option.id,
                                value,
                                option.required
                              )
                            }
                          }}
                          className="h-12 w-full rounded-md border bg-secondary p-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary-foreground"
                          placeholder={dict.sdk.enterNumber}
                        />
                        {errorMessages[option.id] && (
                          <div className="text-sm text-red-500">
                            {errorMessages[option.id]}
                          </div>
                        )}
                      </div>
                    )
                  case "date":
                    return (
                      <div className="flex flex-col space-y-2">
                        <legend className="text-lg font-semibold">
                          {label}
                        </legend>
                        <Input
                          type="date"
                          key={index}
                          required={option.required}
                          onChange={(event) =>
                            handleTextChange(
                              option.id,
                              event.target.value,
                              option.required
                            )
                          }
                          className="h-12 w-full rounded-md border bg-secondary p-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary-foreground"
                          placeholder={dict.sdk.enterDate}
                        />
                        {errorMessages[option.id] && (
                          <div className="text-sm text-red-500">
                            {errorMessages[option.id]}
                          </div>
                        )}
                      </div>
                    )
                  case "location":
                    return (
                      <div className="flex flex-col space-y-2">
                        <legend className="text-lg font-semibold">
                          {label}
                        </legend>
                        <Input
                          type="text"
                          key={index}
                          maxLength={1000}
                          required={option.required}
                          onChange={(event) =>
                            handleTextChange(
                              option.id,
                              event.target.value,
                              option.required
                            )
                          }
                          className="h-12 w-full rounded-md border bg-secondary p-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary-foreground"
                          placeholder={dict.sdk.enterLocation}
                        />
                        {errorMessages[option.id] && (
                          <div className="text-sm text-red-500">
                            {errorMessages[option.id]}
                          </div>
                        )}
                      </div>
                    )
                  case "yes_no":
                    return (
                      <div className="flex flex-col space-y-2">
                        <Select
                          key={index}
                          required={option.required}
                          onValueChange={(value) => {
                            handleSingleChoiceChange(option.id, value)
                          }}
                        >
                          <SelectTrigger>{label}</SelectTrigger>
                          <SelectContent>
                            <SelectItem key="1" value={"Yes"}>
                              {dict.sdk.yes}
                            </SelectItem>
                            <SelectItem key="2" value={"No"}>
                              {dict.sdk.no}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        {errorMessages[option.id] && (
                          <div className="text-sm text-red-500">
                            {errorMessages[option.id]}
                          </div>
                        )}
                      </div>
                    )
                  case "single_choice":
                    return (
                      <div className="flex flex-col space-y-2">
                        <Select
                          key={index}
                          required={option.required}
                          onValueChange={(value) => {
                            handleSingleChoiceChange(option.id, value)
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
                        {errorMessages[option.id] && (
                          <div className="text-sm text-red-500">
                            {errorMessages[option.id]}
                          </div>
                        )}
                      </div>
                    )
                  case "multiple_choice":
                    return (
                      <fieldset key={index} className="flex flex-col space-y-2">
                        <legend className="text-lg font-semibold">
                          {label}
                        </legend>
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
                                  !!isChecked
                                )
                              }}
                            />{" "}
                            <span>{opt}</span>
                          </label>
                        ))}
                        {errorMessages[option.id] && (
                          <div className="text-sm text-red-500">
                            {errorMessages[option.id]}
                          </div>
                        )}
                      </fieldset>
                    )
                  case "file":
                    return (
                      <div className="flex flex-col space-y-2">
                        <legend className="text-lg font-semibold">
                          {label}
                        </legend>
                        <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pb-6 pt-5">
                          <div className="space-y-1 text-center">
                            <input
                              type="file"
                              onChange={(event) => {
                                const file = event.target.files
                                  ? event.target.files[0]
                                  : null
                                console.log(
                                  "uploading file for option",
                                  option.id,
                                  file
                                )
                                handleFileChange(option.id, file)
                              }}
                              accept={option.options
                                .map((opt) => mimeTypes[opt])
                                .join(",")}
                              className="w-full focus:border-indigo-500 focus:ring-indigo-500"
                            />
                            <p className="text-xs text-gray-500">
                              {dict.sdk.allowedFormats}
                              {option.options.join(", ")}
                            </p>
                          </div>
                        </div>
                        {errorMessages[option.id] && (
                          <div className="text-sm text-red-500">
                            {errorMessages[option.id]}
                          </div>
                        )}
                      </div>
                    )
                  default:
                    return null
                }
              })}
              <p className="mt-2 text-sm text-gray-500">
                {dict.sdk.fieldsMarkedAreRequired}
              </p>
              <button
                onClick={onClick}
                className={cn(
                  buttonVariants({ variant: "default" }),
                  "text-md dark:shadow-gray flex h-12 w-full items-center justify-center rounded-full shadow-md shadow-primary",
                  {
                    "cursor-not-allowed opacity-60":
                      isLoading ||
                      Object.values(errorMessages).some(
                        (message) => message !== null
                      ),
                  }
                )}
                disabled={
                  isLoading ||
                  Object.values(errorMessages).some(
                    (message) => message !== null
                  )
                }
              >
                {isLoading ? (
                  <Icons.spinner className="mr-2 size-4 animate-spin" />
                ) : (
                  <Icons.add className="mr-2 size-4" />
                )}
                {dict.sdk.newApplication}
              </button>
              <Separator className="mt-10 lg:mt-0" />
            </div>
          </div>
        </div>
      )
    )
  } else {
    return (
      dict && (
        <div className="container grid h-screen w-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-1 lg:px-0">
          <Link
            href="/.."
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "absolute left-4 top-4 md:left-8 md:top-8"
            )}
          >
            <>
              <Icons.chevronLeft className="mr-2 size-4" />
              {dict.sdk.backToHomepage}
            </>
          </Link>

          <Link
            href={`/${lang}`}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "absolute right-4 top-4 md:right-8 md:top-8"
            )}
          >
            {dict.sdk.goToEmbloy}
          </Link>
          <EmptyPlaceholder className="mx-auto mt-5 max-w-[800px]">
            <EmptyPlaceholder.Icon name="warning" />
            <EmptyPlaceholder.Title>
              {dict.sdk.notFoundTitle}
            </EmptyPlaceholder.Title>
            <EmptyPlaceholder.Description>
              {dict.sdk.notFoundSubtitle}
            </EmptyPlaceholder.Description>
            <Link
              href={`/${lang}/dashboard/overview`}
              className={buttonVariants({ variant: "ghost" })}
            >
              {dict.sdk.goToDashboard}
            </Link>
          </EmptyPlaceholder>
        </div>
      )
    )
  }
}
