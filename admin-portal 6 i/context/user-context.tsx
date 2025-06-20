"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import type { User } from "@supabase/supabase-js"

interface AuthContextType {
  user: User | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true })

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Initial session fetch
    const getSession = async () => {
        
      const { data, error } = await supabase.auth.getSession()
      if (error) {
        console.error("Error getting session:", error.message)
      }
      const sessionUser = data.session?.user ?? null
      setUser(sessionUser)
      setLoading(false)

      if (sessionUser) {
        await createUserIfNotExists(sessionUser)
      }
      console.log("Session User:", sessionUser)

    }

    getSession()

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const sessionUser = session?.user ?? null
      setUser(sessionUser)
      setLoading(false)

      if (sessionUser) {
        await createUserIfNotExists(sessionUser)
      }
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  // Auto-insert user profile
  const createUserIfNotExists = async (user: User) => {
    const { data, error } = await supabase
      .from("users")
      .select("id")
      .eq("id", user.id)
      .maybeSingle()

    if (!data) {
      const { error: insertError } = await supabase.from("users").upsert({
  id: user.id,
  name: user.user_metadata?.full_name || "",
  phone: "",
  address: "",
  bio: "",
})


      if (insertError) {
        console.error("❌ Failed to insert user into 'users' table:", insertError.message)
      } else {
        console.log("✅ User inserted into 'users' table")
      }
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
