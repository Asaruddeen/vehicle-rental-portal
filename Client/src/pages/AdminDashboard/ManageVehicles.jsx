import { useState } from 'react'
import { useVehicles } from '../../hooks/useVehicles'
import { FaEdit, FaTrash, FaCheck, FaTimes, FaSearch } from 'react-icons/fa'
import toast from 'react-hot-toast'

const ManageVehicles = () => {
  const { vehicles, updateVehicle, deleteVehicle } = useVehicles()
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')

  const handleEdit = (vehicle) => {
    setEditingId(vehicle._id)
    setEditForm(vehicle)
  }

  const handleSave = async () => {
    const result = await updateVehicle(editingId, editForm)
    if (result.success) {
      setEditingId(null)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setEditForm(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }))
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      await deleteVehicle(id)
    }
  }

  // Filter vehicles based on search and type
  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = 
      vehicle.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.location?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = filterType === 'all' || vehicle.type === filterType
    
    return matchesSearch && matchesType
  })

  const vehicleTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'scooter', label: 'Scooter' },
    { value: 'motorcycle', label: 'Motorcycle' },
    { value: 'hatchback', label: 'Hatchback' },
    { value: 'sedan', label: 'Sedan' },
    { value: 'suv', label: 'SUV' },
    { value: 'auto', label: 'Auto' },
    { value: 'van', label: 'Van' }
  ]

  return (
    <div className="bg-white/95 backdrop-blur rounded-3xl border-4 border-primary-400 p-6 shadow-2xl">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h3 className="font-black text-xl">Manage Vehicles</h3>
        
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search vehicles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border-2 border-primary-200 rounded-xl focus:border-primary-500 w-full sm:w-64"
            />
          </div>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border-2 border-primary-200 rounded-xl focus:border-primary-500"
          >
            {vehicleTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>
        
        <span className="bg-primary-100 px-4 py-2 rounded-full text-primary-700 font-bold whitespace-nowrap">
          Total: {filteredVehicles.length} / {vehicles.length}
        </span>
      </div>

      {filteredVehicles.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No vehicles found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-primary-100">
              <tr>
                <th className="px-4 py-3 text-left">Image</th>
                <th className="px-4 py-3 text-left">Vehicle</th>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-left">Price/Day</th>
                <th className="px-4 py-3 text-left">Fuel</th>
                <th className="px-4 py-3 text-left">Seats</th>
                <th className="px-4 py-3 text-left">Location</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVehicles.map(vehicle => (
                <tr key={vehicle._id} className="border-b border-primary-100 hover:bg-primary-50">
                  <td className="px-4 py-3">
                    <img 
                      src={vehicle.image} 
                      alt={vehicle.model}
                      className="w-16 h-12 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/150?text=No+Image'
                      }}
                    />
                  </td>
                  <td className="px-4 py-3 font-bold">
                    {editingId === vehicle._id ? (
                      <div className="space-y-1">
                        <input
                          type="text"
                          name="brand"
                          value={editForm.brand || ''}
                          onChange={handleChange}
                          className="w-24 px-2 py-1 border rounded text-sm"
                          placeholder="Brand"
                        />
                        <input
                          type="text"
                          name="model"
                          value={editForm.model || ''}
                          onChange={handleChange}
                          className="w-24 px-2 py-1 border rounded text-sm"
                          placeholder="Model"
                        />
                      </div>
                    ) : (
                      `${vehicle.brand} ${vehicle.model}`
                    )}
                  </td>
                  <td className="px-4 py-3 capitalize">
                    {editingId === vehicle._id ? (
                      <select
                        name="type"
                        value={editForm.type || ''}
                        onChange={handleChange}
                        className="px-2 py-1 border rounded text-sm"
                      >
                        {vehicleTypes.filter(t => t.value !== 'all').map(type => (
                          <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                      </select>
                    ) : (
                      vehicle.type
                    )}
                  </td>
                  <td className="px-4 py-3 font-bold text-primary-600">
                    {editingId === vehicle._id ? (
                      <input
                        type="number"
                        name="price"
                        value={editForm.price || ''}
                        onChange={handleChange}
                        className="w-20 px-2 py-1 border rounded text-sm"
                      />
                    ) : (
                      `₹${vehicle.price}`
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editingId === vehicle._id ? (
                      <select
                        name="fuel"
                        value={editForm.fuel || 'Petrol'}
                        onChange={handleChange}
                        className="px-2 py-1 border rounded text-sm"
                      >
                        <option value="Petrol">Petrol</option>
                        <option value="Diesel">Diesel</option>
                        <option value="CNG">CNG</option>
                        <option value="Electric">Electric</option>
                      </select>
                    ) : (
                      vehicle.fuel
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editingId === vehicle._id ? (
                      <input
                        type="number"
                        name="seats"
                        value={editForm.seats || ''}
                        onChange={handleChange}
                        className="w-16 px-2 py-1 border rounded text-sm"
                        min="1"
                      />
                    ) : (
                      vehicle.seats
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editingId === vehicle._id ? (
                      <input
                        type="text"
                        name="location"
                        value={editForm.location || ''}
                        onChange={handleChange}
                        className="w-24 px-2 py-1 border rounded text-sm"
                      />
                    ) : (
                      vehicle.location
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editingId === vehicle._id ? (
                      <select
                        name="available"
                        value={editForm.available ? 'true' : 'false'}
                        onChange={(e) => setEditForm(prev => ({ 
                          ...prev, 
                          available: e.target.value === 'true' 
                        }))}
                        className="px-2 py-1 border rounded text-sm"
                      >
                        <option value="true">Available</option>
                        <option value="false">Unavailable</option>
                      </select>
                    ) : (
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        vehicle.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {vehicle.available ? 'Available' : 'Unavailable'}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {editingId === vehicle._id ? (
                        <>
                          <button
                            onClick={handleSave}
                            className="text-green-600 hover:text-green-700 p-1"
                            title="Save"
                          >
                            <FaCheck />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="text-red-600 hover:text-red-700 p-1"
                            title="Cancel"
                          >
                            <FaTimes />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEdit(vehicle)}
                            className="text-blue-600 hover:text-blue-700 p-1"
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(vehicle._id)}
                            className="text-red-600 hover:text-red-700 p-1"
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default ManageVehicles