// pages/api/admin/packages/[id].js
import connectDB from '../../../../lib/mongodb';
import { Package } from '../../../../lib/models';

export default async function handler(req, res) {
  const { id } = req.query;

  // Only allow GET requests for this endpoint
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();

    if (!id) {
      return res.status(400).json({ message: 'Package ID is required' });
    }

    // Find the package by ID
    const packageData = await Package.findById(id);

    if (!packageData) {
      return res.status(404).json({ message: 'Package not found' });
    }

    // Check if package is active
    if (!packageData.isActive) {
      return res.status(404).json({ message: 'Package not found' });
    }

    // Optionally populate category information
    let packageWithCategory = packageData.toObject();

    try {
      const { Category } = require('../../../../lib/models');
      const category = await Category.findById(packageData.categoryId);

      if (category) {
        packageWithCategory.categoryName = category.name;

        // Add subcategory name if exists
        if (packageData.subcategoryIndex !== null && 
            packageData.subcategoryIndex !== undefined &&
            category.subcategories && 
            category.subcategories[packageData.subcategoryIndex]) {
          packageWithCategory.subcategoryName = category.subcategories[packageData.subcategoryIndex].name;
        }
      }
    } catch (categoryError) {
      console.warn('Could not populate category data:', categoryError);
      // Continue without category data
    }

    console.log(`Fetched package: ${id}`);

    res.status(200).json({
      package: packageWithCategory
    });

  } catch (error) {
    console.error('Get single package error:', error);
    
    // Handle invalid ObjectId
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Package not found' });
    }

    res.status(500).json({ message: 'Internal server error' });
  }
}