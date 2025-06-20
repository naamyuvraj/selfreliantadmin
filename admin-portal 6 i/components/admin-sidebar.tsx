"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  Package,
  PlusCircle,
  Settings,
  ShoppingBag,
  Users,
  Home,
  LogOut,
  MessageSquare,
  Mail,
} from "lucide-react"

const sidebarNavItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: BarChart3,
  },
  {
    title: "Add Product",
    href: "/products/add",
    icon: PlusCircle,
  },
  {
    title: "Inventory",
    href: "/products/inventory",
    icon: Package,
  },
  {
    title: "Orders",
    href: "/orders",
    icon: ShoppingBag,
  },
  {
    title: "Customers",
    href: "/customers",
    icon: Users,
  },
  {
    title: "Messages",
    href: "/messages",
    icon: MessageSquare,
  },
  {
    title: "Contact Inquiries",
    href: "/contact",
    icon: Mail,
  },
  {
    title: "Profile",
    href: "/profile",
    icon: Settings,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="admin-sidebar w-full h-full md:w-64 lg:w-72">
      <div className="flex h-full flex-col">
        <div className="flex h-14 md:h-16 items-center border-b border-gray-700 px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold text-white">
            <Home className="h-5 w-5 md:h-6 md:w-6 text-[#C87355]" />
            <span className="text-base md:text-lg">Handicrafts Admin</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-2 md:px-4 text-sm font-medium">
            {sidebarNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-3 md:py-2 transition-all hover:text-[#C2925E] text-sm md:text-sm ${
                  pathname === item.href
                    ? "bg-[#608C44]/20 text-[#608C44] border-l-4 border-[#608C44]"
                    : "text-gray-300 hover:bg-gray-800 hover:text-[#C87355]"
                }`}
              >
                <item.icon className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{item.title}</span>
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-2 md:p-4">
          <button className="w-full flex items-center justify-start px-3 py-2 text-sm text-gray-300 hover:text-[#C87355] border border-gray-700 hover:border-[#C87355] rounded-md">
            <LogOut className="mr-2 h-4 w-4 flex-shrink-0" />
            <span className="truncate">Log out</span>
          </button>
        </div>
      </div>
    </div>
  )
}
