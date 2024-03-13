"use client"

import Link from "next/link"
import { User } from "@/lib/api/session"
import { logout } from "@/lib/api/auth"
import {Locale} from "../i18n-config";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { UserAvatar } from "@/components/user-avatar"
import { useRouter } from "next/navigation"
import { getDictionary } from "@/app/[lang]/dictionaries";
import { useState, useEffect } from "react";

interface UserAccountNavProps extends React.HTMLAttributes<HTMLDivElement> {
  user: Pick<User, "first_name" | "last_name" | "image_url" | "email">
  params: {
    lang: Locale
  }
}

export function UserAccountNav({ user, params: {lang} }: UserAccountNavProps ) {
  const router = useRouter()
  const [dict, setDict] = useState<Record<string, any> | null>(null);

  useEffect(() => {
    const fetchDictionary = async () => {
      const dictionary = await getDictionary(lang);
      setDict(dictionary);
    };

    fetchDictionary();
  }, [lang]);

  return dict && (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar
          user={{ email: user.email, image_url: user.image_url || null }}
          className="size-12 border border-secondary-foreground"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {user.first_name && <p className="font-medium">{user.first_name}</p>}
            {user.last_name && <p className="font-medium">{user.last_name}</p>}
            {user.email && (
              <p className="w-[200px] truncate text-sm text-muted-foreground">
                {user.email}
              </p>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={`/${lang}/dashboard/overview`}>{dict.nav.side.dashboard}</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/${lang}/dashboard/upcoming-jobs`}>{dict.nav.side["upcoming jobs"]}</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/${lang}/dashboard/applications`}>{dict.nav.side.applications}</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/${lang}/dashboard/billing`}>{dict.nav.side.billing}</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/${lang}/dashboard/settings`}>{dict.nav.side.settings}</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={async (event) => {
            event.preventDefault()
            await logout()
            // This forces a cache invalidation.
            router.refresh()
            router.push(`/${lang}/login`)
          }}
        >
          {dict.nav.side.signOut}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
