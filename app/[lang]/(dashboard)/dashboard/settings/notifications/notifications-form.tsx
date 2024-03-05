"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/new-york/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/new-york/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/new-york/ui/radio-group"
import { Switch } from "@/components/new-york/ui/switch"
import { useEffect, useState } from "react"
import { getDictionary } from "@/app/[lang]/dictionaries"
import { toast } from "@/components/ui/use-toast"
import { updateUser } from "@/lib/api/user"

const notificationsFormSchema = z.object({
  type: z.enum(["all", "mentions", "none"], {
    required_error: "You need to select a notification type.",
  }),
  application_notifications: z.boolean().default(false).optional(),
  marketing_notifications: z.boolean().default(false).optional(),
  communication_notifications: z.boolean().default(true).optional(),
  security_notifications: z.boolean().default(true).optional(),
})

type NotificationsFormValues = z.infer<typeof notificationsFormSchema>

export function NotificationsForm({ params: {lang}, user }) {
  const [dict, setDict] = useState<Record<string, any> | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  
  useEffect(() => {
    const fetchDictionary = async () => {
      const dictionary = await getDictionary(lang);
      setDict(dictionary);
    };
    
    fetchDictionary()
  }, [lang, dict]);
  
  const form = useForm<NotificationsFormValues>({
    resolver: zodResolver(notificationsFormSchema),
    defaultValues: {
      type: "all",
      application_notifications: user.application_notifications,
      marketing_notifications: user.marketing_notifications,
      communication_notifications: user.communication_notifications,
      security_notifications: user.security_notifications,
    },
  })
  
  
  async function onSubmit(data: NotificationsFormValues) {
    setIsSaving(true);

    const err = await updateUser(JSON.stringify({ user: data }));
    setIsSaving(false);

    if (err) {
      return (
        dict &&
        toast({
          title: dict.errors[err || "500"].title || dict.errors.generic.title,
          description:
            dict.errors[err || "500"].description ||
            dict.errors.generic.description,
          variant: "destructive",
        })
      );
    }

    dict &&
      toast({
        description: dict.dashboard.settings.success.updateAccount.description,
      });
  }

  return dict && (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>{dict.dashboard.settings.notifications.notifyAbout}</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="all" />
                    </FormControl>
                    <FormLabel className="font-normal">
                    {dict.dashboard.settings.notifications.allNewMessages}
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="mentions" />
                    </FormControl>
                    <FormLabel className="font-normal">
                    {dict.dashboard.settings.notifications.directMessages}
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="none" />
                    </FormControl>
                    <FormLabel className="font-normal">{dict.dashboard.settings.notifications.nothing}</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          <h3 className="mb-4 text-lg font-medium">{dict.dashboard.settings.notifications.emailNotifications}</h3>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="application_notifications"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      {dict.dashboard.settings.notifications.applicationNotifications}
                    </FormLabel>
                    <FormDescription>
                      {dict.dashboard.settings.notifications.applicationNotificationsDescription}
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="communication_notifications"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                  <FormLabel className="text-base">
                      {dict.dashboard.settings.notifications.communicationEmails}
                    </FormLabel>
                    <FormDescription>
                      {dict.dashboard.settings.notifications.communicationEmailsDescription}
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="marketing_notifications"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                  <FormLabel className="text-base">
                      {dict.dashboard.settings.notifications.marketingEmails}
                    </FormLabel>
                    <FormDescription>
                      {dict.dashboard.settings.notifications.marketingEmailsDescription}
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="security_notifications"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                  <FormLabel className="text-base">
                      {dict.dashboard.settings.notifications.securityEmails}
                    </FormLabel>
                    <FormDescription>
                      {dict.dashboard.settings.notifications.securityEmailsDescription}
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled
                      aria-readonly
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
        <Button type="submit" disabled={isSaving}>{dict.dashboard.settings.notifications.updateNotifications} </Button>
      </form>
    </Form>
  )
}
