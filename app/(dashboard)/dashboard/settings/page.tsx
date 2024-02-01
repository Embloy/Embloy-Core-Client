"use client"

import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation"
import { getCurrentUser, User } from "@/lib/api/session"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"
import { UserForm } from "@/components/user-form"
import DashboardSettingsLoading from './loading';

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<Boolean>(true);
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        router.push("/login");
      } else {
        setUser(currentUser);
      }
      setIsLoading(false);
    };

    fetchUser();
  }, [router]);

  if (isLoading) {
    return <DashboardSettingsLoading/>
  }

  if (!user && !isLoading) {
    return null;
  }

  if (user && !isLoading) {
    return (
      <DashboardShell>
        <DashboardHeader
          heading="Settings"
          text="Manage account and website settings."
        />
        <div className="grid gap-10">
          <UserForm user={user} />
        </div>
      </DashboardShell>
    )
}
}