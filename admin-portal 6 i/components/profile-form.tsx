"use client"

import { useState, useEffect } from "react"
import { Loader2, User } from "lucide-react"
import { supabase } from "@/lib/supabaseClient"
import { useAuth } from "@/context/user-context"

export function ProfileForm() {
  const { user, loading: userLoading } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    bio: "",
  })

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return

const { data, error } = await supabase
  .from("users")
  .select("*")
  .eq("id", user.id)
  .maybeSingle() // ✅ safer than .single()

      if (error) {
        console.error("Error fetching profile:", error.message)
      } else {
        setFormData({
          name: data.name || "",
          email: user.email || "",
          phone: data.phone || "",
          address: data.address || "",
          bio: data.bio || "",
        })
      }

      setIsLoading(false)
    }

    if (!userLoading && user) fetchProfile()
  }, [user, userLoading])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setIsSubmitting(true)

    const { error } = await supabase
      .from("users")
      .upsert({
        id: user.id,
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        bio: formData.bio,
      })

    setIsSubmitting(false)

    if (error) {
      console.error("Update error:", error.message)
      alert("Failed to update profile.")
    } else {
      alert("Profile updated successfully!")
    }
  }

  if (isLoading) return <div>Loading profile...</div>

  return (
    <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-3">
      {/* Sidebar with Avatar */}
      <div className="lg:col-span-1 bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex flex-col items-center gap-3 sm:gap-4">
          <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-gray-200 flex items-center justify-center">
            <User className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
          </div>
          <div className="text-center">
            <h3 className="text-base sm:text-lg font-medium">{formData.name}</h3>
            <p className="text-xs sm:text-sm text-gray-500">Store Owner</p>
          </div>
          <button className="w-full border border-[#608C44]/50 hover:border-[#608C44] hover:text-[#608C44] text-sm px-4 py-2 rounded-md">
            Change Avatar
          </button>
        </div>
      </div>

      {/* Profile Form */}
      <div className="lg:col-span-2 bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#608C44] focus:border-[#608C44]"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email (read-only)
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                readOnly
                className="w-full bg-gray-100 px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm resize-none"
              rows={3}
            />
          </div>

          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm resize-none"
              rows={3}
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#608C44] hover:bg-[#608C44]/90 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin inline-block" />}
              Update Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
