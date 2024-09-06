import * as React from "react"
import { useRouter } from "next/navigation"
import { Locale } from "@/i18n-config"
import { useMediaQuery } from "@react-hook/media-query"

import { Button, ButtonProps } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getDictionary } from "@/app/[lang]/dictionaries"

interface ManualProxyFormProps extends ButtonProps {
  params: {
    lang: Locale
    mode: string | null
    eType: string | null
  }
}

export function ManualProxyForm({
  params: { lang, mode = "", eType = "manual" },
}: ManualProxyFormProps) {
  const router = useRouter()
  const [dict, setDict] = React.useState<Record<string, any> | null>(null)
  const [open, setOpen] = React.useState(eType == "external" || eType == "auto")
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const [url, setURL] = React.useState("")
  const [slug, setSlug] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)

  const urlPlaceholders = {
    lever: "https://jobs.lever.co/en/embloy/05157a89-...",
    ashby: "https://jobs.ashbyhq.com/embloy/05157a89-...",
    greenhouse: "https://boards.greenhouse.io/embloy/jobs/...",
    workable: "https://embloy.workable.com/jobs/...",
    smartrecruiters: "https://careers.smartrecruiters.com/...",
    default: "https://jobs.example.com/05157a89-...",
    job: "https://jobs.example.com/05157a89-...",
  }

  React.useEffect(() => {
    const fetchDictionary = async () => {
      const dictionary = await getDictionary(lang)
      setDict(dictionary)
    }

    fetchDictionary()
  }, [lang])

  const handleFormSubmit = async (event) => {
    event.preventDefault()
    setIsLoading(true)
    if (slug) {
      await router.push(
        `https://apply.embloy.com?slug=${slug}&mode=${mode}&eType=${eType}`
      )
    } else if (url) {
      await router.push(
        `https://apply.embloy.com?url=${url}&mode=${mode}&eType=${eType}`
      )
    }
    setIsLoading(false)
  }

  if (!dict) return null

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="filled" size="bold" className="ml-4 px-4">
            {dict.proxy.apply}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>{dict.proxy.paste}</DialogTitle>
            <DialogDescription>{dict.proxy.applyWith}</DialogDescription>
          </DialogHeader>
          <form className="grid items-start gap-4" onSubmit={handleFormSubmit}>
            <div className="grid gap-2">
              <Label htmlFor="url">{dict.proxy.url}</Label>
              <Input
                type="url"
                id="url"
                placeholder={urlPlaceholders[mode || "default"]}
                value={url}
                onChange={(e) => setURL(e.target.value)}
                disabled={!!slug}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="slug">{dict.proxy.slug}</Label>
              <Input
                id="slug"
                placeholder="05157a89-..."
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                disabled={!!url}
              />
            </div>
            <Button type="submit" disabled={isLoading || (!url && !slug)}>
              {dict.dashboard.upcoming.apply}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="filled" size="bold">
          {dict.proxy.apply}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{dict.proxy.paste}</DrawerTitle>
          <DrawerDescription>{dict.proxy.applyWith}</DrawerDescription>
        </DrawerHeader>
        <form
          className="grid items-start gap-4 px-4"
          onSubmit={handleFormSubmit}
        >
          <div className="grid gap-2">
            <Label htmlFor="url">{dict.proxy.url}</Label>
            <Input
              type="url"
              id="url"
              placeholder={urlPlaceholders[mode || "default"]}
              value={url}
              onChange={(e) => setURL(e.target.value)}
              disabled={!!slug}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="slug">{dict.proxy.slug}</Label>
            <Input
              id="slug"
              placeholder="eyJhbGciOiJIUzI1NiJ9°ey..."
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              disabled={!!url}
            />
          </div>
          <Button type="submit" disabled={isLoading || (!url && !slug)}>
            {dict.dashboard.upcoming.apply}
          </Button>
        </form>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">{dict.dashboard.upcoming.cancel}</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
