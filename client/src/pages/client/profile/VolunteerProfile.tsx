import { Link } from "react-router-dom"
// import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/Avatar"
import { Card, CardContent } from "../../../components/ui/Card"
import { UserIcon, BuildingIcon } from "../../../icons/icons"

export default function ProfilePage() {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[#E5EAE7] p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-[#2D5A4C] text-5xl font-bold mb-4">PROFILE MANAGEMENT</h1>
        <h2 className="text-[#2D5A4C] text-4xl mb-8">Volunteering Team</h2>

        <div className="grid md:grid-cols-[1fr_300px] gap-8">
          <div className="space-y-8">
            <div className="flex flex-col items-center gap-2">
              {/* <Avatar className="w-32 h-32">
                <AvatarImage src="/placeholder.svg" alt="Profile picture" />
                <AvatarFallback>HA</AvatarFallback>
              </Avatar> */}
              <Link to="/profile/edit" className="text-[#2D5A4C]">
                Edit Profile
              </Link>
            </div>

            <div className="space-y-6">
              <div className="grid gap-2">
                <label htmlFor="name">NAME</label>
                <input id="name" value="Hafsa Alsiddiky" className="bg-white" readOnly />
              </div>

              <div className="grid gap-2">
                <label htmlFor="email">EMAIL</label>
                <input id="email" value="hello@reallygreatsite.com" className="bg-white" readOnly />
              </div>

              <div className="grid gap-2">
                <label htmlFor="gender">GENDER</label>
                <input id="gender" value="Female" className="bg-white" readOnly />
              </div>

              <div className="grid gap-2">
                <label htmlFor="dob">DATE OF BIRTH</label>
                <select>
                  <option>Select date</option>
                  <option value="date">Select date</option>
                </select>
              </div>

              <div className="grid gap-2">
                <label htmlFor="nationality">NATIONALITY</label>
                <input id="nationality" value="Saudi Arabia" className="bg-white" readOnly />
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            <Card className="bg-[#2D5A4C] text-white">
              <CardContent className="p-6">
                <div className="flex flex-col items-center gap-4">
                  <UserIcon size={48} />
                  <h3 className="text-xl font-semibold">Team</h3>
                  <button className="sm w-full">
                    Edit Profile
                  </button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#2D5A4C] text-white">
              <CardContent className="p-6">
                <div className="flex flex-col items-center gap-4">
                  <BuildingIcon size={48} />
                  <h3 className="text-xl font-semibold">Charity Center</h3>
                  <button className="sm w-full">
                    Edit Profile
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
