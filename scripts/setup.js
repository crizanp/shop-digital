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

// WordPress Plugin Schema
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
const Admin = mongoose.model('Admin', adminSchema);
const Plugin = mongoose.model('Plugin', pluginSchema);

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
    const adminExists = await Admin.findOne({ email: 'admin@foxbeep.com' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('Foxbeep025#', 12);
      const admin = new Admin({
        username: 'foxbeep',
        email: 'admin@foxbeep.com',
        password: hashedPassword,
        role: 'admin'
      });
      await admin.save();
      console.log('Admin user created: admin@foxbeep.com / Foxbeep025#');
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
      },
      // WordPress Plugin Categories
      {
        name: "WordPress Plugins",
        slug: "wordpress-plugins",
        hasSubcategories: true,
        subcategories: [
          { name: "E-commerce", slug: "ecommerce" },
          { name: "SEO", slug: "seo" },
          { name: "Security", slug: "security" },
          { name: "Page Builders", slug: "page-builders" },
          { name: "Performance", slug: "performance" },
          { name: "Forms", slug: "forms" },
          { name: "Analytics", slug: "analytics" },
          { name: "Social Media", slug: "social-media" },
          { name: "Backup", slug: "backup" },
          { name: "Membership", slug: "membership" }
        ]
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

    // Create sample WordPress plugins
    const pluginCategory = await Category.findOne({ slug: "wordpress-plugins" });
    if (pluginCategory) {
      const samplePlugins = [
        {
          name: "Advanced WooCommerce Manager",
          slug: "advanced-woocommerce-manager",
          shortDescription: "Complete e-commerce solution with advanced inventory management, custom checkout fields, and powerful reporting tools.",
          longDescription: `
            <h2>Transform Your WooCommerce Store</h2>
            <p>Advanced WooCommerce Manager is the ultimate plugin for store owners who want complete control over their e-commerce operations.</p>
            
            <h3>Key Features:</h3>
            <ul>
              <li>Advanced inventory management with low stock alerts</li>
              <li>Custom checkout fields and validation</li>
              <li>Comprehensive sales reporting and analytics</li>
              <li>Bulk product import/export tools</li>
              <li>Customer segmentation and targeting</li>
            </ul>
            
            <h3>Perfect For:</h3>
            <p>Store owners, digital marketers, and e-commerce agencies looking to optimize their WooCommerce operations.</p>
          `,
          documentation: `
            <h2>Installation Guide</h2>
            <ol>
              <li>Upload the plugin files to /wp-content/plugins/advanced-woocommerce-manager/</li>
              <li>Activate the plugin through the WordPress admin</li>
              <li>Navigate to WooCommerce > Advanced Manager to configure settings</li>
            </ol>
            
            <h2>Configuration</h2>
            <p>After activation, configure your inventory settings, reporting preferences, and custom checkout fields in the Advanced Manager panel.</p>
          `,
          version: "2.1.0",
          author: "WooCommerce Experts",
          authorUrl: "https://woocommerceexperts.com",
          pluginUrl: "https://wordpress.org/plugins/advanced-woocommerce-manager",
          downloadUrl: "https://downloads.wordpress.org/plugin/advanced-woocommerce-manager.zip",
          demoUrl: "https://demo.woocommerceexperts.com",
          images: [
            {
              url: "/api/placeholder/800/400",
              alt: "Advanced WooCommerce Manager Dashboard",
              isPrimary: true
            },
            {
              url: "/api/placeholder/800/400",
              alt: "Inventory Management Interface",
              isPrimary: false
            }
          ],
          categoryId: pluginCategory._id.toString(),
          subcategoryIndex: 0, // E-commerce
          tags: ["woocommerce", "e-commerce", "inventory", "reporting", "analytics"],
          features: [
            "Advanced inventory tracking",
            "Custom checkout fields",
            "Sales analytics dashboard",
            "Bulk import/export tools",
            "Customer segmentation",
            "Low stock alerts",
            "Custom reporting",
            "Mobile responsive design"
          ],
          requirements: {
            wordpressVersion: "5.8+",
            phpVersion: "7.4+",
            testedUpTo: "6.4"
          },
          pricing: [
            {
              title: "License Options",
              options: [
                {
                  name: "Single Site License",
                  price: "$49",
                  description: "Perfect for individual stores"
                },
                {
                  name: "5 Sites License",
                  price: "$99",
                  description: "Great for agencies and multiple stores"
                },
                {
                  name: "Unlimited License",
                  price: "$199",
                  description: "Use on unlimited sites"
                }
              ]
            }
          ],
          isPremium: true,
          price: "$49",
          downloads: 1250,
          rating: {
            average: 4.8,
            count: 89
          },
          featured: true
        },
        {
          name: "SEO Power Tools",
          slug: "seo-power-tools",
          shortDescription: "Comprehensive SEO plugin with advanced keyword tracking, meta optimization, and Google Analytics integration.",
          longDescription: `
            <h2>Boost Your WordPress SEO</h2>
            <p>SEO Power Tools provides everything you need to optimize your WordPress site for search engines and drive more organic traffic.</p>
            
            <h3>Advanced Features:</h3>
            <ul>
              <li>Real-time SEO analysis and suggestions</li>
              <li>XML sitemap generation</li>
              <li>Schema markup automation</li>
              <li>Social media optimization</li>
              <li>Google Analytics integration</li>
            </ul>
          `,
          documentation: `
            <h2>Getting Started</h2>
            <p>After installation, run the SEO setup wizard to configure your basic settings and connect Google Analytics.</p>
            
            <h2>Features Overview</h2>
            <p>Use the SEO dashboard to monitor your site's performance and implement optimization suggestions.</p>
          `,
          version: "3.2.1",
          author: "SEO Ninjas",
          authorUrl: "https://seoninjas.com",
          downloadUrl: "https://downloads.wordpress.org/plugin/seo-power-tools.zip",
          images: [
            {
              url: "/api/placeholder/800/400",
              alt: "SEO Power Tools Dashboard",
              isPrimary: true
            }
          ],
          categoryId: pluginCategory._id.toString(),
          subcategoryIndex: 1, // SEO
          tags: ["seo", "analytics", "optimization", "google", "schema"],
          features: [
            "Real-time SEO analysis",
            "XML sitemap generation",
            "Schema markup",
            "Social media optimization",
            "Google Analytics integration",
            "Keyword tracking",
            "Performance monitoring"
          ],
          isPremium: false,
          price: "Free",
          downloads: 5420,
          rating: {
            average: 4.6,
            count: 234
          },
          featured: true
        },
        {
          name: "Ultimate Security Shield",
          slug: "ultimate-security-shield",
          shortDescription: "Advanced WordPress security plugin with malware scanning, firewall protection, and real-time threat monitoring.",
          longDescription: `
            <h2>Protect Your WordPress Site</h2>
            <p>Ultimate Security Shield provides enterprise-level security features to protect your WordPress site from threats and attacks.</p>
          `,
          version: "1.8.5",
          author: "Security Pros",
          authorUrl: "https://securitypros.com",
          downloadUrl: "https://downloads.wordpress.org/plugin/ultimate-security-shield.zip",
          images: [
            {
              url: "/api/placeholder/800/400",
              alt: "Security Dashboard",
              isPrimary: true
            }
          ],
          categoryId: pluginCategory._id.toString(),
          subcategoryIndex: 2, // Security
          tags: ["security", "firewall", "malware", "protection"],
          features: [
            "Malware scanning",
            "Firewall protection",
            "Login protection",
            "File integrity monitoring",
            "Real-time alerts"
          ],
          isPremium: true,
          price: "$79",
          downloads: 892,
          rating: {
            average: 4.9,
            count: 67
          }
        }
      ];

      for (const pluginData of samplePlugins) {
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

    console.log('Database setup completed!');
    console.log('\nAdmin Login Details:');
    console.log('Email: admin@foxbeep.com');
    console.log('Password: Foxbeep025#');
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