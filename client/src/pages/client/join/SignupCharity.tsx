import { useState } from "react"
import { Link } from "react-router-dom"

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    institutionName: "",
    institutionType: "orphanage",
    contact: {
      phone: "",
      address: ""
    }
  })

  const handleSubmit = async (e:any) => {
    e.preventDefault()
    try {
      // const response = await authService.register(payload)
      // login(response.data)
    } catch (error: any) {
      // Handle error
      alert(error?.message)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-md mx-auto pt-16 pb-24 px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">
            JOIN OUR TEAM
          </h1>
          <h2 className="text-3xl font-semibold mb-2">Create new Account</h2>
          <p className="text-gray-600">
            Already Registered?{" "}
            <Link
              to="/join/login-charity"
              className="text-primary hover:underline"
            >
              Log in here
            </Link>
            .
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              ORGANIZATION NAME
            </label>
            <input
              type="text"
              id="name"
              className="w-full p-3 bg-primary/20 rounded-md"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              EMAIL
            </label>
            <input
              type="email"
              id="email"
              className="w-full p-3 bg-primary/20 rounded-md"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              PASSWORD
            </label>
            <input
              type="password"
              id="password"
              className="w-full p-3 bg-primary/20 rounded-md"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>

          <div>
            <label
              htmlFor="institutionName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              INSTITUTION NAME
            </label>
            <input
              type="text"
              id="institutionName"
              className="w-full p-3 bg-primary/20 rounded-md"
              value={formData.institutionName}
              onChange={(e) =>
                setFormData({ ...formData, institutionName: e.target.value })
              }
            />
          </div>

          <div>
            <label
              htmlFor="institutionType"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              INSTITUTION TYPE
            </label>
            <select
              value={formData.institutionType}
              onChange={(e) =>
                setFormData({ ...formData, institutionType: e.target.value })
              }
              className="w-full p-3 bg-primary/20 rounded-md"
            >
              <option value="orphanage">Orphanage</option>
              <option value="elderly-care">Elderly Care</option>
              <option value="special-needs">Special Needs</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="contact.phone"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              CONTACT NUMBER
            </label>
            <input
              type="tel"
              id="contact.phone"
              className="w-full p-3 bg-primary/20 rounded-md"
              value={formData.contact.phone}
              onChange={(e) =>
                setFormData({ ...formData, contact: { ...formData.contact, phone: e.target.value } })
              }
            />
          </div>

          <div>
            <label
              htmlFor="contact.address"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              ADDRESS
            </label>
            <input
              type="text"
              id="contact.address"
              className="w-full p-3 bg-primary/20 rounded-md"
              value={formData.contact.address}
              onChange={(e) =>
                setFormData({ ...formData, contact: { ...formData.contact, address: e.target.value } })
              }
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gray-600 text-white rounded-md py-3 hover:bg-gray-700 transition-colors"
          >
            Sign up
          </button>
        </form>
      </main>
    </div>
  )
}
