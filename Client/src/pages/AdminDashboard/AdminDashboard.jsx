import { useState, useEffect } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import ManageVehicles from './ManageVehicles'
import ManageBookings from './ManageBookings'
import AddVehicle from './AddVehicle'
import { FaCar, FaBookmark, FaPlusCircle, FaTachometerAlt, FaUsers } from 'react-icons/fa'
import { useVehicles } from '../../hooks/useVehicles'

const AdminDashboard = () => {
  const navigate = useNavigate()
  const { vehicles, bookings, loadBookings } = useVehicles()
  const [stats, setStats] = useState({
    totalVehicles: 0,
    availableVehicles: 0,
    totalBookings: 0,
    pendingBookings: 0
  })

  useEffect(() => {
    loadBookings()
  }, [])

  useEffect(() => {
    if (vehicles && bookings) {
      setStats({
        totalVehicles: vehicles.length,
        availableVehicles: vehicles.filter(v => v.available).length,
        totalBookings: bookings.length,
        pendingBookings: bookings.filter(b => b.status === 'pending').length
      })
    }
  }, [vehicles, bookings])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur rounded-3xl border-4 border-primary-400 p-6 shadow-2xl">
        <h2 className="text-2xl font-black flex items-center gap-2">
          <FaTachometerAlt className="text-primary-500" />
          Admin Dashboard — Manage Your Fleet
        </h2>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-primary-100 text-sm">Total Vehicles</p>
              <h3 className="text-3xl font-black">{stats.totalVehicles}</h3>
            </div>
            <FaCar className="text-4xl text-white/50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-green-100 text-sm">Available</p>
              <h3 className="text-3xl font-black">{stats.availableVehicles}</h3>
            </div>
            <FaCar className="text-4xl text-white/50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-blue-100 text-sm">Total Bookings</p>
              <h3 className="text-3xl font-black">{stats.totalBookings}</h3>
            </div>
            <FaBookmark className="text-4xl text-white/50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-yellow-100 text-sm">Pending</p>
              <h3 className="text-3xl font-black">{stats.pendingBookings}</h3>
            </div>
            <FaUsers className="text-4xl text-white/50" />
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to="/admin"
          end
          className="bg-white/90 backdrop-blur p-6 rounded-2xl border-2 border-primary-300 
                     hover:border-primary-500 hover:shadow-xl transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-primary-100 rounded-xl flex items-center justify-center text-primary-500 text-2xl group-hover:bg-primary-500 group-hover:text-white transition-all">
              <FaCar />
            </div>
            <div>
              <h3 className="font-black text-lg">Manage Vehicles</h3>
              <p className="text-sm text-gray-600">Add, edit, delete vehicles</p>
            </div>
          </div>
        </Link>

        <Link
          to="/admin/bookings"
          className="bg-white/90 backdrop-blur p-6 rounded-2xl border-2 border-primary-300 
                     hover:border-primary-500 hover:shadow-xl transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-primary-100 rounded-xl flex items-center justify-center text-primary-500 text-2xl group-hover:bg-primary-500 group-hover:text-white transition-all">
              <FaBookmark />
            </div>
            <div>
              <h3 className="font-black text-lg">View Bookings</h3>
              <p className="text-sm text-gray-600">Approve / Reject bookings</p>
            </div>
          </div>
        </Link>

        <Link
          to="/admin/add-vehicle"
          className="bg-white/90 backdrop-blur p-6 rounded-2xl border-2 border-primary-300 
                     hover:border-primary-500 hover:shadow-xl transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-primary-100 rounded-xl flex items-center justify-center text-primary-500 text-2xl group-hover:bg-primary-500 group-hover:text-white transition-all">
              <FaPlusCircle />
            </div>
            <div>
              <h3 className="font-black text-lg">Add Vehicle</h3>
              <p className="text-sm text-gray-600">Upload new vehicle</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Routes */}
      <div className="mt-8">
        <Routes>
          <Route index element={<ManageVehicles />} />
          <Route path="bookings" element={<ManageBookings />} />
          <Route path="add-vehicle" element={<AddVehicle />} />
        </Routes>
      </div>
    </div>
  )
}

export default AdminDashboard