"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  { name: "Jan", total: 24000 },
  { name: "Feb", total: 13980 },
  { name: "Mar", total: 98000 },
  { name: "Apr", total: 39080 },
  { name: "May", total: 48000 },
  { name: "Jun", total: 38000 },
  { name: "Jul", total: 43000 },
  { name: "Aug", total: 53000 },
  { name: "Sep", total: 49000 },
  { name: "Oct", total: 63000 },
  { name: "Nov", total: 54000 },
  { name: "Dec", total: 78000 },
]

const formatIndianCurrency = (value: number) => {
  if (value >= 10000000) {
    return `₹${(value / 10000000).toFixed(1)}Cr`
  } else if (value >= 100000) {
    return `₹${(value / 100000).toFixed(1)}L`
  } else if (value >= 1000) {
    return `₹${(value / 1000).toFixed(1)}K`
  }
  return `₹${value}`
}

export function SalesChart({ className }: { className?: string }) {
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
            margin={{
              top: 5,
              right: 10,
              left: 10,
              bottom: 0,
            }}
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
            <Line type="monotone" dataKey="total" stroke="#608C44" strokeWidth={2} activeDot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
