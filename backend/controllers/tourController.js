const Tour = require('../models/Tour');

// @desc    Get all tours
// @route   GET /tours
const getTours = async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice } = req.query;
    let query = { isActive: true };

    if (category && category !== 'All') {
      query.type = `${category} Tour`;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { from: { $regex: search, $options: 'i' } },
        { to: { $regex: search, $options: 'i' } },
      ];
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseInt(minPrice);
      if (maxPrice) query.price.$lte = parseInt(maxPrice);
    }

    const tours = await Tour.find(query).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: tours.length,
      tours,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single tour
// @route   GET /tours/:id
const getTourById = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (!tour) {
      return res.status(404).json({ message: 'Tour not found' });
    }
    res.json({
      success: true,
      tour,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create tour (Admin only)
// @route   POST /tours
const createTour = async (req, res) => {
  try {
    const tour = await Tour.create(req.body);
    res.status(201).json({
      success: true,
      tour,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update tour (Admin only)
// @route   PUT /tours/:id
const updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!tour) {
      return res.status(404).json({ message: 'Tour not found' });
    }
    res.json({
      success: true,
      tour,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete tour (Admin only)
// @route   DELETE /tours/:id
const deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id);
    if (!tour) {
      return res.status(404).json({ message: 'Tour not found' });
    }
    res.json({
      success: true,
      message: 'Tour deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Seed initial tours
// @route   POST /tours/seed
const seedTours = async (req, res) => {
  try {
    const count = await Tour.countDocuments();
    if (count > 0) {
      return res.json({ message: 'Tours already exist' });
    }

    const initialTours = [
      { id: 1, name: "Naran Kaghan Family Tour", from: "Islamabad", to: "Naran Kaghan", time: "07:00 AM", price: 4500, seats: 45, rating: 4.8, duration: "8h", type: "Family Tour", description: "Beautiful valleys & lakes for family", images: ["https://images.pexels.com/photos/2614816/pexels-photo-2614816.jpeg?w=500"], amenities: ["AC Bus", "Meal Included", "Guide", "Hotel Stay"] },
      { id: 2, name: "Murree Family Getaway", from: "Rawalpindi", to: "Murree", time: "06:00 AM", price: 2500, seats: 50, rating: 4.6, duration: "2h", type: "Family Tour", description: "Perfect family picnic spot", images: ["https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?w=500"], amenities: ["AC Bus", "Breakfast", "Sightseeing"] },
      { id: 3, name: "Swat Valley Family Tour", from: "Peshawar", to: "Swat", time: "07:30 AM", price: 3500, seats: 40, rating: 4.7, duration: "5h", type: "Family Tour", description: "Switzerland of Pakistan", images: ["https://images.pexels.com/photos/842519/pexels-photo-842519.jpeg?w=500"], amenities: ["AC Bus", "Meal Included", "Guide"] },
      { id: 4, name: "Hunza Couple Retreat", from: "Gilgit", to: "Hunza", time: "08:00 AM", price: 6000, seats: 35, rating: 4.9, duration: "4h", type: "Couple Tour", description: "Romantic mountain views", images: ["https://images.pexels.com/photos/258117/pexels-photo-258117.jpeg?w=500"], amenities: ["AC Bus", "Luxury Hotel", "Candle Light Dinner", "Guide"] },
      { id: 5, name: "Fairy Meadows Couple Tour", from: "Rawalpindi", to: "Fairy Meadows", time: "04:00 AM", price: 7500, seats: 25, rating: 5.0, duration: "14h", type: "Couple Tour", description: "Perfect for honeymoon", images: ["https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?w=500"], amenities: ["Jeep Service", "Camping", "Bonfire", "Meals"] },
      { id: 6, name: "Karachi City Explorer", from: "Karachi", to: "Clifton & Sea View", time: "09:00 AM", price: 1500, seats: 50, rating: 4.3, duration: "4h", type: "City Tour", description: "Beaches & food street", images: ["https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?w=500"], amenities: ["AC Bus", "Guide", "Food Street Visit"] },
      { id: 7, name: "Lahore Historical Tour", from: "Lahore", to: "Badshahi Mosque", time: "10:00 AM", price: 1800, seats: 45, rating: 4.7, duration: "5h", type: "City Tour", description: "Historical landmarks", images: ["https://images.pexels.com/photos/3837723/pexels-photo-3837723.jpeg?w=500"], amenities: ["AC Bus", "Entry Tickets", "Guide", "Lunch"] },
      { id: 8, name: "Skardu Adventure", from: "Islamabad", to: "Skardu", time: "05:00 AM", price: 8000, seats: 30, rating: 4.9, duration: "12h", type: "Adventure Tour", description: "Cold desert adventure", images: ["https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?w=500"], amenities: ["Flight Ticket", "Hotel Stay", "Meals", "Guide"] },
      { id: 9, name: "Deosai Plains Adventure", from: "Skardu", to: "Deosai", time: "05:30 AM", price: 9000, seats: 25, rating: 4.9, duration: "9h", type: "Adventure Tour", description: "World's highest plateau", images: ["https://images.pexels.com/photos/3799171/pexels-photo-3799171.jpeg?w=500"], amenities: ["4x4 Jeep", "Camping", "Meals", "Guide"] },
      { id: 10, name: "Northern Areas Group Tour", from: "Islamabad", to: "Gilgit-Baltistan", time: "06:00 AM", price: 15000, seats: 40, rating: 4.9, duration: "7 days", type: "Group Tour", description: "Complete northern exploration", images: ["https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?w=500"], amenities: ["AC Transport", "Hotel Stay", "All Meals", "Sightseeing"] },
    ];

    await Tour.insertMany(initialTours);
    res.status(201).json({ message: `${initialTours.length} tours seeded successfully` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getTours, getTourById, createTour, updateTour, deleteTour, seedTours };