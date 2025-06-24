"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"

export default function AuthRedirectPage() {
  const router = useRouter()
  const params = useSearchParams()
  const type = params.get("type") // admin or customer

  useEffect(() => {
    const checkRoleAndRedirect = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        alert("Not logged in.")
        return router.push("/login")
      }

      if (type === "admin") {
        const { data: admin } = await supabase
          .from("users")
          .select("id")
          .eq("id", user.id)
          .maybeSingle()

        if (admin) {
          router.push("/dashboard")
        } else {
          alert("Access denied: not an admin.")
          await supabase.auth.signOut()
          router.push("/login")
        }
      } else {
        router.push("/login")
      }
    }

    checkRoleAndRedirect()
  }, [router, type])

  return <p>Redirecting...</p>
}
