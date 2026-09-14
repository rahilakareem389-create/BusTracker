const express = require('express');
const { getStats, getAllBookings, updateBookingStatus, deleteBooking, getAllUsers, updateUserRole, deleteUser } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

router.use(protect, admin);

router.get('/stats', getStats);
router.get('/bookings', getAllBookings);
router.put('/bookings/:id/status', updateBookingStatus);
router.delete('/bookings/:id', deleteBooking);
router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

module.exports = router;