import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Plus, X } from 'lucide-react';

export default function AddProduct() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    brand: '',
    category: '',
    image: '',
    specifications: {
      material: '',
      finish: '',
      type: ''
    },
    variants: [
      {
        size: '',
        price: '',
        stock: ''
      }
    ],
    features: ['']
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/categories');
      setCategories(response.data);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSpecificationChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [name]: value
      }
    }));
  };

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...formData.variants];
    newVariants[index] = {
      ...newVariants[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      variants: newVariants
    }));
  };

  const addVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [
        ...prev.variants,
        { size: '', price: '', stock: '' }
      ]
    }));
  };

  const removeVariant = (index) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData(prev => ({
      ...prev,
      features: newFeatures
    }));
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const removeFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Convert string values to numbers for variants
      const processedData = {
        ...formData,
        variants: formData.variants.map(variant => ({
          ...variant,
          price: Number(variant.price),
          stock: Number(variant.stock)
        }))
      };

      await axios.post('http://localhost:5000/api/products', processedData);
      navigate('/admin/products');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Add New Product</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Slug</label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Brand</label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">Image URL</label>
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Specifications</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Material</label>
              <input
                type="text"
                name="material"
                value={formData.specifications.material}
                onChange={handleSpecificationChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Finish</label>
              <input
                type="text"
                name="finish"
                value={formData.specifications.finish}
                onChange={handleSpecificationChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Type</label>
              <input
                type="text"
                name="type"
                value={formData.specifications.type}
                onChange={handleSpecificationChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
          </div>
        </div>

        {/* Variants */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Variants</h2>
            <button
              type="button"
              onClick={addVariant}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Variant
            </button>
          </div>
          {formData.variants.map((variant, index) => (
            <div key={index} className="grid grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Size</label>
                <input
                  type="text"
                  value={variant.size}
                  onChange={(e) => handleVariantChange(index, 'size', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Price</label>
                <input
                  type="number"
                  value={variant.price}
                  onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Stock</label>
                <input
                  type="number"
                  value={variant.stock}
                  onChange={(e) => handleVariantChange(index, 'stock', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => removeVariant(index)}
                  className="text-red-600 hover:text-red-900"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Features</h2>
            <button
              type="button"
              onClick={addFeature}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Feature
            </button>
          </div>
          {formData.features.map((feature, index) => (
            <div key={index} className="flex gap-4 mb-4">
              <input
                type="text"
                value={feature}
                onChange={(e) => handleFeatureChange(index, e.target.value)}
                className="flex-1 border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
              <button
                type="button"
                onClick={() => removeFeature(index)}
                className="text-red-600 hover:text-red-900"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Adding Product...' : 'Add Product'}
          </button>
        </div>
      </form>
    </div>
  );
} 