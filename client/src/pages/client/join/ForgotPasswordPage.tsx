import { useState } from "react"
import { Link } from "react-router-dom"
import { authService } from "../../../services/authService"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ email?: string }>({})

  const validateForm = () => {
    const newErrors: { email?: string } = {}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!email) {
      newErrors.email = "Email is required."
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email address."
    }

    setErrors(newErrors)
    Object.values(newErrors).forEach((err) => toast.error(err))

    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    setError("")
    try {
      const response = await authService.forgotPassword(email)
      if (response.data.success) {
        toast.success("Password reset link sent to your email!", { autoClose: 1500 })
      } else {
        toast.error(response.data.message || "Failed to send reset link")
      }
    } catch (err: any) {
      console.log(error)
      toast.error(err.response?.data?.message || "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-md mx-auto pt-16 pb-24 px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#397260] mb-4">
            Reset Your Password
          </h1>
          <p className="text-gray-600">
            Enter your email to receive a reset link
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white p-8 rounded-xl shadow-sm"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#397260]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#397260] text-white p-3 rounded-lg hover:bg-[#2c5846] disabled:bg-gray-400"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>

          <div className="text-center mt-4">
            <Link
              to="/login"
              className="text-[#397260] hover:text-[#2c5846] text-sm"
            >
              Back to Login
            </Link>
          </div>
        </form>
      </main>
    </div>
  )
}
