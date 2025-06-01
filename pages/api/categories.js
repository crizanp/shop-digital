// pages/api/categories.js - Public API for frontend
import connectDB from '../../lib/mongodb';
import { Category } from '../../lib/models';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();

    const categories = await Category.find({ isActive: true })
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      categories
    });
  } catch (error) {
    console.error('Public categories API error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch categories' 
    });
  }
}
