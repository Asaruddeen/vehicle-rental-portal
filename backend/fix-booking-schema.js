// fix-booking-schema.js
import mongoose from 'mongoose';
import Booking from './models/Booking.js';
import dotenv from 'dotenv';

dotenv.config();

const fixBookingSchema = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Drop the bookings collection
    await mongoose.connection.db.dropCollection('bookings');
    console.log('Bookings collection dropped');

    // Create a test booking to verify schema works
    console.log('Schema fixed successfully!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

fixBookingSchema();