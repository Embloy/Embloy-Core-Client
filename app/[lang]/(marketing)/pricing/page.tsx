import Link from "next/link"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { getDictionary } from "../../dictionaries"

export const metadata = {
  title: "Pricing",
}

export default async function PricingPage({ params: { lang } }) {
  const dict = await getDictionary(lang)
  
  return (
    <section className="container flex flex-col  gap-6 py-8 md:max-w-[64rem] md:py-12 lg:py-24">
      <div className="mx-auto flex w-full flex-col gap-4 md:max-w-[58rem]">
        <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
          {dict.marketing.pricing.simpleTransparentPricing}
        </h2>
        <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
        {dict.marketing.pricing.freeForApplicants}</p>
        <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
        {dict.marketing.pricing.basicSubscriptionForProviders}
        </p>
      </div>
      <div className="grid w-full items-start gap-10 rounded-lg border p-10 md:grid-cols-[1fr_200px]">
        <div className="grid gap-6">
          <h3 className="text-xl font-bold sm:text-2xl">
            {dict.marketing.pricing.embloyFree.title}
          </h3>
          <ul className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
            <li className="flex items-center">
              <Icons.check className="mr-2 h-4 w-4" /> {dict.marketing.pricing.embloyFree.features[0]}
            </li>
            <li className="flex items-center">
              <Icons.check className="mr-2 h-4 w-4" /> {dict.marketing.pricing.embloyFree.features[1]}
            </li>
            <li className="flex items-center">
              <Icons.check className="mr-2 h-4 w-4" /> {dict.marketing.pricing.embloyFree.features[2]}
            </li>
            <li className="flex items-center">
              <Icons.check className="mr-2 h-4 w-4" /> {dict.marketing.pricing.embloyFree.features[3]}
            </li>
            <li className="flex items-center">
              <Icons.check className="mr-2 h-4 w-4" /> {dict.marketing.pricing.embloyFree.features[4]}
            </li>
            <li className="flex items-center">
              <Icons.check className="mr-2 h-4 w-4" /> {dict.marketing.pricing.embloyFree.features[5]}
            </li>
          </ul>
        </div>
        <div className="flex flex-col gap-4 text-center">
          <div>
            <h4 className="text-7xl font-bold">{dict.marketing.pricing.embloyFree.price}</h4>
            <p className="text-sm font-medium text-muted-foreground">
              {dict.marketing.pricing.embloyFree.billing}
            </p>
          </div>
          <Link href={`/${lang}/login`} className={cn(buttonVariants({ size: "lg" }))}>
            {dict.marketing.pricing.embloyFree.getStarted}
          </Link>
        </div>
      </div>

      <div className="grid w-full items-start gap-10 rounded-lg border p-10 md:grid-cols-[1fr_200px]">
        <div className="grid gap-6">
          <h3 className="text-xl font-bold sm:text-2xl">
            What&apos;s included in EMBLOY SMART
          </h3>
          <ul className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
          <li className="flex items-center">
              <Icons.check className="mr-2 h-4 w-4" /> {dict.marketing.pricing.embloySmart.features[0]}
            </li>
            <li className="flex items-center">
              <Icons.check className="mr-2 h-4 w-4" /> {dict.marketing.pricing.embloySmart.features[1]}
            </li>
            <li className="flex items-center">
              <Icons.check className="mr-2 h-4 w-4" /> {dict.marketing.pricing.embloySmart.features[2]}
            </li>
            <li className="flex items-center">
              <Icons.check className="mr-2 h-4 w-4" /> {dict.marketing.pricing.embloySmart.features[3]}
            </li>
          </ul>
        </div>
        <div className="flex flex-col gap-4 text-center">
          <div>
            <h4 className="text-7xl font-bold">{dict.marketing.pricing.embloySmart.price}</h4>
            <p className="text-sm font-medium text-muted-foreground">
              {dict.marketing.pricing.embloySmart.billing}
            </p>
          </div>
          <Link href={`/${lang}/login`} className={cn(buttonVariants({ size: "lg" }))}>
           {dict.marketing.pricing.embloySmart.getStarted}
          </Link>
        </div>
      </div>

      <div className="grid w-full items-start gap-10 rounded-lg border p-10 md:grid-cols-[1fr_200px]">
        <div className="grid gap-6">
          <h3 className="text-xl font-bold sm:text-2xl">
            What&apos;s included in EMBLOY GENIUS
          </h3>
          <ul className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
          <li className="flex items-center">
              <Icons.check className="mr-2 h-4 w-4" /> {dict.marketing.pricing.embloyGenius.features[0]}
            </li>
            <li className="flex items-center">
              <Icons.check className="mr-2 h-4 w-4" /> {dict.marketing.pricing.embloyGenius.features[1]}
            </li>
            <li className="flex items-center">
              <Icons.check className="mr-2 h-4 w-4" /> {dict.marketing.pricing.embloyGenius.features[2]}
            </li>
            <li className="flex items-center">
              <Icons.check className="mr-2 h-4 w-4" /> {dict.marketing.pricing.embloyGenius.features[3]}
            </li>
          </ul>
        </div>
        <div className="flex flex-col gap-4 text-center">
          <div>
            <h4 className="text-7xl font-bold">{dict.marketing.pricing.embloyGenius.price}</h4>
            <p className="text-sm font-medium text-muted-foreground">
            {dict.marketing.pricing.embloyGenius.billing}
            </p>
          </div>
          <Link href={`/${lang}/login`} className={cn(buttonVariants({ size: "lg" }))}>
            {dict.marketing.pricing.embloyGenius.getStarted}
          </Link>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-[58rem] flex-col gap-4">
        <p className="max-w-[85%] leading-normal text-muted-foreground sm:leading-7">
        <strong>Embloy</strong> {dict.marketing.pricing.partnershipWithStripe1} <strong>Stripe</strong> {dict.marketing.pricing.partnershipWithStripe2}
        </p>
      </div>
    </section>
  )
}
