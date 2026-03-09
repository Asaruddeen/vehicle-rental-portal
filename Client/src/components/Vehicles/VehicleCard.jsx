// src/components/Vehicles/VehicleCard.jsx
import { FaGasPump, FaUsers, FaMapMarkerAlt, FaRupeeSign } from 'react-icons/fa'
import { useAuth } from '../../hooks/useAuth'
import { useNavigate } from 'react-router-dom'

const VehicleCard = ({ vehicle, onBookNow }) => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const getTypeIcon = (type) => {
    switch(type) {
      case 'scooter':
        return '🛵'
      case 'motorcycle':
        return '🏍️'
      case 'hatchback':
      case 'sedan':
      case 'suv':
        return '🚗'
      case 'auto':
        return '🛺'
      case 'van':
        return '🚐'
      default:
        return '🚘'
    }
  }

  const handleBookClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Don't proceed if vehicle is unavailable
    if (!vehicle.available) {
      return
    }
    
    console.log('Book button clicked for vehicle:', vehicle)
    console.log('User logged in:', !!user)
    console.log('onBookNow function:', onBookNow)
    
    if (!user) {
      // Save the intended booking
      sessionStorage.setItem('intendedBooking', JSON.stringify({
        vehicleId: vehicle._id,
        vehicleName: `${vehicle.brand} ${vehicle.model}`,
        timestamp: new Date().toISOString()
      }))
      
      // Redirect to login
      navigate('/login', { 
        state: { 
          from: '/dashboard',
          message: 'Please login to book this vehicle'
        }
      })
      return
    }
    
    // Call the onBookNow prop function
    if (onBookNow && typeof onBookNow === 'function') {
      onBookNow(vehicle)
    } else {
      console.error('onBookNow is not a function', onBookNow)
    }
  }

  return (
    <div className={`bg-white/95 backdrop-blur rounded-3xl border-2 overflow-hidden shadow-xl transition-all group ${
      vehicle.available 
        ? 'border-primary-200 hover:border-primary-500 hover:shadow-2xl' 
        : 'border-gray-300 opacity-75'
    }`}>
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={vehicle.image} 
          alt={`${vehicle.brand} ${vehicle.model}`}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Available'
          }}
        />
        <div className="absolute top-4 right-4 bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-bold">
          {getTypeIcon(vehicle.type)} {vehicle.type}
        </div>
        
        {/* Unavailable Badge */}
        {!vehicle.available && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold transform -rotate-12">
              Currently Unavailable
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="font-black text-xl mb-1">{vehicle.brand} {vehicle.model}</h3>
        
        {/* Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-gray-600">
            <FaGasPump className="text-primary-500" />
            <span className="text-sm">{vehicle.fuel}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <FaUsers className="text-primary-500" />
            <span className="text-sm">{vehicle.seats} Seats</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <FaMapMarkerAlt className="text-primary-500" />
            <span className="text-sm">{vehicle.location}</span>
          </div>
        </div>

        {/* Price and Action */}
        <div className="flex items-center justify-between pt-4 border-t-2 border-primary-100">
          <div>
            <p className="text-sm text-gray-500">Price per day</p>
            <p className="text-2xl font-black text-primary-600 flex items-center">
              <FaRupeeSign className="text-xl" />
              {vehicle.price}
            </p>
          </div>
          
          {vehicle.available ? (
            <button
              onClick={handleBookClick}
              className={`px-6 py-2 rounded-xl font-bold transition-all ${
                user 
                  ? 'bg-primary-500 hover:bg-primary-600 text-white' 
                  : 'bg-yellow-500 hover:bg-yellow-600 text-white'
              }`}
            >
              {user ? 'Book Now' : 'Login to Book'}
            </button>
          ) : (
            <button
              disabled
              className="px-6 py-2 rounded-xl font-bold bg-gray-400 text-white cursor-not-allowed"
              title="Vehicle is currently unavailable"
            >
              Unavailable
            </button>
          )}
        </div>

        {/* Login prompt for non-authenticated users */}
        {!user && vehicle.available && (
          <p className="text-xs text-center text-yellow-600 mt-3">
            🔐 Please login to book this vehicle
          </p>
        )}
        
        {/* Unavailable message */}
        {!vehicle.available && (
          <p className="text-xs text-center text-red-600 mt-3">
            🚫 This vehicle is currently unavailable for booking
          </p>
        )}
      </div>
    </div>
  )
}

export default VehicleCard