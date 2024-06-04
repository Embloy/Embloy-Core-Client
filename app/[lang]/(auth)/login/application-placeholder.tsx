import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"
import { Icons } from "@/components/icons"

import { getDictionary } from "../../dictionaries"

export function ApplicationPlaceholder({ params: { lang } }) {
  const [dict, setDict] = useState<Record<string, any> | null>(null)

  useEffect(() => {
    const fetchDictionary = async () => {
      const dictionary = await getDictionary(lang)
      setDict(dictionary)
    }

    fetchDictionary()
  }, [lang])

  return (
    dict && (
      <div className="container grid h-screen w-screen flex-col items-center justify-center pt-10 lg:max-w-none lg:grid-cols-3 lg:px-0 lg:pt-0">
        <Link
          href={`/${lang}`}
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
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[650px]">
            <div className="flex flex-col space-y-2 text-center">
              <Icons.logo className="mx-auto size-6" />
              <h1 className="text-2xl font-semibold tracking-tight">
                {dict.sdk.applyFor}
                {dict.sdk.thisJob}
              </h1>
              <p className="text-sm text-muted-foreground">
                {dict.sdk.enterDetails}
              </p>
            </div>
            <textarea
              className="h-32 w-full resize-none rounded-md border bg-secondary p-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary-foreground"
              placeholder={dict.sdk.enterApplicationText}
            />
            <div className="text-sm text-red-500"></div>
            <div>
              <legend className="text-lg font-semibold">
                {dict.sdk.uploadCV}
              </legend>
              <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pb-6 pt-5">
                <div className="space-y-1 text-center">
                  <input className="w-full focus:border-indigo-500 focus:ring-indigo-500" />
                  <p className="text-xs text-gray-500">
                    {dict.sdk.allowedFormats}
                    {".pdf, .docx, .txt"}
                  </p>
                </div>
              </div>
              <div className="text-sm text-red-500"></div>
            </div>
            <div>
              <Select>
                <SelectTrigger>
                  Have you already worked with usHave you already worked with?
                </SelectTrigger>
                <SelectContent>
                  <SelectItem key="1" value={"Yes"}>
                    {dict.sdk.yes}
                  </SelectItem>
                  <SelectItem key="2" value={"No"}>
                    {dict.sdk.no}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <legend className="text-lg font-semibold">Tell us about yourself</legend>
              <textarea
                maxLength={200}
                style={{ resize: "none", overflow: "auto" }}
                className="h-20 w-full rounded-md border bg-secondary p-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary-foreground"
                placeholder={dict.sdk.enterShortText}
              />
            </div>
            <fieldset className="flex flex-col space-y-2">
              <legend className="text-lg font-semibold">
                Which of the following languages do you know?
              </legend>
              <label className="flex items-center space-x-2">
                <Checkbox />
                <span>Rust (particularly, Actix web)</span>
              </label>
              <label className="flex items-center space-x-2">
                <Checkbox />
                <span>Ruby</span>
              </label>
              <label className="flex items-center space-x-2">
                <Checkbox />
                <span>TypeScript and React based frameworks</span>
              </label>
            </fieldset>
            <button className={cn(buttonVariants({ variant: "default" }))}>
              <Icons.add className="mr-2 size-4" />
              {dict.sdk.newApplication}
            </button>
          </div>
        </div>
      </div>
    )
  )
}
