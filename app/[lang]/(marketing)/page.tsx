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
        <div className="container flex max-w-5xl flex-col items-center gap-16 text-center bg-white bg-opacity-5 backdrop-blur-[8px] portrait:bg-background rounded-lg py-4">
            <div className="flex flex-row portrait:flex-col w-full items-start justify-between">
              <div className="w-[45px] flex flex-col items-start justify-start">
                <p className="text-sm text-muted-foreground dark:text-muted-foreground text-left">
                  {dict.marketing.sec0.about}
                </p>
              </div>
              <div className="w-6/12 portrait:w-full flex flex-col items-start justify-start gap-8">
                <h1 className="text-5xl portrait:text-3xl font-heading text-left">
                  {dict.marketing.sec0.head}
                </h1>
                <h1 className="text-lg text-left">
                  {dict.marketing.sec0.subHead}
                </h1>
                <div className="w-full flex flex-row portrait:flex-col items-center portrait:items-start justify-between gap-2 ">
                  <Link
                    href={`/${lang}/register`}
                    className={cn(
                      buttonVariants({ variant: "filled", size: "bold" }),
                      " px-4 portrait:w-full"
                    )}
                  >
                    {dict.pages.signup}
                  </Link>

                  <p className="text-sm text-left portrait:text-center portrait:w-full">
                    {dict.marketing.sec0.try}
                  </p>
                  <div className="w-7/12 portrait:w-full flex items-center portrait:justify-center">
                  <Link className="w-full portrait:w-8/12" href="/en-US/login?origin=/en-US/sdk/apply?request_token=eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOjcsImV4cCI6MTcyNTIzMjA0MCwic2Vzc2lvbiI6eyJtb2RlIjoiYXNoYnkiLCJzdWNjZXNzX3VybCI6Imh0dHBzOi8vam9icy5ici5kZS9jdWkoYkQxa1pTWmpQVFV4TWc9PSkvZGVmYXVsdC5odG0_Y29uZmlndXJhdGlvbklkPVpCUl9TRUFSQ0gjIVpCUl9TRUFSQ0gvUE1fUE9TVElORyZjR2QxYVdROU5EWkVOekpDTlVaQ09URXdNVVZFUlVGRVJFRXhORGxHTlVKQ01UQXdNalElM0QiLCJqb2Jfc2x1ZyI6ImFzaGJ5X18zNTBjYmVkMy0wMTZlLTQ1MzEtOTQzZi01NmM4NjdkZTk5ZWQiLCJ1c2VyX2lkIjo3LCJzdWJzY3JpcHRpb25fdHlwZSI6ImVudGVycHJpc2VfMSJ9LCJpYXQiOjE3MjUyMzAyNDAsImlzcyI6ImFwaS5lbWJsb3kuY29tIn0.J1hwRKJnVHNX1Qr9c2oDqARToMSH2MiB-M4KzL2GL2Y">
                    <Image 
                      src="https://embloy.com/images/button-black_large.svg" 
                      width={0}
                      height={0}
                      sizes="100vw"
                      alt="Embloy button"
                      className="portrait:hidden rounded-lg w-full"
                    />
                    <Image 
                      src="https://embloy.com/images/button-purple_large.svg" 
                      width={0}
                      height={0}
                      sizes="100vw"
                      alt="Embloy button"
                      className="landscape:hidden rounded-lg w-full"
                    />
                  </Link>
                  </div>
                  
                </div>
                <p className="text-sm text-left">
                  <a href="" className="text-embloy-foreground dark:text-embloy-foreground hover:underline">{dict.marketing.sec0.disclaimerLink}</a>
                  {dict.marketing.sec0.disclaimer}
                </p>
                
              </div>
              <div className="portrait:hidden w-5/12 flex flex-col items-start justify-start ">
                <Image
                src="/images/desk.png"
                width={0}
                height={0}
                sizes="100vw"
                alt="Picture of the author"
                className="rounded-lg w-full"
                />

              </div>
            </div>
          
            <div className="flex flex-row portrait:flex-col w-full items-start justify-between">
              <div className="w-[45px] portrait:w-full flex flex-col items-start justify-start">
                <p className="text-sm text-muted-foreground dark:text-muted-foreground text-left">
                  {dict.marketing.sec1.about}
                </p>
              </div>
              <div className="w-11/12 portrait:w-full flex flex-row portrait:flex-col items-start justify-between portrait:gap-4">
                <div className="w-4/12 portrait:w-full flex flex-row items-start justify-start gap-2 portrait:gap-4">
                  <Image
                  src="/images/how0.png"
                  width={0}
                  height={0}
                  sizes="100vw"
                  alt="how0"
                  className="rounded-[5px] w-2/12"
                  />
                  <p className="text-sm text-left w-9/12">
                    <strong className="portrait:hidden">{dict.marketing.sec1.how0Head}</strong>
                    <h1 className="landscape:hidden text-xl font-heading text-left ">{dict.marketing.sec1.how0Head}</h1>
                    <br className="portrait:hidden" />
                    {dict.marketing.sec1.how0}
                  </p>
                </div>
                <div className="w-4/12 portrait:w-full flex flex-row items-start justify-start gap-2 portrait:gap-4">
                  <Image
                  src="/images/how1.png"
                  width={0}
                  height={0}
                  sizes="100vw"
                  alt="how0"
                  className="rounded-[5px] w-2/12"
                  />
                  <p className="text-sm text-left w-9/12">
                    <strong className="portrait:hidden">{dict.marketing.sec1.how1Head}</strong>
                    <h1 className="landscape:hidden text-xl font-heading text-left">{dict.marketing.sec1.how1Head}</h1>
                    <br className="portrait:hidden"/>
                    {dict.marketing.sec1.how1}
                  </p>
                </div>
                <div className="w-4/12 portrait:w-full flex flex-row items-start justify-start gap-2 portrait:gap-4">
                  <Image
                  src="/images/how2.png"
                  width={0}
                  height={0}
                  sizes="100vw"
                  alt="how0"
                  className="rounded-[5px] w-2/12"
                  />
                  <p className="text-sm text-left w-9/12">
                    <strong className="portrait:hidden">{dict.marketing.sec1.how2Head}</strong>
                    <h1 className="landscape:hidden text-xl font-heading text-left">{dict.marketing.sec1.how2Head}</h1>
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
        <div className="container flex max-w-5xl flex-col items-center gap-16 text-center py-4">
          <div className="flex flex-row portrait:flex-col w-full items-start justify-between">
            <div className="w-[45px] portrait:w-full flex flex-col items-start justify-start">
              <p className="text-sm text-muted-foreground dark:text-muted-foreground text-left">
                {dict.marketing.sec2.about}
              </p>
            </div>
            <div className="w-11/12 portrait:w-full flex flex-col items-start justify-start gap-8">
              <div className="w-full flex flex-row portrait:flex-col items-start gap-4 justify-between">
                <div className="w-4/12 portrait:w-full flex flex-col items-start justify-start p-3 border-2 border-accent-foreground dark:border-accent-foreground rounded-lg gap-3">
                  <h1 className="text-xl font-heading text-left">
                    {dict.marketing.sec2.feature0Head}
                  </h1>
                  <p className="text-sm text-left">
                    {dict.marketing.sec2.feature0Desc}
                  </p>
                </div>
                <div className="w-4/12 portrait:w-full flex flex-col items-start justify-start p-3 border-2 border-accent-foreground dark:border-accent-foreground rounded-lg gap-3">
                  <h1 className="text-xl font-heading text-left">
                    {dict.marketing.sec2.feature1Head}
                  </h1>
                  <p className="text-sm text-left">
                    {dict.marketing.sec2.feature1Desc}
                  </p>
                </div>
                <div className="w-4/12 portrait:w-full flex flex-col items-start justify-start p-3 border-2 border-accent-foreground dark:border-accent-foreground rounded-lg gap-3">
                  <h1 className="text-xl font-heading text-left">
                    {dict.marketing.sec2.feature2Head}
                  </h1>
                  <p className="text-sm text-left">
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
        <div className="container flex max-w-5xl flex-col items-center gap-16 text-center py-4">
          <div className="flex flex-row portrait:flex-col w-full items-start justify-between">
            <div className="w-[45px] portrait:w-full flex flex-col items-start justify-start">
              <p className="text-sm text-muted-foreground dark:text-muted-foreground text-left">
                {dict.marketing.sec3.about}
              </p>
            </div>
            <div className="w-11/12 portrait:w-full flex flex-col items-start justify-start gap-8">
              <div className="w-full flex flex-row portrait:flex-col items-start justify-start portrait:gap-4">
                <h1 className="text-3xl font-heading text-left">
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
        <div className="container flex max-w-5xl flex-col items-center gap-16 text-center py-4">
          <div className="flex flex-row portrait:flex-col w-full items-start justify-between">
            <div className="w-[45px] portrait:w-full flex flex-col items-start justify-start">
              <p className="text-sm text-muted-foreground dark:text-muted-foreground text-left ">
                {dict.marketing.sec4.about}
              </p>
            </div>
            <div className="w-11/12 portrait:w-full flex flex-col items-start justify-start gap-8">
              <h1 className="text-3xl font-heading text-left">
                {dict.marketing.sec4.head}
              </h1>
              <ul className="list-disc pl-7">
                <li>
                  <p className="text-sm text-left">
                  {dict.marketing.sec4.news0}
                  <br />
                  <a target="_blank" href={dict.marketing.sec4.news0Link} className="text-sm text-embloy-foreground dark:text-embloy-foreground hover:underline">{dict.marketing.sec4.link}</a>
                  </p>
                </li>
                <li>
                  <p className="text-sm text-left">
                  {dict.marketing.sec4.news1}
                  <br />
                  <a target="_blank" href={dict.marketing.sec4.news1Link} className=" text-sm text-embloy-foreground dark:text-embloy-foreground hover:underline">{dict.marketing.sec4.link}</a>
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
