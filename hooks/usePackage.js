export const usepackages = (id) => {
  const [packages, setpackages] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchpackages = async () => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`/api/packagess/${id}`);
      
      if (response.data.success) {
        setpackages(response.data.packages);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch packages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchpackages();
  }, [id]);

  return {
    packages,
    loading,
    error,
    refetch: fetchpackages
  };
};