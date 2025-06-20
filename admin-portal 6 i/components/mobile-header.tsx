"use client"

import { Menu, Bell, User, X } from "lucide-react"
import { useState } from "react"
import { AdminSidebar } from "./admin-sidebar"

export function MobileHeader() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-30 flex h-14 md:h-16 items-center gap-4 border-b bg-[#C87355] px-4 md:hidden">
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden bg-transparent border border-white text-white hover:bg-[#C87355]/90 h-8 w-8 rounded-md flex items-center justify-center"
      >
        <Menu className="h-4 w-4" />
        <span className="sr-only">Toggle Menu</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50">
          <div className="fixed inset-y-0 left-0 w-[280px] sm:w-[300px] bg-[#333333] shadow-lg">
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <span className="text-white font-semibold">Menu</span>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-gray-800 h-8 w-8 rounded-md flex items-center justify-center"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <AdminSidebar />
          </div>
        </div>
      )}

      <div className="flex-1">
        <h1 className="text-white font-semibold text-sm truncate">Handicrafts Admin</h1>
      </div>

      <div className="flex items-center gap-1">
        <button className="text-white hover:bg-[#C87355]/90 h-8 w-8 rounded-md flex items-center justify-center">
          <Bell className="h-4 w-4" />
          <span className="sr-only">Notifications</span>
        </button>
        <button className="text-white hover:bg-[#C87355]/90 h-8 w-8 rounded-md flex items-center justify-center">
          <User className="h-4 w-4" />
          <span className="sr-only">Profile</span>
        </button>
      </div>
    </header>
  )
}
