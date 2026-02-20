"use client"

import { AuthProvider, useAuth } from "../contexts/auth-context"
import { Login } from "../components/login"
import { CustomerDashboard } from "../components/dashboards/customer-dashboard"
import { VendorDashboard } from "../components/dashboards/vendor-dashboard"
import { DriverDashboard } from "../components/dashboards/driver-dashboard"
import { AdminDashboard } from "../components/dashboards/admin-dashboard"

function AppContent() {
  const { isAuthenticated, user, login } = useAuth()

  if (!isAuthenticated) {
    return <Login onLogin={login} />
  }

  // Render dashboard based on user role
  switch (user?.role) {
    case "customer":
      return <CustomerDashboard />
    case "vendor":
      return <VendorDashboard />
    case "driver":
      return <DriverDashboard />
    case "admin":
      return <AdminDashboard />
    default:
      return <Login onLogin={login} />
  }
}

export default function SyntheticV0PageForDeployment() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}