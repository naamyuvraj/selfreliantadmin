"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { format } from "date-fns"
import { Loader2 } from "lucide-react"
import Image from "next/image"

interface Order {
  id: string
  total: number
  created_at: string
  status: string
  customers: {
    name: string
    email: string
  }
  order_items: {
    inventory: {
      name: string
      image_urls: string[]
    }
  }[]
}

export default function AdminOrdersTable() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState("all")

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
          ),
          order_items (
            inventory (
              name,
              image_urls
            )
          )
        `)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching orders:", error.message)
      } else {
        setOrders(data)
      }

      setLoading(false)
    }

    fetchOrders()
  }, [])

  const filteredOrders =
    statusFilter === "all"
      ? orders
      : orders.filter((order) => order.status === statusFilter)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
        <h2 className="text-xl font-semibold">All Orders</h2>
        <select
          className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40 text-gray-500">
          <Loader2 className="animate-spin h-6 w-6 mr-2" />
          Loading orders...
        </div>
      ) : filteredOrders.length === 0 ? (
        <p className="text-center text-gray-500">No orders found.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-xl border shadow-sm p-4 space-y-3"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-600">Order ID:</p>
                  <p className="text-sm font-medium text-gray-900">{order.id}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
              </div>

              <div>
                <p className="text-sm text-gray-600">Customer:</p>
                <p className="font-medium text-sm">{order.customers.name}</p>
                <p className="text-xs text-gray-500">{order.customers.email}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Date:</p>
                <p className="text-sm text-gray-800">
                  {format(new Date(order.created_at), "dd MMM yyyy")}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Amount:</p>
                <p className="text-green-700 font-semibold text-base">
                  ₹{order.total}
                </p>
              </div>

              {Array.isArray(order.order_items) && order.order_items.length > 0 && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Products:</p>
                  <div className="flex gap-2 overflow-x-auto">
                    {order.order_items.map((item, index) =>
                      item.inventory?.image_urls?.[0] ? (
                        <Image
                          key={index}
                          src={item.inventory.image_urls[0]}
                          alt={item.inventory.name}
                          width={64}
                          height={64}
                          className="w-16 h-16 rounded object-cover border"
                        />
                      ) : (
                        <div
                          key={index}
                          className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-600"
                        >
                          No Image
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
