import Image from "next/image"
import Link from "next/link"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { EmbloySpacer } from "@/components/ui/stuff"

import { getDictionary } from "../dictionaries"

export default async function IndexPage({ params: { lang } }) {
  const dict = await getDictionary(lang)

  return (
    <>
      {/* eslint-disable-next-line */}
      <section className="space-y-6 md:bg-[url('/images/bg-1.png')] bg-cover bg-center pb-8 pt-6 md:dark:bg-[url('/images/bg-1-dark.jpg')] md:pb-12 portrait:py-0 ">
        <div className="dark:backdrop-blu container flex w-11/12 flex-col items-center gap-16 rounded-lg bg-white/80 py-12 text-center backdrop-blur dark:bg-[#110e1b]/80 portrait:gap-0">
          <Link
            href={`${siteConfig.links.developer}/blog`}
            className="rounded-2xl border-2 border-primary bg-embloy-foreground px-4 py-1.5 text-2xl font-medium text-primary duration-300 hover:bg-primary hover:text-embloy-foreground dark:border-embloy-foreground dark:text-background dark:hover:text-primary-foreground portrait:text-sm"
            target="_blank"
          >
            {dict.marketing.inviteMessage}
          </Link>
          <div className="flex w-full flex-row items-start justify-between px-10 portrait:flex-col portrait:px-0">
            <div className="flex w-6/12 flex-col items-start justify-start gap-8 pt-5 portrait:w-full portrait:gap-4">
              <h1 className="text-left font-heading text-5xl md:text-6xl lg:text-8xl">
                {dict.marketing.landing.head}
              </h1>
              <h1 className="text-left text-2xl portrait:text-lg">
                {dict.marketing.landing.subHead}
              </h1>
              <div className="mt-12 flex w-full flex-row items-center justify-between gap-2 portrait:flex-col portrait:items-start">
                <Link
                  href={`/${lang}/register`}
                  className={cn(
                    buttonVariants({ variant: "filled", size: "boldLg" }),
                    " px-9 py-2 portrait:w-full portrait:px-4 portrait:py-0"
                  )}
                >
                  {dict.pages.signup}
                </Link>

                <p className="mx-4 whitespace-nowrap text-center portrait:hidden portrait:text-center portrait:text-sm landscape:text-lg">
                  {dict.marketing.landing.try}
                </p>
                <div className="flex w-8/12 items-center portrait:w-full portrait:justify-center">
                  <Link
                    className="portrait:w-8/12"
                    target="_blank"
                    href="https://embloy.com/sdk/apply?gq=eyJhbGciOiJIUzI1NiJ9°eyJzdWIiOjEzLCJleHAiOjE3MjgwMjYyNDUsImp0aSI6IjkzN2FhZGQyOGYwNDcyNGNmZjEwZGEyNzY3Nzc0YzZhIiwiaWF0IjoxNzI1Mzk2NDk5LCJqb2JfaWQiOiI3IiwiaXNzIjoiYXBpLmVtYmxveS5jb20ifQ°352KDBcCKTnkxRawgzrsei8r2Ii769lV1WPaxfUxaiI"
                  >
                    <Image
                      src="https://embloy.com/images/button-black_large.svg"
                      alt="Embloy button"
                      width={300}
                      height={300}
                      className="transform-gpu dark:hidden portrait:hidden"
                    />
                    <Image
                      src="https://embloy.com/images/button-white_large.svg"
                      alt="Embloy button"
                      width={300}
                      height={300}
                      className="hidden transform-gpu dark:block portrait:hidden"
                    />
                  </Link>
                </div>
              </div>
            </div>
            <div className="flex w-5/12 flex-col items-start justify-start portrait:hidden ">
              <Image
                src="/images/desk-dark-1.png"
                width={0}
                height={0}
                sizes="100vw"
                alt="Picture of the author"
                className="hidden w-full rounded-lg dark:block"
              />
              <Image
                src="/images/desk-light-1.png"
                width={0}
                height={0}
                sizes="100vw"
                alt="Picture of the author"
                className="w-full rounded-lg dark:hidden"
              />
            </div>
          </div>
        </div>
      </section>
      <EmbloySpacer className="portrait:hidden" />
      <section>
        <div className="container flex w-11/12 flex-col items-center gap-16 py-4 text-center">
          <div className="flex w-full flex-row items-start justify-between portrait:flex-col">
            <div className="flex w-[45px] flex-col items-start justify-start portrait:w-full">
              <p className="text-left text-sm text-muted-foreground dark:text-muted-foreground">
                {dict.marketing.howItWorks.about}
              </p>
            </div>
            <div className="flex w-11/12 flex-row items-start justify-between portrait:w-full portrait:flex-col portrait:gap-4">
              <div className="flex w-4/12 flex-row items-start justify-start gap-2 portrait:w-full portrait:gap-4">
                <Image
                  src="/images/how0-light.png"
                  width={0}
                  height={0}
                  sizes="100vw"
                  alt="how0"
                  className="w-2/12 rounded-[5px] dark:hidden"
                />
                <Image
                  src="/images/how0.png"
                  width={0}
                  height={0}
                  sizes="100vw"
                  alt="how0"
                  className="hidden w-2/12 rounded-[5px] dark:block"
                />
                <p className="w-9/12 text-left portrait:text-sm landscape:text-lg">
                  <strong className="portrait:hidden">
                    {dict.marketing.howItWorks.how0Head}
                  </strong>
                  <h1 className="text-left font-heading text-xl landscape:hidden ">
                    {dict.marketing.howItWorks.how0Head}
                  </h1>
                  <br className="portrait:hidden" />
                  {dict.marketing.howItWorks.how0}
                </p>
              </div>
              <div className="flex w-4/12 flex-row items-start justify-start gap-2 portrait:w-full portrait:gap-4">
                <Image
                  src="/images/how1-light.png"
                  width={0}
                  height={0}
                  sizes="100vw"
                  alt="how0"
                  className="w-2/12 rounded-[5px] dark:hidden"
                />
                <Image
                  src="/images/how1.png"
                  width={0}
                  height={0}
                  sizes="100vw"
                  alt="how0"
                  className="hidden w-2/12 rounded-[5px] dark:block"
                />
                <p className="w-9/12 text-left portrait:text-sm landscape:text-lg">
                  <strong className="portrait:hidden">
                    {dict.marketing.howItWorks.how1Head}
                  </strong>
                  <h1 className="text-left font-heading text-xl landscape:hidden">
                    {dict.marketing.howItWorks.how1Head}
                  </h1>
                  <br className="portrait:hidden" />
                  {dict.marketing.howItWorks.how1}
                </p>
              </div>
              <div className="flex w-4/12 flex-row items-start justify-start gap-2 portrait:w-full portrait:gap-4">
                <Image
                  src="/images/how2-light.png"
                  width={0}
                  height={0}
                  sizes="100vw"
                  alt="how0"
                  className="block w-2/12 rounded-[5px] dark:hidden"
                />
                <Image
                  src="/images/how2.png"
                  width={0}
                  height={0}
                  sizes="100vw"
                  alt="how0"
                  className="hidden w-2/12 rounded-[5px] dark:block"
                />
                <p className="w-9/12 text-left portrait:text-sm landscape:text-lg">
                  <strong className="portrait:hidden">
                    {dict.marketing.howItWorks.how2Head}
                  </strong>
                  <h1 className="text-left font-heading text-xl landscape:hidden">
                    {dict.marketing.howItWorks.how2Head}
                  </h1>
                  <br className="portrait:hidden" />
                  {dict.marketing.howItWorks.how2}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <EmbloySpacer className="portrait:hidden" />
      <section className="space-y-6">
        <div className="container flex w-11/12 flex-col items-center gap-16 py-4 text-center">
          <div className="flex w-full flex-row items-start justify-between portrait:flex-col">
            <div className="flex w-[45px] flex-col items-start justify-start portrait:w-full">
              <p className="text-left text-sm text-muted-foreground dark:text-muted-foreground">
                {dict.marketing.usefulLinks.about}
              </p>
            </div>
            <div className="flex w-11/12 flex-col items-start justify-start gap-8 portrait:w-full">
              <div className="flex w-full flex-row items-start justify-start portrait:flex-col portrait:gap-4">
                <h1 className="text-left font-heading text-3xl">
                  {dict.marketing.usefulLinks.head}
                </h1>
                <Link
                  href={siteConfig.links.calendy}
                  target="_blank"
                  className={cn(
                    buttonVariants({ variant: "bold", size: "default" }),
                    "ml-4 portrait:px-4 portrait:text-sm landscape:px-6 landscape:text-lg"
                  )}
                >
                  {dict.pages.demo}
                </Link>

                <Link
                  href={siteConfig.links.about + "/en/contact"}
                  target="_blank"
                  className={cn(
                    buttonVariants({ variant: "bold", size: "default" }),
                    "ml-4 portrait:px-4 portrait:text-sm landscape:px-6 landscape:text-lg"
                  )}
                >
                  {dict.pages.addL}
                </Link>
                <Link
                  href={siteConfig.links.developer + "/docs/category/guides"}
                  target="_blank"
                  className={cn(
                    buttonVariants({ variant: "bold", size: "default" }),
                    "ml-4 portrait:px-4 portrait:text-sm landscape:px-6 landscape:text-lg"
                  )}
                >
                  {dict.pages.tutorial}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <EmbloySpacer className="portrait:hidden" />
      <section className="space-y-6">
        <div className="container flex w-11/12 flex-col items-center gap-16 py-4 text-center">
          <div className="flex w-full flex-row items-start justify-between portrait:flex-col">
            <div className="flex w-[45px] flex-col items-start justify-start portrait:mb-2 portrait:w-full">
              <p className="text-left text-sm text-muted-foreground dark:text-muted-foreground">
                {dict.marketing.newFeatures.about}
              </p>
            </div>
            <div className="grid w-11/12 flex-col items-start justify-start gap-8 md:grid-cols-3 portrait:w-full">
              <div className="mb-8 flex w-full flex-col items-start justify-start gap-8 portrait:mb-0">
                <div className="relative scale-100 transform-gpu overflow-hidden rounded-lg border bg-background p-2 opacity-90 transition-all duration-500 ease-in-out hover:scale-105 hover:border-primary hover:opacity-100 dark:bg-muted">
                  <div className="flex flex-col justify-between rounded-md p-6">
                    <div className="space-y-2">
                      <h3 className="font-bold">
                        {dict.marketing.newFeatures.feature0Head}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {dict.marketing.newFeatures.feature0Desc}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="relative scale-100 transform-gpu overflow-hidden rounded-lg border bg-background p-2 opacity-90 transition-all duration-500 ease-in-out hover:scale-105 hover:border-primary hover:opacity-100 dark:bg-muted">
                  <div className="flex flex-col justify-between rounded-md p-6">
                    <div className="space-y-2">
                      <h3 className="font-bold">
                        {dict.marketing.newFeatures.feature1Head}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {dict.marketing.newFeatures.feature1Desc}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="relative scale-100 transform-gpu overflow-hidden rounded-lg border bg-background p-2 opacity-90 transition-all duration-500 ease-in-out hover:scale-105 hover:border-primary hover:opacity-100 dark:bg-muted">
                  <div className="flex flex-col justify-between rounded-md p-6">
                    <div className="space-y-2">
                      <h3 className="font-bold">
                        {dict.marketing.newFeatures.feature2Head}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {dict.marketing.newFeatures.feature2Desc}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mb-8 flex w-full flex-col items-start justify-start gap-8 portrait:mb-0">
                <div className="relative scale-100 transform-gpu overflow-hidden rounded-lg border bg-background p-2 opacity-90 transition-all duration-500 ease-in-out hover:scale-105 hover:border-primary hover:opacity-100 dark:bg-muted">
                  <div className="flex flex-col justify-between rounded-md p-6">
                    <div className="space-y-2">
                      <h3 className="font-bold">
                        {dict.marketing.newFeatures.feature3Head}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {dict.marketing.newFeatures.feature3Desc}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="relative scale-100 transform-gpu overflow-hidden rounded-lg border bg-background p-2 opacity-90 transition-all duration-500 ease-in-out hover:scale-105 hover:border-primary hover:opacity-100 dark:bg-muted">
                  <div className="flex flex-col justify-between rounded-md p-6">
                    <div className="space-y-2">
                      <h3 className="font-bold">
                        {dict.marketing.newFeatures.feature4Head}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {dict.marketing.newFeatures.feature4Desc}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="relative scale-100 transform-gpu overflow-hidden rounded-lg border bg-background p-2 opacity-90 transition-all duration-500 ease-in-out hover:scale-105 hover:border-primary hover:opacity-100 dark:bg-muted">
                  <div className="flex flex-col justify-between rounded-md p-6">
                    <div className="space-y-2">
                      <h3 className="font-bold">
                        {dict.marketing.newFeatures.feature5Head}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {dict.marketing.newFeatures.feature5Desc}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mb-8 flex w-full flex-col items-start justify-start gap-8 portrait:mb-0">
                <div className="relative scale-100 transform-gpu overflow-hidden rounded-lg border bg-background p-2 opacity-90 transition-all duration-500 ease-in-out hover:scale-105 hover:border-primary hover:opacity-100 dark:bg-muted">
                  <div className="flex flex-col justify-between rounded-md p-6">
                    <div className="space-y-2">
                      <h3 className="font-bold">
                        {dict.marketing.newFeatures.feature6Head}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {dict.marketing.newFeatures.feature6Desc}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="relative scale-100 transform-gpu overflow-hidden rounded-lg border bg-background p-2 opacity-90 transition-all duration-500 ease-in-out hover:scale-105 hover:border-primary hover:opacity-100 dark:bg-muted">
                  <div className="flex flex-col justify-between rounded-md p-6">
                    <div className="space-y-2">
                      <h3 className="font-bold">
                        {dict.marketing.newFeatures.feature7Head}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {dict.marketing.newFeatures.feature7Desc}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="relative scale-100 transform-gpu overflow-hidden rounded-lg border bg-background p-2 opacity-90 transition-all duration-500 ease-in-out hover:scale-105 hover:border-primary hover:opacity-100 dark:bg-muted">
                  <div className="flex flex-col justify-between rounded-md p-6">
                    <div className="space-y-2">
                      <h3 className="font-bold">
                        {dict.marketing.newFeatures.feature8Head}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {dict.marketing.newFeatures.feature8Desc}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <EmbloySpacer className="portrait:hidden" />
      <section className="space-y-6">
        <div className="container flex w-11/12 flex-col items-center gap-16 py-4 text-center">
          <div className="flex w-full flex-row items-start justify-between portrait:flex-col">
            <div className="flex w-[45px] flex-col items-start justify-start portrait:w-full">
              <p className="text-left text-sm text-muted-foreground dark:text-muted-foreground ">
                {dict.marketing.news.about}
              </p>
            </div>
            <div className="flex w-11/12 flex-col items-start justify-start gap-8 portrait:w-full">
              <h1 className="text-left font-heading text-3xl">
                {dict.marketing.news.head}
              </h1>
              <ul className="list-disc pl-7">
                <li>
                  <p className="text-left portrait:text-sm landscape:text-lg">
                    {dict.marketing.news.news0}
                    <br />
                    <a
                      target="_blank"
                      href={dict.marketing.news.news0Link}
                      className="text-sky-500 hover:underline dark:text-embloy-foreground portrait:text-sm landscape:text-lg"
                      rel="noreferrer"
                    >
                      {dict.marketing.news.link}
                    </a>
                  </p>
                </li>
                <li>
                  <p className="text-left portrait:text-sm landscape:text-lg">
                    {dict.marketing.news.news1}
                    <br />
                    <a
                      target="_blank"
                      href={dict.marketing.news.news1Link}
                      className=" text-sky-500 hover:underline dark:text-embloy-foreground portrait:text-sm landscape:text-lg"
                      rel="noreferrer"
                    >
                      {dict.marketing.news.link}
                    </a>
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <EmbloySpacer className="portrait:hidden" />
      <section
        id="open-source"
        className="container bg-background bg-cover bg-center md:bg-[url('/images/bg-2.png')] md:dark:bg-[url('/images/bg-2-dark.jpg')] lg:py-12"
      >
        <div className="mx-auto my-12 flex max-w-[65rem] flex-col items-center justify-center gap-4 text-center"></div>
        <div className="container mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
          <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
            {dict.marketing.qrApplications}
          </h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-2xl sm:leading-7">
            {dict.marketing.qrApplicationsDescription}
          </p>
          <Image
            src="/images/qr-code.png"
            width={200}
            height={200}
            alt="QR code"
            className="mx-auto my-10 rounded-sm"
          />
          <Link
            href={`${lang}/register`}
            target="_blank"
            rel="noreferrer"
            className={cn(
              buttonVariants({ variant: "filled", size: "boldLg" }),
              "portrait:w-full portrait:px-4 portrait:py-0 portrait:mb-10"
            )}
          >
            {dict.marketing.getStarted}
          </Link>
        </div>
      </section>{" "}
    </>
  )
}
