// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientAuthProvider from "@/components/auth-provider";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import type { Session } from "@supabase/auth-helpers-nextjs";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Handicraft Admin Portal",
  description: "Admin portal for managing handicraft e-commerce website",
  generator: "v0.dev",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // ✅ Create Supabase server client from cookies
  const supabase = createServerComponentClient({ cookies });

  // ✅ Get current session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50`}>
        {/* ✅ Pass initialSession to ClientAuthProvider */}
        <ClientAuthProvider initialSession={session}>
          {children}
        </ClientAuthProvider>
      </body>
    </html>
  );
}
