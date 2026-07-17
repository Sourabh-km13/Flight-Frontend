import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AdminProtectedRoute from './components/AdminProtectedRoute'
import ProtectedRoute from './components/ProtectedRoute'
import AdminDashboardPage from './pages/AdminDashboardPage'
import AdminLoginPage from './pages/AdminLoginPage'
import BookingReceiptPage from './pages/BookingReceiptPage'
import BookTicketPage from './pages/BookTicketPage'
import BookingsPage from './pages/BookingsPage'
import DashboardPage from './pages/DashboardPage'
import FlightBookingPage from './pages/FlightBookingPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/admin/signin" element={<AdminLoginPage />} />
        <Route
          path="/admin"
          element={
            <AdminProtectedRoute>
              <AdminDashboardPage />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bookings"
          element={
            <ProtectedRoute>
              <BookingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bookings/:bookingId"
          element={
            <ProtectedRoute>
              <BookingReceiptPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/searchflights"
          element={
            <ProtectedRoute>
              <BookTicketPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/searchflights/:flightId"
          element={
            <ProtectedRoute>
              <FlightBookingPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
