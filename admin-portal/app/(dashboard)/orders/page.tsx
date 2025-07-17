"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/context/user-context";

interface Order {
  id: string;
  price: number;
  created_at: string;
  order_id: {
    status: string;
    customer_id: {
      name: string;
      email: string;
    };
  };
  product_id: {
    id: string;
    name: string;
    image_urls: string[];
    user_id: string;
    price: number;
  };
}

export default function AdminOrdersTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const { user } = useAuth(); // ✅ Get current admin user

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return; // Wait until auth is loaded

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
            id,
            name,
            image_urls,
            user_id,
            price
          )
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching orders:", error.message);
      } else {
        // ✅ Filter to only include orders where product_id.user_id === logged in admin
        const filtered = data.filter(
          (order: Order) => order.product_id?.user_id === user.id
        );
        setOrders(filtered);
      }

      setLoading(false);
    };

    fetchOrders();
  }, [user]);

  const filteredOrders =
    statusFilter === "all"
      ? orders
      : orders.filter((order) => order.order_id.status === statusFilter);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
        <h2 className="text-xl font-semibold">My Orders</h2>
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
                  <p className="text-sm font-medium text-gray-900">
                    {order.id}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                    order.order_id.status
                  )}`}
                >
                  {order.order_id.status}
                </span>
              </div>

<div>
  <p className="text-sm text-gray-600">Customer:</p>
  <p className="font-medium text-sm">
    {order.order_id.customer_id?.name ?? "Unknown"}
  </p>
  <p className="text-xs text-gray-500">
    {order.order_id.customer_id?.email ?? "No email"}
  </p>
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
                  ₹{order.price}
                </p>
              </div>

              {order.product_id?.image_urls?.[0] && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Product:</p>
                  <Image
                    src={order.product_id.image_urls[0]}
                    alt={order.product_id.name}
                    width={64}
                    height={64}
                    className="w-16 h-16 rounded object-cover border"
                  />
                  <p className="text-sm mt-1">{order.product_id.name}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
