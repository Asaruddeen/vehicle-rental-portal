// src/pages/UserDashboard/BookVehicle.jsx
import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useVehicles } from '../../hooks/useVehicles'
import { useAuth } from '../../hooks/useAuth'
import VehicleFilters from '../../components/Vehicles/VehicleFilters'
import VehicleGrid from '../../components/Vehicles/VehicleGrid'
import BookingModal from '../../components/Common/BookingModal'
import { FaSearch, FaSignInAlt, FaInfoCircle } from 'react-icons/fa'
import toast from 'react-hot-toast'

const BookVehicle = () => {
  const { vehicles, loading } = useVehicles()
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [filters, setFilters] = useState({
    search: '',
    type: 'all',
    minPrice: '',
    maxPrice: ''
  })
  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [sortBy, setSortBy] = useState('default')
  const [processingIntendedBooking, setProcessingIntendedBooking] = useState(false)
  const [showAvailableOnly, setShowAvailableOnly] = useState(false)

  // Apply filters to all vehicles (including unavailable)
  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = 
      vehicle.brand?.toLowerCase().includes(filters.search.toLowerCase()) ||
      vehicle.model?.toLowerCase().includes(filters.search.toLowerCase()) ||
      vehicle.location?.toLowerCase().includes(filters.search.toLowerCase())
    
    const matchesType = filters.type === 'all' || vehicle.type === filters.type
    
    const matchesPrice = 
      (!filters.minPrice || vehicle.price >= parseFloat(filters.minPrice)) &&
      (!filters.maxPrice || vehicle.price <= parseFloat(filters.maxPrice))
    
    // If showAvailableOnly is true, only show available vehicles
    const matchesAvailability = showAvailableOnly ? vehicle.available === true : true
    
    return matchesSearch && matchesType && matchesPrice && matchesAvailability
  })

  // Sort vehicles
  const sortedVehicles = [...filteredVehicles].sort((a, b) => {
    switch(sortBy) {
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      case 'name':
        return a.brand.localeCompare(b.brand)
      default:
        return 0
    }
  })

const handleBookNow = (vehicle) => {
  console.log('handleBookNow called with vehicle:', vehicle)
  
  // Check if vehicle is available
  if (!vehicle.available) {
    toast.error('This vehicle is currently unavailable for booking', {
      icon: '🚫',
      duration: 3000
    })
    return
  }
  
  // Check if user is logged in
  if (!user) {
    // Save the vehicle they wanted to book in session storage
    sessionStorage.setItem('intendedBooking', JSON.stringify({
      vehicleId: vehicle._id,
      vehicleName: `${vehicle.brand} ${vehicle.model}`,
      timestamp: new Date().toISOString()
    }))
    
    // Show toast message
    toast.error('Please login to book a vehicle', {
      icon: '🔐',
      duration: 3000
    })
    
    // Redirect to login page with return URL
    navigate('/login', { 
      state: { 
        from: '/dashboard',
        message: 'Please login to continue with your booking'
      }
    })
    return
  }
  
  // THIS IS THE FIX - Set the selected vehicle and show modal
  setSelectedVehicle(vehicle)
  setShowBookingModal(true)
}

  // Calculate counts
  const totalVehicles = vehicles.length
  const availableCount = vehicles.filter(v => v.available).length
  const unavailableCount = totalVehicles - availableCount

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur rounded-3xl border-4 border-primary-400 p-6 shadow-2xl">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-black flex items-center gap-2">
            <FaSearch className="text-primary-500" />
            Find Your Perfect Ride
          </h2>
          
          {/* Availability Stats */}
          <div className="flex gap-3">
            <div className="bg-green-50 border-2 border-green-200 rounded-xl px-4 py-2">
              <p className="text-sm text-green-700">
                <span className="font-bold">Available:</span> {availableCount}
              </p>
            </div>
            <div className="bg-red-50 border-2 border-red-200 rounded-xl px-4 py-2">
              <p className="text-sm text-red-700">
                <span className="font-bold">Unavailable:</span> {unavailableCount}
              </p>
            </div>
          </div>
        </div>
        
        {/* Search, Sort and Availability Toggle */}
        <div className="flex flex-col md:flex-row gap-4 mt-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by brand, model, or location..."
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
              className="w-full pl-12 pr-4 py-3 border-2 border-primary-200 rounded-xl focus:border-primary-500"
            />
          </div>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 border-2 border-primary-200 rounded-xl focus:border-primary-500 bg-white"
          >
            <option value="default">Sort by: Default</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Name: A to Z</option>
          </select>

          {/* Availability Toggle */}
          <button
            onClick={() => setShowAvailableOnly(!showAvailableOnly)}
            className={`px-4 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
              showAvailableOnly 
                ? 'bg-green-500 text-white border-2 border-green-600' 
                : 'bg-white text-gray-700 border-2 border-primary-200 hover:border-primary-500'
            }`}
          >
            <FaInfoCircle />
            {showAvailableOnly ? 'Showing Available Only' : 'Show All Vehicles'}
          </button>
        </div>

        {/* Info message about unavailable vehicles */}
        {!showAvailableOnly && unavailableCount > 0 && (
          <div className="mt-4 bg-blue-50 border-2 border-blue-200 rounded-xl p-3 flex items-center gap-2">
            <FaInfoCircle className="text-blue-600" />
            <p className="text-sm text-blue-700">
              <span className="font-bold">Note:</span> Showing all vehicles. Unavailable vehicles have disabled booking buttons.
            </p>
          </div>
        )}
      </div>

      {/* Filters */}
      <VehicleFilters filters={filters} setFilters={setFilters} />
      
      {/* Results Count */}
      <div className="flex justify-between items-center bg-white/80 p-4 rounded-2xl">
        <div>
          <h3 className="text-xl font-bold">Vehicles</h3>
          <p className="text-gray-600">
            {sortedVehicles.length} vehicles found
            {showAvailableOnly && ' (available only)'}
          </p>
        </div>
        <div className="flex gap-2">
          <span className="bg-green-100 px-4 py-2 rounded-full text-green-700 font-bold">
            {availableCount} Available
          </span>
          <span className="bg-red-100 px-4 py-2 rounded-full text-red-700 font-bold">
            {unavailableCount} Unavailable
          </span>
        </div>
      </div>

      {/* Vehicle Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      ) : (
        <>
          {sortedVehicles.length === 0 ? (
            <div className="text-center py-12 bg-white/80 rounded-3xl">
              <FaSearch className="text-5xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-500">No vehicles found</h3>
              <p className="text-gray-400 mt-2">Try adjusting your filters</p>
            </div>
          ) : (
            <VehicleGrid 
              vehicles={sortedVehicles} 
              onBookNow={handleBookNow}
            />
          )}
        </>
      )}

      {/* Booking Modal */}
      {showBookingModal && selectedVehicle && user && (
        <BookingModal
          vehicle={selectedVehicle}
          user={user}
          onClose={() => {
            setShowBookingModal(false)
            setSelectedVehicle(null)
          }}
          onSuccess={() => {
            setShowBookingModal(false)
            setSelectedVehicle(null)
            toast.success('Booking created successfully!')
            navigate('/dashboard?tab=history')
          }}
        />
      )}
    </div>
  )
}

export default BookVehicle