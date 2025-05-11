import "../styles/global.css"
import { Header } from "../components/Header"
import { Outlet } from "react-router-dom"

export default function ClientLayout() {
  return (
    <div>
      <Header />
      <Outlet />
    </div>
  )
}
