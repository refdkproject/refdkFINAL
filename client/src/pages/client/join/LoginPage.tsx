import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../../../services/authService";
import { useAuth } from "../../../context/AuthContext";
import { toast } from "react-toastify";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!credentials.email) {
      newErrors.email = "Email is required.";
    } else if (!emailRegex.test(credentials.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!credentials.password) {
      newErrors.password = "Password is required.";
    }
    // else if (
    //   credentials.password.length < 6 ||
    //   !/[A-Z]/.test(credentials.password) ||
    //   !/[a-z]/.test(credentials.password) ||
    //   !/[0-9]/.test(credentials.password) ||
    //   !/[!@#$%^&*(),.?":{}|<>]/.test(credentials.password)
    // ) {
    //   newErrors.password =
    //     "Password must be at least 6 characters long and include uppercase letters, lowercase letters, numbers, and special characters.";
    // }

    setErrors(newErrors);
    Object.values(newErrors).forEach((err) => toast.error(err));

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await authService.login(credentials);
      if (response.data.success) {
        login(response.data.data);
        navigate("/");
      } else {
        toast.error(response.data.message || "Login failed");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-md mx-auto pt-16 pb-24 px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#397260] mb-4">Welcome Back</h1>
          <p className="text-gray-600">
            Don't have an account?{" "}
            <Link to="/join" className="text-[#397260] hover:text-[#2c5846] font-semibold">
              Register here
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-sm">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#397260] focus:border-[#397260]"
              value={credentials.email}
              onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
            />
            {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#397260] focus:border-[#397260]"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            />
            {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#397260] text-white p-3 rounded-lg hover:bg-[#2c5846] disabled:bg-gray-400 transition-colors duration-200 font-semibold"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <div className="text-center mt-4">
            <Link to="/forgot-password" className="text-[#397260] hover:text-[#2c5846] text-sm">
              Forgot password?
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}