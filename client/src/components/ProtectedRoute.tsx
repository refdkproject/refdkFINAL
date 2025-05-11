import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

interface ProtectedRouteProps {
  allowedRoles: string[]
  children?: React.ReactElement
}

export default function ProtectedRoute({
  allowedRoles,
  children,
}: ProtectedRouteProps) {
  const { user } = useAuth()
  
  if (allowedRoles.includes("public") && user?.role !== "charity_admin" && user?.role !== "volunteer") {
    return children ? children : <div className="mt-[4rem]"><Outlet /></div> 
  }
  
  if (!user) {
    return <Navigate to="/login" replace />
  }


  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  return children ? children : user.role === "volunteer" ? <div className="pt-[4rem]"><Outlet /></div> : <div className="pt-[5rem]"><Outlet /></div>  
}
