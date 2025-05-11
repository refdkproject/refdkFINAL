import axios from "axios"

const API_URL = `${import.meta.env.VITE_BASE_URL}/api`

type VolunteerSignupData = {
  role: "volunteer" | "charity_admin"
  name: string
  email: string
  password: string
  phoneNumber: string
  birthDate: string
}

type CharitySignupData = {
  role: "charity_admin" | "volunteer"
  name: string
  email: string
  password: string
  birthDate: string
  phoneNumber: string
  institutionName: string
  institutionType: string
}

export const authService = {
  register: async (data: VolunteerSignupData | CharitySignupData | any) => {
    return axios.post(`${API_URL}/users`, data)
  },

  login: async (credentials: { email: string; password: string }) => {
    return axios.post(`${API_URL}/users/login`, credentials)
  },

  getProfile: async () => {
    return axios.get(`${API_URL}/users/profile`)
  },

  forgotPassword: async (email: string) => {
    return axios.post(`${API_URL}/users/forgot-password`, { email })
  },
  resetPassword: async (token: string | undefined, password: string) => {
    return axios.patch(`${API_URL}/users/reset-password/${token}`, { password })
  },
}
