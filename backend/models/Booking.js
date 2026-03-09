import mongoose from 'mongoose';

const bookingSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Vehicle',
  },
  // Fix: Define vehicleDetails as an embedded object with proper type
  vehicleDetails: {
    brand: { type: String },
    model: { type: String },
    image: { type: String },
    type: { type: String },
    fuel: { type: String },
    location: { type: String },
    seats: { type: Number }
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  days: {
    type: Number,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'completed', 'cancelled'],
    default: 'pending',
  },
  userName: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  userPhone: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;