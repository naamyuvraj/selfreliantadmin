"use client"

import { useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"
import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  const router = useRouter()

useEffect(() => {
  const handleAuthRedirect = async () => {
    const url = new URL(window.location.href)
    const hasCode = url.searchParams.get("code")
    const hasProvider = url.searchParams.get("provider")

    if (hasCode && hasProvider) {
      const { data, error } = await supabase.auth.exchangeCodeForSession()

      if (error) {
        console.error("🔴 Failed to exchange auth code:", error.message)
      } else if (data.session) {
        const userId = data.session.user.id

        // Check if user is an admin
        const { data: adminData } = await supabase
          .from("users")
          .select("id")
          .eq("id", userId)
          .maybeSingle()

        if (adminData) {
          console.log("✅ Admin login")
          router.push("/dashboard")
        } else {
          console.warn("🚫 Not an admin — redirecting to buyer platform")
          window.location.href = "https://buyerselfreliant.vercel.app/"
        }
      }
    }
  }

  handleAuthRedirect()
}, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#C87355]/10 to-[#608C44]/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
            <p className="text-sm text-gray-600 mt-2">Sign in to your Handicrafts Admin account</p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
