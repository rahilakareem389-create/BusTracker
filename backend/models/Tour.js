const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  seats: {
    type: Number,
    required: true,
    default: 40,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  duration: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['Family Tour', 'Couple Tour', 'City Tour', 'Adventure Tour', 'College Tour', 'School Tour', 'Group Tour', 'Hotel Tour'],
  },
  description: {
    type: String,
    required: true,
  },
  images: [{
    type: String,
  }],
  amenities: [{
    type: String,
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Tour', tourSchema);