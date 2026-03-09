import asyncHandler from 'express-async-handler';
import Booking from '../models/Booking.js';
import Vehicle from '../models/Vehicle.js';

// @desc    Create a booking
// @route   POST /api/bookings
// @access  Private
export const createBooking = asyncHandler(async (req, res) => {
  const { vehicleId, startDate, endDate, days, totalPrice } = req.body;
  
  console.log('Creating booking with data:', { vehicleId, startDate, endDate, days, totalPrice });
  
  // Check if vehicle exists and is available
  const vehicle = await Vehicle.findById(vehicleId);
  
  if (!vehicle) {
    res.status(404);
    throw new Error('Vehicle not found');
  }
  
  if (!vehicle.available) {
    res.status(400);
    throw new Error('Vehicle is not available');
  }
  
  // Check for existing bookings on same dates
  const existingBooking = await Booking.findOne({
    vehicle: vehicleId,
    status: { $in: ['pending', 'approved'] },
    $or: [
      {
        startDate: { $lte: new Date(endDate) },
        endDate: { $gte: new Date(startDate) }
      }
    ]
  });
  
  if (existingBooking) {
    res.status(400);
    throw new Error('Vehicle already booked for these dates');
  }
  
  // Prepare vehicle details object
  const vehicleDetails = {
    brand: vehicle.brand,
    model: vehicle.model,
    image: vehicle.image,
    type: vehicle.type,
    fuel: vehicle.fuel,
    location: vehicle.location,
    seats: vehicle.seats
  };
  
  console.log('Vehicle details to save:', vehicleDetails);
  
  // Create booking with vehicle details embedded
  const bookingData = {
    user: req.user._id,
    vehicle: vehicleId,
    vehicleDetails: vehicleDetails,
    startDate,
    endDate,
    days,
    totalPrice,
    userName: req.user.name,
    userEmail: req.user.email,
    userPhone: req.user.phone
  };
  
  console.log('Full booking data:', bookingData);
  
  const booking = await Booking.create(bookingData);
  
  if (booking) {
    // Populate the response
    const populatedBooking = await Booking.findById(booking._id)
      .populate('vehicle', 'brand model image price type fuel location seats');
    
    console.log('Booking created successfully:', populatedBooking._id);
    
    res.status(201).json({
      success: true,
      booking: populatedBooking
    });
  } else {
    res.status(400);
    throw new Error('Invalid booking data');
  }
});

// @desc    Get user bookings
// @route   GET /api/bookings/mybookings
// @access  Private
export const getUserBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate('vehicle', 'brand model image price type fuel location seats')
    .sort({ createdAt: -1 });
  
  res.json({
    success: true,
    count: bookings.length,
    bookings
  });
});

// @desc    Get all bookings (Admin)
// @route   GET /api/bookings
// @access  Private/Admin
export const getAllBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({})
    .populate('vehicle', 'brand model image price type fuel location seats')
    .populate('user', 'name email')
    .sort({ createdAt: -1 });
  
  res.json({
    success: true,
    count: bookings.length,
    bookings
  });
});

// @desc    Update booking status
// @route   PUT /api/bookings/:id
// @access  Private/Admin
export const updateBookingStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  
  const booking = await Booking.findById(req.params.id);
  
  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }
  
  booking.status = status;
  await booking.save();
  
  // Return populated booking
  const updatedBooking = await Booking.findById(req.params.id)
    .populate('vehicle', 'brand model image price type fuel location seats')
    .populate('user', 'name email');
  
  res.json({
    success: true,
    booking: updatedBooking
  });
});