// pages/api/packages.js - Public API for frontend
import connectDB from '../../lib/mongodb';
import { Package } from '../../lib/models';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();

    const { 
      categoryId, 
      subcategoryIndex, // Add subcategoryIndex support
      featured, 
      page = 1, 
      limit = 9, 
      search 
    } = req.query;
    
    // Build filter object
    const filter = { isActive: true };
    
    if (categoryId) {
      // FIXED: Keep as string since categoryId is stored as string in DB
      filter.categoryId = categoryId;
    }
    
    // ADDED: Filter by subcategory if provided
    if (subcategoryIndex !== undefined && subcategoryIndex !== null) {
      if (subcategoryIndex === 'null' || subcategoryIndex === '') {
        filter.subcategoryIndex = null;
      } else {
        filter.subcategoryIndex = parseInt(subcategoryIndex);
      }
    }
    
    if (featured === 'true') {
      filter.featured = true;
    }
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { subtitle: { $regex: search, $options: 'i' } }
      ];
    }

  // Enforce server-side pagination limit: default 6, max 6
  const enforcedLimit = Math.min(9, parseInt(limit) || 9);
  const skip = (parseInt(page) - 1) * enforcedLimit;
    
    // Only select essential fields for performance
    const packages = await Package.find(filter)
      .select('_id title description price image features categoryId subcategoryIndex featured createdAt')
      .sort({ featured: -1, createdAt: -1 })
  .skip(skip)
  .limit(enforcedLimit);

    const total = await Package.countDocuments(filter);

    // Add slug generation for each package
    const packagesWithSlug = packages.map(pkg => ({
      ...pkg.toObject(),
      slug: pkg.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    }));

    console.log('Packages query:', { filter, found: packages.length }); // Debug log

    res.status(200).json({
      success: true,
      packages: packagesWithSlug,
      pagination: {
  currentPage: parseInt(page),
  totalPages: Math.ceil(total / enforcedLimit),
        totalItems: total,
  hasNextPage: skip + enforcedLimit < total,
        hasPrevPage: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Public packages API error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch packages' 
    });
  }
}