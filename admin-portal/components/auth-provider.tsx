"use client"

import { AuthProvider } from "@/context/user-context"

export default function ClientAuthProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return <AuthProvider>{children}</AuthProvider>
}
