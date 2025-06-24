"use client"

import { useEffect, useState } from "react"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { supabase } from "@/lib/supabaseClient"

interface SalesData {
  name: string // e.g., "Jan"
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

  useEffect(() => {
    const fetchMonthlySales = async () => {
      const currentYear = new Date().getFullYear()

      const { data: orders, error } = await supabase
        .from("orders")
        .select("total, created_at")
        .gte("created_at", `${currentYear}-01-01`)
        .lte("created_at", `${currentYear}-12-31`)

      if (error) {
        console.error("Error fetching sales:", error)
        return
      }

      // Initialize monthly totals
      const monthlyTotals: number[] = Array(12).fill(0)

      orders?.forEach((order) => {
        const date = new Date(order.created_at)
        const monthIndex = date.getMonth()
        monthlyTotals[monthIndex] += order.total
      })

      const formattedData: SalesData[] = months.map((name, index) => ({
        name,
        total: monthlyTotals[index],
      }))

      setData(formattedData)
    }

    fetchMonthlySales()
  }, [])

  return (
    <div className={`${className} bg-white p-4 rounded-lg border border-gray-200 shadow-sm`}>
      <div className="pb-2 sm:pb-4">
        <h3 className="text-base sm:text-lg font-medium">Sales Overview</h3>
        <p className="text-xs sm:text-sm text-gray-500">Monthly sales performance for the current year</p>
      </div>
      <div className="h-[250px] sm:h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 10, left: 10, bottom: 0 }}
          >
            <XAxis dataKey="name" stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
            <YAxis
              stroke="#888888"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tickFormatter={formatIndianCurrency}
            />
            <Tooltip
              formatter={(value: number) => [formatIndianCurrency(value), "Sales"]}
              labelStyle={{ color: "#333" }}
            />
            <Line
              type="monotone"
              dataKey="total"
              stroke="#608C44"
              strokeWidth={2}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
