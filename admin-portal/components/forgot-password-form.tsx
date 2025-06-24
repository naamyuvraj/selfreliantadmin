"use client"

import type React from "react"

import { useState } from "react"
import { ArrowLeft, Loader2, CheckCircle } from "lucide-react"

interface ForgotPasswordFormProps {
  onBack: () => void
  onSuccess: () => void
}

export function ForgotPasswordForm({ onBack, onSuccess }: ForgotPasswordFormProps) {
  const [step, setStep] = useState<"email" | "sent" | "reset">("email")
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [resetCode, setResetCode] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleSendResetLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate sending reset email
    setTimeout(() => {
      setIsLoading(false)
      setStep("sent")
    }, 1500)
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate code verification
    setTimeout(() => {
      setIsLoading(false)
      if (resetCode === "123456") {
        setStep("reset")
      } else {
        alert("Invalid reset code. Try: 123456")
      }
    }, 1500)
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      alert("Passwords don't match")
      return
    }

    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters")
      return
    }

    setIsLoading(true)

    // Simulate password reset
    setTimeout(() => {
      setIsLoading(false)
      alert("Password reset successful!")
      onSuccess()
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button type="button" onClick={onBack} className="p-1 hover:bg-gray-100 rounded-md">
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Reset Password</h2>
          <p className="text-sm text-gray-600">
            {step === "email" && "Enter your email to receive reset instructions"}
            {step === "sent" && "Check your email for reset code"}
            {step === "reset" && "Create a new password"}
          </p>
        </div>
      </div>

      {step === "email" && (
        <form onSubmit={handleSendResetLink} className="space-y-4">
          <div>
            <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="reset-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#608C44] focus:border-[#608C44]"
              required
            />
            <p className="text-xs text-gray-500 mt-1">We'll send you a reset code to this email address</p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#608C44] hover:bg-[#608C44]/90 text-white py-2 px-4 rounded-md font-medium transition-colors disabled:opacity-50"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin inline-block" />}
            Send Reset Code
          </button>
        </form>
      )}

      {step === "sent" && (
        <div className="space-y-4">
          <div className="text-center py-4">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Check Your Email</h3>
            <p className="text-sm text-gray-600 mb-4">
              We've sent a 6-digit reset code to
              <br />
              <strong>{email}</strong>
            </p>
          </div>

          <form onSubmit={handleVerifyCode} className="space-y-4">
            <div>
              <label htmlFor="reset-code" className="block text-sm font-medium text-gray-700 mb-1">
                Reset Code
              </label>
              <input
                type="text"
                id="reset-code"
                value={resetCode}
                onChange={(e) => setResetCode(e.target.value)}
                placeholder="Enter 6-digit code"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#608C44] focus:border-[#608C44] text-center text-lg font-mono"
                maxLength={6}
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#608C44] hover:bg-[#608C44]/90 text-white py-2 px-4 rounded-md font-medium transition-colors disabled:opacity-50"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin inline-block" />}
              Verify Code
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setStep("email")}
                className="text-sm text-[#608C44] hover:text-[#608C44]/80"
              >
                Didn't receive code? Try again
              </button>
            </div>

            <div className="text-center text-sm text-gray-600">Demo reset code: 123456</div>
          </form>
        </div>
      )}

      {step === "reset" && (
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div>
            <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              id="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#608C44] focus:border-[#608C44]"
              minLength={6}
              required
            />
          </div>

          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#608C44] focus:border-[#608C44]"
              minLength={6}
              required
            />
          </div>

          <div className="text-xs text-gray-500 space-y-1">
            <p>Password requirements:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>At least 6 characters long</li>
              <li>Must match confirmation password</li>
            </ul>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#608C44] hover:bg-[#608C44]/90 text-white py-2 px-4 rounded-md font-medium transition-colors disabled:opacity-50"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin inline-block" />}
            Reset Password
          </button>
        </form>
      )}
    </div>
  )
}
