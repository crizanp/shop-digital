const mongoose = require('mongoose');
const path = require('path');

// Load environment variables from .env.local
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

// Import models
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  hasSubcategories: { type: Boolean, default: false },
  subcategories: [{ name: String, slug: String }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const pluginSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  shortDescription: { type: String, required: true, maxlength: 300 },
  longDescription: { type: String, required: true },
  documentation: { type: String, default: '' },
  version: { type: String, required: true, default: '1.0.0' },
  author: { type: String, required: true },
  authorUrl: { type: String, default: '' },
  pluginUrl: { type: String, default: '' },
  downloadUrl: { type: String, required: true },
  demoUrl: { type: String, default: '' },
  images: [{
    url: { type: String, required: true },
    alt: { type: String, default: '' },
    isPrimary: { type: Boolean, default: false }
  }],
  categoryId: { type: String, required: true },
  subcategoryIndex: { type: Number, default: null },
  tags: [{ type: String, trim: true }],
  features: [{ type: String, required: true }],
  requirements: {
    wordpressVersion: { type: String, default: '5.0+' },
    phpVersion: { type: String, default: '7.4+' },
    testedUpTo: { type: String, default: '6.4' }
  },
  pricing: [{
    title: { type: String, required: true },
    options: [{
      name: { type: String, required: true },
      price: { type: String, required: true },
      description: { type: String, default: '' }
    }]
  }],
  isPremium: { type: Boolean, default: false },
  price: { type: String, default: 'Free' },
  downloads: { type: Number, default: 0 },
  rating: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 }
  },
  isActive: { type: Boolean, default: true },
  featured: { type: Boolean, default: false },
  lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true });

const Category = mongoose.model('Category', categorySchema);
const Plugin = mongoose.model('Plugin', pluginSchema);

async function addTestPlugins() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get all categories
    const categories = await Category.find({});
    console.log('Available categories:', categories.map(c => ({ name: c.name, id: c._id })));

    // Find WordPress Plugins category
    const wpPluginsCategory = categories.find(c => c.slug === 'wordpress-plugins');
    
    if (wpPluginsCategory) {
      const additionalPlugins = [
        {
          name: "Contact Form Builder Pro",
          slug: "contact-form-builder-pro",
          shortDescription: "Advanced form builder with drag-and-drop interface, multi-step forms, and powerful integrations.",
          longDescription: "<h2>Build Beautiful Forms</h2><p>Create stunning contact forms with our powerful drag-and-drop builder.</p>",
          version: "2.5.0",
          author: "Form Masters",
          downloadUrl: "https://downloads.wordpress.org/plugin/contact-form-builder-pro.zip",
          images: [
            {
              url: "/api/placeholder/800/400",
              alt: "Contact Form Builder Interface",
              isPrimary: true
            }
          ],
          categoryId: wpPluginsCategory._id.toString(),
          subcategoryIndex: 5, // Forms
          tags: ["forms", "contact", "builder", "integration"],
          features: [
            "Drag & drop form builder",
            "Multi-step forms",
            "Email notifications",
            "Spam protection",
            "Payment integration"
          ],
          isPremium: true,
          price: "$39",
          downloads: 892,
          rating: {
            average: 4.7,
            count: 156
          }
        },
        {
          name: "Page Speed Optimizer",
          slug: "page-speed-optimizer",
          shortDescription: "Boost your website performance with advanced caching, image optimization, and code minification.",
          longDescription: "<h2>Speed Up Your Website</h2><p>Comprehensive performance optimization plugin.</p>",
          version: "1.8.2",
          author: "Speed Experts",
          downloadUrl: "https://downloads.wordpress.org/plugin/page-speed-optimizer.zip",
          images: [
            {
              url: "/api/placeholder/800/400",
              alt: "Speed Optimizer Dashboard",
              isPrimary: true
            }
          ],
          categoryId: wpPluginsCategory._id.toString(),
          subcategoryIndex: 4, // Performance
          tags: ["performance", "speed", "caching", "optimization"],
          features: [
            "Advanced caching",
            "Image optimization",
            "Code minification",
            "CDN integration",
            "Performance monitoring"
          ],
          isPremium: false,
          price: "Free",
          downloads: 2341,
          rating: {
            average: 4.5,
            count: 198
          },
          featured: true
        }
      ];

      for (const pluginData of additionalPlugins) {
        const existingPlugin = await Plugin.findOne({ slug: pluginData.slug });
        if (!existingPlugin) {
          const plugin = new Plugin(pluginData);
          await plugin.save();
          console.log(`Created plugin: ${pluginData.name}`);
        } else {
          console.log(`Plugin already exists: ${pluginData.name}`);
        }
      }
    }

    console.log('Test plugins added successfully!');

  } catch (error) {
    console.error('Error adding test plugins:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

addTestPlugins();
