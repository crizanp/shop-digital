const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

// Admin schema
const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['admin', 'moderator'], default: 'admin' },
  isActive: { type: Boolean, default: true },
  lastLogin: Date
}, { timestamps: true });

const Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema);

async function debugLogin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find the admin user
    const admin = await Admin.findOne({ email: 'admin@foxbeep.com' });
    
    if (!admin) {
      console.log('❌ Admin user not found!');
      return;
    }

    console.log('✅ Admin user found:');
    console.log('Email:', admin.email);
    console.log('Username:', admin.username);
    console.log('Role:', admin.role);
    console.log('IsActive:', admin.isActive);
    console.log('Password hash:', admin.password);

    // Test password comparison
    const testPassword = 'Foxbeep025#';
    const isValid = await bcrypt.compare(testPassword, admin.password);
    
    console.log('\n🔑 Password Test:');
    console.log('Test password:', testPassword);
    console.log('Password valid:', isValid);

    if (!isValid) {
      console.log('\n🔧 Recreating admin with correct password...');
      const hashedPassword = await bcrypt.hash('Foxbeep025#', 12);
      admin.password = hashedPassword;
      admin.username = 'foxbeep'; // Add missing username
      await admin.save();
      console.log('✅ Password and username updated successfully!');
      
      // Test again
      const isValidNow = await bcrypt.compare('Foxbeep025#', admin.password);
      console.log('Password valid now:', isValidNow);
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

debugLogin();
