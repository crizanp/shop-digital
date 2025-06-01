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
      featured, 
      page = 1, 
      limit = 10, 
      search 
    } = req.query;
    
    // Build filter object
    const filter = { isActive: true };
    
    if (categoryId) {
      filter.categoryId = parseInt(categoryId);
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

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const packages = await Package.find(filter)
      .sort({ featured: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Package.countDocuments(filter);

    res.status(200).json({
      success: true,
      packages,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        hasNextPage: skip + parseInt(limit) < total,
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