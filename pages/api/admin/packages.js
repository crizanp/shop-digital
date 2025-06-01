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

// Helper function to process subcategory data
function processSubcategoryData(packageData) {
  // Process subcategory if provided
  if (packageData.subcategoryId && packageData.subcategoryId.includes('-')) {
    const [categoryId, subcategoryIndex] = packageData.subcategoryId.split('-');
    
    // Ensure categoryId matches (for validation)
    if (packageData.categoryId && packageData.categoryId !== categoryId) {
      throw new Error('Subcategory does not belong to the selected category');
    }
    
    // Set the category if not already set
    if (!packageData.categoryId) {
      packageData.categoryId = categoryId;
    }
    
    packageData.subcategoryIndex = parseInt(subcategoryIndex);
    
    // Remove the combined subcategoryId as we store the index
    delete packageData.subcategoryId;
    
    console.log('Processed subcategory:', {
      categoryId: packageData.categoryId,
      subcategoryIndex: packageData.subcategoryIndex
    });
  } else if (packageData.subcategoryId === '' || packageData.subcategoryId === null) {
    // If subcategoryId is empty, remove subcategoryIndex
    delete packageData.subcategoryIndex;
    delete packageData.subcategoryId;
    console.log('Removed subcategory data');
  }
  
  return packageData;
}

// GET - Fetch Packages with optional filters
async function getPackages(req, res) {
  try {
    const { categoryId, featured, page = 1, limit = 10 } = req.query;
    
    const filter = { isActive: true };
    
    // Handle categoryId - keep it as ObjectId string for MongoDB references
    if (categoryId) {
      filter.categoryId = categoryId;
    }
    
    if (featured) filter.featured = featured === 'true';

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const packages = await Package.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Package.countDocuments(filter);

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

// POST - Create new Package
async function createPackage(req, res) {
  try {
    let packageData = { ...req.body };

    // Validate required fields
    const requiredFields = ['title', 'price', 'image', 'categoryId', 'description', 'longDescription'];
    for (const field of requiredFields) {
      if (!packageData[field]) {
        return res.status(400).json({ message: `${field} is required` });
      }
    }

    // Process subcategory data
    packageData = processSubcategoryData(packageData);

    console.log('Creating package with data:', packageData);

    const newPackage = new Package(packageData);
    await newPackage.save();

    res.status(201).json({ 
      message: 'Package created successfully', 
      package: newPackage
    });
  } catch (error) {
    console.error('Create Package error:', error);
    
    // Better error handling for validation errors
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

    if (!id) {
      return res.status(400).json({ message: 'Package ID is required' });
    }

    // Process subcategory data for updates
    updates = processSubcategoryData(updates);

    console.log('Updating package with data:', {
      id,
      categoryId: updates.categoryId,
      subcategoryIndex: updates.subcategoryIndex,
      hasSubcategory: updates.subcategoryIndex !== undefined
    });

    const updatedPackage = await Package.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedPackage) {
      return res.status(404).json({ message: 'Package not found' });
    }

    console.log('Package updated successfully:', {
      id: updatedPackage._id,
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

    res.status(200).json({ message: 'Package deleted successfully' });
  } catch (error) {
    console.error('Delete package error:', error);
    res.status(500).json({ 
      message: 'Failed to delete package',
      error: error.message 
    });
  }
}