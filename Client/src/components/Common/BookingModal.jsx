// src/components/Common/BookingModal.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useVehicles } from '../../hooks/useVehicles'
import { FaTimes, FaCalendarAlt, FaUser, FaPhone, FaEnvelope, FaMoneyBillWave } from 'react-icons/fa'
import { differenceInDays, format, addDays } from 'date-fns'
import toast from 'react-hot-toast'

const BookingModal = ({ vehicle, user, onClose, onSuccess }) => {
  const navigate = useNavigate()
  const { createBooking } = useVehicles()
  const [loading, setLoading] = useState(false)
  const [bookingData, setBookingData] = useState({
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
    days: 1,
    totalPrice: vehicle?.price || 0
  })

  useEffect(() => {
    // Recalculate when vehicle changes
    if (vehicle) {
      setBookingData(prev => ({
        ...prev,
        totalPrice: prev.days * vehicle.price
      }))
    }
  }, [vehicle])

  const handleDateChange = (e) => {
    const { name, value } = e.target
    const newData = { ...bookingData, [name]: value }
    
    // Calculate days and total price
    const start = new Date(newData.startDate)
    const end = new Date(newData.endDate)
    
    if (end > start) {
      const days = differenceInDays(end, start)
      newData.days = days
      newData.totalPrice = days * vehicle.price
    }
    
    setBookingData(newData)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!vehicle || !vehicle._id) {
      toast.error('Vehicle information is missing')
      return
    }

    if (bookingData.days < 1) {
      toast.error('End date must be after start date')
      return
    }

    setLoading(true)
    
    const bookingPayload = {
      vehicleId: vehicle._id,
      startDate: bookingData.startDate,
      endDate: bookingData.endDate,
      days: bookingData.days,
      totalPrice: bookingData.totalPrice
    }
    
    console.log('Sending booking payload:', bookingPayload)
    
    try {
      const result = await createBooking(bookingPayload)
      
      if (result && result.success) {
        toast.success('Booking created successfully!')
        onSuccess()
      } else {
        toast.error(result?.error || 'Failed to create booking')
      }
    } catch (error) {
      console.error('Booking error:', error)
      toast.error(error.message || 'Failed to create booking')
    } finally {
      setLoading(false)
    }
  }

  // Don't render if no vehicle
  if (!vehicle) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b-2 border-primary-100 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-black">Book Your Vehicle</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-2"
          >
            <FaTimes size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Vehicle Summary */}
          <div className="bg-primary-50 rounded-2xl p-4 mb-6 flex gap-4">
            <img 
              src={vehicle.image} 
              alt={vehicle.model}
              className="w-24 h-20 object-cover rounded-xl"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/150?text=No+Image'
              }}
            />
            <div>
              <h3 className="font-black text-lg">{vehicle.brand} {vehicle.model}</h3>
              <p className="text-sm text-gray-600 capitalize">{vehicle.type} • {vehicle.fuel} • {vehicle.seats} Seats</p>
              <p className="text-primary-600 font-bold mt-1">₹{vehicle.price}/day</p>
            </div>
          </div>

          {/* User Info */}
          {user && (
            <div className="bg-gray-50 rounded-2xl p-4 mb-6">
              <h4 className="font-bold mb-3 flex items-center gap-2">
                <FaUser className="text-primary-500" /> Your Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <FaUser className="text-sm" />
                  <span>{user?.name}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <FaEnvelope className="text-sm" />
                  <span>{user?.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <FaPhone className="text-sm" />
                  <span>{user?.phone}</span>
                </div>
              </div>
            </div>
          )}

          {/* Booking Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <FaCalendarAlt className="text-primary-500" />
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={bookingData.startDate}
                  onChange={handleDateChange}
                  min={format(new Date(), 'yyyy-MM-dd')}
                  required
                  className="w-full px-4 py-3 border-2 border-primary-200 rounded-xl focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <FaCalendarAlt className="text-primary-500" />
                  End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={bookingData.endDate}
                  onChange={handleDateChange}
                  min={bookingData.startDate}
                  required
                  className="w-full px-4 py-3 border-2 border-primary-200 rounded-xl focus:border-primary-500"
                />
              </div>
            </div>

            {/* Price Summary */}
            <div className="bg-primary-50 rounded-2xl p-6">
              <h4 className="font-bold mb-4 flex items-center gap-2">
                <FaMoneyBillWave className="text-primary-500" />
                Price Summary
              </h4>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Price per day:</span>
                  <span className="font-bold">₹{vehicle.price}</span>
                </div>
                <div className="flex justify-between">
                  <span>Number of days:</span>
                  <span className="font-bold">{bookingData.days}</span>
                </div>
                <div className="border-t-2 border-primary-200 pt-2 mt-2">
                  <div className="flex justify-between text-lg">
                    <span className="font-black">Total Amount:</span>
                    <span className="font-black text-primary-600">₹{bookingData.totalPrice}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Terms */}
            <div className="text-sm text-gray-500">
              <p>By clicking Book Now, you agree to our terms and conditions. Cancellation policy applies.</p>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 btn-primary py-3"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mx-auto"></div>
                ) : (
                  'Confirm Booking'
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-100 font-bold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default BookingModal