// src/pages/AdminDashboard/AddVehicle.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useVehicles } from '../../hooks/useVehicles'
import { FaUpload, FaSave, FaTimes, FaImage } from 'react-icons/fa'
import toast from 'react-hot-toast'

const AddVehicle = () => {
  const navigate = useNavigate()
  const { addVehicle } = useVehicles()
  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    type: 'scooter',
    price: '',
    fuel: 'Petrol',
    seats: '2',
    location: 'Chennai',
    image: '',
    available: true
  })

  const vehicleTypes = [
    { value: 'scooter', label: 'Scooter' },
    { value: 'motorcycle', label: 'Motorcycle' },
    { value: 'hatchback', label: 'Hatchback' },
    { value: 'sedan', label: 'Sedan' },
    { value: 'suv', label: 'SUV' },
    { value: 'auto', label: 'Auto' },
    { value: 'van', label: 'Van' }
  ]

  const fuelTypes = ['Petrol', 'Diesel', 'CNG', 'Electric']
  const locations = ['Chennai', 'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Pune', 'Kolkata']

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  // Handle image file upload
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB')
        return
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file')
        return
      }

      setImageFile(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
        // Store base64 in formData
        setFormData(prev => ({
          ...prev,
          image: reader.result
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle image URL input
  const handleImageUrlChange = (e) => {
    const url = e.target.value
    setFormData(prev => ({
      ...prev,
      image: url
    }))
    setImagePreview(url)
    setImageFile(null)
  }

  const validateForm = () => {
    if (!formData.brand.trim()) {
      toast.error('Brand is required')
      return false
    }
    if (!formData.model.trim()) {
      toast.error('Model is required')
      return false
    }
    if (!formData.price) {
      toast.error('Price is required')
      return false
    }
    
    // Fix price validation - allow any positive number
    const priceValue = parseFloat(formData.price)
    if (isNaN(priceValue) || priceValue <= 0) {
      toast.error('Please enter a valid price (must be greater than 0)')
      return false
    }

    if (!formData.image) {
      toast.error('Please add an image (URL or upload file)')
      return false
    }

    // Check if image is URL or base64
    const isValidUrl = formData.image.startsWith('http://') || 
                      formData.image.startsWith('https://') || 
                      formData.image.startsWith('data:image')
    
    if (!isValidUrl) {
      toast.error('Please enter a valid image URL or upload an image file')
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)
    
    // Prepare data for submission
    const vehicleData = {
      ...formData,
      price: parseFloat(formData.price), // Use parseFloat to allow decimal values
      seats: parseInt(formData.seats) || 2
    }

    const result = await addVehicle(vehicleData)
    setLoading(false)
    
    if (result.success) {
      toast.success('Vehicle added successfully!')
      navigate('/admin')
    }
  }

  return (
    <div className="bg-white/95 backdrop-blur rounded-3xl border-4 border-primary-400 p-6 shadow-2xl">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-black text-xl flex items-center gap-2">
          <FaUpload className="text-primary-500" />
          Add New Vehicle
        </h3>
        <button
          onClick={() => navigate('/admin')}
          className="text-gray-500 hover:text-gray-700 p-2"
        >
          <FaTimes size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Brand */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Brand <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              required
              placeholder="e.g., Toyota, Honda"
              className="w-full px-4 py-3 border-2 border-primary-200 rounded-xl focus:border-primary-500 focus:outline-none"
            />
          </div>

          {/* Model */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Model <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="model"
              value={formData.model}
              onChange={handleChange}
              required
              placeholder="e.g., Innova, City"
              className="w-full px-4 py-3 border-2 border-primary-200 rounded-xl focus:border-primary-500 focus:outline-none"
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Type <span className="text-red-500">*</span>
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-primary-200 rounded-xl focus:border-primary-500 focus:outline-none"
            >
              {vehicleTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          {/* Price - Fixed to accept any number */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Price per day (₹) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0.01"
              step="0.01"
              placeholder="e.g., 2000.50"
              className="w-full px-4 py-3 border-2 border-primary-200 rounded-xl focus:border-primary-500 focus:outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">You can enter any amount (e.g., 500, 1250.50, 2000)</p>
          </div>

          {/* Fuel Type */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Fuel Type</label>
            <select
              name="fuel"
              value={formData.fuel}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-primary-200 rounded-xl focus:border-primary-500 focus:outline-none"
            >
              {fuelTypes.map(fuel => (
                <option key={fuel} value={fuel}>{fuel}</option>
              ))}
            </select>
          </div>

          {/* Seats */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Seats</label>
            <input
              type="number"
              name="seats"
              value={formData.seats}
              onChange={handleChange}
              min="1"
              max="50"
              className="w-full px-4 py-3 border-2 border-primary-200 rounded-xl focus:border-primary-500 focus:outline-none"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Location</label>
            <select
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-primary-200 rounded-xl focus:border-primary-500 focus:outline-none"
            >
              {locations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>

          {/* Image Upload Section - Updated to handle both URL and file upload */}
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Vehicle Image <span className="text-red-500">*</span>
            </label>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* URL Input */}
              <div>
                <p className="text-xs font-medium text-gray-600 mb-2">Option 1: Enter Image URL</p>
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.image?.startsWith('http') ? formData.image : ''}
                  onChange={handleImageUrlChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-3 border-2 border-primary-200 rounded-xl focus:border-primary-500 focus:outline-none"
                />
              </div>

              {/* File Upload */}
              <div>
                <p className="text-xs font-medium text-gray-600 mb-2">Option 2: Upload Image File</p>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="w-full px-4 py-3 border-2 border-primary-200 rounded-xl bg-gray-50 flex items-center gap-2">
                    <FaImage className="text-primary-500" />
                    <span className="text-gray-600">
                      {imageFile ? imageFile.name : 'Choose an image...'}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Max size: 5MB. Supports JPG, PNG, GIF</p>
              </div>
            </div>

            {/* Image Preview */}
            {imagePreview && (
              <div className="mt-4">
                <p className="text-xs font-medium text-gray-600 mb-2">Preview:</p>
                <div className="relative inline-block">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="h-40 w-auto object-cover rounded-lg border-2 border-primary-200"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x200?text=Invalid+Image'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview('')
                      setImageFile(null)
                      setFormData(prev => ({ ...prev, image: '' }))
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <FaTimes size={12} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Available Checkbox */}
          <div className="flex items-center">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="available"
                checked={formData.available}
                onChange={handleChange}
                className="w-5 h-5 text-primary-500 rounded focus:ring-primary-500"
              />
              <span className="font-medium">Available for booking immediately</span>
            </label>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex gap-4 pt-4 border-t-2 border-primary-100">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex items-center gap-2 px-8 py-3"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Saving...
              </>
            ) : (
              <>
                <FaSave /> Save Vehicle
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin')}
            className="px-8 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-100 font-bold transition-all"
          >
            Cancel
          </button>
        </div>
      </form>

      <p className="text-xs text-gray-500 mt-4">
        <span className="text-red-500">*</span> Required fields. You can either enter an image URL or upload an image file.
      </p>
    </div>
  )
}

export default AddVehicle