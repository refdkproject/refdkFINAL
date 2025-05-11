import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { authService } from "../../../services/authService"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"


export default function ResetPasswordPage() {
  const { token } = useParams()
  const navigate = useNavigate()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      toast.error("Passwords do not match", { autoClose: 2000 })
      return
    }

    setLoading(true)

    try {
      const response = await authService.resetPassword(token, password)

      if (response.data.success) {
        toast.success("Password reset successfully!", { autoClose: 1500 })
        setError("")
        setMessage("")
        setTimeout(() => navigate("/login"), 2000)
      } else {
        toast.error(response.data.message || "Password reset failed")
      }
    } catch (err: any) {
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
            Set New Password
          </h1>
          <p className="text-gray-600">Create a new secure password</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white p-8 rounded-xl shadow-sm"
        >
          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          {message && (
            <div className="p-3 bg-green-100 text-green-700 rounded-lg">
              {message}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <input
              type="password"
              required
              minLength={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#397260]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#397260]"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#397260] text-white p-3 rounded-lg hover:bg-[#2c5846] disabled:bg-gray-400"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </main>
    </div>
  )
}
