import connectDB from '@/lib/mongodb';
import { Category, Package, Plugin } from '@/lib/models';

const slugify = (s = '') =>
  s
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

export default function Sitemap() {
  // getServerSideProps will handle the response
  return null;
}

export async function getServerSideProps({ req, res }) {
  try {
    await connectDB();

    const categories = await Category.find({ isActive: true }).lean();
    const packages = await Package.find({ isActive: true }).lean();
    const plugins = await Plugin.find({ isActive: true }).lean();

    const protocol = req.headers['x-forwarded-proto'] || (req.connection && req.connection.encrypted ? 'https' : 'http') || 'https';
    const host = req.headers.host || 'foxbeep.com';
    const baseUrl = `${protocol}://${host}`;

    const currentDate = new Date().toISOString();

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n`;

    // Homepage
    sitemap += `  <url>\n    <loc>${baseUrl}</loc>\n    <lastmod>${currentDate}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;

    // Plugins index
    sitemap += `  <url>\n    <loc>${baseUrl}/plugins</loc>\n    <lastmod>${currentDate}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;

    // Categories and subcategories
    categories.forEach(category => {
      if (category.slug !== 'wordpress-plugins') {
        sitemap += `  <url>\n    <loc>${baseUrl}/category/${category.slug}</loc>\n    <lastmod>${currentDate}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
      }

      if (category.hasSubcategories && category.subcategories) {
        category.subcategories.forEach(sub => {
          if (category.slug === 'wordpress-plugins') {
            sitemap += `  <url>\n    <loc>${baseUrl}/plugins?category=${sub.slug}</loc>\n    <lastmod>${currentDate}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
          } else {
            sitemap += `  <url>\n    <loc>${baseUrl}/subcategory/${sub.slug}</loc>\n    <lastmod>${currentDate}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
          }
        });
      }
    });

    // Packages
    packages.forEach(pkg => {
      const slugPart = pkg.slug || (pkg.title ? slugify(pkg.title) : String(pkg._id));
      const lastmod = pkg.updatedAt ? new Date(pkg.updatedAt).toISOString() : currentDate;
      sitemap += `  <url>\n    <loc>${baseUrl}/details/${slugPart}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n`;

      if (pkg.images && pkg.images.length > 0) {
        pkg.images.forEach(image => {
          const imgUrl = image.url && /^https?:\/\//.test(image.url) ? image.url : `${baseUrl.replace(/\/$/, '')}${image.url.startsWith('/') ? '' : '/'}${image.url}`;
          sitemap += `    <image:image>\n      <image:loc>${imgUrl}</image:loc>\n      <image:title>${pkg.name || pkg.title}</image:title>\n      <image:caption>${pkg.shortDescription || ''}</image:caption>\n    </image:image>\n`;
        });
      }

      sitemap += `  </url>\n`;
    });

    // Plugins
    plugins.forEach(plugin => {
      const slugPart = plugin.slug || (plugin.name ? slugify(plugin.name) : String(plugin._id));
      const lastmod = plugin.updatedAt ? new Date(plugin.updatedAt).toISOString() : currentDate;
      sitemap += `  <url>\n    <loc>${baseUrl}/plugins/${slugPart}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n`;

      if (plugin.images && plugin.images.length > 0) {
        plugin.images.forEach(image => {
          const imgUrl = image.url && /^https?:\/\//.test(image.url) ? image.url : `${baseUrl.replace(/\/$/, '')}${image.url.startsWith('/') ? '' : '/'}${image.url}`;
          sitemap += `    <image:image>\n      <image:loc>${imgUrl}</image:loc>\n      <image:title>${plugin.name}</image:title>\n      <image:caption>${plugin.shortDescription || ''}</image:caption>\n    </image:image>\n`;
        });
      }

      sitemap += `  </url>\n`;
    });

    sitemap += `</urlset>`;

    res.setHeader('Content-Type', 'text/xml');
    res.statusCode = 200;
    res.end(sitemap);

    return { props: {} };
  } catch (err) {
    console.error('Sitemap generation error', err);
    return { notFound: true };
  }
}
