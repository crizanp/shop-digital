// pages/api/admin/categories.js
import connectDB from '../../../lib/mongodb';
import { Category } from '../../../lib/models';
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
        return await getCategories(req, res);
      case 'POST':
        return await createCategory(req, res);
      case 'PUT':
        return await updateCategory(req, res);
      case 'DELETE':
        return await deleteCategory(req, res);
      default:
        return res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Categories API error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// GET - Fetch all categories
async function getCategories(req, res) {
  try {
    const categories = await Category.find({ isActive: true }).sort({ createdAt: -1 });
    res.status(200).json({ 
      success: true,
      categories 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch categories' 
    });
  }
}

// POST - Create new category
async function createCategory(req, res) {
  try {
    const { name, slug, hasSubcategories, subcategories } = req.body;

    if (!name || !slug) {
      return res.status(400).json({ message: 'Name and slug are required' });
    }

    // Check if slug already exists
    const existingCategory = await Category.findOne({ slug });
    if (existingCategory) {
      return res.status(400).json({ message: 'Slug already exists' });
    }

    const category = new Category({
      name,
      slug,
      hasSubcategories: hasSubcategories || false,
      subcategories: subcategories || []
    });

    await category.save();
    res.status(201).json({ message: 'Category created successfully', category });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create category' });
  }
}

// PUT - Update category
async function updateCategory(req, res) {
  try {
    const { id } = req.query;
    const updates = req.body;

    if (!id) {
      return res.status(400).json({ message: 'Category ID is required' });
    }

    const category = await Category.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json({ message: 'Category updated successfully', category });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update category' });
  }
}

// DELETE - Delete category
async function deleteCategory(req, res) {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ message: 'Category ID is required' });
    }

    const category = await Category.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete category' });
  }
}