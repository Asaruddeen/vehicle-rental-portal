import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useVehicles } from '../hooks/useVehicles'
import { useAuth } from '../hooks/useAuth'
import VehicleFilters from '../components/Vehicles/VehicleFilters'
import VehicleGrid from '../components/Vehicles/VehicleGrid'
import toast from 'react-hot-toast'

const Home = () => {
  const { vehicles } = useVehicles()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [filters, setFilters] = useState({
    search: '',
    type: 'all',
    minPrice: '',
    maxPrice: ''
  })

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.brand?.toLowerCase().includes(filters.search.toLowerCase()) ||
                         vehicle.model?.toLowerCase().includes(filters.search.toLowerCase()) ||
                         vehicle.location?.toLowerCase().includes(filters.search.toLowerCase())
    
    const matchesType = filters.type === 'all' || vehicle.type === filters.type
    
    const matchesPrice = (!filters.minPrice || vehicle.price >= parseInt(filters.minPrice)) &&
                        (!filters.maxPrice || vehicle.price <= parseInt(filters.maxPrice))
    
    return matchesSearch && matchesType && matchesPrice
  })

  const handleBookNow = (vehicle) => {
    console.log('Home page - handleBookNow called with vehicle:', vehicle)
    
    if (!user) {
      // Save intended booking
      sessionStorage.setItem('intendedBooking', JSON.stringify({
        vehicleId: vehicle._id,
        vehicleName: `${vehicle.brand} ${vehicle.model}`,
        timestamp: new Date().toISOString()
      }))
      
      toast.error('Please login to book a vehicle', {
        icon: '🔐',
        duration: 3000
      })
      
      navigate('/login', { 
        state: { 
          from: '/',
          message: 'Please login to continue with your booking'
        }
      })
      return
    }
    
    // If logged in, navigate to dashboard with the vehicle selected
    navigate('/dashboard?tab=browse', { 
      state: { 
        selectedVehicle: vehicle,
        autoOpenBooking: true 
      }
    })
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="relative rounded-4xl overflow-hidden mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-primary-400 opacity-95"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/light-wool.png')] mix-blend-overlay"></div>
        <div className="relative p-8 md:p-12 text-white">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="max-w-xl">
              <span className="bg-yellow-400/30 backdrop-blur-sm px-5 py-2 rounded-full text-sm font-bold inline-block mb-4 border border-white/50">
                <i className="fas fa-praying-hands"></i> Tamil Nadu tour vehicles
              </span>
              <h2 className="text-4xl md:text-5xl font-black leading-tight">
                A vehicle for<br /><span className="text-yellow-300">your journey</span>
              </h2>
              <p className="text-white/90 text-lg mt-3 flex gap-4 flex-wrap font-medium">
                <span><i className="fas fa-motorcycle"></i> Bike</span>
                <span><i className="fas fa-car"></i> Car</span>
                <span><i className="fas fa-auto-rickshaw"></i> Auto</span>
                <span><i className="fas fa-van-shuttle"></i> Van</span>
              </p>
            </div>
            
            {/* Search Card */}
            <VehicleFilters filters={filters} setFilters={setFilters} />
          </div>
        </div>
      </section>

      {/* Results Count */}
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-2xl font-black flex items-center gap-2">
          <i className="fas fa-caravan text-primary-600"></i>
          <span className="text-gray-800">Our vehicles</span>
          <span className="text-sm bg-primary-200 px-4 py-1.5 rounded-full text-primary-800 font-bold ml-2">
            Available today
          </span>
        </h3>
        <span className="text-sm bg-white border-2 border-primary-300 px-5 py-2 rounded-full text-primary-700 font-bold shadow-sm">
          {filteredVehicles.length} vehicles
        </span>
      </div>

      {/* Vehicle Grid - Now with onBookNow prop */}
      <VehicleGrid 
        vehicles={filteredVehicles} 
        onBookNow={handleBookNow}
      />
    </div>
  )
}

export default Home