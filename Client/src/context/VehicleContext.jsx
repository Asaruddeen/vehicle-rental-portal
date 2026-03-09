// src/context/VehicleContext.jsx
import { createContext, useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const VehicleContext = createContext();

export const VehicleProvider = ({ children }) => {
  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load vehicles on mount
  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    setLoading(true);
    try {
      const data = await api.vehicles.getAll();
      setVehicles(data.vehicles);
    } catch (error) {
      toast.error('Failed to load vehicles');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Updated loadBookings to properly handle vehicle data
  const loadBookings = async () => {
    try {
      const data = await api.bookings.getAllBookings();
      // Ensure each booking has the vehicle data properly populated
      const bookingsWithVehicles = data.bookings.map(booking => ({
        ...booking,
        vehicle: booking.vehicle || null
      }));
      setBookings(bookingsWithVehicles);
    } catch (error) {
      console.error('Failed to load bookings:', error);
    }
  };

  const addVehicle = async (vehicleData) => {
    try {
      const data = await api.vehicles.create(vehicleData);
      if (data.success) {
        setVehicles([...vehicles, data.vehicle]);
        toast.success('Vehicle added successfully');
        return { success: true };
      }
    } catch (error) {
      toast.error(error.message || 'Failed to add vehicle');
      return { success: false, error: error.message };
    }
  };

  const updateVehicle = async (id, vehicleData) => {
    try {
      const data = await api.vehicles.update(id, vehicleData);
      if (data.success) {
        setVehicles(vehicles.map(v => v._id === id ? data.vehicle : v));
        toast.success('Vehicle updated successfully');
        return { success: true };
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update vehicle');
      return { success: false, error: error.message };
    }
  };

  const deleteVehicle = async (id) => {
    try {
      const data = await api.vehicles.delete(id);
      if (data.success) {
        setVehicles(vehicles.filter(v => v._id !== id));
        toast.success('Vehicle deleted successfully');
        return { success: true };
      }
    } catch (error) {
      toast.error(error.message || 'Failed to delete vehicle');
      return { success: false, error: error.message };
    }
  };

  // Updated createBooking to handle the response properly
  const createBooking = async (bookingData) => {
    try {
      const data = await api.bookings.create(bookingData);
      if (data.success) {
        toast.success('Booking created successfully');
        return { success: true, booking: data.booking };
      }
    } catch (error) {
      toast.error(error.message || 'Failed to create booking');
      return { success: false, error: error.message };
    }
  };

  // Updated getUserBookings to return properly populated bookings
  const getUserBookings = async () => {
    try {
      const data = await api.bookings.getUserBookings();
      // Ensure each booking has vehicle data
      const bookingsWithVehicles = data.bookings.map(booking => ({
        ...booking,
        vehicle: booking.vehicle || null
      }));
      return bookingsWithVehicles;
    } catch (error) {
      console.error('Failed to get user bookings:', error);
      return [];
    }
  };

  // Updated updateBookingStatus to refresh bookings after update
  const updateBookingStatus = async (id, status) => {
    try {
      const data = await api.bookings.updateStatus(id, status);
      if (data.success) {
        // Refresh bookings to get updated data
        await loadBookings();
        toast.success(`Booking ${status} successfully`);
        return { success: true };
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update booking');
      return { success: false, error: error.message };
    }
  };

  return (
    <VehicleContext.Provider value={{
      vehicles,
      bookings,
      loading,
      loadVehicles,
      loadBookings,
      addVehicle,
      updateVehicle,
      deleteVehicle,
      createBooking,
      getUserBookings,
      updateBookingStatus,
    }}>
      {children}
    </VehicleContext.Provider>
  );
};

export default VehicleContext;