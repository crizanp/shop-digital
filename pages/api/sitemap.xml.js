// Generate sitemap for better SEO
import { connectToDatabase } from '../lib/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { db } = await connectToDatabase();
    
    // Get all categories and subcategories
    const categories = await db.collection('categories').find({ isActive: true }).toArray();
    
    // Get all packages for individual package pages
    const packages = await db.collection('packages').find({ isActive: true }).toArray();
    
    // Get all plugins
    const plugins = await db.collection('plugins').find({ isActive: true }).toArray();

    const baseUrl = 'https://foxbeep.com';
    const currentDate = new Date().toISOString();

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  
  <!-- Homepage -->
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- Plugins page -->
  <url>
    <loc>${baseUrl}/plugins</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`;

    // Add category pages
    categories.forEach(category => {
      if (category.slug !== 'wordpress-plugins') {
        sitemap += `
  <url>
    <loc>${baseUrl}/category/${category.slug}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
      }

      // Add subcategory pages
      if (category.hasSubcategories && category.subcategories) {
        category.subcategories.forEach(sub => {
          if (category.slug === 'wordpress-plugins') {
            sitemap += `
  <url>
    <loc>${baseUrl}/plugins?category=${sub.slug}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
          } else {
            sitemap += `
  <url>
    <loc>${baseUrl}/subcategory/${sub.slug}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
          }
        });
      }
    });

    // Add individual package pages
    packages.forEach(pkg => {
      sitemap += `
  <url>
    <loc>${baseUrl}/details/${pkg.slug}</loc>
    <lastmod>${pkg.updatedAt || currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>`;
    
      // Add images to sitemap
      if (pkg.images && pkg.images.length > 0) {
        pkg.images.forEach(image => {
          sitemap += `
    <image:image>
      <image:loc>${image.url}</image:loc>
      <image:title>${pkg.name}</image:title>
      <image:caption>${pkg.shortDescription}</image:caption>
    </image:image>`;
        });
      }
      
      sitemap += `
  </url>`;
    });

    // Add individual plugin pages
    plugins.forEach(plugin => {
      sitemap += `
  <url>
    <loc>${baseUrl}/plugins/${plugin.slug}</loc>
    <lastmod>${plugin.updatedAt || currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>`;
    
      // Add images to sitemap
      if (plugin.images && plugin.images.length > 0) {
        plugin.images.forEach(image => {
          sitemap += `
    <image:image>
      <image:loc>${image.url}</image:loc>
      <image:title>${plugin.name}</image:title>
      <image:caption>${plugin.shortDescription}</image:caption>
    </image:image>`;
        });
      }
      
      sitemap += `
  </url>`;
    });

    sitemap += `
</urlset>`;

    res.setHeader('Content-Type', 'text/xml');
    res.status(200).send(sitemap);

  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.status(500).json({ message: 'Error generating sitemap' });
  }
}
