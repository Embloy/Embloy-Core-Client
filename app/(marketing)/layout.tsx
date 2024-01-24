"use client"

import { dashboardConfig } from "@/config/dashboard"
import { useEffect, useState } from 'react';
import { getCurrentUser, User } from '@/lib/api/session';
import { UserAccountNav } from "@/components/user-account-nav"

import Link from "next/link"
import { useSearchParams } from "next/navigation";
import { marketingConfig } from "@/config/marketing"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { MainNav } from "@/components/main-nav"
import { SiteFooter } from "@/components/site-footer"


interface MarketingLayoutProps {
  children: React.ReactNode
}

export default function MarketingLayout({children }: MarketingLayoutProps) {

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const refreshToken = useSearchParams().get('refresh_token');

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getCurrentUser(refreshToken ?? undefined);
      setIsLoading(false);
      if (currentUser) {
        setUser(currentUser);
      }
    };

    fetchUser();
  }, []);

  if (isLoading) {
    // You can return a loading spinner here
    return null;
  }

  if (user) {
    return (
      <div className="flex min-h-screen flex-col space-y-6">
        <header className="sticky top-0 z-40 border-b bg-background">
          <div className="container flex h-16 items-center justify-between py-4">
            <MainNav items={dashboardConfig.mainNav} />
            <UserAccountNav
              user={{
                first_name: `${user.first_name}`,
                last_name: `${user.last_name}`,
                image_url: user.image_url,
                email: user.email,
              }}
            />
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <SiteFooter className="border-t" />
      </div>
    )
  } else {
    return (
      <div className="flex min-h-screen flex-col">
        <header className="container z-40 bg-background">
          <div className="flex h-20 items-center justify-between py-6">
            <MainNav items={marketingConfig.mainNav} />
            <nav>
              <Link
                href="/login"
                className={cn(
                  buttonVariants({ variant: "secondary", size: "sm" }),
                  "px-4"
                )}
              >
                Login
              </Link>
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </div>
    )
  }
}
