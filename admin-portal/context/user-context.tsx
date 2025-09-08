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
  const [loading, setLoading] = useState(true);

  const createUserIfNotExists = async (user: User) => {
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
  };

  const hasFetchedSession = useRef(false);

  useEffect(() => {
    if (hasFetchedSession.current) return;
    hasFetchedSession.current = true;

    const init = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      setSession(sessionData.session);
      const currentUser = sessionData.session?.user ?? null;
      setUser(currentUser);
      setLoading(false);

      if (currentUser) await createUserIfNotExists(currentUser);
    };

    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      const u = session?.user ?? null;
      setUser(u);
      setLoading(false);
      if (_event === "SIGNED_IN" && u) {
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
