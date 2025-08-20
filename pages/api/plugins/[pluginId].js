// pages/api/plugins/[pluginId].js - Public API for plugin details
import connectDB from '../../../lib/mongodb';
import { Plugin, Category } from '../../../lib/models';
import mongoose from 'mongoose';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { pluginId } = req.query;

  try {
    await connectDB();

    // Check if pluginId is a valid ObjectId
    const isValidObjectId = mongoose.Types.ObjectId.isValid(pluginId) && pluginId.length === 24;
    
    // Build query - prefer slug lookup for better URLs
    let query = {
      isActive: true
    };
    
    if (isValidObjectId) {
      // If it's a valid ObjectId, search by _id
      query._id = pluginId;
    } else {
      // Otherwise search by slug
      query.slug = pluginId;
    }

    const plugin = await Plugin.findOne(query).lean();

    if (!plugin) {
      return res.status(404).json({ 
        success: false, 
        message: 'Plugin not found' 
      });
    }

    // Populate category information
    let pluginWithCategory = { ...plugin };
    
    try {
      const category = await Category.findById(plugin.categoryId);
      if (category) {
        pluginWithCategory.categoryName = category.name;
        pluginWithCategory.categorySlug = category.slug;

        // Add subcategory name if exists
        if (plugin.subcategoryIndex !== null && 
            plugin.subcategoryIndex !== undefined &&
            category.subcategories && 
            category.subcategories[plugin.subcategoryIndex]) {
          const subcategory = category.subcategories[plugin.subcategoryIndex];
          pluginWithCategory.subcategoryName = subcategory.name;
          pluginWithCategory.subcategorySlug = subcategory.slug;
        }
      }
    } catch (categoryError) {
      console.warn('Could not populate category data:', categoryError);
    }

    // Get related plugins (same category, excluding current)
    const relatedPlugins = await Plugin.find({
      categoryId: plugin.categoryId,
      _id: { $ne: plugin._id },
      isActive: true
    })
    .select('name slug shortDescription images price isPremium rating downloads')
    .limit(4)
    .lean();

    // Increment download count (you might want to do this only on actual downloads)
    await Plugin.findByIdAndUpdate(plugin._id, {
      $inc: { downloads: 1 }
    });

    res.status(200).json({
      success: true,
      plugin: pluginWithCategory,
      relatedPlugins
    });

  } catch (error) {
    console.error('Plugin details API error:', error);
    
    // Handle invalid ObjectId
    if (error.name === 'CastError') {
      return res.status(404).json({ 
        success: false, 
        message: 'Plugin not found' 
      });
    }

    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
}
