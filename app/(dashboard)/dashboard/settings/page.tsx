"use client"

import { useState, useEffect } from 'react';
import { redirect } from "next/navigation"
import { getCurrentUser, User } from "@/lib/api/session"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"
import { UserForm } from "@/components/user-form"

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        redirect("/login");
      } else {
        setUser(currentUser);
      }
    };

    fetchUser();
  }, []);

  if (!user) {
    return null; // or a loading spinner
  }

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