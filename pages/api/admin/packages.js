// pages/api/admin/packages.js
import connectDB from '../../../lib/mongodb';
import { Package } from '../../../lib/models';
import { authenticateAdmin } from '../../../lib/auth';

export default async function handler(req, res) {
  try {
    await connectDB();

    // Authentication check for POST, PUT, DELETE
    if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
      const auth = await authenticateAdmin(req);
      if (!auth.authenticated) {
        return res.status(401).json({ message: auth.error });
      }
    }

    switch (req.method) {
      case 'GET':
        return await getPackages(req, res);
      case 'POST':
        return await createPackage(req, res);
      case 'PUT':
        return await updatePackage(req, res);
      case 'DELETE':
        return await deletePackage(req, res);
      default:
        return res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Packages API error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
// FIXED: Enhanced debugging for subcategory processing
// FIXED: Enhanced debugging for subcategory processing
function processSubcategoryData(packageData) {
  console.log('[DEBUG] Processing subcategory data:', {
    incomingData: {
      subcategoryIndex: packageData.subcategoryIndex, // Look for subcategoryIndex, not subcategoryId
      categoryId: packageData.categoryId,
      type: typeof packageData.subcategoryIndex
    }
  });

  // Only process if we have valid input
  if (packageData.subcategoryIndex !== undefined &&
    packageData.subcategoryIndex !== null &&
    packageData.subcategoryIndex !== '') {

    const subIndex = parseInt(packageData.subcategoryIndex);
    console.log(`[DEBUG] Parsed subcategory index: ${subIndex} (from: ${packageData.subcategoryIndex})`);

    if (!isNaN(subIndex)) {
      packageData.subcategoryIndex = subIndex;
      console.log(`[DEBUG] Set subcategoryIndex to: ${subIndex}`);
    } else {
      console.warn('[WARN] Invalid subcategoryIndex format:', packageData.subcategoryIndex);
      packageData.subcategoryIndex = null;
    }
  } else {
    console.log('[DEBUG] No subcategoryIndex provided or it is empty. Setting to null.');
    packageData.subcategoryIndex = null;
  }

  console.log('[DEBUG] Final package data after processing:', {
    subcategoryIndex: packageData.subcategoryIndex,
    type: typeof packageData.subcategoryIndex
  });

  return packageData;
}
async function getPackages(req, res) {
  try {
    const { categoryId, featured, page = 1, limit = 50, populateCategory = false } = req.query;

    const filter = { isActive: true };

    if (categoryId) {
      filter.categoryId = categoryId;
    }

    if (featured) filter.featured = featured === 'true';

    const skip = (parseInt(page) - 1) * parseInt(limit);

    let packages = await Package.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // ADDED: If we need to populate category information for admin
    if (populateCategory === 'true') {
      const { Category } = require('../../../lib/models');

      // Get all categories for reference
      const categories = await Category.find({ isActive: true });

      // Add category info to packages
      packages = packages.map(pkg => {
        const packageObj = pkg.toObject();
        const category = categories.find(cat => cat._id.toString() === pkg.categoryId);

        if (category) {
          packageObj.categoryName = category.name;

          // Add subcategory name if exists
          if (pkg.subcategoryIndex !== null && pkg.subcategoryIndex !== undefined &&
            category.subcategories && category.subcategories[pkg.subcategoryIndex]) {
            packageObj.subcategoryName = category.subcategories[pkg.subcategoryIndex].name;
          }
        }

        return packageObj;
      });
    }

    const total = await Package.countDocuments(filter);

    console.log(`Fetched ${packages.length} packages`);

    res.status(200).json({
      packages,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total
      }
    });
  } catch (error) {
    console.error('Get packages error:', error);
    res.status(500).json({ message: 'Failed to fetch packages' });
  }
}

// GET - Fetch Packages with optional filters


// POST - Create new Package
async function createPackage(req, res) {
  try {
    let packageData = { ...req.body };

    console.log('Create package request body:', packageData);

    // Validate required fields
    const requiredFields = ['title', 'price', 'image', 'categoryId', 'description', 'longDescription'];
    for (const field of requiredFields) {
      if (!packageData[field]) {
        return res.status(400).json({ message: `${field} is required` });
      }
    }

    // Process subcategory data
    packageData = processSubcategoryData(packageData);

    console.log('Creating package with data:', {
      title: packageData.title,
      categoryId: packageData.categoryId,
      subcategoryIndex: packageData.subcategoryIndex,
      type: typeof packageData.subcategoryIndex
    });

    const newPackage = new Package(packageData);
    await newPackage.save();

    console.log('Package created successfully:', {
      id: newPackage._id,
      subcategoryIndex: newPackage.subcategoryIndex
    });


    res.status(201).json({
      message: 'Package created successfully',
      package: newPackage
    });
  } catch (error) {
    console.error('Create Package error:', error);

    if (error.name === 'ValidationError') {
      const validationErrors = Object.keys(error.errors).map(key => ({
        field: key,
        message: error.errors[key].message
      }));

      return res.status(400).json({
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    res.status(500).json({
      message: 'Failed to create package',
      error: error.message
    });
  }
}

// PUT - Update Package
async function updatePackage(req, res) {
  try {
    const { id } = req.query;
    let updates = { ...req.body };

    console.log('Update package request:', { id, body: updates });

    if (!id) {
      return res.status(400).json({ message: 'Package ID is required' });
    }

    // Process subcategory data for updates
    updates = processSubcategoryData(updates);

    console.log('Updating package with data:', {
      id,
      updates: {
        ...updates,
        subcategoryIndex: updates.subcategoryIndex,
        type: typeof updates.subcategoryIndex
      }
    });

    const updatedPackage = await Package.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    console.log('Package updated successfully:', {
      id: updatedPackage._id,
      subcategoryIndex: updatedPackage.subcategoryIndex
    });

    if (!updatedPackage) {
      return res.status(404).json({ message: 'Package not found' });
    }

    console.log('Package updated successfully:', {
      id: updatedPackage._id,
      title: updatedPackage.title,
      categoryId: updatedPackage.categoryId,
      subcategoryIndex: updatedPackage.subcategoryIndex
    });

    res.status(200).json({
      message: 'Package updated successfully',
      package: updatedPackage
    });
  } catch (error) {
    console.error('Update package error:', error);

    if (error.name === 'ValidationError') {
      const validationErrors = Object.keys(error.errors).map(key => ({
        field: key,
        message: error.errors[key].message
      }));

      return res.status(400).json({
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    res.status(500).json({
      message: 'Failed to update package',
      error: error.message
    });
  }
}

// DELETE - Delete Package (soft delete)
async function deletePackage(req, res) {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ message: 'Package ID is required' });
    }

    const deletedPackage = await Package.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!deletedPackage) {
      return res.status(404).json({ message: 'Package not found' });
    }

    console.log('Package soft deleted:', id);

    res.status(200).json({ message: 'Package deleted successfully' });
  } catch (error) {
    console.error('Delete package error:', error);
    res.status(500).json({
      message: 'Failed to delete package',
      error: error.message
    });
  }
}