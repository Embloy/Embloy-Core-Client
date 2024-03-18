import Link from "next/link"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { getDictionary } from "../dictionaries"

export default async function IndexPage({ params: { lang } }) {
    const dict = await getDictionary(lang)

  return (
    <>
      {/* eslint-disable-next-line */}
      <section className="space-y-6 bg-background md:bg-[url('/images/bg-1.png')] bg-cover bg-center pb-8 pt-6 md:dark:bg-[url('/images/bg-1-dark.png')] md:pb-12 md:pt-10 lg:py-32">
      
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
          <Link
            href={siteConfig.links.github}
            className="rounded-2xl bg-muted px-4 py-1.5 text-sm font-medium"
            target="_blank"
          >
          {dict.marketing.workInProgress}
          </Link>
          <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
          <p>{dict.marketing.mainHeader}</p>
          {dict.marketing.subHeader}
          </h1>
          <p className="hidden max-w-[42rem] leading-normal text-muted-foreground sm:block sm:text-xl sm:leading-8">
          {dict.marketing.recruitmentSteps}
          </p>
          <div className="hidden space-x-4 lg:block">
            <Link href={`/${lang}/login`} className={cn(buttonVariants({ size: "lg" }))}>
            {dict.marketing.getStarted}
            </Link>
            <Link
              href={siteConfig.links.genius}
              target="_blank"
              rel="noreferrer"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
              >
              {dict.marketing.forCompanies}
            </Link>
          </div>
          <div className="space-x-4 lg:hidden">
            <Link href={`/${lang}/login`} className={cn(buttonVariants({ size: "lg" }))}>
              {dict.marketing.getStarted}
            </Link>
          </div>
        </div>
      </section>
      
      <section
        id="features"
        className="container space-y-6 bg-slate-50 py-8 dark:bg-transparent md:py-12 lg:py-24"
      >
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
          {dict.marketing.features}
          </h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
          {dict.marketing.featureDescription}
          </p>
        </div>
        <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
        <div className="relative scale-100 transform-gpu overflow-hidden rounded-lg border bg-background p-2 opacity-90 transition-all duration-500 ease-in-out hover:scale-105 hover:opacity-100">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <svg viewBox="0 0 24 24" className="size-12" fill="none">
               <path d="M5 12C5 8.13401 8.13401 5 12 5M16.4999 7.5L11.9999 12M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM13 12C13 12.5523 12.5523 13 12 13C11.4477 13 11 12.5523 11 12C11 11.4477 11.4477 11 12 11C12.5523 11 13 11.4477 13 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div className="space-y-2">
                <h3 className="font-bold">{dict.marketing.smartHiring}</h3>
                <p className="text-sm text-muted-foreground">
                {dict.marketing.smartHiringDescription}
                </p>
              </div>
            </div>
          </div>
          <div className="relative scale-100 transform-gpu overflow-hidden rounded-lg border bg-background p-2 opacity-90 transition-all duration-500 ease-in-out hover:scale-105 hover:opacity-100">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <svg className="fill-currentColor size-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 4.5H18.3C19.4201 4.5 19.9802 4.5 20.408 4.71799C20.7843 4.90973 21.0903 5.21569 21.282 5.59202C21.5 6.01984 21.5 6.57989 21.5 7.7V9C21.5 9.93188 21.5 10.3978 21.3478 10.7654C21.1448 11.2554 20.7554 11.6448 20.2654 11.8478C19.8978 12 19.4319 12 18.5 12M13 19.5H5.7C4.5799 19.5 4.01984 19.5 3.59202 19.282C3.21569 19.0903 2.90973 18.7843 2.71799 18.408C2.5 17.9802 2.5 17.4201 2.5 16.3V15C2.5 14.0681 2.5 13.6022 2.65224 13.2346C2.85523 12.7446 3.24458 12.3552 3.73463 12.1522C4.10218 12 4.56812 12 5.5 12M10.3 14.5H13.7C13.98 14.5 14.12 14.5 14.227 14.4455C14.3211 14.3976 14.3976 14.3211 14.4455 14.227C14.5 14.12 14.5 13.98 14.5 13.7V10.3C14.5 10.02 14.5 9.87996 14.4455 9.773C14.3976 9.67892 14.3211 9.60243 14.227 9.5545C14.12 9.5 13.98 9.5 13.7 9.5H10.3C10.02 9.5 9.87996 9.5 9.773 9.5545C9.67892 9.60243 9.60243 9.67892 9.5545 9.773C9.5 9.87996 9.5 10.02 9.5 10.3V13.7C9.5 13.98 9.5 14.12 9.5545 14.227C9.60243 14.3211 9.67892 14.3976 9.773 14.4455C9.87996 14.5 10.02 14.5 10.3 14.5ZM17.8 22H21.2C21.48 22 21.62 22 21.727 21.9455C21.8211 21.8976 21.8976 21.8211 21.9455 21.727C22 21.62 22 21.48 22 21.2V17.8C22 17.52 22 17.38 21.9455 17.273C21.8976 17.1789 21.8211 17.1024 21.727 17.0545C21.62 17 21.48 17 21.2 17H17.8C17.52 17 17.38 17 17.273 17.0545C17.1789 17.1024 17.1024 17.1789 17.0545 17.273C17 17.38 17 17.52 17 17.8V21.2C17 21.48 17 21.62 17.0545 21.727C17.1024 21.8211 17.1789 21.8976 17.273 21.9455C17.38 22 17.52 22 17.8 22ZM2.8 7H6.2C6.48003 7 6.62004 7 6.727 6.9455C6.82108 6.89757 6.89757 6.82108 6.9455 6.727C7 6.62004 7 6.48003 7 6.2V2.8C7 2.51997 7 2.37996 6.9455 2.273C6.89757 2.17892 6.82108 2.10243 6.727 2.0545C6.62004 2 6.48003 2 6.2 2H2.8C2.51997 2 2.37996 2 2.273 2.0545C2.17892 2.10243 2.10243 2.17892 2.0545 2.273C2 2.37996 2 2.51997 2 2.8V6.2C2 6.48003 2 6.62004 2.0545 6.727C2.10243 6.82108 2.17892 6.89757 2.273 6.9455C2.37996 7 2.51997 7 2.8 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div className="space-y-2">
                <h3 className="font-bold">{dict.marketing.endToEndRecruitment}</h3>
                <p className="text-sm text-muted-foreground">
                  {dict.marketing.endToEndRecruitmentDescription}
                </p>
              </div>
            </div>
          </div>
          <div className="relative scale-100 transform-gpu overflow-hidden rounded-lg border bg-background p-2 opacity-90 transition-all duration-500 ease-in-out hover:scale-105 hover:opacity-100">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
            <svg className="size-12" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.5 4.5C7.5 3.11929 8.61929 2 10 2C11.3807 2 12.5 3.11929 12.5 4.5V6H13.5C14.8978 6 15.5967 6 16.1481 6.22836C16.8831 6.53284 17.4672 7.11687 17.7716 7.85195C18 8.40326 18 9.10218 18 10.5H19.5C20.8807 10.5 22 11.6193 22 13C22 14.3807 20.8807 15.5 19.5 15.5H18V17.2C18 18.8802 18 19.7202 17.673 20.362C17.3854 20.9265 16.9265 21.3854 16.362 21.673C15.7202 22 14.8802 22 13.2 22H12.5V20.25C12.5 19.0074 11.4926 18 10.25 18C9.00736 18 8 19.0074 8 20.25V22H6.8C5.11984 22 4.27976 22 3.63803 21.673C3.07354 21.3854 2.6146 20.9265 2.32698 20.362C2 19.7202 2 18.8802 2 17.2V15.5H3.5C4.88071 15.5 6 14.3807 6 13C6 11.6193 4.88071 10.5 3.5 10.5H2C2 9.10218 2 8.40326 2.22836 7.85195C2.53284 7.11687 3.11687 6.53284 3.85195 6.22836C4.40326 6 5.10218 6 6.5 6H7.5V4.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div className="space-y-2">
                <h3 className="font-bold">{dict.marketing.easyToIntegrate}</h3>
                <p className="text-sm text-muted-foreground">
                {dict.marketing.easyToIntegrateDescription}
                </p>
              </div>
            </div>
          </div>
          <div className="relative scale-100 transform-gpu overflow-hidden rounded-lg border bg-background p-2 opacity-90 transition-all duration-500 ease-in-out hover:scale-105 hover:opacity-100">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <svg viewBox="0 0 24 24" className="size-12">
               <path d="M9 3.5V2M5.06066 5.06066L4 4M5.06066 13L4 14.0607M13 5.06066L14.0607 4M3.5 9H2M8.5 8.5L12.6111 21.2778L15.5 18.3889L19.1111 22L22 19.1111L18.3889 15.5L21.2778 12.6111L8.5 8.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div className="space-y-2">
                <h3 className="font-bold">{dict.marketing.oneClickToApply}</h3>
                <p className="text-sm text-muted-foreground">
                {dict.marketing.oneClickToApplyDescription}
                </p>
              </div>
            </div>
          </div>
          <div className="relative scale-100 transform-gpu overflow-hidden rounded-lg border bg-background p-2 opacity-90 transition-all duration-500 ease-in-out hover:scale-105 hover:opacity-100">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <svg className="size-12" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 9H2M14 17.5L16.5 15L14 12.5M10 12.5L7.5 15L10 17.5M2 7.8L2 16.2C2 17.8802 2 18.7202 2.32698 19.362C2.6146 19.9265 3.07354 20.3854 3.63803 20.673C4.27976 21 5.11984 21 6.8 21H17.2C18.8802 21 19.7202 21 20.362 20.673C20.9265 20.3854 21.3854 19.9265 21.673 19.362C22 18.7202 22 17.8802 22 16.2V7.8C22 6.11984 22 5.27977 21.673 4.63803C21.3854 4.07354 20.9265 3.6146 20.362 3.32698C19.7202 3 18.8802 3 17.2 3L6.8 3C5.11984 3 4.27976 3 3.63803 3.32698C3.07354 3.6146 2.6146 4.07354 2.32698 4.63803C2 5.27976 2 6.11984 2 7.8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div className="space-y-2">
                <h3 className="font-bold">{dict.marketing.xPlatform}</h3>
                <p className="text-sm text-muted-foreground">
                {dict.marketing.xPlatformDescription}
                </p>
              </div>
            </div>
          </div>
          <div className="relative scale-100 transform-gpu overflow-hidden rounded-lg border bg-background p-2 opacity-90 transition-all duration-500 ease-in-out hover:scale-105 hover:opacity-100">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <svg viewBox="0 0 24 24" fill="none" className="size-12">
                <path d="M9.99999 13C10.4294 13.5741 10.9773 14.0491 11.6065 14.3929C12.2357 14.7367 12.9315 14.9411 13.6466 14.9923C14.3618 15.0435 15.0796 14.9403 15.7513 14.6897C16.4231 14.4392 17.0331 14.047 17.54 13.54L20.54 10.54C21.4508 9.59695 21.9547 8.33394 21.9434 7.02296C21.932 5.71198 21.4061 4.45791 20.4791 3.53087C19.552 2.60383 18.298 2.07799 16.987 2.0666C15.676 2.0552 14.413 2.55918 13.47 3.46997L11.75 5.17997M14 11C13.5705 10.4258 13.0226 9.95078 12.3934 9.60703C11.7642 9.26327 11.0685 9.05885 10.3533 9.00763C9.63819 8.95641 8.9204 9.0596 8.24864 9.31018C7.57688 9.56077 6.96687 9.9529 6.45999 10.46L3.45999 13.46C2.5492 14.403 2.04522 15.666 2.05662 16.977C2.06801 18.288 2.59385 19.542 3.52089 20.4691C4.44793 21.3961 5.702 21.9219 7.01298 21.9333C8.32396 21.9447 9.58697 21.4408 10.53 20.53L12.24 18.82" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div className="space-y-2">
                <h3 className="font-bold">{dict.marketing.socialTools}</h3>
                <p className="text-sm text-muted-foreground">
                {dict.marketing.socialToolsDescription}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="mx-auto text-center md:max-w-[58rem]">
          <p className="leading-normal text-muted-foreground sm:text-lg sm:leading-7">
          {dict.marketing.smarterFasterBetter}
          </p>
        </div>
      </section>
      <section id="open-source" className="container bg-background bg-cover bg-center py-8 md:bg-[url('/images/bg-2.png')] md:py-12 md:dark:bg-[url('/images/bg-2-dark.png')] lg:py-24">
        <div className="mx-auto my-12 flex max-w-[65rem] flex-col items-center justify-center gap-4 text-center">
        </div>
        <div className="container mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 py-8 text-center md:py-12 lg:py-24">
          <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
          {dict.marketing.openSource}
          </h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
          {dict.marketing.openSourceDescription} <br />{" "}
          {dict.marketing.sourceCodeAvailableOnGitHub}{" "}
            <Link
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-4"
            >
              GitHub
            </Link>
            .{" "}
          </p>
        </div>
      </section>
    </>
  )
}
