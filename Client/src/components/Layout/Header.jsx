import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const Header = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <header className="relative z-20 bg-white/90 backdrop-blur-sm border-b-4 border-primary-400 sticky top-0 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap items-center justify-between gap-2">
        <Link to="/" className="flex items-center gap-3">
          <div className="">
            <i className="fas fa-temple text-2xl"></i>
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">
              <span className="text-primary-600">Tamizh</span>
              <span className="text-gray-800">Vahanam</span>
            </h1>
            <p className="text-xs text-primary-500 font-semibold flex items-center gap-1">
              <i className="fas fa-map-marker-alt"></i> Madurai • Chennai • Coimbatore • Thanjavur
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <span className="hidden md:flex items-center gap-2 bg-primary-100 px-5 py-2.5 rounded-full text-primary-800 text-sm font-bold border-2 border-primary-300">
            <i className="fa-solid fa-phone-volume fa-shake"></i> +91 735 888 4400
          </span>
          
          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-primary-700 font-semibold hidden md:block">
                {user.name} ({user.role})
              </span>
              <button
                onClick={() => navigate(user.role === 'admin' ? '/admin' : '/dashboard')}
                className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 shadow-md transition"
              >
                <i className="fas fa-tachometer-alt"></i>
                <span className="hidden sm:inline">Dashboard</span>
              </button>
              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 shadow-md transition"
              >
                <i className="fas fa-sign-out-alt"></i>
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-primary-500 hover:bg-primary-600 text-white px-5 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 shadow-md transition"
              >
                <i className="fas fa-user-shield"></i> Login
              </Link>
              <Link
                to="/register"
                className="border-2 border-primary-500 text-primary-600 hover:bg-primary-500 hover:text-white px-5 py-2.5 rounded-full text-sm font-bold transition"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header