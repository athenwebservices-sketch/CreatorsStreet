// seedUsers.js

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/userModel'); // <-- IMPORTANT: Update this path

// --- Configuration ---
// It's best practice to store your MongoDB URI in an environment variable
// For this example, we'll define it here.
const MONGO_URI = 'mongodb://localhost:27017/test'; // <-- IMPORTANT: Update your DB name

// --- Data to Seed ---
const usersToSeed = [
  {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    password: 'password123', // Plain text password, will be hashed
    role: 'customer',
    isEmailVerified: true,
    addresses: [
      {
        type: 'shipping',
        isDefault: true,
        street: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zipCode: '90210',
        country: 'USA'
      }
    ],
    paymentMethods: [
      {
        type: 'card',
        provider: 'visa',
        providerToken: 'tok_1J2x3Y4Z5X6W7V8U',
        last4Digits: '4242',
        cardBrand: 'Visa',
        expiryMonth: 12,
        expiryYear: 2025,
        isDefault: true
      }
    ]
  },
  {
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    password: 'password456',
    role: 'customer',
    isEmailVerified: true,
  },
  {
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@example.com',
    password: 'secureAdminPassword',
    role: 'admin',
    isEmailVerified: true,
  },
  {
    firstName: 'Super',
    lastName: 'Admin',
    email: 'superadmin@example.com',
    password: 'verySecureSuperAdminPassword',
    role: 'superadmin',
    isEmailVerified: true,
  }
];

// --- Seeding Function ---
const seedDatabase = async () => {
  try {
    // 1. Connect to the database
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB connected successfully.');

    // 2. Clear existing users (optional, but good for a clean slate)
    // await User.deleteMany({});
    // console.log('🗑️ Cleared existing users.');

    // 3. Iterate and seed users
    for (const userData of usersToSeed) {
      const { email, password } = userData;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        console.log(`⚠️ User with email "${email}" already exists. Skipping.`);
        continue;
      }

      // Create a new user instance
      const newUser = new User(userData);

      // Use the setPassword method to hash the password
      await newUser.setPassword(password);

      // Save the user to the database
      await newUser.save();
      console.log(`✅ User "${newUser.email}" created successfully.`);
    }

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    // 4. Disconnect from the database
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed.');
  }
};
module.exports = seedDatabase;

// --- Run the Seeder ---
seedDatabase();