"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { Button } from "@/components/new-york/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/new-york/ui/card"
import { Input } from "@/components/new-york/ui/input"
import { Label } from "@/components/new-york/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/new-york/ui/select"
import { Textarea } from "@/components/new-york/ui/textarea"
import { getDictionary } from "@/app/[lang]/dictionaries"

export default function ReportAnIssuePage({ params: { lang } }) {
  const router = useRouter()
  const [dict, setDict] = useState<Record<string, any> | null>(null)
  const [area, setArea] = useState("billing")
  const [securityLevel, setSecurityLevel] = useState("2")
  const [subject, setSubject] = useState("")
  const [description, setDescription] = useState("")

  useEffect(() => {
    const fetchDictionary = async () => {
      const dictionary = await getDictionary(lang)
      setDict(dictionary)
    }

    fetchDictionary()
  }, [router, lang, dict])

  const handleSubmit = () => {
    const mailtoLink = `mailto:support@example.com?subject=${encodeURIComponent(
      subject
    )}&body=${dict && encodeURIComponent(
      dict.dashboard.reportIssue.emailBody
        .replace("{area}", area)
        .replace("{securityLevel}", securityLevel)
        .replace("{description}", description)
    )}`
    window.open(mailtoLink, '_blank')
  }

  return (
    dict && (
      <div className="container w-full items-start">
        <Card className="col-span-2 mx-10 w-3/4 portrait:w-full portrait:mx-0">
          <CardHeader>
            <CardTitle>{dict.dashboard.reportIssue.title}</CardTitle>
            <CardDescription>
              {dict.dashboard.reportIssue.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid grid-cols-2 portrait:grid-cols-1 portrait:gap-6">
              <div className="grid gap-2">
                <Label htmlFor="area">{dict.dashboard.reportIssue.areaLabel}</Label>
                <Select defaultValue="billing" onValueChange={setArea}>
                  <SelectTrigger id="area">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="team">{dict.dashboard.reportIssue.areaOptions.application}</SelectItem>
                    <SelectItem value="billing">{dict.dashboard.reportIssue.areaOptions.billing}</SelectItem>
                    <SelectItem value="account">{dict.dashboard.reportIssue.areaOptions.account}</SelectItem>
                    <SelectItem value="deployments">{dict.dashboard.reportIssue.areaOptions.security}</SelectItem>
                    <SelectItem value="support">{dict.dashboard.reportIssue.areaOptions.support}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="security-level">
                  {dict.dashboard.reportIssue.securityLevelLabel}
                </Label>
                <Select defaultValue="2" onValueChange={setSecurityLevel}>
                  <SelectTrigger
                    id="security-level"
                    className="line-clamp-1 w-[160px] truncate"
                  >
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">{dict.dashboard.reportIssue.securityLevelOptions["1"]}</SelectItem>
                    <SelectItem value="2">{dict.dashboard.reportIssue.securityLevelOptions["2"]}</SelectItem>
                    <SelectItem value="3">{dict.dashboard.reportIssue.securityLevelOptions["3"]}</SelectItem>
                    <SelectItem value="4">{dict.dashboard.reportIssue.securityLevelOptions["4"]}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="subject">{dict.dashboard.reportIssue.subjectLabel}</Label>
              <Input
                id="subject"
                placeholder={dict.dashboard.reportIssue.subjectPlaceholder}
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">{dict.dashboard.reportIssue.descriptionLabel}</Label>
              <Textarea
                id="description"
                placeholder={dict.dashboard.reportIssue.descriptionPlaceholder}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter className="justify-between space-x-2">
            <Button variant="ghost" onClick={() => router.back()}>
              {dict.dashboard.reportIssue.goBack}
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!area || !securityLevel || !subject || !description}
            >
              {dict.dashboard.reportIssue.submit}
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  )
}