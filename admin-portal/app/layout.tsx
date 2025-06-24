import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import ClientAuthProvider from "@/components/auth-provider" // 👈 import wrapper

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Handicraft Admin Portal",
  description: "Admin portal for managing handicraft e-commerce website",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50`}>
        <ClientAuthProvider>{children}</ClientAuthProvider>
      </body>
    </html>
  )
}
