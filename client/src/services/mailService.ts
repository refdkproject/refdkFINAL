import api from '../axiosInstance'

export const sendMail = async (mailData: any) => {
  console.log(mailData)
  return await api.post(`/email/send`, mailData)
}
