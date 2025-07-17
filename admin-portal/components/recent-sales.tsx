"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useAuth } from "@/context/user-context"
import { format } from "date-fns"

interface Sale {
  id: string
  price: number
  created_at: string
  order_id: {
    status: string
    customer_id: {
      name: string
      email: string
    }
  }
  product_id: {
    name: string
    user_id: string
  }
}

export function RecentSales({ className }: { className?: string }) {
  const [sales, setSales] = useState<Sale[]>([])
  const { user } = useAuth()

  useEffect(() => {
    const fetchSales = async () => {
      if (!user) return

      const { data, error } = await supabase
        .from("order_items")
        .select(`
          id,
          price,
          created_at,
          order_id (
            status,
            customer_id (
              name,
              email
            )
          ),
          product_id (
            name,
            user_id
          )
        `)
        .order("created_at", { ascending: false })
        .limit(10)

      if (error) {
        console.error("Error fetching sales:", error.message)
        return
      }

      // Filter sales by the current seller
      const filtered = (data || []).filter(
        (sale: Sale) => sale.product_id?.user_id === user.id
      )

      setSales(filtered)
    }

    fetchSales()
  }, [user])

  return (
    <div className={`${className} bg-white p-4 rounded-lg border border-gray-200 shadow-sm`}>
      <h3 className="text-base sm:text-lg font-semibold mb-2">Recent Sales</h3>

      {sales.length === 0 ? (
        <p className="text-sm text-gray-500">No recent sales found.</p>
      ) : (
        <div className="overflow-auto">
          <table className="min-w-full text-sm border border-gray-200">
            <thead className="bg-gray-50 text-gray-600 text-left">
              <tr>
                <th className="p-2 border-b">Customer</th>
                <th className="p-2 border-b">Email</th>
                <th className="p-2 border-b">Product</th>
                <th className="p-2 border-b">Status</th>
                <th className="p-2 border-b">Date</th>
                <th className="p-2 border-b">Amount</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {sales.map((sale) => (
                <tr key={sale.id} className="border-t">
                  <td className="p-2">{sale.order_id.customer_id?.name || "Unknown"}</td>
                  <td className="p-2">{sale.order_id.customer_id?.email || "No email"}</td>
                  <td className="p-2">{sale.product_id?.name || "Unknown"}</td>
                  <td className="p-2 capitalize">{sale.order_id.status}</td>
                  <td className="p-2">{format(new Date(sale.created_at), "dd MMM yyyy")}</td>
                  <td className="p-2 font-semibold text-green-700">₹{sale.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
