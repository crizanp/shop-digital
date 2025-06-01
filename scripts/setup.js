const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');

// Load environment variables from .env.local
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

// Debug: Check if environment variable is loaded
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Found' : 'Not found');

// Import models
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  hasSubcategories: { type: Boolean, default: false },
  subcategories: [{ name: String, slug: String }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['admin', 'moderator'], default: 'admin' },
  isActive: { type: Boolean, default: true },
  lastLogin: Date
}, { timestamps: true });

const Category = mongoose.model('Category', categorySchema);
const Admin = mongoose.model('Admin', adminSchema);

async function setupDatabase() {
  try {
    // Check if MONGODB_URI is available
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not set. Please check your .env.local file.');
    }

    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Create admin user
    const adminExists = await Admin.findOne({ email: 'admin@example.com' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 12);
      const admin = new Admin({
        username: 'admin',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin'
      });
      await admin.save();
      console.log('Admin user created: admin@example.com / admin123');
    } else {
      console.log('Admin user already exists');
    }

    // Create sample categories
    const sampleCategories = [
      {
        name: "Design Services",
        slug: "design-services",
        hasSubcategories: true,
        subcategories: [
          { name: "Logo Design", slug: "logo-design" },
          { name: "Letterhead Design", slug: "letterhead-design" },
          { name: "Invoice Design", slug: "invoice-design" },
          { name: "Business Card Design", slug: "business-card-design" }
        ]
      },
      {
        name: "Website Services",
        slug: "website-services",
        hasSubcategories: true,
        subcategories: [
          { name: "Websites", slug: "websites" },
          { name: "100 USD+ Websites", slug: "100-usd-websites" },
          { name: "500 USD+ Websites", slug: "500-usd-websites" },
          { name: "1000 USD+ Websites", slug: "1000-usd-websites" }
        ]
      },
      {
        name: "Website Maintenance",
        slug: "website-maintenance",
        hasSubcategories: false
      },
      {
        name: "Digital Marketing",
        slug: "digital-marketing",
        hasSubcategories: false
      },
      {
        name: "Social Media Management",
        slug: "social-media-management",
        hasSubcategories: false
      }
    ];

    for (const catData of sampleCategories) {
      const existingCat = await Category.findOne({ slug: catData.slug });
      if (!existingCat) {
        const category = new Category(catData);
        await category.save();
        console.log(`Created category: ${catData.name}`);
      } else {
        console.log(`Category already exists: ${catData.name}`);
      }
    }

    console.log('Database setup completed!');
    console.log('\nAdmin Login Details:');
    console.log('Email: admin@example.com');
    console.log('Password: admin123');
    console.log('\nAccess admin panel at: http://localhost:3000/admin');

  } catch (error) {
    console.error('Setup error:', error.message);
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      console.log('Disconnected from MongoDB');
    }
  }
}

setupDatabase();