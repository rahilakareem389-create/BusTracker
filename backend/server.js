require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use((req, res, next) => {
  console.log(`[REQUEST] ${req.method} ${req.url}`);
  next();
});
app.use(express.json());
app.use(cors({ 
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:5174', 'http://127.0.0.1:5174'], 
  credentials: true 
}));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bus_tracker')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('MongoDB Error:', err));

// ============ SCHEMAS ============
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  phone: String,
  role: { type: String, default: 'user' }
});

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const TourSchema = new mongoose.Schema({
  name: String, from: String, to: String, time: String, price: Number,
  seats: Number, rating: Number, duration: String, type: String,
  description: String, images: [String], amenities: [String]
});

const BookingSchema = new mongoose.Schema({
  bookingId: String,
  userId: mongoose.Schema.Types.ObjectId,
  tourId: mongoose.Schema.Types.ObjectId,
  tourName: String, tourPrice: Number, tourFrom: String, tourTo: String,
  fullName: String, cnic: String, phone: String, email: String,
  seats: { type: Number, default: 1 },
  totalAmount: Number,
  paymentMethod: String, transactionId: String,
  status: { type: String, default: 'pending' },
  bookingDate: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);
const Tour = mongoose.model('Tour', TourSchema);
const Booking = mongoose.model('Booking', BookingSchema);

// ============ MIDDLEWARE ============
const auth = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized', logout: true });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'SECRET_KEY');
    req.user = await User.findById(decoded.id);
    if (!req.user) return res.status(401).json({ message: 'User not found', logout: true });
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token', logout: true });
  }
};

const adminAuth = async (req, res, next) => {
  await auth(req, res, () => {
    if (req.user?.role !== 'admin') return res.status(403).json({ message: 'Admin only' });
    next();
  });
};

// ============ AUTH ROUTES ============
app.post('/auth/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User already exists' });
    const user = await User.create({ name, email, password, phone });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'SECRET_KEY', { expiresIn: '7d' });
    res.json({ success: true, token, user: { id: user._id, name, email, phone, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'SECRET_KEY', { expiresIn: '7d' });
    res.json({ success: true, token, user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============ TOURS ============
app.get('/tours', async (req, res) => {
  const tours = await Tour.find();
  res.json({ success: true, tours });
});

// ============ BOOKINGS ============
app.post('/bookings', auth, async (req, res) => {
  try {
    const { tourId, fullName, cnic, phone, email, seats, paymentMethod, transactionId } = req.body;
    const tour = await Tour.findById(tourId);
    if (!tour) return res.status(404).json({ message: 'Tour not found' });
    const totalAmount = tour.price * (seats || 1);
    const booking = await Booking.create({
      bookingId: `BKG${Date.now()}${Math.floor(Math.random() * 1000)}`,
      userId: req.user.id, tourId, tourName: tour.name, tourPrice: tour.price,
      tourFrom: tour.from, tourTo: tour.to, fullName, cnic, phone, email,
      seats: seats || 1, totalAmount, paymentMethod, transactionId, status: 'pending'
    });
    res.status(201).json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/bookings/my-bookings', auth, async (req, res) => {
  const bookings = await Booking.find({ userId: req.user.id }).sort({ bookingDate: -1 });
  res.json({ success: true, bookings });
});

app.put('/bookings/:id/cancel', auth, async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.status(404).json({ message: 'Not found' });
  if (booking.userId.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized' });
  booking.status = 'cancelled';
  await booking.save();
  res.json({ success: true });
});

// ============ ADMIN ROUTES ============
app.get('/admin/stats', adminAuth, async (req, res) => {
  const totalBookings = await Booking.countDocuments();
  const totalUsers = await User.countDocuments({ role: 'user' });
  const pendingBookings = await Booking.countDocuments({ status: 'pending' });
  const bookings = await Booking.find();
  const totalRevenue = bookings.reduce((sum, b) => 
    (b.status === 'confirmed' || b.status === 'completed') ? sum + b.totalAmount : sum, 0);
  res.json({ success: true, stats: { totalBookings, totalUsers, totalRevenue, pendingBookings } });
});

app.get('/admin/bookings', adminAuth, async (req, res) => {
  const bookings = await Booking.find().sort({ bookingDate: -1 });
  const formatted = bookings.map(b => ({
    _id: b._id,
    bookingId: b.bookingId, 
    fullName: b.fullName, 
    tourName: b.tourName,
    tourPrice: `₨ ${b.tourPrice.toLocaleString()}`, 
    status: b.status,
    email: b.email, 
    phone: b.phone, 
    cnic: b.cnic,
    totalAmount: b.totalAmount,
    bookingDate: b.bookingDate
  }));
  res.json({ success: true, bookings: formatted });
});

app.put('/admin/bookings/:id/status', adminAuth, async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.status(404).json({ message: 'Not found' });
  booking.status = req.body.status;
  await booking.save();
  res.json({ success: true });
});

app.delete('/admin/bookings/:id', adminAuth, async (req, res) => {
  await Booking.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

app.get('/admin/users', adminAuth, async (req, res) => {
  const users = await User.find().select('-password');
  res.json({ success: true, users });
});

// ============ SEED DATA ============
const seedData = async () => {
  const adminExists = await User.findOne({ email: 'admin@example.com' });
  if (!adminExists) {
    await User.create({ name: 'Admin User', email: 'admin@example.com', password: 'admin123', phone: '03001234567', role: 'admin' });
    console.log('✅ Admin created: admin@example.com / admin123');
  }
  
  const tourCount = await Tour.countDocuments();
  if (tourCount === 0) {
    const tours = [
      { name: "Naran Kaghan Tour", from: "Islamabad", to: "Naran", time: "07:00 AM", price: 4500, seats: 45, rating: 4.8, duration: "8h", type: "Family Tour", description: "Beautiful valleys" },
      { name: "Murree Tour", from: "Rawalpindi", to: "Murree", time: "06:00 AM", price: 2500, seats: 50, rating: 4.6, duration: "2h", type: "Family Tour", description: "Hill station" },
      { name: "Hunza Valley", from: "Gilgit", to: "Hunza", time: "08:00 AM", price: 6000, seats: 35, rating: 4.9, duration: "4h", type: "Couple Tour", description: "Paradise" },
      { name: "Skardu Adventure", from: "Islamabad", to: "Skardu", time: "05:00 AM", price: 8000, seats: 30, rating: 4.9, duration: "12h", type: "Adventure Tour", description: "Cold desert" },
      { name: "Lahore City Tour", from: "Lahore", to: "Badshahi Mosque", time: "10:00 AM", price: 1800, seats: 45, rating: 4.7, duration: "5h", type: "City Tour", description: "Historical" }
    ];
    await Tour.insertMany(tours);
    console.log(`✅ ${tours.length} tours created`);
  }
};

setTimeout(seedData, 2000);

app.get('/health', (req, res) => res.json({ status: 'OK' }));

// ============ PORT 5000 PE SERVER START KARO ============
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

module.exports = app;