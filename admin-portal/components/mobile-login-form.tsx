"use client"

import type React from "react"

import { useState } from "react"
import { ArrowLeft, Loader2 } from "lucide-react"

interface MobileLoginFormProps {
  onBack: () => void
  onSuccess: () => void
}

export function MobileLoginForm({ onBack, onSuccess }: MobileLoginFormProps) {
  const [step, setStep] = useState<"phone" | "otp">("phone")
  const [isLoading, setIsLoading] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [resendTimer, setResendTimer] = useState(0)

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate sending OTP
    setTimeout(() => {
      setIsLoading(false)
      setStep("otp")
      setResendTimer(30)

      // Start countdown
      const interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }, 1500)
  }

  const handleOTPChange = (index: number, value: string) => {
    if (value.length > 1) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      nextInput?.focus()
    }
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    const otpValue = otp.join("")

    if (otpValue.length !== 6) {
      alert("Please enter complete OTP")
      return
    }

    setIsLoading(true)

    // Simulate OTP verification
    setTimeout(() => {
      setIsLoading(false)
      if (otpValue === "123456") {
        alert("Mobile login successful!")
        onSuccess()
      } else {
        alert("Invalid OTP. Try: 123456")
      }
    }, 1500)
  }

  const handleResendOTP = () => {
    if (resendTimer > 0) return

    setResendTimer(30)
    alert("OTP sent successfully!")

    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button type="button" onClick={onBack} className="p-1 hover:bg-gray-100 rounded-md">
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Mobile Login</h2>
          <p className="text-sm text-gray-600">
            {step === "phone" ? "Enter your mobile number" : "Enter the OTP sent to your mobile"}
          </p>
        </div>
      </div>

      {step === "phone" ? (
        <form onSubmit={handleSendOTP} className="space-y-4">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Mobile Number
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                +91
              </span>
              <input
                type="tel"
                id="phone"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="9876543210"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-r-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#608C44] focus:border-[#608C44]"
                pattern="[0-9]{10}"
                maxLength={10}
                required
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">We'll send you an OTP to verify your number</p>
          </div>

          <button
            type="submit"
            disabled={isLoading || phoneNumber.length !== 10}
            className="w-full bg-[#608C44] hover:bg-[#608C44]/90 text-white py-2 px-4 rounded-md font-medium transition-colors disabled:opacity-50"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin inline-block" />}
            Send OTP
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOTP} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Enter 6-digit OTP</label>
            <div className="flex gap-2 justify-center">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  value={digit}
                  onChange={(e) => handleOTPChange(index, e.target.value)}
                  className="w-12 h-12 text-center border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#608C44] focus:border-[#608C44] text-lg font-medium"
                  maxLength={1}
                  pattern="[0-9]"
                />
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">OTP sent to +91 {phoneNumber}</p>
          </div>

          <div className="text-center">
            {resendTimer > 0 ? (
              <p className="text-sm text-gray-500">Resend OTP in {resendTimer}s</p>
            ) : (
              <button
                type="button"
                onClick={handleResendOTP}
                className="text-sm text-[#608C44] hover:text-[#608C44]/80"
              >
                Resend OTP
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#608C44] hover:bg-[#608C44]/90 text-white py-2 px-4 rounded-md font-medium transition-colors disabled:opacity-50"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin inline-block" />}
            Verify OTP
          </button>

          <div className="text-center text-sm text-gray-600">Demo OTP: 123456</div>
        </form>
      )}
    </div>
  )
}
