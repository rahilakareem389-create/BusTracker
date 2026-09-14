const Booking = require('../models/Booking');
const Tour = require('../models/Tour');
const User = require('../models/User');

// @desc    Create booking
// @route   POST /bookings
const createBooking = async (req, res) => {
  try {
    const { tourId, fullName, cnic, phone, email, seats, paymentMethod, transactionId } = req.body;
    
    const tour = await Tour.findById(tourId);
    if (!tour) {
      return res.status(404).json({ message: 'Tour not found' });
    }

    const totalAmount = tour.price * (seats || 1);

    const booking = await Booking.create({
      userId: req.user.id,
      tourId,
      tourName: tour.name,
      tourPrice: tour.price,
      tourFrom: tour.from,
      tourTo: tour.to,
      fullName,
      cnic,
      phone,
      email,
      seats: seats || 1,
      totalAmount,
      paymentMethod,
      transactionId,
      status: 'pending',
    });

    res.status(201).json({
      success: true,
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user bookings
// @route   GET /bookings/my-bookings
const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id }).sort({ bookingDate: -1 });
    res.json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get booking by ID
// @route   GET /bookings/:id
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Check if user owns the booking or is admin
    if (booking.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    res.json({
      success: true,
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel booking
// @route   PUT /bookings/:id/cancel
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    if (booking.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    if (booking.status === 'confirmed' || booking.status === 'pending') {
      booking.status = 'cancelled';
      booking.updatedAt = Date.now();
      await booking.save();
    }
    
    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createBooking, getUserBookings, getBookingById, cancelBooking };