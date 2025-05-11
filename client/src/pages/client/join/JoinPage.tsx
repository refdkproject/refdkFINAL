import { Link } from "react-router-dom"

export default function JoinPage() {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[#E5EAE7] flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-[#2D5A4C] text-6xl font-bold mb-4">
          JOIN OUR TEAM
        </h1>
        <h2 className="text-[#2D5A4C] text-5xl font-semibold mb-2">WELCOME</h2>
        <h3 className="text-4xl mb-4">مرحبا بك</h3>
        <p className="text-gray-600 text-xl mb-12">
          where every step you take creates a difference
        </p>

        <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <Link to="/register/volunteer">
            <button className="w-full h-14 text-md rounded-md px-4 text-white bg-[#285043] hover:bg-[#4f9780]">
              Sign Up as Volunteer
            </button>
          </Link>
          <Link to="/register/charity-admin">
            <button className="w-full h-14 text-md rounded-md px-4 text-white bg-[#5c887b] hover:bg-[#7A9589]">
              Sign Up as Charity Admin
            </button>
          </Link>
        </div>
      </div>
    </main>
  )
}
