// src/components/Vehicles/VehicleGrid.jsx
import VehicleCard from './VehicleCard'
import { FaMapSigns } from 'react-icons/fa'

const VehicleGrid = ({ vehicles, onBookNow }) => {
  if (vehicles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white/80 rounded-4xl border-4 border-dashed border-primary-400 mt-6 shadow-inner">
        <FaMapSigns className="text-7xl text-primary-300 mb-5" />
        <p className="text-3xl font-black text-gray-500">No vehicles found</p>
        <p className="text-primary-500 text-lg font-medium">Try a different filter</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7 auto-rows-fr">
      {vehicles.map(vehicle => (
        <VehicleCard 
          key={vehicle._id || vehicle.id} 
          vehicle={vehicle} 
          onBookNow={onBookNow}
        />
      ))}
    </div>
  )
}

export default VehicleGrid