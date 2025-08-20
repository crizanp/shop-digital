// pages/api/plugins.js - Public API for frontend
import connectDB from '../../lib/mongodb';
import { Plugin } from '../../lib/models';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();

    const { 
      page = 1, 
      limit = 12, 
      category, 
      search, 
      featured, 
      isPremium,
      sort = 'newest'
    } = req.query;

    // Build filter for active plugins only
    const filter = { isActive: true };
    
    if (category && category !== 'all') {
      filter.categoryId = category;
    }
    
    if (featured === 'true') {
      filter.featured = true;
    }
    
    if (isPremium === 'true') {
      filter.isPremium = true;
    } else if (isPremium === 'false') {
      filter.isPremium = false;
    }
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Build sort options
    let sortOptions = {};
    switch (sort) {
      case 'newest':
        sortOptions = { createdAt: -1 };
        break;
      case 'oldest':
        sortOptions = { createdAt: 1 };
        break;
      case 'popular':
        sortOptions = { downloads: -1 };
        break;
      case 'rating':
        sortOptions = { 'rating.average': -1, 'rating.count': -1 };
        break;
      case 'name':
        sortOptions = { name: 1 };
        break;
      case 'updated':
        sortOptions = { lastUpdated: -1 };
        break;
      default:
        sortOptions = { createdAt: -1 };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const plugins = await Plugin.find(filter)
      .select('-documentation') // Exclude documentation from list view
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Plugin.countDocuments(filter);

    // Get featured plugins for homepage
    const featuredPlugins = await Plugin.find({ 
      isActive: true, 
      featured: true 
    })
    .select('-documentation')
    .limit(6)
    .lean();

    res.status(200).json({
      success: true,
      plugins,
      featuredPlugins,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total,
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Public plugins API error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch plugins' 
    });
  }
}
