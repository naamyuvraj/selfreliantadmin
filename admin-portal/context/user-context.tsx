"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  type ReactNode,
} from "react";
import { supabase } from "@/lib/supabaseClient";
import type { Session, User } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
});

export const AuthProvider = ({
  children,
  initialSession,
}: {
  children: ReactNode;
  initialSession?: Session | null;
}) => {
  const [user, setUser] = useState<User | null>(initialSession?.user ?? null);
  const [session, setSession] = useState<Session | null>(initialSession ?? null);
  const [loading, setLoading] = useState(false); // ✅ no need to wait if initialSession exists

  const createUserIfNotExists = async (user: User) => {
    try {
      const { data } = await supabase
        .from("users")
        .select("id")
        .eq("id", user.id)
        .maybeSingle();

      if (!data) {
        const { error } = await supabase.from("users").insert({
          id: user.id,
          name: user.user_metadata?.full_name || "",
          phone: "",
          address: "",
          bio: "",
        });
        if (error) console.error("❌ Failed to insert user:", error.message);
      }
    } catch (err) {
      console.error("❌ Error checking user:", err);
    }
  };

  // ✅ Handle auth state changes
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      const u = session?.user ?? null;
      setUser(u);
      setLoading(false);

      // ✅ only create user on new sign in
      if (event === "SIGNED_IN" && u) {
        await createUserIfNotExists(u);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, session, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
