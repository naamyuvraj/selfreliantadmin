"use client"

import { useEffect, useState } from "react"
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { supabase } from "@/lib/supabaseClient"
import { useAuth } from "@/context/user-context";

interface SalesData {
  name: string
  total: number
}

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

const formatIndianCurrency = (value: number) => {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`
  if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`
  return `₹${value}`
}

export function SalesChart({ className }: { className?: string }) {
  const [data, setData] = useState<SalesData[]>([])
  const { user } = useAuth() // 👈 Your logged-in user

  useEffect(() => {
    if (!user?.id) return

    const fetchSellerSales = async () => {
      const currentYear = new Date().getFullYear()

      const { data: items, error } = await supabase
        .from("order_items")
        .select(`
          price,
          created_at,
          product_id (
            user_id
          )
        `)
        .gte("created_at", `${currentYear}-01-01`)
        .lte("created_at", `${currentYear}-12-31`)

      if (error) {
        console.error("Error fetching sales:", error.message)
        return
      }

      // Filter only current seller's items
      const sellerItems = items?.filter(
        (item) => item.product_id?.user_id === user.id
      )

      // Monthly aggregation
      const monthlyTotals = Array(12).fill(0)
      sellerItems?.forEach((item) => {
        const month = new Date(item.created_at).getMonth()
        monthlyTotals[month] += item.price
      })

      const formatted: SalesData[] = months.map((name, i) => ({
        name,
        total: monthlyTotals[i],
      }))

      setData(formatted)
    }

    fetchSellerSales()
  }, [user?.id])

  return (
    <div className={`${className} bg-white p-4 rounded-lg border border-gray-200 shadow-sm`}>
      <div className="pb-2 sm:pb-4">
        <h3 className="text-base sm:text-lg font-medium">Sales Overview</h3>
        <p className="text-xs sm:text-sm text-gray-500">Monthly sales performance for the current year</p>
      </div>
      <div className="h-[250px] sm:h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
            <XAxis dataKey="name" stroke="#888" fontSize={10} tickLine={false} axisLine={false} />
            <YAxis stroke="#888" fontSize={10} tickLine={false} axisLine={false} tickFormatter={formatIndianCurrency} />
            <Tooltip formatter={(val: number) => [formatIndianCurrency(val), "Sales"]} />
            <Line type="monotone" dataKey="total" stroke="#608C44" strokeWidth={2} activeDot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
