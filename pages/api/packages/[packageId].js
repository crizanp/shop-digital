// pages/api/packages/[packageId].js - Public API for package details
import connectDB from '../../../lib/mongodb';
import { Package, Category } from '../../../lib/models';

export default async function handler(req, res) {
  const { packageId } = req.query;

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();

    if (!packageId) return res.status(400).json({ message: 'Package ID is required' });

    const packageData = await Package.findOne({ _id: packageId, isActive: true });
    if (!packageData) return res.status(404).json({ message: 'Package not found' });

    const pkg = packageData.toObject();

    try {
      const category = await Category.findById(pkg.categoryId).select('name slug subcategories');
      if (category) {
        pkg.categoryName = category.name;
        pkg.categorySlug = category.slug;
        if (typeof pkg.subcategoryIndex === 'number' && category.subcategories && category.subcategories[pkg.subcategoryIndex]) {
          const sub = category.subcategories[pkg.subcategoryIndex];
          pkg.subcategoryName = sub.name;
          pkg.subcategorySlug = sub.slug;
        }
      }
    } catch (err) {
      console.error('Error populating category for package detail:', err);
    }

    pkg.slug = (pkg.title || '').toString().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const result = {
      _id: pkg._id,
      title: pkg.title,
      description: pkg.description,
      longDescription: pkg.longDescription,
      price: pkg.price,
      image: pkg.image,
      features: pkg.features || [],
      categoryId: pkg.categoryId,
      categoryName: pkg.categoryName,
      categorySlug: pkg.categorySlug,
      subcategoryIndex: pkg.subcategoryIndex,
      subcategoryName: pkg.subcategoryName,
      subcategorySlug: pkg.subcategorySlug,
      slug: pkg.slug,
      createdAt: pkg.createdAt,
      updatedAt: pkg.updatedAt
    };

    return res.status(200).json({ success: true, package: result });
  } catch (error) {
    console.error('Package detail API error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch package details' });
  }
}