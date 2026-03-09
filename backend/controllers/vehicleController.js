import asyncHandler from 'express-async-handler';
import Vehicle from '../models/Vehicle.js';

// @desc    Get all vehicles
// @route   GET /api/vehicles
// @access  Public
export const getVehicles = asyncHandler(async (req, res) => {
  const { type, minPrice, maxPrice, search, available } = req.query;
  
  let query = {};
  
  if (type && type !== 'all') {
    query.type = type;
  }
  
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = parseInt(minPrice);
    if (maxPrice) query.price.$lte = parseInt(maxPrice);
  }
  
  if (available === 'true') {
    query.available = true;
  }
  
  if (search) {
    query.$or = [
      { brand: { $regex: search, $options: 'i' } },
      { model: { $regex: search, $options: 'i' } },
      { location: { $regex: search, $options: 'i' } }
    ];
  }
  
  const vehicles = await Vehicle.find(query).sort({ createdAt: -1 });
  
  res.json({
    success: true,
    count: vehicles.length,
    vehicles
  });
});

// @desc    Get single vehicle
// @route   GET /api/vehicles/:id
// @access  Public
export const getVehicleById = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findById(req.params.id);
  
  if (vehicle) {
    res.json({
      success: true,
      vehicle
    });
  } else {
    res.status(404);
    throw new Error('Vehicle not found');
  }
});

// @desc    Create a vehicle
// @route   POST /api/vehicles
// @access  Private/Admin
export const createVehicle = asyncHandler(async (req, res) => {
  const { brand, model, type, price, fuel, seats, location, image } = req.body;
  
  const parsedPrice = parseFloat(price);

  const vehicle = await Vehicle.create({
    brand,
    model,
    type,
    price: parsedPrice,
    price,
    fuel,
    seats,
    location,
    image
  });
  
  if (vehicle) {
    res.status(201).json({
      success: true,
      vehicle
    });
  } else {
    res.status(400);
    throw new Error('Invalid vehicle data');
  }
});

// @desc    Update a vehicle
// @route   PUT /api/vehicles/:id
// @access  Private/Admin
export const updateVehicle = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findById(req.params.id);
  
  if (vehicle) {
    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.json({
      success: true,
      vehicle: updatedVehicle
    });
  } else {
    res.status(404);
    throw new Error('Vehicle not found');
  }
});

// @desc    Delete a vehicle
// @route   DELETE /api/vehicles/:id
// @access  Private/Admin
export const deleteVehicle = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findById(req.params.id);
  
  if (vehicle) {
    await vehicle.deleteOne();
    res.json({
      success: true,
      message: 'Vehicle removed'
    });
  } else {
    res.status(404);
    throw new Error('Vehicle not found');
  }
});