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
  const initAuth = async () => {
    const url = new URL(window.location.href);
    const hasCode = url.searchParams.get("code");
    const hasProvider = url.searchParams.get("provider");

    // ✅ Step 1: Handle OAuth code exchange
    if (hasCode && hasProvider) {
      const { error } = await supabase.auth.exchangeCodeForSession();
      if (error) {
        console.error("❌ Failed to exchange code for session:", error.message);
      } else {
        // Clean URL after exchange
        const cleanUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, "", cleanUrl);
      }
    }

    // ✅ Step 2: Get current session
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error("Error getting session:", error.message);
    }
    const sessionUser = data.session?.user ?? null;
    setUser(sessionUser);
    setLoading(false);

    if (sessionUser) {
      await createUserIfNotExists(sessionUser);
    }
  };

  initAuth();

  const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
    const sessionUser = session?.user ?? null;
    setUser(sessionUser);
    setLoading(false);

    if (sessionUser) {
      await createUserIfNotExists(sessionUser);
    }
  });

  return () => {
    listener.subscription.unsubscribe();
  };
}, []);
console.log("AuthProvider initialized", { user, loading });
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
