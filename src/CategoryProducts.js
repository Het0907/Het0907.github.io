import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ShoppingBag, ChevronRight, Filter, X } from 'lucide-react';
import { FaShoppingCart } from 'react-icons/fa';

export default function CategoryProducts() {
  const { categorySlug, subcategorySlug } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    brand: '',
    minPrice: '',
    maxPrice: '',
    size: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('Fetching products for subcategory:', subcategorySlug);
        const response = await axios.get(`http://localhost:5000/api/products`, {
          params: {
            category: subcategorySlug,
            ...filters
          }
        });
        console.log('Products response:', response.data);
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error details:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status
        });
        setError(err.response?.data?.message || 'Failed to load products. Please try again later.');
        setLoading(false);
      }
    };

    if (subcategorySlug) {
      fetchProducts();
    }
  }, [subcategorySlug, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      brand: '',
      minPrice: '',
      maxPrice: '',
      size: ''
    });
  };

  const handleAddToCart = (product) => {
    // Implementation of adding to cart
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 py-8">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Filters */}
      <div className="mb-8">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50"
        >
          <Filter className="h-5 w-5 mr-2" />
          Filters
        </button>

        {showFilters && (
          <div className="mt-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Brand</label>
                <input
                  type="text"
                  name="brand"
                  value={filters.brand}
                  onChange={handleFilterChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Min Price</label>
                <input
                  type="number"
                  name="minPrice"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Max Price</label>
                <input
                  type="number"
                  name="maxPrice"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Size</label>
                <input
                  type="text"
                  name="size"
                  value={filters.size}
                  onChange={handleFilterChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4">
              <Link to={`/product/${product.slug}`} className="block">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {product.name}
                </h3>
              </Link>
              {product.brand && (
                <p className="text-base font-bold text-gray-700 mb-2">
                  {product.brand}
                </p>
              )}
              <p className="text-gray-600 text-sm mb-4">{product.description}</p>
              
              {/* Price Range */}
              <div className="text-lg font-bold text-blue-600 mb-4">
                {product.variants && product.variants.length > 0 ? (
                  product.variants.length > 1 ? (
                    <span>
                      ₹{product.lowestPrice?.toLocaleString() || 'Price not set'} - ₹{product.highestPrice?.toLocaleString() || 'Price not set'}
                    </span>
                  ) : (
                    <span>₹{product.variants[0].price?.toLocaleString() || 'Price not set'}</span>
                  )
                ) : (
                  <span>No price set</span>
                )}
              </div>

              {/* Variants */}
              {product.variants && product.variants.length > 1 && (
                <div className="text-sm text-gray-500 mb-4">
                  {product.variants.length} sizes available
                </div>
              )}

              {/* Add to Cart Button */}
              <button
                onClick={() => handleAddToCart(product)}
                className="w-full py-2 px-4 rounded-md text-white font-semibold flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700"
              >
                <FaShoppingCart />
                <span>Add to Cart</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 