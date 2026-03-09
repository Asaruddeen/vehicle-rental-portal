// src/pages/Auth/LoginPage.jsx
import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { FaEnvelope, FaLock, FaSignInAlt } from 'react-icons/fa'
import toast from 'react-hot-toast'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Get the return URL from location state
  const from = location.state?.from || '/dashboard'
  const message = location.state?.message

  // Show message if redirected from booking
  useEffect(() => {
    if (message) {
      toast(message, {
        icon: '🔐',
        duration: 4000
      })
    }
  }, [message])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const result = await login(email, password)
    setLoading(false)
    
    if (result.success) {
      toast.success('Login successful!')
      
      // Check if there's an intended booking
      const intendedBooking = sessionStorage.getItem('intendedBooking')
      
      if (result.user.role === 'admin') {
        navigate('/admin')
      } else {
        // If there was an intended booking, go to dashboard where they can continue
        navigate(from)
        
        // Show a message about continuing booking
        if (intendedBooking) {
          toast.success('You can now continue with your booking!', {
            duration: 4000
          })
        }
      }
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="bg-white/95 backdrop-blur rounded-3xl border-4 border-primary-400 p-8 shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <div className="h-20 w-20 bg-gradient-to-r from-primary-500 to-primary-400 rounded-2xl flex items-center justify-center text-white text-4xl shadow-lg mx-auto mb-4">
            <FaSignInAlt />
          </div>
          <h2 className="text-3xl font-black">Welcome Back</h2>
          <p className="text-primary-600">Sign in to continue</p>
          {message && (
            <p className="text-sm text-yellow-600 mt-2 bg-yellow-50 p-2 rounded-xl">
              {message}
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
              <FaEnvelope className="text-primary-500" /> Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              className="w-full px-4 py-3 border-2 border-primary-200 rounded-xl focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
              <FaLock className="text-primary-500" /> Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              className="w-full px-4 py-3 border-2 border-primary-200 rounded-xl focus:border-primary-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <FaSignInAlt /> Sign In
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 font-bold hover:underline">
              Register here
            </Link>
          </p>
          <p className="text-xs text-gray-500 mt-4">
            Admin: admin@tamizhvahanam.com / admin123
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage