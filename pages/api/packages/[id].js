// pages/api/packagess/[id].js - Get single packages
import connectDB from '../../../lib/mongodb';
import { packages } from '../../../lib/models';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();

    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ 
        success: false, 
        message: 'packages ID is required' 
      });
    }

    const packages = await packages.findById(id);

    if (!packages || !packages.isActive) {
      return res.status(404).json({ 
        success: false, 
        message: 'packages not found' 
      });
    }

    res.status(200).json({
      success: true,
      packages
    });
  } catch (error) {
    console.error('Get packages API error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch packages' 
    });
  }
}