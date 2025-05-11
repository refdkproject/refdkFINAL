export type VolunteerProfile = {
  _id: string
  name: string
  email: string
  role: "volunteer"
  profilePic: string
  phoneNumber?: string
  birthDate?: string
  skills?: string[]
  availability?: string
  areasOfInterest?: string[]
}

export type CharityProfile = {
  _id: string
  name: string
  email: string
  role: "charity_admin"
  profilePic: string
  phoneNumber?: string
  birthDate?: string
  institution?: {
    name?: string
    type?: string
    contact?: {
      address?: string
    }
  }
}
