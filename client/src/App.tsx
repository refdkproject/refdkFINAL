import { RouterProvider } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

import HomePage from "./pages/client/HomePage"
import ClientLayout from "./layouts/ClientLayout"
import { createBrowserRouter } from "react-router-dom"
// import CharityProfile from "./pages/client/profile/CharityProfile"
// import VolunteerProfile from "./pages/client/profile/VolunteerProfile"
import LoginPage from "./pages/client/join/LoginPage"
import SignupPage from "./pages/client/join/SignupPage"
import JoinPage from "./pages/client/join/JoinPage"
import EventPage from "./pages/client/events/EventPage"
import { AdminEventPage } from "./pages/admin/events/EventPage"
import { AddTrainingForm } from "./pages/admin/training/AddTraining"
import { AdminInstitutionEngagement } from "./pages/admin/institutionEngagement/InstitutionEngagement"
import ForgotPasswordPage from "./pages/client/join/ForgotPasswordPage"
import ResetPasswordPage from "./pages/client/join/ResetPasswordPage"
import ProfilePage from "./pages/client/profile/ProfilePage"
import ProtectedRoute from "./components/ProtectedRoute"
import { AddEventForm } from "./pages/admin/events/AddEvent"
import AdminInstitutionPage from "./pages/admin/institution/Institution"
import { AddInstitutionEngagementForm } from "./pages/admin/institutionEngagement/AddInstitutionEngagement"
import { UpdateEventForm } from "./pages/admin/events/UpdateEvent"
import { UpdateInstitutionEngagementForm } from "./pages/admin/institutionEngagement/UpdateInstitutionEngagement"
import InstitutionEngagementPage from "./pages/client/institutionEngagement/InstitutionEngagement"
import InstitutionPage from "./pages/client/institution/Institution"
import EventDetailPage from "./pages/client/events/EventDetail"
import ScheduledEventsPage from "./pages/client/events/ScheduledEvents"
import AdminEventDetailPage from "./pages/admin/events/EventDetail"
import { AdminTraining } from "./pages/admin/training/TrainingPage"
import { UpdateTraining } from "./pages/admin/training/UpdateTraining"
import { AdminWishlist } from "./pages/admin/wishlist/WishlistPage"
import { AddWishlistForm } from "./pages/admin/wishlist/AddWishlist"
import { UpdateWishlist } from "./pages/admin/wishlist/UpdateWishlist"
import WishListPage from "./pages/client/wishlist/Wishlist"
import TrainingPage from "./pages/client/training/Training"
import NewsFeedPage from "./pages/admin/newsFeed/newFeed"
import ChatAdmin from "./pages/admin/chat/ChatRoom"
import TimeTracker from "./pages/client/Time Tracker/TimeTracker"
// import CharityDashboard from "./pages/client/dashboard/CharityDashboard"

const router = createBrowserRouter([
  {
    path: "/",
    element: <ClientLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      // Public Routes
      {
        element: <ProtectedRoute allowedRoles={['public']} />,
        children: [
          { path: "/login", element: <LoginPage /> },
          {
            path: "/register",
            children: [
              {
                path: "volunteer",
                element: <SignupPage role="volunteer" />,
              },
              {
                path: "charity-admin",
                element: <SignupPage role="charity_admin" />,
              },
            ],
          },
          {
            path: "/join",
            element: <JoinPage />,
          },
          {
            path: "/forgot-password",
            element: <ForgotPasswordPage />,
          },
          {
            path: "/reset-password/:token",
            element: <ResetPasswordPage />,
          },
        ]
      },

      // Protected Routes
      {
        element: <ProtectedRoute allowedRoles={["volunteer"]} />,
        children: [
          { path: "/institution-engagement", element: <InstitutionEngagementPage /> },
          { path: "/wishlist", element: <WishListPage /> },
          { path: "/training", element: <TrainingPage /> },
          { path: "/institutions", element: <InstitutionPage /> },
          { path: "/events", element: <EventPage /> },
          { path: "/scheduled-events", element: <ScheduledEventsPage /> },
          { path: "/event-detail/:eventId", element: <EventDetailPage /> },
          { path: "/track", element: <TimeTracker /> },
          { path: "/news-feed", element: <NewsFeedPage /> },
        ]
      },
      {
        element: <ProtectedRoute allowedRoles={['charity_admin']} />,
        children: [
          // Admin Routes
          { path: "/admin/training", element: <AdminTraining /> },
          { path: "/admin/add-training", element: <AddTrainingForm /> },
          { path: "/admin/update-training/:id", element: <UpdateTraining /> },
          { path: "/admin/wishlist", element: <AdminWishlist /> },
          { path: "/admin/add-wishlist", element: <AddWishlistForm /> },
          { path: "/admin/update-wishlist/:id", element: <UpdateWishlist /> },
          { path: "/admin/events", element: <AdminEventPage /> },
          { path: "/admin/add-event", element: <AddEventForm /> },
          { path: "/admin/view-event/:eventId", element: <AdminEventDetailPage /> },
          { path: "/admin/update-event/:id", element: <UpdateEventForm /> },
          { path: "/admin/institution-engagement", element: <AdminInstitutionEngagement /> },
          { path: "/admin/institutions", element: <AdminInstitutionPage /> },
          { path: "/admin/add-institution-engagement", element: <AddInstitutionEngagementForm /> },
          { path: "/admin/update-institution-engagement/:id", element: <UpdateInstitutionEngagementForm /> },
          { path: "/admin/news-feed", element: <NewsFeedPage /> },
          
        ] 
      },
      { path: "/chat", 
        element: (
          <ProtectedRoute allowedRoles={["charity_admin", "volunteer"]} />
        ), 
        children: [{ path: "", element: <ChatAdmin /> }] },
      {
        path: "/profile",
        element: (
          <ProtectedRoute allowedRoles={["volunteer", "charity_admin"]} />
        ),
        children: [{ path: "", element: <ProfilePage /> }],
      },

    ],
  },
])

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <ToastContainer />
    </AuthProvider>
  )
}
export default App
