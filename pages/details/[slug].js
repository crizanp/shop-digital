// pages/details/[slug].js
import Head from 'next/head';
import PackageDetailPage from '@/components/PackageDetailPage';
import Navbar from '@/components/Navbar';
import connectDB from '@/lib/mongodb';
import { Package, Category } from '@/lib/models';

const slugify = (s = '') =>
  s
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

export default function PackageDetailWrapper({ packageData, categories }) {
  if (!packageData) {
    return (
      <>
        <Head>
          <title>Package Not Found | Professional Design Solutions</title>
        </Head>
        <Navbar />
        <div className="min-h-screen bg-white text-gray-900 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-semibold">Package not found</h2>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{packageData.title} | Professional Design Solutions</title>
        <meta name="description" content={packageData.description || ''} />
      </Head>
      <Navbar />
      <div className="bg-white text-gray-900">
        <div className="container mx-auto max-w-7xl px-4">
          <PackageDetailPage packageData={packageData} categoryData={categories} lightTheme />
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const { params } = context;
  const slug = params.slug;

  try {
    await connectDB();

    // Fetch categories for sidebar/context
    const categories = await Category.find({}).lean().catch(() => []);

  // Fetch active packages (include pricing/faqs/longDescription so detail page can show addons)
  const pkgs = await Package.find({ isActive: true }).lean();

    const found = pkgs.find(p => {
      const generated = slugify(p.title || p._id);
      if (p.slug && p.slug === slug) return true;
      if (generated === slug) return true;
      return String(p._id) === slug;
    });

    // Deep-serialize any ObjectId/Date nested inside objects so Next.js can JSON-serialize props
    const isObjectId = (v) => {
      return (
        v && (
          v._bsontype === 'ObjectID' ||
          (v.constructor && v.constructor.name === 'ObjectID') ||
          (typeof v.toHexString === 'function')
        )
      );
    };

    const deepSerialize = (val) => {
      if (val === null || val === undefined) return null;
      if (Array.isArray(val)) return val.map(deepSerialize);
      if (isObjectId(val)) return String(val);
      if (val instanceof Date) return val.toISOString();
      if (typeof val === 'object') {
        const out = {};
        for (const [k, v] of Object.entries(val)) {
          out[k] = deepSerialize(v);
        }
        return out;
      }
      return val;
    };

    const safePackage = deepSerialize(found);
    const safeCategories = deepSerialize(categories || []);

    return {
      props: {
        packageData: safePackage,
        categories: safeCategories
      }
    };
  } catch (err) {
    console.error('Details SSR error:', err);
    return {
      props: { packageData: null, categories: [] }
    };
  }
}
