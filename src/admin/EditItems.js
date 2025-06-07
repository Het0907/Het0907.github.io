import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ChevronRight, Package, Tag, Info, Edit2, Save, X, PlusCircle, MinusCircle } from 'lucide-react';

export default function EditItems() {
  console.log('EditItems component mounted');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState(null);

  const mainCategories = [
    {
      id: 'engineering-hardware',
      name: 'Engineering Hardware',
      description: 'Industrial and engineering equipment, tools, and hardware',
      icon: Package
    },
    {
      id: 'pharma-materials',
      name: 'Pharma Materials',
      description: 'Pharmaceutical materials and equipment',
      icon: Tag
    },
    {
      id: 'ibr-materials',
      name: 'IBR Materials',
      description: 'IBR materials and related products',
      icon: Info
    }
  ];

  useEffect(() => {
    if (selectedCategory) {
      console.log('Selected category for editing:', selectedCategory);
      fetchProducts(selectedCategory);
    }
  }, [selectedCategory]);

  const fetchProducts = async (categorySlug) => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching category ID for slug:', categorySlug);
      const categoryResponse = await axios.get(`http://localhost:5000/api/categories/slug/${categorySlug}`);
      
      if (!categoryResponse.data || !categoryResponse.data._id) {
        console.error('Category data or ID is missing for slug:', categorySlug, categoryResponse.data);
        setError('Failed to get category ID for products');
        setLoading(false);
        return;
      }

      const categoryId = categoryResponse.data._id;
      console.log('Extracted Category ID for products:', categoryId);

      console.log('Fetching products for category ID:', categoryId);
      const response = await axios.get(`http://localhost:5000/api/products/category/${categoryId}`);
      console.log('Products fetched for editing:', response.data);
      setProducts(response.data);
    } catch (err) {
      setError('Failed to fetch products');
      console.error('Error fetching products for editing:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setEditForm({
      name: product.name,
      description: product.description,
      brand: product.brand,
      specifications: { ...product.specifications },
      variants: [...product.variants],
      features: [...product.features]
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSpecificationChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [name]: value
      }
    }));
  };

  const handleAddVariant = () => {
    setEditForm(prev => ({
      ...prev,
      variants: [...prev.variants, { size: '', price: 0 }]
    }));
  };

  const handleRemoveVariant = (index) => {
    setEditForm(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
  };

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...editForm.variants];
    newVariants[index] = {
      ...newVariants[index],
      [field]: value
    };
    setEditForm(prev => ({
      ...prev,
      variants: newVariants
    }));
  };

  const handleAddFeature = () => {
    setEditForm(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const handleRemoveFeature = (index) => {
    setEditForm(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...editForm.features];
    newFeatures[index] = value;
    setEditForm(prev => ({
      ...prev,
      features: newFeatures
    }));
  };

  const handleSave = async () => {
    console.log('Attempting to save product with data:', editForm);
    console.log('Saving product with ID:', editingProduct?._id);
    try {
      await axios.patch(`http://localhost:5000/api/products/${editingProduct._id}`, editForm);
      // Refresh the products list
      fetchProducts(selectedCategory);
      setEditingProduct(null);
      setEditForm(null);
      console.log('Product saved successfully!');
    } catch (err) {
      setError('Failed to update product');
      console.error('Error updating product:', err.response?.data || err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Items</h1>

        {!selectedCategory ? (
          // Show main categories
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mainCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-left"
              >
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-yellow-500 text-white mb-4">
                  <category.icon className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">{category.name}</h2>
                <p className="text-gray-600">{category.description}</p>
                <div className="mt-4 flex items-center text-yellow-600">
                  <span>Edit Products</span>
                  <ChevronRight className="h-5 w-5 ml-1" />
                </div>
              </button>
            ))}
          </div>
        ) : (
          // Show products for selected category
          <div>
            <button
              onClick={() => setSelectedCategory(null)}
              className="mb-6 text-yellow-600 hover:text-yellow-800 flex items-center"
            >
              <ChevronRight className="h-5 w-5 rotate-180 mr-1" />
              Back to Categories
            </button>

            {loading ? (
              <div className="text-center py-8">Loading products...</div>
            ) : error ? (
              <div className="text-center py-8 text-red-600">{error}</div>
            ) : (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 border-b">
                  <h2 className="text-2xl font-semibold text-gray-900">
                    {mainCategories.find(c => c.id === selectedCategory)?.name}
                  </h2>
                </div>
                <div className="divide-y">
                  {products.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">
                      No products found in this category.
                    </div>
                  ) : (
                    products.map((product) => (
                      <div key={product._id} className="p-6 hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                            <p className="text-sm text-gray-600 mt-1">{product.description}</p>
                            <div className="mt-2 flex items-center space-x-4">
                              <span className="text-sm text-gray-500">Brand: {product.brand}</span>
                              <span className="text-sm text-gray-500">
                                Variants: {product.variants.length}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className="text-sm font-medium text-gray-900">
                              ₹{product.variants[0]?.price || 'N/A'}
                            </span>
                          </div>
                          <div className="mt-4 flex justify-end space-x-2">
                            <button
                              onClick={() => handleEdit(product)}
                              className="flex items-center px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                            >
                              <Edit2 className="h-5 w-5 mr-1" />
                              Edit
                            </button>
                          </div>
                        </div>
                        {/* Edit Form */}
                        {editingProduct?._id === product._id && (
                          <div className="mt-6 p-4 bg-gray-50 rounded-lg shadow-inner space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700">Name</label>
                                <input
                                  type="text"
                                  name="name"
                                  value={editForm.name}
                                  onChange={handleInputChange}
                                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700">Brand</label>
                                <input
                                  type="text"
                                  name="brand"
                                  value={editForm.brand}
                                  onChange={handleInputChange}
                                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Description</label>
                              <textarea
                                name="description"
                                value={editForm.description}
                                onChange={handleInputChange}
                                rows="3"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                              ></textarea>
                            </div>

                            {/* Variants */}
                            <div>
                              <h4 className="text-md font-medium text-gray-800 mb-2">Variants</h4>
                              {editForm.variants.map((variant, vIndex) => (
                                <div key={vIndex} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700">Size</label>
                                    <input
                                      type="text"
                                      value={variant.size}
                                      onChange={(e) => handleVariantChange(vIndex, 'size', e.target.value)}
                                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                      placeholder="Size"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700">Price</label>
                                    <input
                                      type="number"
                                      value={variant.price}
                                      onChange={(e) => handleVariantChange(vIndex, 'price', Number(e.target.value))}
                                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                      placeholder="Price"
                                    />
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveVariant(vIndex)}
                                    className="text-red-600 hover:text-red-800"
                                  >
                                    Remove Variant
                                  </button>
                                </div>
                              ))}
                              <button
                                type="button"
                                onClick={handleAddVariant}
                                className="mt-2 text-blue-600 hover:text-blue-800"
                              >
                                Add Variant
                              </button>
                            </div>

                            {/* Features */}
                            <div>
                              <h4 className="text-md font-medium text-gray-800 mb-2">Features</h4>
                              {editForm.features.map((feature, fIndex) => (
                                <div key={fIndex} className="flex items-center space-x-2 mb-2">
                                  <input
                                    type="text"
                                    value={feature}
                                    onChange={(e) => handleFeatureChange(fIndex, e.target.value)}
                                    placeholder="Feature"
                                    className="border border-gray-300 rounded-md shadow-sm p-2 w-full"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveFeature(fIndex)}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <MinusCircle className="h-5 w-5" />
                                  </button>
                                </div>
                              ))}
                              <button
                                type="button"
                                onClick={handleAddFeature}
                                className="flex items-center px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm mt-2"
                              >
                                <PlusCircle className="h-4 w-4 mr-1" /> Add Feature
                              </button>
                            </div>

                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={handleSave}
                                className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                              >
                                <Save className="h-5 w-5 mr-1" />
                                Save
                              </button>
                              <button
                                onClick={() => setEditingProduct(null)}
                                className="flex items-center px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
                              >
                                <X className="h-5 w-5 mr-1" />
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 