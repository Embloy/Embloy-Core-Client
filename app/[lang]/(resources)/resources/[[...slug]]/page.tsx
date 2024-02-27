import { notFound } from "next/navigation"
import { allResources } from "contentlayer/generated"

import { getTableOfContents } from "@/lib/toc"
import { Mdx } from "@/components/mdx-components"
import { ResourcePageHeader } from "@/components/page-header"
import { ResourcesPager } from "@/components/pager"
import { DashboardTableOfContents } from "@/components/toc"

import "@/styles/mdx.css"
import { Metadata } from "next"

import { env } from "@/env.mjs"
import { absoluteUrl } from "@/lib/utils"
import { Locale } from "@/i18n-config"

interface ResourcePageProps {
  params: {
    slug: string[]
    lang: Locale
  }
}

async function getResourceFromParams(params: {slug, lang}) {
  if (!params.slug) {
    params.slug = [params.lang];
  } else if (params.slug.length === 0) {
    params.slug.push(params.lang);
  } else {
    params.slug.unshift(params.lang);
  }
  
  const slug = params.slug?.join("/") || ""
  const resource = allResources.find((resource) => resource.slugAsParams.trim() === slug.trim() && resource.lang === params.lang)

  if (!resource) {
    null
  }

  return resource
}

export async function generateMetadata({
  params,
}: ResourcePageProps): Promise<Metadata> {
  const resource = await getResourceFromParams(params)

  if (!resource) {
    return {}
  }

  const url = env.NEXT_PUBLIC_APP_URL

  const ogUrl = new URL(`${url}/api/og`)
  ogUrl.searchParams.set("heading", resource.description ?? resource.title)
  ogUrl.searchParams.set("type", "Resourceumentation")
  ogUrl.searchParams.set("mode", "dark")

  return {
    title: resource.title,
    description: resource.description,
    openGraph: {
      title: resource.title,
      description: resource.description,
      type: "article",
      url: absoluteUrl(resource.slug),
      images: [
        {
          url: ogUrl.toString(),
          width: 1200,
          height: 630,
          alt: resource.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: resource.title,
      description: resource.description,
      images: [ogUrl.toString()],
    },
  }
}

export async function generateStaticParams(): Promise<
  ResourcePageProps["params"][]
> {
  return allResources.map((resource) => ({
    slug: resource.slugAsParams.split("/"),
    lang: "en-US"
  }))
}

export default async function ResourcePage({ params: {slug, lang} }: ResourcePageProps) {
  const resource = await getResourceFromParams({slug, lang})

  if (!resource) {
    notFound()
  }

  const toc = await getTableOfContents(resource.body.raw)
  
  return (
    <main className="relative py-6 lg:gap-10 lg:py-10 xl:grid xl:grid-cols-[1fr_300px]">
      <div className="mx-auto w-full min-w-0">
        <ResourcePageHeader heading={resource.title} text={resource.description} params={{lang: lang}}/>
        <Mdx code={resource.body.code} />
        <hr className="my-4 md:my-6" />
        <ResourcesPager resource={resource} params={{lang: lang}}/>
      </div>
      <div className="hidden text-sm xl:block">
        <div className="sticky top-16 -mt-10 max-h-[calc(var(--vh)-4rem)] overflow-y-auto pt-10">
          <DashboardTableOfContents toc={toc} params={{lang: lang}} />
        </div>
      </div>
    </main>
  )
}