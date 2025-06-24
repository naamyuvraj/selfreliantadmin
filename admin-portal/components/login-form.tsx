"use client"

import type React from "react"

import { useState } from "react"
import { Eye, EyeOff, Mail, Phone, Loader2 } from "lucide-react"
import { GoogleLoginButton } from "./google-login-button"
import { MobileLoginForm } from "./mobile-login-form"
import { ForgotPasswordForm } from "./forgot-password-form"

type LoginMethod = "email" | "mobile" | "forgot"

export function LoginForm() {
  const [loginMethod, setLoginMethod] = useState<LoginMethod>("email")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      if (formData.email === "admin@handicrafts.in" && formData.password === "admin123") {
        alert("Login successful!")
        window.location.href = "/dashboard"
      } else {
        alert("Invalid credentials. Try: admin@handicrafts.in / admin123")
      }
    }, 1500)
  }

  if (loginMethod === "mobile") {
    return (
      <MobileLoginForm onBack={() => setLoginMethod("email")} onSuccess={() => (window.location.href = "/dashboard")} />
    )
  }

  if (loginMethod === "forgot") {
    return <ForgotPasswordForm onBack={() => setLoginMethod("email")} onSuccess={() => setLoginMethod("email")} />
  }

  return (
    <div className="space-y-6">
      {/* Google Login */}
      <GoogleLoginButton />

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>

      {/* Login Method Tabs */}
      <div className="flex rounded-lg bg-gray-100 p-1">
        <button
          type="button"
          onClick={() => setLoginMethod("email")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
            loginMethod === "email" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <Mail className="h-4 w-4" />
          Email
        </button>
        <button
          type="button"
          onClick={() => setLoginMethod("mobile")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
            loginMethod === "mobile" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <Phone className="h-4 w-4" />
          Mobile
        </button>
      </div>

      {/* Email Login Form */}
      <form onSubmit={handleEmailLogin} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="admin@handicrafts.in"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#608C44] focus:border-[#608C44]"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#608C44] focus:border-[#608C44]"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input type="checkbox" className="h-4 w-4 text-[#608C44] focus:ring-[#608C44] border-gray-300 rounded" />
            <span className="ml-2 text-sm text-gray-600">Remember me</span>
          </label>
          <button
            type="button"
            onClick={() => setLoginMethod("forgot")}
            className="text-sm text-[#608C44] hover:text-[#608C44]/80"
          >
            Forgot password?
          </button>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#608C44] hover:bg-[#608C44]/90 text-white py-2 px-4 rounded-md font-medium transition-colors disabled:opacity-50"
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin inline-block" />}
          Sign In
        </button>
      </form>

      <div className="text-center text-sm text-gray-600">Demo credentials: admin@handicrafts.in / admin123</div>
    </div>
  )
}
