import { Outlet } from "react-router-dom"

export default function AdminLayout() {

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
        <Outlet />
    </div>
  )
}
