const express = require('express');
const { createBooking, getUserBookings, getBookingById, cancelBooking } = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, createBooking);
router.get('/my-bookings', protect, getUserBookings);
router.get('/:id', protect, getBookingById);
router.put('/:id/cancel', protect, cancelBooking);

module.exports = router;