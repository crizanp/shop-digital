/**
 * Search API Endpoint
 * Searches across packages, plugins, and categories
 * Supports fuzzy search and filtering
 */

const searchDatabase = async (query) => {
  try {
    // Fetch all packages
    const packagesRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/packages?limit=1000`
    );
    const packagesData = packagesRes.ok ? await packagesRes.json() : { packages: [] };
    const packages = packagesData.packages || [];

    // Fetch all plugins
    const pluginsRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/plugins?limit=1000`
    );
    const pluginsData = pluginsRes.ok ? await pluginsRes.json() : { plugins: [] };
    const plugins = pluginsData.plugins || [];

    // Fetch categories
    const categoriesRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/categories`
    );
    const categoriesData = categoriesRes.ok ? await categoriesRes.json() : { categories: [] };
    const categories = categoriesData.categories || [];

    // Normalize search query
    const normalizedQuery = query.toLowerCase().trim();
    if (!normalizedQuery) return { packages: [], plugins: [], categories: [] };

    // Fuzzy search function
    const calculateSimilarity = (text, query) => {
      text = text.toLowerCase();
      
      // Exact match gets highest score
      if (text === query) return 100;
      
      // Starts with query
      if (text.startsWith(query)) return 80;
      
      // Contains query as substring
      if (text.includes(query)) return 60;
      
      // Levenshtein distance for fuzzy matching
      const words = text.split(' ');
      let maxScore = 0;
      
      for (const word of words) {
        const similarity = levenshteinSimilarity(word, query);
        maxScore = Math.max(maxScore, similarity);
      }
      
      return maxScore * 50; // Scale to 0-50
    };

    // Levenshtein distance algorithm for fuzzy matching
    const levenshteinSimilarity = (str1, str2) => {
      const len1 = str1.length;
      const len2 = str2.length;
      const matrix = Array(len2 + 1)
        .fill(null)
        .map(() => Array(len1 + 1).fill(0));

      for (let i = 0; i <= len1; i++) matrix[0][i] = i;
      for (let j = 0; j <= len2; j++) matrix[j][0] = j;

      for (let j = 1; j <= len2; j++) {
        for (let i = 1; i <= len1; i++) {
          const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
          matrix[j][i] = Math.min(
            matrix[j][i - 1] + 1,
            matrix[j - 1][i] + 1,
            matrix[j - 1][i - 1] + indicator
          );
        }
      }

      const distance = matrix[len2][len1];
      const maxLen = Math.max(len1, len2);
      return 1 - distance / maxLen;
    };

    // Search packages
    const searchedPackages = packages
      .map((pkg) => {
        const titleScore = calculateSimilarity(pkg.title || '', normalizedQuery);
        const descScore = calculateSimilarity(pkg.description || '', normalizedQuery);
        const categoryScore = calculateSimilarity(pkg.category || '', normalizedQuery);
        const maxScore = Math.max(titleScore, descScore, categoryScore);

        return {
          ...pkg,
          searchScore: maxScore,
          type: 'package'
        };
      })
      .filter((pkg) => pkg.searchScore > 0)
      .sort((a, b) => b.searchScore - a.searchScore)
      .slice(0, 10);

    // Search plugins
    const searchedPlugins = plugins
      .map((plugin) => {
        const nameScore = calculateSimilarity(plugin.name || '', normalizedQuery);
        const descScore = calculateSimilarity(plugin.description || '', normalizedQuery);
        const categoryScore = calculateSimilarity(plugin.category || '', normalizedQuery);
        const maxScore = Math.max(nameScore, descScore, categoryScore);

        return {
          ...plugin,
          searchScore: maxScore,
          type: 'plugin'
        };
      })
      .filter((plugin) => plugin.searchScore > 0)
      .sort((a, b) => b.searchScore - a.searchScore)
      .slice(0, 10);

    // Search categories
    const searchedCategories = categories
      .map((cat) => {
        const nameScore = calculateSimilarity(cat.name || '', normalizedQuery);
        const descScore = calculateSimilarity(cat.description || '', normalizedQuery);
        const maxScore = Math.max(nameScore, descScore);

        return {
          ...cat,
          searchScore: maxScore,
          type: 'category'
        };
      })
      .filter((cat) => cat.searchScore > 0)
      .sort((a, b) => b.searchScore - a.searchScore)
      .slice(0, 5);

    // Combine and sort all results
    const allResults = [...searchedPackages, ...searchedPlugins, ...searchedCategories].sort(
      (a, b) => b.searchScore - a.searchScore
    );

    return {
      packages: searchedPackages,
      plugins: searchedPlugins,
      categories: searchedCategories,
      allResults,
      query: normalizedQuery,
      totalResults: allResults.length
    };
  } catch (error) {
    console.error('Search error:', error);
    return {
      packages: [],
      plugins: [],
      categories: [],
      allResults: [],
      query,
      totalResults: 0,
      error: error.message
    };
  }
};

export default async function handler(req, res) {
  const { q } = req.query;

  if (!q || typeof q !== 'string') {
    return res.status(400).json({
      error: 'Missing or invalid search query',
      packages: [],
      plugins: [],
      categories: [],
      allResults: [],
      totalResults: 0
    });
  }

  const results = await searchDatabase(q);
  return res.status(200).json(results);
}
