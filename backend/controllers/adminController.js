const Booking = require('../models/Booking');
const User = require('../models/User');
const Tour = require('../models/Tour');

// @desc    Get dashboard stats
// @route   GET /admin/stats
const getStats = async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const totalUsers = await User.countDocuments({ role: 'user' });
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    
    const bookings = await Booking.find();
    const totalRevenue = bookings.reduce((sum, booking) => {
      if (booking.status === 'confirmed' || booking.status === 'completed') {
        return sum + booking.totalAmount;
      }
      return sum;
    }, 0);
    
    res.json({
      success: true,
      stats: {
        totalBookings,
        totalUsers,
        totalRevenue,
        pendingBookings,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all bookings
// @route   GET /admin/bookings
const getAllBookings = async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    const bookings = await Booking.find(query).populate('userId', 'name email').sort({ bookingDate: -1 });
    
    // Format bookings for frontend
    const formattedBookings = bookings.map(booking => ({
      bookingId: booking.bookingId,
      fullName: booking.fullName,
      tourName: booking.tourName,
      tourPrice: `₨ ${booking.tourPrice.toLocaleString()}`,
      status: booking.status,
      email: booking.email,
      phone: booking.phone,
      cnic: booking.cnic,
      totalAmount: booking.totalAmount,
      bookingDate: booking.bookingDate,
    }));
    
    res.json({
      success: true,
      count: formattedBookings.length,
      bookings: formattedBookings,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update booking status
// @route   PUT /admin/bookings/:id/status
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    booking.status = status;
    booking.updatedAt = Date.now();
    await booking.save();
    
    res.json({
      success: true,
      message: `Booking status updated to ${status}`,
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete booking
// @route   DELETE /admin/bookings/:id
const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    res.json({
      success: true,
      message: 'Booking deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users
// @route   GET /admin/users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user role (make admin)
// @route   PUT /admin/users/:id/role
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.role = role;
    await user.save();
    
    res.json({
      success: true,
      message: `User role updated to ${role}`,
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /admin/users/:id
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Also delete user's bookings
    await Booking.deleteMany({ userId: req.params.id });
    
    res.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getStats, getAllBookings, updateBookingStatus, deleteBooking, getAllUsers, updateUserRole, deleteUser };