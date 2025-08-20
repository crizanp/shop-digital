// pages/api/admin/plugins.js
import connectDB from '../../../lib/mongodb';
import { Plugin } from '../../../lib/models';
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
        return await getPlugins(req, res);
      case 'POST':
        return await createPlugin(req, res);
      case 'PUT':
        return await updatePlugin(req, res);
      case 'DELETE':
        return await deletePlugin(req, res);
      default:
        return res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Plugins API error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// GET - Fetch all plugins with optional filters
async function getPlugins(req, res) {
  try {
    const { 
      page = 1, 
      limit = 10, 
      category, 
      search, 
      featured, 
      isPremium,
      isActive 
    } = req.query;

    const filter = {};
    
    if (category) filter.categoryId = category;
    if (featured) filter.featured = featured === 'true';
    if (isPremium) filter.isPremium = isPremium === 'true';
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const plugins = await Plugin.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Plugin.countDocuments(filter);

    res.status(200).json({
      success: true,
      plugins,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get plugins error:', error);
    res.status(500).json({ message: 'Failed to fetch plugins' });
  }
}

// POST - Create new plugin
async function createPlugin(req, res) {
  try {
    const {
      name,
      shortDescription,
      longDescription,
      documentation,
      version,
      author,
      authorUrl,
      pluginUrl,
      downloadUrl,
      demoUrl,
      images,
      categoryId,
      subcategoryIndex,
      tags,
      features,
      requirements,
      pricing,
      isPremium,
      price
    } = req.body;

    // Generate slug from name
    const slug = name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Check if slug already exists
    const existingPlugin = await Plugin.findOne({ slug });
    if (existingPlugin) {
      return res.status(400).json({ message: 'Plugin with this name already exists' });
    }

    const plugin = new Plugin({
      name,
      slug,
      shortDescription,
      longDescription,
      documentation,
      version,
      author,
      authorUrl,
      pluginUrl,
      downloadUrl,
      demoUrl,
      images: images || [],
      categoryId,
      subcategoryIndex,
      tags: tags || [],
      features: features || [],
      requirements: requirements || {},
      pricing: pricing || [],
      isPremium: isPremium || false,
      price: price || 'Free'
    });

    await plugin.save();

    res.status(201).json({
      success: true,
      message: 'Plugin created successfully',
      plugin
    });
  } catch (error) {
    console.error('Create plugin error:', error);
    res.status(500).json({ message: 'Failed to create plugin' });
  }
}

// PUT - Update plugin
async function updatePlugin(req, res) {
  try {
    const { id } = req.query;
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

// DELETE - Delete plugin (soft delete)
async function deletePlugin(req, res) {
  try {
    const { id } = req.query;

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
