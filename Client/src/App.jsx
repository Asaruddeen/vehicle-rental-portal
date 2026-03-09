import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Header from './components/Layout/Header'
import Footer from './components/Layout/Footer'
import Home from './pages/Home'
import LoginPage from './pages/Auth/LoginPage'
import RegisterPage from './pages/Auth/RegisterPage'
import UserDashboard from './pages/UserDashboard/UserDashboard'
import AdminDashboard from './pages/AdminDashboard/AdminDashboard'
import ProtectedRoute from './components/Auth/ProtectedRoute'
import { useAuth } from './hooks/useAuth'

function App() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen flex flex-col relative">
      <div className="kolam-pattern fixed inset-0 z-0 opacity-10 pointer-events-none"></div>
      <Header />
      <main className="relative z-10 flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* User Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute role="user">
              <UserDashboard />
            </ProtectedRoute>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin/*" element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <Footer />
      <Toaster position="top-right" toastOptions={{
        duration: 4000,
        style: {
          background: '#fff',
          color: '#363636',
          boxShadow: '0 4px 12px rgba(249, 115, 22, 0.2)',
          border: '2px solid #fed7aa',
          borderRadius: '1rem',
        },
      }} />
      
      <style>{`
        .kolam-pattern {
          background-image: radial-gradient(circle at 10px 10px, #f97316 1px, transparent 1px), 
                          radial-gradient(circle at 30px 30px, #fb923c 1px, transparent 1px);
          background-size: 40px 40px;
        }
      `}</style>
    </div>
  )
}

export default App