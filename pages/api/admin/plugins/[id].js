// pages/api/admin/plugins/[id].js
import connectDB from '../../../../lib/mongodb';
import { Plugin, Category } from '../../../../lib/models';
import { authenticateAdmin } from '../../../../lib/auth';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    // GET doesn't require authentication for admin API (internal use)
    try {
      await connectDB();

      const plugin = await Plugin.findById(id);
      if (!plugin) {
        return res.status(404).json({ message: 'Plugin not found' });
      }

      // Populate category information
      let pluginWithCategory = plugin.toObject();
      
      try {
        const category = await Category.findById(plugin.categoryId);
        if (category) {
          pluginWithCategory.categoryName = category.name;

          // Add subcategory name if exists
          if (plugin.subcategoryIndex !== null && 
              plugin.subcategoryIndex !== undefined &&
              category.subcategories && 
              category.subcategories[plugin.subcategoryIndex]) {
            pluginWithCategory.subcategoryName = category.subcategories[plugin.subcategoryIndex].name;
          }
        }
      } catch (categoryError) {
        console.warn('Could not populate category data:', categoryError);
        // Continue without category data
      }

      console.log(`Fetched plugin: ${id}`);

      res.status(200).json({
        plugin: pluginWithCategory
      });

    } catch (error) {
      console.error('Get single plugin error:', error);
      
      // Handle invalid ObjectId
      if (error.name === 'CastError') {
        return res.status(404).json({ message: 'Plugin not found' });
      }

      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    // All other methods require authentication
    try {
      await connectDB();

      const auth = await authenticateAdmin(req);
      if (!auth.authenticated) {
        return res.status(401).json({ message: auth.error });
      }

      switch (req.method) {
        case 'PUT':
          return await updatePlugin(req, res, id);
        case 'DELETE':
          return await deletePlugin(req, res, id);
        default:
          return res.status(405).json({ message: 'Method not allowed' });
      }
    } catch (error) {
      console.error('Plugin API error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

async function updatePlugin(req, res, id) {
  try {
    const updateData = req.body;

    // If name is being updated, regenerate slug
    if (updateData.name) {
      const newSlug = updateData.name.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      
      // Check if new slug conflicts with another plugin
      const existingPlugin = await Plugin.findOne({ 
        slug: newSlug, 
        _id: { $ne: id } 
      });
      
      if (existingPlugin) {
        return res.status(400).json({ message: 'Plugin name conflicts with existing plugin' });
      }
      
      updateData.slug = newSlug;
    }

    const plugin = await Plugin.findByIdAndUpdate(
      id,
      { ...updateData, lastUpdated: new Date() },
      { new: true, runValidators: true }
    );

    if (!plugin) {
      return res.status(404).json({ message: 'Plugin not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Plugin updated successfully',
      plugin
    });
  } catch (error) {
    console.error('Update plugin error:', error);
    res.status(500).json({ message: 'Failed to update plugin' });
  }
}

async function deletePlugin(req, res, id) {
  try {
    const plugin = await Plugin.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!plugin) {
      return res.status(404).json({ message: 'Plugin not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Plugin deleted successfully'
    });
  } catch (error) {
    console.error('Delete plugin error:', error);
    res.status(500).json({ message: 'Failed to delete plugin' });
  }
}
