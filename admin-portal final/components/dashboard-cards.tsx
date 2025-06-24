"use client";

import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  ArrowDownRight,
  IndianRupee,
  Users,
  ShoppingBag,
  Package,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/context/user-context"; // your custom context

export function DashboardCards() {
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();
  const [stats, setStats] = useState({
    revenue: 0,
    totalOrders: 0,
    inventoryCount: 0,
    lowStockCount: 0,
  });

  useEffect(() => {
    if (!user) return;
    setLoading(true);
const fetchSellerStats = async () => {
  try {
    const [orderItemsRes, inventoryRes] = await Promise.all([
      supabase
        .from("order_items")
        .select(`
          order_id,
          price,
          quantity,
          inventory (
            user_id
          )
        `)
        .eq("inventory.user_id", user.id),

      supabase
        .from("inventory")
        .select("quantity")
        .eq("user_id", user.id),
    ]);

    const orderItems = orderItemsRes.data || [];
    const inventory = inventoryRes.data || [];

    const revenue = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const uniqueOrderIds = new Set(orderItems.map((item) => item.order_id));
    const totalOrders = uniqueOrderIds.size;

    const inventoryCount = inventory.length;
    const lowStockCount = inventory.filter((i) => i.quantity < 10).length;

    setStats({
      revenue,
      totalOrders,
      inventoryCount,
      lowStockCount,
    });
  } catch (err) {
    console.error("Error fetching dashboard stats:", err);
  } finally {
    setLoading(false);
  }
};

    fetchSellerStats();
  }, [user]);

  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      <DashboardCard
        title="Total Revenue"
        value={`₹${stats.revenue.toLocaleString()}`}
        icon={<IndianRupee className="h-4 w-4 text-[#C87355]" />}
        // growth="+20.1%"
        note="This month"
        loading={loading}
      />
      <DashboardCard
        title="Total Orders"
        value={`${stats.totalOrders}`}
        icon={<ShoppingBag className="h-4 w-4 text-[#608C44]" />}
        // growth="+10.2%"
        note="Placed by customers"
        loading={loading}
      />
      <DashboardCard
        title="Inventory Items"
        value={`${stats.inventoryCount}`}
        icon={<Package className="h-4 w-4 text-[#C87355]" />}
        // growth={`-${stats.lowStockCount}`}
        note="Low stock"
        negative
        loading={loading}
      />
      <DashboardCard
        title="Low Stock"
        value={`${stats.lowStockCount}`}
        icon={<Package className="h-4 w-4 text-red-500" />}
        // growth=""
        note="Below 10 Qty."
        negative
        loading={loading}
      />
    </div>
  );
}

function DashboardCard({
  title,
  value,
  icon,
  // growth,
  note,
  negative = false,
  loading,
}) {
  const ArrowIcon = negative ? ArrowDownRight : ArrowUpRight;

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm animate-in fade-in duration-300">
      <div className="flex justify-between items-center pb-2">
        <h3 className="text-xs sm:text-sm font-medium">{title}</h3>
        {icon}
      </div>
      <div>
        {loading ? (
          <div className="h-6 bg-gray-200 rounded w-24 mb-1 animate-pulse" />
        ) : (
          <div className="text-xl sm:text-2xl font-bold">{value}</div>
        )}
        <div className="text-xs text-gray-500">
          {loading ? (
            <div className="h-4 bg-gray-100 rounded w-32 animate-pulse mt-1" />
          ) : (
             (
              <span
                className={`flex items-center ${
                  negative ? "text-red-500" : "text-[#608C44]"
                }`}
              >
                {/* {growth} <ArrowIcon className="ml-1 h-3 w-3 sm:h-4 sm:w-4" /> */}
              </span>
            )
          )}
          {!loading && note && ` ${note}`}
        </div>
      </div>
    </div>
  );
}
