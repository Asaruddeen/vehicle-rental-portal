// backend/models/Vehicle.js
import mongoose from 'mongoose';

const vehicleSchema = mongoose.Schema({
  brand: {
    type: String,
    required: [true, 'Please add a brand']
  },
  model: {
    type: String,
    required: [true, 'Please add a model']
  },
  type: {
    type: String,
    required: [true, 'Please add a vehicle type'],
    enum: ['scooter', 'motorcycle', 'hatchback', 'sedan', 'suv', 'auto', 'van']
  },
  price: {
    type: Number,
    required: [true, 'Please add price per day'],
    min: 0
  },
  fuel: {
    type: String,
    enum: ['Petrol', 'Diesel', 'CNG', 'Electric'],
    default: 'Petrol'
  },
  seats: {
    type: Number,
    required: true,
    min: 1,
    max: 50
  },
  location: {
    type: String,
    required: [true, 'Please add location']
  },
  image: {
    type: String,
    required: [true, 'Please add an image URL or base64 data'],
    // Allow longer strings for base64 images
    maxlength: [5000000, 'Image data too large'] // 5MB limit
  },
  available: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);
export default Vehicle;