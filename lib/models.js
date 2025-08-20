import mongoose from 'mongoose';

// Category Schema
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  hasSubcategories: {
    type: Boolean,
    default: false
  },
  subcategories: [{
    name: {
      type: String,
      required: true
    },
    slug: {
      type: String,
      required: true
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Package Schema - FIXED: subcategoryIndex should be Number, not String
const packageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  subtitle: {
    type: String,
    trim: true
  },
  price: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  categoryId: {
    type: String,
    required: true
  },
  // FIXED: Changed to Number and allow null
  subcategoryIndex: {
    type: Number,
    default: null
  },
  description: {
    type: String,
    required: true
  },
  longDescription: {
    type: String,
    required: true
  },
  features: [{
    type: String
  }],
  // Optional live demo URL for packages (non-compulsory)
  demoUrl: {
    type: String,
    default: ''
  },
  faqs: [{
    question: {
      type: String,
      required: true
    },
    answer: {
      type: String,
      required: true
    }
  }],
  pricing: [{
    title: {
      type: String,
      required: true
    },
    options: [{
      name: {
        type: String,
        required: true
      },
      price: {
        type: String,
        required: true
      }
    }]
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Admin User Schema
const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['admin', 'moderator'],
    default: 'admin'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true
});

// WordPress Plugin Schema
const pluginSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  shortDescription: {
    type: String,
    required: true,
    maxlength: 300
  },
  longDescription: {
    type: String,
    required: true
  },
  documentation: {
    type: String,
    default: ''
  },
  version: {
    type: String,
    required: true,
    default: '1.0.0'
  },
  author: {
    type: String,
    required: true
  },
  authorUrl: {
    type: String,
    default: ''
  },
  pluginUrl: {
    type: String,
    default: ''
  },
  downloadUrl: {
    type: String,
    required: true
  },
  demoUrl: {
    type: String,
    default: ''
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      default: ''
    },
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  categoryId: {
    type: String,
    required: true
  },
  subcategoryIndex: {
    type: Number,
    default: null
  },
  tags: [{
    type: String,
    trim: true
  }],
  features: [{
    type: String,
    required: true
  }],
  requirements: {
    wordpressVersion: {
      type: String,
      default: '5.0+'
    },
    phpVersion: {
      type: String,
      default: '7.4+'
    },
    testedUpTo: {
      type: String,
      default: '6.4'
    }
  },
  pricing: [{
    title: {
      type: String,
      required: true
    },
    options: [{
      name: {
        type: String,
        required: true
      },
      price: {
        type: String,
        required: true
      },
      description: {
        type: String,
        default: ''
      }
    }]
  }],
  isPremium: {
    type: Boolean,
    default: false
  },
  price: {
    type: String,
    default: 'Free'
  },
  downloads: {
    type: Number,
    default: 0
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Export models
export const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);
export const Package = mongoose.models.Package || mongoose.model('Package', packageSchema);
export const Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema);
export const Plugin = mongoose.models.Plugin || mongoose.model('Plugin', pluginSchema);