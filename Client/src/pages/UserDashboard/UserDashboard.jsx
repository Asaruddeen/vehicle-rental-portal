// src/pages/UserDashboard/UserDashboard.jsx
import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useVehicles } from '../../hooks/useVehicles'
import BookingHistory from './BookingHistory'
import BookVehicle from './BookVehicle'
import { FaHistory, FaCar, FaUser, FaBell, FaWallet } from 'react-icons/fa'

const UserDashboard = () => {
  const { user } = useAuth()
  const { getUserBookings, bookings: allBookings } = useVehicles()
  const [activeTab, setActiveTab] = useState('book')
  const [userBookings, setUserBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalBookings: 0,
    activeBookings: 0,
    completedBookings: 0,
    totalSpent: 0
  })

  useEffect(() => {
    loadUserBookings()
  }, [])

  const loadUserBookings = async () => {
    setLoading(true)
    const bookings = await getUserBookings()
    setUserBookings(bookings)
    
    // Calculate stats
    const active = bookings.filter(b => b.status === 'approved' && new Date(b.endDate) > new Date()).length
    const completed = bookings.filter(b => b.status === 'approved' && new Date(b.endDate) < new Date()).length
    const totalSpent = bookings
      .filter(b => b.status === 'approved')
      .reduce((sum, b) => sum + b.totalPrice, 0)
    
    setStats({
      totalBookings: bookings.length,
      activeBookings: active,
      completedBookings: completed,
      totalSpent: totalSpent
    })
    
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-3xl p-6 shadow-2xl text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 bg-white/20 rounded-2xl flex items-center justify-center text-white text-4xl backdrop-blur">
              <FaUser />
            </div>
            <div>
              <h2 className="text-3xl font-black">Welcome back, {user?.name}! 👋</h2>
              <p className="text-primary-100 font-medium mt-1">{user?.email} • {user?.phone}</p>
            </div>
          </div>
          <div className="bg-white/20 p-4 rounded-2xl backdrop-blur">
            <p className="text-sm opacity-90">Member since</p>
            <p className="font-bold">{new Date(user?.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/95 backdrop-blur rounded-2xl p-4 border-2 border-primary-200 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Bookings</p>
              <h3 className="text-2xl font-black text-primary-600">{stats.totalBookings}</h3>
            </div>
            <div className="h-12 w-12 bg-primary-100 rounded-xl flex items-center justify-center text-primary-500 text-xl">
              <FaCar />
            </div>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur rounded-2xl p-4 border-2 border-green-200 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Active Bookings</p>
              <h3 className="text-2xl font-black text-green-600">{stats.activeBookings}</h3>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center text-green-500 text-xl">
              <FaBell />
            </div>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur rounded-2xl p-4 border-2 border-blue-200 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Completed</p>
              <h3 className="text-2xl font-black text-blue-600">{stats.completedBookings}</h3>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-500 text-xl">
              <FaHistory />
            </div>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur rounded-2xl p-4 border-2 border-yellow-200 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Spent</p>
              <h3 className="text-2xl font-black text-yellow-600">₹{stats.totalSpent}</h3>
            </div>
            <div className="h-12 w-12 bg-yellow-100 rounded-xl flex items-center justify-center text-yellow-500 text-xl">
              <FaWallet />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b-2 border-primary-200 pb-2">
        <button
          onClick={() => setActiveTab('book')}
          className={`flex items-center gap-2 px-6 py-3 rounded-t-2xl font-bold text-lg transition-all
            ${activeTab === 'book' 
              ? 'bg-primary-500 text-white shadow-lg' 
              : 'bg-white/80 text-primary-600 hover:bg-primary-100'}`}
        >
          <FaCar /> Browse Vehicles
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 px-6 py-3 rounded-t-2xl font-bold text-lg transition-all
            ${activeTab === 'history' 
              ? 'bg-primary-500 text-white shadow-lg' 
              : 'bg-white/80 text-primary-600 hover:bg-primary-100'}`}
        >
          <FaHistory /> My Bookings ({userBookings.length})
        </button>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          </div>
        ) : (
          <>
            {activeTab === 'book' && <BookVehicle />}
            {activeTab === 'history' && <BookingHistory bookings={userBookings} />}
          </>
        )}
      </div>
    </div>
  )
}

export default UserDashboard