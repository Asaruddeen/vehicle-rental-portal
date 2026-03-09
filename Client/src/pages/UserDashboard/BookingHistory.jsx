// src/pages/UserDashboard/BookingHistory.jsx
import { useVehicles } from '../../hooks/useVehicles'
import { format } from 'date-fns'
import { FaHistory, FaCheck, FaTimes, FaClock, FaEye, FaCopy, FaIdCard, FaImage } from 'react-icons/fa'
import { useState } from 'react'
import toast from 'react-hot-toast'

const BookingHistory = ({ bookings }) => {
  const { vehicles } = useVehicles()
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [showDetails, setShowDetails] = useState(false)

  const getVehicleDetails = (booking) => {
    // First try to get from populated vehicle field
    if (booking.vehicle && typeof booking.vehicle === 'object') {
      return booking.vehicle;
    }
    // Check for vehicleDetails snapshot
    if (booking.vehicleDetails) {
      return booking.vehicleDetails;
    }
    // Fallback to finding in vehicles array
    return vehicles.find(v => v._id === booking.vehicle);
  }

  const getStatusIcon = (status) => {
    switch(status) {
      case 'approved':
        return <FaCheck className="text-green-500" />
      case 'rejected':
        return <FaTimes className="text-red-500" />
      default:
        return <FaClock className="text-yellow-500" />
    }
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'approved':
        return 'bg-green-100 text-green-700 border-green-300'
      case 'rejected':
        return 'bg-red-100 text-red-700 border-red-300'
      default:
        return 'bg-yellow-100 text-yellow-700 border-yellow-300'
    }
  }

  const isActive = (booking) => {
    return booking.status === 'approved' && new Date(booking.endDate) > new Date()
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    toast.success('Booking ID copied to clipboard!')
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-12 bg-white/80 rounded-3xl border-2 border-dashed border-primary-300">
        <FaHistory className="text-5xl text-primary-300 mx-auto mb-4" />
        <h3 className="text-2xl font-black text-gray-500">No bookings yet</h3>
        <p className="text-primary-500">Start by booking a vehicle!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {bookings.map(booking => {
        const vehicle = getVehicleDetails(booking)
        const active = isActive(booking)
        const bookingId = booking._id || booking.id
        const shortId = bookingId ? bookingId.slice(-8).toUpperCase() : 'N/A'
        
        return (
          <div key={bookingId} className="bg-white/90 backdrop-blur rounded-2xl border-2 border-primary-200 p-6 shadow-lg hover:shadow-xl transition-all">
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
                  
                  {/* Vehicle Details Badges */}
                  {vehicle && (
                    <div className="flex flex-wrap gap-2 mt-1 mb-2">
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
                        <span className="font-bold">Dates:</span> {format(new Date(booking.startDate), 'dd MMM yyyy')} - {format(new Date(booking.endDate), 'dd MMM yyyy')}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-bold">Duration:</span> {booking.days} {booking.days === 1 ? 'day' : 'days'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        <span className="font-bold">Vehicle:</span> {vehicle?.type || 'N/A'} • {vehicle?.fuel || 'N/A'}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-bold">Location:</span> {vehicle?.location || booking.location || 'N/A'}
                      </p>
                      <p className="text-lg font-black text-primary-600 mt-2">
                        ₹{booking.totalPrice}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-2 min-w-[140px]">
                <span className={`px-4 py-2 rounded-full text-sm font-bold border-2 flex items-center gap-2 ${getStatusColor(booking.status)}`}>
                  {getStatusIcon(booking.status)}
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>
                
                {active && (
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                    Active Now
                  </span>
                )}
                
                {booking.status !== 'pending' && (
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <FaClock className="text-gray-400" />
                    Processed: {booking.updatedAt ? format(new Date(booking.updatedAt), 'dd MMM yyyy') : 'N/A'}
                  </p>
                )}
                
                <button
                  onClick={() => {
                    setSelectedBooking(booking)
                    setShowDetails(true)
                  }}
                  className="text-primary-600 hover:text-primary-700 text-sm font-bold flex items-center gap-1 mt-2"
                >
                  <FaEye /> View Details
                </button>
              </div>
            </div>
          </div>
        )
      })}

      {/* Booking Details Modal */}
      {showDetails && selectedBooking && (
        <BookingDetailsModal
          booking={selectedBooking}
          vehicle={getVehicleDetails(selectedBooking)}
          onClose={() => {
            setShowDetails(false)
            setSelectedBooking(null)
          }}
        />
      )}
    </div>
  )
}

// Booking Details Modal Component
const BookingDetailsModal = ({ booking, vehicle, onClose }) => {
  const bookingId = booking._id || booking.id
  const shortId = bookingId ? bookingId.slice(-8).toUpperCase() : 'N/A'

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    toast.success('Booking ID copied to clipboard!')
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-md w-full">
        <div className="p-6 border-b-2 border-primary-100 flex justify-between items-center">
          <h3 className="font-black text-xl">Booking Details</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          {vehicle && (
            <div className="flex gap-4">
              <img 
                src={vehicle.image || 'https://via.placeholder.com/150?text=No+Image'} 
                alt={vehicle.model}
                className="w-20 h-16 object-cover rounded-xl"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/150?text=No+Image'
                }}
              />
              <div>
                <h4 className="font-bold">{vehicle.brand || 'Unknown'} {vehicle.model || 'Vehicle'}</h4>
                <p className="text-sm text-gray-600">{vehicle.type || 'N/A'} • {vehicle.fuel || 'N/A'}</p>
                <p className="text-xs text-gray-500">{vehicle.seats || '?'} seats • {vehicle.location || 'N/A'}</p>
              </div>
            </div>
          )}
          
          <div className="bg-primary-50 p-3 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FaIdCard className="text-primary-500" />
              <span className="font-mono text-sm">ID: {shortId}</span>
            </div>
            <button
              onClick={() => copyToClipboard(bookingId)}
              className="text-primary-600 hover:text-primary-700 flex items-center gap-1 text-sm"
            >
              <FaCopy /> Copy
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Status</p>
              <p className={`font-bold capitalize ${
                booking.status === 'approved' ? 'text-green-600' :
                booking.status === 'rejected' ? 'text-red-600' :
                'text-yellow-600'
              }`}>{booking.status}</p>
            </div>
            <div>
              <p className="text-gray-600">Processed On</p>
              <p className="font-bold">{booking.updatedAt ? format(new Date(booking.updatedAt), 'dd MMM yyyy') : 'Pending'}</p>
            </div>
            <div>
              <p className="text-gray-600">Start Date</p>
              <p className="font-bold">{format(new Date(booking.startDate), 'dd MMM yyyy')}</p>
            </div>
            <div>
              <p className="text-gray-600">End Date</p>
              <p className="font-bold">{format(new Date(booking.endDate), 'dd MMM yyyy')}</p>
            </div>
            <div>
              <p className="text-gray-600">Duration</p>
              <p className="font-bold">{booking.days} {booking.days === 1 ? 'day' : 'days'}</p>
            </div>
            <div>
              <p className="text-gray-600">Total Price</p>
              <p className="font-bold text-primary-600">₹{booking.totalPrice}</p>
            </div>
          </div>
          
          <div className="border-t-2 border-primary-100 pt-4">
            <p className="text-gray-600 mb-2">Contact Information</p>
            <p className="font-medium">{booking.userName}</p>
            <p className="text-sm text-gray-600">{booking.userEmail}</p>
            <p className="text-sm text-gray-600">{booking.userPhone}</p>
          </div>
          
          <button
            onClick={onClose}
            className="w-full btn-primary mt-4"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default BookingHistory