import { useState } from 'react'
import { AdminDashboard } from '../components/AdminDashboard'
import { AdminLogin } from '../components/AdminLogin'

const SESSION_KEY = 'galeria-admin-session'

export function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => sessionStorage.getItem(SESSION_KEY) === 'authenticated',
  )

  const handleLogin = () => {
    sessionStorage.setItem(SESSION_KEY, 'authenticated')
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_KEY)
    setIsAuthenticated(false)
  }

  return isAuthenticated ? (
    <AdminDashboard onLogout={handleLogout} />
  ) : (
    <AdminLogin onLogin={handleLogin} />
  )
}
