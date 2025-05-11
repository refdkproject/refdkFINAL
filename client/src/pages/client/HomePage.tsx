import { Link } from "react-router-dom"
import { ArrowRight } from "../../icons/icons"
import banner from "../../assets/images/banner.jpg"
import { useAuth } from "../../context/AuthContext"

export default function Home() {
  const { user } = useAuth();
  return (
    <main className="min-h-screen">
      <div
        className="relative h-[100vh] bg-cover bg-center"
        style={{
          backgroundImage: `url(${banner})`,
        }}
      >
        <div className="absolute inset-0 bg-white/40" />
        <div className="relative z-10 container mx-auto px-6 pt-32 lg:pt-40">
          <h1 className="text-[5rem] sm:text-[6rem] lg:text-[8rem] font-bold text-[#2D5A4C] mb-8 leading-none">
            Refdk
        </h1>
          <div className="max-w-2xl">
            <p className="text-lg sm:text-2xl text-gray-900 mb-12 leading-relaxed">
              Welcome to REFDK, a platform connecting volunteers, organizations,
              and investors with charitable institutions to foster giving and
              social impact. By streamlining events, and
              volunteering, REFDK supports Saudi Vision 2030 through
              inclusivity, sustainable development, and enhanced quality of
              life. Join us in building a compassionate, united community for a
              brighter Saudi future.
            </p>
            {
              !user ? (
                <>
                  <Link
                    to="/join"
                    className="inline-flex items-center mr-4 px-6 py-3 text-lg font-medium text-white bg-[#2D5A4C] rounded-full hover:bg-[#234539] transition-colors"
                  >
                    Register Now
                    <div className="ml-4 h-12 w-12 rounded-full border-2 border-current flex items-center justify-center transition-transform group-hover:translate-x-1">
                      <ArrowRight className="h-6 w-6" />
                    </div>
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex items-center px-6 py-3 text-lg font-medium text-white bg-[#2D5A4C] rounded-full hover:bg-[#234539] transition-colors"
                  >
                    Login
                    <div className="ml-4 h-12 w-12 rounded-full border-2 border-current flex items-center justify-center transition-transform group-hover:translate-x-1">
                      <ArrowRight className="h-6 w-6" />
                    </div>
                  </Link>
                </>
              ) : (
                null
              )
            }
          </div>
        </div>
      </div>
    </main>
  )
}
