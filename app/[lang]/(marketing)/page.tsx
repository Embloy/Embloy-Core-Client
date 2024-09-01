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
      
    </>
  )
}
