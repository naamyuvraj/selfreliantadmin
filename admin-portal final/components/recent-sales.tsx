"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

interface Sale {
  id: string
  total: number
  created_at: string
  customers: {
    name: string
    email: string
  }
}

export function RecentSales({ className }: { className?: string }) {
  const [sales, setSales] = useState<Sale[]>([])

  useEffect(() => {
    const fetchSales = async () => {
      const { data, error } = await supabase
        .from("orders") // or "order_items" depending on your schema
        .select(
          `
          id,
          total,
          created_at,
          customers (
            name,
            email
          )
        `
        )
        .order("created_at", { ascending: false })
        .limit(5)

      if (error) {
        console.error("Error fetching sales:", error.message)
      } else {
        setSales(data as Sale[])
      }
    }

    fetchSales()
  }, [])

  return (
    <div className={`${className} bg-white p-4 rounded-lg border border-gray-200 shadow-sm`}>
      <div className="pb-2 sm:pb-4">
        <h3 className="text-base sm:text-lg font-medium">Recent Sales</h3>
        <p className="text-xs sm:text-sm text-gray-500">
          You made {sales.length} sales this month
        </p>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {sales.map((sale) => {
          const initials = sale.customers?.name
            ?.split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()

          return (
            <div key={sale.id} className="flex items-center">
              <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-xs">{initials || "??"}</span>
              </div>
              <div className="ml-3 sm:ml-4 space-y-1 flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium leading-none truncate">
                  {sale.customers?.name || "Unknown"}
                </p>
                <p className="text-xs text-gray-500 truncate">{sale.customers?.email}</p>
              </div>
              <div className="ml-auto font-medium text-xs sm:text-sm">+₹{sale.total}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
