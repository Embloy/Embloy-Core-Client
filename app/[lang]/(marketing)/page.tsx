import Link from "next/link"
import Image from "next/image"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

import { getDictionary } from "../dictionaries"
import {EmbloySpacer} from "@/components/ui/stuff"

export default async function IndexPage({ params: { lang } }) {
  const dict = await getDictionary(lang)

  return (
    <>
      {/* eslint-disable-next-line */}
      <section className="space-y-6 bg-background md:bg-[url('/images/bg-1.png')] bg-cover bg-center pb-8 pt-6 md:dark:bg-[url('/images/bg-1-dark.jpg')] md:pb-12 md:pt-10 lg:py-32">
        <div className="container flex max-w-5xl flex-col items-center gap-16 rounded-lg bg-gray-600 bg-opacity-5 py-4 text-center backdrop-blur dark:bg-white dark:bg-opacity-5 dark:backdrop-blur  portrait:bg-background">
            <div className="flex w-full flex-row items-start justify-between portrait:flex-col">
              <div className="flex w-[45px] flex-col items-start justify-start">
                <p className="text-left text-sm text-muted-foreground dark:text-muted-foreground">
                  {dict.marketing.sec0.about}
                </p>
              </div>
              <div className="flex w-6/12 flex-col items-start justify-start gap-8 portrait:w-full">
                <h1 className="text-left font-heading text-5xl portrait:text-3xl">
                  {dict.marketing.sec0.head}
                </h1>
                <h1 className="text-left text-lg">
                  {dict.marketing.sec0.subHead}
                </h1>
                <div className="flex w-full flex-row items-center justify-between gap-2 portrait:flex-col portrait:items-start ">
                  <Link
                    href={`/${lang}/register`}
                    className={cn(
                      buttonVariants({ variant: "filled", size: "bold" }),
                      " px-4 portrait:w-full"
                    )}
                  >
                    {dict.pages.signup}
                  </Link>

                  <p className="text-left text-sm portrait:w-full portrait:text-center">
                    {dict.marketing.sec0.try}
                  </p>
                  <div className="flex w-7/12 items-center portrait:w-full portrait:justify-center">
                  <Link className="w-full portrait:w-8/12" href="/en-US/login?origin=/en-US/sdk/apply?request_token=eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOjcsImV4cCI6MTcyNTIzMjA0MCwic2Vzc2lvbiI6eyJtb2RlIjoiYXNoYnkiLCJzdWNjZXNzX3VybCI6Imh0dHBzOi8vam9icy5ici5kZS9jdWkoYkQxa1pTWmpQVFV4TWc9PSkvZGVmYXVsdC5odG0_Y29uZmlndXJhdGlvbklkPVpCUl9TRUFSQ0gjIVpCUl9TRUFSQ0gvUE1fUE9TVElORyZjR2QxYVdROU5EWkVOekpDTlVaQ09URXdNVVZFUlVGRVJFRXhORGxHTlVKQ01UQXdNalElM0QiLCJqb2Jfc2x1ZyI6ImFzaGJ5X18zNTBjYmVkMy0wMTZlLTQ1MzEtOTQzZi01NmM4NjdkZTk5ZWQiLCJ1c2VyX2lkIjo3LCJzdWJzY3JpcHRpb25fdHlwZSI6ImVudGVycHJpc2VfMSJ9LCJpYXQiOjE3MjUyMzAyNDAsImlzcyI6ImFwaS5lbWJsb3kuY29tIn0.J1hwRKJnVHNX1Qr9c2oDqARToMSH2MiB-M4KzL2GL2Y">
                    <Image 
                      src="https://embloy.com/images/button-black_large.svg" 
                      width={0}
                      height={0}
                      sizes="100vw"
                      alt="Embloy button"
                      className="w-full rounded-lg portrait:hidden"
                    />
                    <Image 
                      src="https://embloy.com/images/button-purple_large.svg" 
                      width={0}
                      height={0}
                      sizes="100vw"
                      alt="Embloy button"
                      className="w-full rounded-lg landscape:hidden"
                    />
                  </Link>
                  </div>
                  
                </div>
                <p className="text-left text-sm">
                  <a href="" className="text-embloy-foreground hover:underline dark:text-embloy-foreground">{dict.marketing.sec0.disclaimerLink}</a>
                  {dict.marketing.sec0.disclaimer}
                </p>
                
              </div>
              <div className="flex w-5/12 flex-col items-start justify-start portrait:hidden ">
                <Image
                src="/images/desk.png"
                width={0}
                height={0}
                sizes="100vw"
                alt="Picture of the author"
                className="w-full rounded-lg"
                />

              </div>
            </div>
          
            <div className="flex w-full flex-row items-start justify-between portrait:flex-col">
              <div className="flex w-[45px] flex-col items-start justify-start portrait:w-full">
                <p className="text-left text-sm text-muted-foreground dark:text-muted-foreground">
                  {dict.marketing.sec1.about}
                </p>
              </div>
              <div className="flex w-11/12 flex-row items-start justify-between portrait:w-full portrait:flex-col portrait:gap-4">
                <div className="flex w-4/12 flex-row items-start justify-start gap-2 portrait:w-full portrait:gap-4">
                  <Image
                  src="/images/how0.png"
                  width={0}
                  height={0}
                  sizes="100vw"
                  alt="how0"
                  className="w-2/12 rounded-[5px]"
                  />
                  <p className="w-9/12 text-left text-sm">
                    <strong className="portrait:hidden">{dict.marketing.sec1.how0Head}</strong>
                    <h1 className="text-left font-heading text-xl landscape:hidden ">{dict.marketing.sec1.how0Head}</h1>
                    <br className="portrait:hidden" />
                    {dict.marketing.sec1.how0}
                  </p>
                </div>
                <div className="flex w-4/12 flex-row items-start justify-start gap-2 portrait:w-full portrait:gap-4">
                  <Image
                  src="/images/how1.png"
                  width={0}
                  height={0}
                  sizes="100vw"
                  alt="how0"
                  className="w-2/12 rounded-[5px]"
                  />
                  <p className="w-9/12 text-left text-sm">
                    <strong className="portrait:hidden">{dict.marketing.sec1.how1Head}</strong>
                    <h1 className="text-left font-heading text-xl landscape:hidden">{dict.marketing.sec1.how1Head}</h1>
                    <br className="portrait:hidden"/>
                    {dict.marketing.sec1.how1}
                  </p>
                </div>
                <div className="flex w-4/12 flex-row items-start justify-start gap-2 portrait:w-full portrait:gap-4">
                  <Image
                  src="/images/how2.png"
                  width={0}
                  height={0}
                  sizes="100vw"
                  alt="how0"
                  className="w-2/12 rounded-[5px]"
                  />
                  <p className="w-9/12 text-left text-sm">
                    <strong className="portrait:hidden">{dict.marketing.sec1.how2Head}</strong>
                    <h1 className="text-left font-heading text-xl landscape:hidden">{dict.marketing.sec1.how2Head}</h1>
                    <br className="portrait:hidden" />
                    {dict.marketing.sec1.how2}
                  </p>
                </div>
              </div>
            </div>
            
        </div>
      </section>
      <EmbloySpacer className="portrait:hidden" />
      <section className="space-y-6 bg-background">
        <div className="container flex max-w-5xl flex-col items-center gap-16 py-4 text-center">
          <div className="flex w-full flex-row items-start justify-between portrait:flex-col">
            <div className="flex w-[45px] flex-col items-start justify-start portrait:w-full">
              <p className="text-left text-sm text-muted-foreground dark:text-muted-foreground">
                {dict.marketing.sec2.about}
              </p>
            </div>
            <div className="flex w-11/12 flex-col items-start justify-start gap-8 portrait:w-full">
              <div className="flex w-full flex-row items-start justify-between gap-4 portrait:flex-col">
                <div className="flex w-4/12 flex-col items-start justify-start gap-3 rounded-lg border-2 border-accent-foreground p-3 dark:border-accent-foreground portrait:w-full">
                  <h1 className="text-left font-heading text-xl">
                    {dict.marketing.sec2.feature0Head}
                  </h1>
                  <p className="text-left text-sm">
                    {dict.marketing.sec2.feature0Desc}
                  </p>
                </div>
                <div className="flex w-4/12 flex-col items-start justify-start gap-3 rounded-lg border-2 border-accent-foreground p-3 dark:border-accent-foreground portrait:w-full">
                  <h1 className="text-left font-heading text-xl">
                    {dict.marketing.sec2.feature1Head}
                  </h1>
                  <p className="text-left text-sm">
                    {dict.marketing.sec2.feature1Desc}
                  </p>
                </div>
                <div className="flex w-4/12 flex-col items-start justify-start gap-3 rounded-lg border-2 border-accent-foreground p-3 dark:border-accent-foreground portrait:w-full">
                  <h1 className="text-left font-heading text-xl">
                    {dict.marketing.sec2.feature2Head}
                  </h1>
                  <p className="text-left text-sm">
                    {dict.marketing.sec2.feature2Desc}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>        
      </section>
      <EmbloySpacer className="portrait:hidden" />
      <section className="space-y-6 bg-background">
        <div className="container flex max-w-5xl flex-col items-center gap-16 py-4 text-center">
          <div className="flex w-full flex-row items-start justify-between portrait:flex-col">
            <div className="flex w-[45px] flex-col items-start justify-start portrait:w-full">
              <p className="text-left text-sm text-muted-foreground dark:text-muted-foreground">
                {dict.marketing.sec3.about}
              </p>
            </div>
            <div className="flex w-11/12 flex-col items-start justify-start gap-8 portrait:w-full">
              <div className="flex w-full flex-row items-start justify-start portrait:flex-col portrait:gap-4">
                <h1 className="text-left font-heading text-3xl">
                  {dict.marketing.sec3.head}
                </h1>
                <Link
                    href={`/${lang}/register`}
                    className={cn(
                      buttonVariants({ variant: "bold", size: "default" }),
                      "ml-4 px-4"
                    )}
                  >
                    {dict.pages.demo}
                  </Link>
               
                <Link
                    href={`/${lang}/login`}
                    className={cn(
                      buttonVariants({ variant: "bold", size: "default" }),
                      "ml-4 px-4"
                    )}
                  >
                    {dict.pages.addL}
                </Link>
                <Link
                    href={`/${lang}/resources`}
                    className={cn(
                      buttonVariants({ variant: "bold", size: "default" }),
                      "ml-4 px-4"
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
      <section className="space-y-6 bg-background">
        <div className="container flex max-w-5xl flex-col items-center gap-16 py-4 text-center">
          <div className="flex w-full flex-row items-start justify-between portrait:flex-col">
            <div className="flex w-[45px] flex-col items-start justify-start portrait:w-full">
              <p className="text-left text-sm text-muted-foreground dark:text-muted-foreground ">
                {dict.marketing.sec4.about}
              </p>
            </div>
            <div className="flex w-11/12 flex-col items-start justify-start gap-8 portrait:w-full">
              <h1 className="text-left font-heading text-3xl">
                {dict.marketing.sec4.head}
              </h1>
              <ul className="list-disc pl-7">
                <li>
                  <p className="text-left text-sm">
                  {dict.marketing.sec4.news0}
                  <br />
                  <a target="_blank" href={dict.marketing.sec4.news0Link} className="text-sm text-embloy-foreground hover:underline dark:text-embloy-foreground" rel="noreferrer">{dict.marketing.sec4.link}</a>
                  </p>
                </li>
                <li>
                  <p className="text-left text-sm">
                  {dict.marketing.sec4.news1}
                  <br />
                  <a target="_blank" href={dict.marketing.sec4.news1Link} className=" text-sm text-embloy-foreground hover:underline dark:text-embloy-foreground" rel="noreferrer">{dict.marketing.sec4.link}</a>
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>        
      </section>
    </>
  )
}
