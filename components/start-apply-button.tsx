import * as React from "react"
 
import { cn } from "@/lib/utils"
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
import { useMediaQuery } from "@react-hook/media-query"
import { Locale } from "@/i18n-config"
import { useRouter } from "next/navigation"

interface StartApplyButtonProps extends ButtonProps {
  params: {
    lang: Locale
  }
}

export function StartApplyButton({
  params: {lang},
}: StartApplyButtonProps) {
  const router = useRouter()
  const [dict, setDict] = React.useState<Record<string, any> | null>(null);
  const [open, setOpen] = React.useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const [quicklink, setQuicklink] = React.useState("");
  const [gq, setGq] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    const fetchDictionary = async () => {
      const dictionary = await getDictionary(lang);
      setDict(dictionary);
    };

    fetchDictionary();
  }, [lang]);

  const handleFormSubmit = async (event) => {
    event.preventDefault()
    setIsLoading(true);
    if (gq) {
      await router.push(`/sdk/apply?gq=${gq}`)
    } else if (quicklink) {
      await router.push(`/sdk/apply?request_token=${quicklink}`)
    }
    setIsLoading(false);
  }

if (isDesktop) {
  return dict && (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">{dict.dashboard.upcoming.apply}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{dict.dashboard.upcoming.apply}</DialogTitle>
          <DialogDescription>
            {dict.dashboard.upcoming.applyWith}
          </DialogDescription>
        </DialogHeader>
        <form className="grid items-start gap-4" onSubmit={handleFormSubmit}>
        <div className="grid gap-2">
         <Label htmlFor="request_token">{dict.dashboard.upcoming.quicklink}</Label>
          <Input type="request_token" id="request_token" placeholder="eyJhbGciOiJIUzI1NiJ9.ey..." value={quicklink} onChange={(e) => setQuicklink(e.target.value)} disabled={!!gq} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="gq">{dict.dashboard.upcoming.gq}</Label>
          <Input id="gq" placeholder="eyJhbGciOiJIUzI1NiJ9°ey..." value={gq} onChange={(e) => setGq(e.target.value)} disabled={!!quicklink} />
        </div>
        <Button type="submit" disabled={isLoading}>{dict.dashboard.upcoming.apply}</Button>
      </form>
      </DialogContent>
    </Dialog>
  )
}

return dict && (
  <Drawer open={open} onOpenChange={setOpen}>
    <DrawerTrigger asChild>
      <Button variant="default">{dict.dashboard.upcoming.apply}</Button>
    </DrawerTrigger>
    <DrawerContent>
      <DrawerHeader className="text-left">
        <DrawerTitle>{dict.dashboard.upcoming.apply}</DrawerTitle>
        <DrawerDescription>
        {dict.dashboard.upcoming.applyWith}
        </DrawerDescription>
      </DrawerHeader>
      <form className="grid items-start gap-4 px-4" onSubmit={handleFormSubmit}>
        <div className="grid gap-2">
          <Label htmlFor="request_token">{dict.dashboard.upcoming.quicklink}</Label>
          <Input type="request_token" id="request_token" placeholder="eyJhbGciOiJIUzI1NiJ9.ey..." value={quicklink} onChange={(e) => setQuicklink(e.target.value)} disabled={!!gq} />
        </div>
        <div className="grid gap-2">
        <Label htmlFor="gq">{dict.dashboard.upcoming.gq}</Label>
        <Input id="gq" placeholder="eyJhbGciOiJIUzI1NiJ9°ey..." value={gq} onChange={(e) => setGq(e.target.value)} disabled={!!quicklink} />
        </div>
        <Button type="submit" disabled={isLoading}>{dict.dashboard.upcoming.apply}</Button>
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
