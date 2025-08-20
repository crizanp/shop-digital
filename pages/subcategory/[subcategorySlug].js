// pages/subcategory/[subcategorySlug].js
import PricingPage from '../index';

export default function SubcategoryPage(props) {
  return <PricingPage {...props} />;
}

export async function getServerSideProps(context) {
  const { params, req } = context;
  const subcategorySlug = params.subcategorySlug;
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  const host = req.headers.host;
  const baseUrl = `${protocol}://${host}`;

  // Fetch categories
  const categoriesRes = await fetch(`${baseUrl}/api/categories`);
  const categoriesData = await categoriesRes.json();
  const categories = categoriesData.categories || [];

  // Find parent category and subcategory index
  let categoryId = null;
  let subIndex = null;
  let parentCategory = null;
  for (const cat of categories) {
    const idx = (cat.subcategories || []).findIndex(s => s.slug === subcategorySlug);
    if (idx !== -1) {
      categoryId = cat._id;
      subIndex = idx;
      parentCategory = cat;
      break;
    }
  }

  // If this is a WordPress plugins subcategory, redirect to plugins page with category filter
  if (parentCategory && parentCategory.slug === 'wordpress-plugins') {
    return {
      redirect: {
        destination: `/plugins?category=${subcategorySlug}`,
        permanent: false,
      },
    };
  }

  // Fetch packages filtered by categoryId and subcategoryIndex
  let packagesUrl = `${baseUrl}/api/packages?page=1&limit=6`;
  if (categoryId) packagesUrl += `&categoryId=${categoryId}`;
  if (subIndex !== null) packagesUrl += `&subcategoryIndex=${subIndex}`;

  const packagesRes = await fetch(packagesUrl);
  const packagesData = await packagesRes.json();

  return {
    props: {
      initialCategories: categories,
      initialPackages: packagesData.packages || [],
      initialPagination: packagesData.pagination || {}
    }
  };
}