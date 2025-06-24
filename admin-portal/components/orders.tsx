"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { format } from "date-fns"
import { Loader2 } from "lucide-react"

interface Order {
  id: string
  total: number
  created_at: string
  status: string
  customer: {
    name: string
    email: string
  }
}

export default function AdminOrdersTable() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          id,
          total,
          created_at,
          status,
          customers (
            name,
            email
          )
        `)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching orders:", error.message)
      } else {
        const formatted = data.map((o) => ({
          id: o.id,
          amount: o.total,
          created_at: o.created_at,
          status: o.status,
          customer: o.customers,
        }))
        setOrders(formatted)
      }
      setLoading(false)
    }

    fetchOrders()
  }, [])

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
      <h2 className="text-xl font-semibold mb-4">All Orders</h2>

      {loading ? (
        <div className="flex justify-center items-center h-40 text-gray-500">
          <Loader2 className="animate-spin h-6 w-6 mr-2" />
          Loading orders...
        </div>
      ) : orders.length === 0 ? (
        <p className="text-center text-gray-500">No orders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-4 py-2 font-medium text-gray-700">Order ID</th>
                <th className="text-left px-4 py-2 font-medium text-gray-700">Customer</th>
                <th className="text-left px-4 py-2 font-medium text-gray-700">Amount</th>
                <th className="text-left px-4 py-2 font-medium text-gray-700">Date</th>
                <th className="text-left px-4 py-2 font-medium text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-gray-800">{order.id}</td>
                  <td className="px-4 py-2">
                    <div className="font-medium">{order.customer.name}</div>
                    <div className="text-gray-500 text-xs">{order.customer.email}</div>
                  </td>
                  <td className="px-4 py-2 font-semibold text-green-700">₹{order.total}</td>
                  <td className="px-4 py-2 text-gray-600">
                    {format(new Date(order.created_at), "dd MMM yyyy")}
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        order.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : order.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
