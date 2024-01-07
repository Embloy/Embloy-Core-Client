"use client"

import { redirect } from "next/navigation"
import { useEffect, useState } from 'react';
import { getCurrentUser, User } from "@/lib/api/session"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"
import { UserNameForm } from "@/components/user-name-form"

export default async function SettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getCurrentUser();
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

  if (!user) {
    redirect("/login");
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Settings"
        text="Manage account and website settings."
      />
      <div className="grid gap-10">
        <UserNameForm user={{ id: user.id, first_name: user.first_name, last_name:  user.last_name }} />
      </div>
    </DashboardShell>
  )
}
