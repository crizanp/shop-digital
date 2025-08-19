// pages/category/[categorySlug].js
import PricingPage from '../index';

export default function CategoryPage(props) {
  return <PricingPage {...props} />;
}

export async function getServerSideProps(context) {
  const { params, req } = context;
  const categorySlug = params.categorySlug;
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  const host = req.headers.host;
  const baseUrl = `${protocol}://${host}`;

  // Fetch categories
  const categoriesRes = await fetch(`${baseUrl}/api/categories`);
  const categoriesData = await categoriesRes.json();
  const categories = categoriesData.categories || [];

  // Find category ID by slug
  const category = categories.find(c => c.slug === categorySlug);
  const categoryId = category ? category._id : null;

  // Fetch packages filtered by category (first page)
  const packagesRes = await fetch(`${baseUrl}/api/packages?page=1&limit=6${categoryId ? `&categoryId=${categoryId}` : ''}`);
  const packagesData = await packagesRes.json();

  return {
    props: {
      initialCategories: categories,
      initialPackages: packagesData.packages || [],
      initialPagination: packagesData.pagination || {}
    }
  };
}
