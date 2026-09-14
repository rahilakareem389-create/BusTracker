const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    unique: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  tourId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tour',
    required: true,
  },
  tourName: {
    type: String,
    required: true,
  },
  tourPrice: {
    type: Number,
    required: true,
  },
  tourFrom: {
    type: String,
    required: true,
  },
  tourTo: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  cnic: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  seats: {
    type: Number,
    default: 1,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ['jazzcash', 'bank', 'cash'],
    default: 'jazzcash',
  },
  transactionId: {
    type: String,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending',
  },
  bookingDate: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Generate booking ID before saving
bookingSchema.pre('save', async function (next) {
  if (!this.bookingId) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const count = await mongoose.model('Booking').countDocuments();
    this.bookingId = `BKG${year}${month}${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);