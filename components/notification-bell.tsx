"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Icons } from "@/components/icons"
import { getDictionary } from "@/app/[lang]/dictionaries"
import { useEffect, useState } from "react"
import { Locale } from "@/i18n-config"
import { redirect } from "next/navigation"
import { getLatestNotifications, Notification } from "@/lib/api/notifications"
import { toast } from "./ui/use-toast"
import Link from 'next/link';

interface NotificationBellProps {
  params: {
    lang: Locale
  }
}

export default function NotificationBell({params: { lang} }: NotificationBellProps)  {
  const [dict, setDict] = useState<Record<string, any> | null>(null);
  const [notifications, setNotifications] = useState<Notification[] | null>([]);
  const [isLoading, setIsLoading] = useState<Boolean>(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      const dictionary = await getDictionary(lang);
      setDict(dictionary);
      
      setIsLoading(true);
      const {response, err} = await getLatestNotifications();
      setIsLoading(false);
      if (err) {
        return toast({
          title: dictionary.errors[err || "500"].title || dictionary.errors.generic.title,
          description: dictionary.errors[err || "500"].description || dictionary.errors.generic.description,
          variant: "destructive",
        })
      }
      if (response) setNotifications(response);

    };
    fetchNotifications();
  }, [lang, dict]);

  const getNotificationLink = (type: string) => {
    switch (type) {
      case 'ApplicationStatusNotification':
        return '/dashboard/applications';
      case 'ApplicationNotification':
        return 'https://genius.embloy.com/recruitement';
      default:
        return '/';
    }
  }

  return dict && notifications && (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="size-8 px-0">
          {notifications.length > 0 ? <Icons.bellRing className="rotate-0 scale-100 transition-all" /> : <Icons.bell className="rotate-0 scale-100 transition-all" />}
          <span className="sr-only">{dict.nav.notifications.latestNotifications}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="border p-2">
      <DropdownMenuLabel className="p-2">
            <span>{dict.nav.notifications.latestNotifications}</span>
      </DropdownMenuLabel>

        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <Link href={getNotificationLink(notification.type)} passHref>
              <DropdownMenuItem key={notification.id} className="my-1 p-2 hover:bg-gray-200">
                {
                  notification.read_at ?
                  <Icons.mailCheck className='mr-2 size-4 text-muted-foreground' />
                  : 
                  <Icons.mailWarning className='mr-2 size-4 text-blue-600' />
                }
                <span>{dict.nav.notifications[notification.type]}</span>
              </DropdownMenuItem>
            </Link>
          ))
        ) : (
          <DropdownMenuLabel className="my-1 p-2">
            <span>{dict.nav.notifications.noNotifications}</span>
          </DropdownMenuLabel>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}