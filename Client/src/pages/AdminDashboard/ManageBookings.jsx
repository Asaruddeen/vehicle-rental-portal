// src/pages/AdminDashboard/ManageBookings.jsx
import { useState, useEffect } from 'react'
import { useVehicles } from '../../hooks/useVehicles'
import { useAuth } from '../../hooks/useAuth'
import { FaCheck, FaTimes, FaClock, FaSearch, FaFilter, FaCopy, FaIdCard, FaImage } from 'react-icons/fa'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

const ManageBookings = () => {
  const { bookings, updateBookingStatus, loadBookings, vehicles } = useVehicles()
  const { user } = useAuth()
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadBookings()
  }, [])

  const getVehicleDetails = (booking) => {
    // First try to get from populated vehicle field
    if (booking.vehicle && typeof booking.vehicle === 'object') {
      return booking.vehicle;
    }
    // Fallback to finding in vehicles array
    return vehicles.find(v => v._id === booking.vehicle);
  }

  const handleStatusUpdate = async (bookingId, status) => {
    if (window.confirm(`Are you sure you want to ${status} this booking?`)) {
      const result = await updateBookingStatus(bookingId, status)
      if (result.success) {
        // Refresh bookings to get updated data
        await loadBookings()
      }
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    toast.success('Booking ID copied to clipboard!')
  }

  const getStatusBadge = (status) => {
    switch(status) {
      case 'pending':
        return <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><FaClock /> Pending</span>
      case 'approved':
        return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><FaCheck /> Approved</span>
      case 'rejected':
        return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><FaTimes /> Rejected</span>
      default:
        return null
    }
  }

  // Filter bookings
  const filteredBookings = bookings.filter(booking => {
    const matchesStatus = filterStatus === 'all' || booking.status === filterStatus
    const vehicle = getVehicleDetails(booking)
    const matchesSearch = 
      vehicle?.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle?.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking._id?.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesStatus && matchesSearch
  })

  return (
    <div className="bg-white/95 backdrop-blur rounded-3xl border-4 border-primary-400 p-6 shadow-2xl">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h3 className="font-black text-xl">Manage Bookings</h3>
        
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by ID, name, vehicle..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border-2 border-primary-200 rounded-xl focus:border-primary-500 w-full sm:w-64"
            />
          </div>
          
          <div className="relative">
            <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-10 pr-4 py-2 border-2 border-primary-200 rounded-xl focus:border-primary-500 appearance-none"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
        
        <span className="bg-primary-100 px-4 py-2 rounded-full text-primary-700 font-bold">
          Total: {filteredBookings.length} / {bookings.length}
        </span>
      </div>

      <div className="space-y-4">
        {filteredBookings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No bookings found</p>
          </div>
        ) : (
          filteredBookings.map(booking => {
            const vehicle = getVehicleDetails(booking)
            const bookingId = booking._id || booking.id
            const shortId = bookingId ? bookingId.slice(-8).toUpperCase() : 'N/A'
            
            return (
              <div key={bookingId} className="border-2 border-primary-200 rounded-2xl p-4 hover:border-primary-400 transition-all">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex gap-4">
                    {/* Vehicle Image */}
                    {vehicle ? (
                      <img 
                        src={vehicle.image || 'https://via.placeholder.com/150?text=No+Image'} 
                        alt={vehicle.model}
                        className="w-24 h-20 object-cover rounded-xl"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/150?text=No+Image'
                        }}
                      />
                    ) : (
                      <div className="w-24 h-20 bg-gray-200 rounded-xl flex items-center justify-center">
                        <FaImage className="text-gray-400 text-2xl" />
                      </div>
                    )}
                    
                    <div className="flex-1">
                      {/* Booking ID Display */}
                      <div className="flex items-center gap-2 mb-2">
                        <FaIdCard className="text-primary-500" />
                        <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                          Booking ID: {shortId}
                        </span>
                        <button
                          onClick={() => copyToClipboard(bookingId)}
                          className="text-gray-500 hover:text-primary-500 transition-colors"
                          title="Copy full ID"
                        >
                          <FaCopy size={14} />
                        </button>
                      </div>

                      <h4 className="font-black text-lg">
                        {vehicle?.brand || 'Unknown'} {vehicle?.model || 'Vehicle'}
                      </h4>
                      
                      {/* Vehicle Details */}
                      {vehicle && (
                        <div className="flex gap-2 mt-1 mb-2">
                          <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">
                            {vehicle.type || 'N/A'}
                          </span>
                          <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">
                            {vehicle.fuel || 'N/A'}
                          </span>
                          <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">
                            {vehicle.seats || '?'} seats
                          </span>
                        </div>
                      )}
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                        <div>
                          <p className="text-sm text-gray-600">
                            <span className="font-bold">Customer:</span> {booking.userName}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-bold">Email:</span> {booking.userEmail}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-bold">Phone:</span> {booking.userPhone}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">
                            <span className="font-bold">Dates:</span> {format(new Date(booking.startDate), 'dd MMM yyyy')} - {format(new Date(booking.endDate), 'dd MMM yyyy')}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-bold">Duration:</span> {booking.days} {booking.days === 1 ? 'day' : 'days'}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-bold">Location:</span> {vehicle?.location || booking.location || 'N/A'}
                          </p>
                          <p className="text-lg font-black text-primary-600 mt-1">
                            Total: ₹{booking.totalPrice}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2 min-w-[140px]">
                    {getStatusBadge(booking.status)}
                    
                    {booking.status === 'pending' && (
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => handleStatusUpdate(bookingId, 'approved')}
                          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-1 transition-all"
                        >
                          <FaCheck /> Approve
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(bookingId, 'rejected')}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-1 transition-all"
                        >
                          <FaTimes /> Reject
                        </button>
                      </div>
                    )}
                    
                    {booking.status !== 'pending' && (
                      <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                        <FaClock className="text-gray-400" />
                        Processed: {booking.updatedAt ? format(new Date(booking.updatedAt), 'dd MMM yyyy') : 'N/A'}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default ManageBookings