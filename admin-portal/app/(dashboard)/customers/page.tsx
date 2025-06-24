"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { format } from "date-fns"
import { Loader2 } from "lucide-react"

interface Customer {
  id: string
  name: string
  email: string
  created_at: string
}

export default function CustomersTable() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCustomers = async () => {
      const { data, error } = await supabase
        .from("customers")
        .select("id, name, email, created_at")
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching customers:", error.message)
      } else {
        setCustomers(data)
      }
      setLoading(false)
    }

    fetchCustomers()
  }, [])

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
      <h2 className="text-xl font-semibold mb-4">Registered Customers</h2>

      {loading ? (
        <div className="flex justify-center items-center h-40 text-gray-500">
          <Loader2 className="animate-spin h-6 w-6 mr-2" />
          Loading customers...
        </div>
      ) : customers.length === 0 ? (
        <p className="text-center text-gray-500">No customers found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-4 py-2 font-medium text-gray-700">Name</th>
                <th className="text-left px-4 py-2 font-medium text-gray-700">Email</th>
                <th className="text-left px-4 py-2 font-medium text-gray-700">Registered On</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-gray-800">{customer.name}</td>
                  <td className="px-4 py-2 text-gray-600">{customer.email}</td>
                  <td className="px-4 py-2 text-gray-500">
                    {format(new Date(customer.created_at), "dd MMM yyyy")}
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
