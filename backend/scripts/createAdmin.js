const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const adminExists = await User.findOne({ email: 'admin@bustracker.com' });
    if (!adminExists) {
      const admin = new User({
        name: 'Super Admin',
        email: 'admin@bustracker.com',
        password: 'admin123',
        phone: '03001234567',
        role: 'admin'
      });
      await admin.save();
      console.log('✅ Admin created successfully!');
      console.log('📧 Email: admin@bustracker.com');
      console.log('🔑 Password: admin123');
    } else {
      console.log('ℹ️ Admin already exists');
    }
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

createAdmin();