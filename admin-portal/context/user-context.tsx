// context/UserContext.tsx
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { supabase } from "@/lib/supabaseClient";
import type { Session, User } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
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
  const [loading, setLoading] = useState(!initialSession);

  const createUserIfNotExists = async (user: User) => {
    const { data, error } = await supabase
      .from("users")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();

    if (!data) {
      const { error: insertError } = await supabase.from("users").upsert({
        id: user.id,
        name: user.user_metadata?.full_name || "",
        phone: "",
        address: "",
        bio: "",
      });

      if (insertError) {
        console.error("❌ Failed to insert user:", insertError.message);
      }
    }
  };

  useEffect(() => {
    const init = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const currentUser = sessionData.session?.user ?? null;
      setUser(currentUser);
      setLoading(false);

      if (currentUser) await createUserIfNotExists(currentUser);
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const u = session?.user ?? null;
        setUser(u);
        setLoading(false);
        if (u) await createUserIfNotExists(u);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
