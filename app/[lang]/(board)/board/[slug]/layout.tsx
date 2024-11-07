"use client"
import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { User, getCurrentUser } from "@/lib/api/session"
import Loading from "../../../loading"
interface boardLayoutProps {
    children: React.ReactNode
    params: {
      lang: Locale
    }
  }
  
  export default function BoardLayout({ children, params: { lang } }: boardLayoutProps) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [dict, setDict] = useState<Record<string, any> | null>(null)
    const router = useRouter()
    const searchParams = useSearchParams()
    const refreshToken = searchParams.get("refresh_token")
    const noRedirect = searchParams.get("noredirect")
    const mode = searchParams.get("mode")
    const eType = searchParams.get("eType")

  
    if (isLoading) {
      return <Loading />
    } 
    if (user){

    } else {
      return <div className="min-h-screen">{children}</div>
  }
}
  