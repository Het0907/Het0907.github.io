import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ChevronRight, Package, Tag, Info, Plus, PlusCircle, MinusCircle } from 'lucide-react';

export default function AddItems() {
  const [selectedMainCategorySlug, setSelectedMainCategorySlug] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState(null);
  const [newSubcategoryName, setNewSubcategoryName] = useState('');
  const [newSubcategorySlug, setNewSubcategorySlug] = useState('');
  const [newSubcategoryImage, setNewSubcategoryImage] = useState('');
  const [newSubcategoryError, setNewSubcategoryError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    brand: '',
    category: '',
    specifications: {
      material: '',
      finish: '',
      type: ''
    },
    variants: [
      {
        size: '',
        price: ''
      }
    ],
    features: ['']
  });

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
    if (selectedMainCategorySlug) {
      fetchSubcategories(selectedMainCategorySlug);
    }
  }, [selectedMainCategorySlug]);

  const fetchSubcategories = async (parentSlug) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/categories?parentCategorySlug=${parentSlug}`);
      setSubcategories(response.data);
      setNewSubcategoryError(null);
    } catch (err) {
      console.error('Error fetching subcategories:', err);
      setSubcategories([]);
      setNewSubcategoryError('Failed to fetch subcategories.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubcategory = async () => {
    if (!newSubcategoryName.trim() || !newSubcategorySlug.trim() || !newSubcategoryImage.trim()) {
      setNewSubcategoryError('Subcategory name, slug, and image are required.');
      return;
    }
    if (!selectedMainCategorySlug) {
      setNewSubcategoryError('Please select a main category first.');
      return;
    }

    setLoading(true);
    setNewSubcategoryError(null);
    try {
      const mainCategoryResponse = await axios.get(`http://localhost:5000/api/categories/slug/${selectedMainCategorySlug}`);
      const parentCategoryId = mainCategoryResponse.data._id;

      const newSubcategoryData = {
        name: newSubcategoryName.trim(),
        slug: newSubcategorySlug.trim(),
        parentCategory: parentCategoryId,
        description: `Subcategory of ${selectedMainCategorySlug}`,
        image: newSubcategoryImage.trim()
      };

      const response = await axios.post('http://localhost:5000/api/categories', newSubcategoryData);
      const addedSubcategory = response.data;

      setSubcategories(prev => [...prev, addedSubcategory]);
      setSelectedSubcategoryId(addedSubcategory._id);
      setNewSubcategoryName('');
      setNewSubcategorySlug('');
      setNewSubcategoryImage('');
      setSuccess('Subcategory added successfully!');
    } catch (err) {
      console.error('Error adding subcategory:', err.response?.data || err.message);
      setNewSubcategoryError(err.response?.data?.message || 'Failed to add new subcategory.');
    } finally {
      setLoading(false);
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
        { size: '', price: '' }
      ]
    }));
  };

  const removeVariant = (index) => {
    const newVariants = formData.variants.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      variants: newVariants
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
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      features: newFeatures
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!selectedSubcategoryId) {
      setError('Please select or add a subcategory before adding a product.');
      setLoading(false);
      return;
    }

    try {
      const productData = {
        ...formData,
        category: selectedSubcategoryId
      };

      await axios.post('http://localhost:5000/api/products', productData);
      setSuccess('Product added successfully!');
      setFormData({
        name: '',
        slug: '',
        description: '',
        brand: '',
        category: '',
        specifications: {
          material: '',
          finish: '',
          type: ''
        },
        variants: [
          {
            size: '',
            price: ''
          }
        ],
        features: ['']
      });
      setSelectedSubcategoryId(null);
      setNewSubcategoryName('');
      setNewSubcategorySlug('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add product');
      console.error('Error adding product:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToCategories = () => {
    setSelectedMainCategorySlug(null);
    setSubcategories([]);
    setSelectedSubcategoryId(null);
    setNewSubcategoryName('');
    setNewSubcategorySlug('');
    setNewSubcategoryImage('');
    setNewSubcategoryError(null);
    setError(null);
    setSuccess(null);
  };

  const handleBackToSubcategories = () => {
    setSelectedSubcategoryId(null);
    setFormData(prev => ({
      ...prev,
      category: ''
    }));
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Add New Items</h1>

        {success && <div className="bg-green-100 text-green-800 px-4 py-2 rounded mb-4">{success}</div>}
        {error && <div className="bg-red-100 text-red-800 px-4 py-2 rounded mb-4">{error}</div>}

        {!selectedMainCategorySlug ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mainCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedMainCategorySlug(category.id)}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-left"
              >
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-yellow-500 text-white mb-4">
                  <category.icon className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">{category.name}</h2>
                <p className="text-gray-600">{category.description}</p>
                <div className="mt-4 flex items-center text-yellow-600">
                  <span>Select Category</span>
                  <ChevronRight className="h-5 w-5 ml-1" />
                </div>
              </button>
            ))}
          </div>
        ) : !selectedSubcategoryId ? (
          <div>
            <button
              onClick={handleBackToCategories}
              className="mb-6 text-yellow-600 hover:text-yellow-800 flex items-center"
            >
              <ChevronRight className="h-5 w-5 rotate-180 mr-1" />
              Back to Main Categories
            </button>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Subcategories for {mainCategories.find(c => c.id === selectedMainCategorySlug)?.name}
            </h2>

            {loading ? (
              <div className="text-center py-8">Loading subcategories...</div>
            ) : newSubcategoryError ? (
              <div className="text-center py-8 text-red-600">{newSubcategoryError}</div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6">
                {subcategories.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Existing Subcategories:</h3>
                    <div className="flex flex-wrap gap-3">
                      {subcategories.map(sub => (
                        <button
                          key={sub._id}
                          onClick={() => setSelectedSubcategoryId(sub._id)}
                          className="px-4 py-2 bg-yellow-100 border border-yellow-300 rounded-lg shadow-sm text-yellow-800 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                        >
                          {sub.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <h3 className="text-xl font-semibold text-gray-800 mb-4">Add New Subcategory:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="newSubcategoryName" className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      id="newSubcategoryName"
                      value={newSubcategoryName}
                      onChange={(e) => setNewSubcategoryName(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      placeholder="e.g., Welding Rods"
                    />
                  </div>
                  <div>
                    <label htmlFor="newSubcategorySlug" className="block text-sm font-medium text-gray-700">Slug</label>
                    <input
                      type="text"
                      id="newSubcategorySlug"
                      value={newSubcategorySlug}
                      onChange={(e) => setNewSubcategorySlug(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      placeholder="e.g., welding-rods"
                    />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Image URL</label>
                  <input
                    type="text"
                    value={newSubcategoryImage}
                    onChange={(e) => setNewSubcategoryImage(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    placeholder="Enter image URL (e.g., /images/categories/example.jpg)"
                  />
                </div>
                <button
                  onClick={handleAddSubcategory}
                  className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  disabled={loading}
                >
                  <Plus className="h-5 w-5 mr-1" /> Add Subcategory
                </button>
              </div>
            )}
          </div>
        ) : (
          <div>
            <button
              onClick={handleBackToSubcategories}
              className="mb-6 text-yellow-600 hover:text-yellow-800 flex items-center"
            >
              <ChevronRight className="h-5 w-5 rotate-180 mr-1" />
              Back to Subcategories
            </button>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Add New Product to {subcategories.find(s => s._id === selectedSubcategoryId)?.name || 'Selected Subcategory'}
            </h2>
            
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Product Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="slug" className="block text-sm font-medium text-gray-700">Product Slug</label>
                  <input
                    type="text"
                    id="slug"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="brand" className="block text-sm font-medium text-gray-700">Brand</label>
                  <input
                    type="text"
                    id="brand"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Specifications (Optional)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="material" className="block text-sm font-medium text-gray-700">Material</label>
                    <input
                      type="text"
                      id="material"
                      name="material"
                      value={formData.specifications.material}
                      onChange={handleSpecificationChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                  </div>
                  <div>
                    <label htmlFor="finish" className="block text-sm font-medium text-gray-700">Finish</label>
                    <input
                      type="text"
                      id="finish"
                      name="finish"
                      value={formData.specifications.finish}
                      onChange={handleSpecificationChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                  </div>
                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
                    <input
                      type="text"
                      id="type"
                      name="type"
                      value={formData.specifications.type}
                      onChange={handleSpecificationChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Variants</h3>
                {formData.variants.map((variant, index) => (
                  <div key={index} className="grid grid-cols-4 gap-4 mb-2 items-end">
                    <div>
                      <label htmlFor={`variant-size-${index}`} className="block text-sm font-medium text-gray-700">Size</label>
                      <input
                        type="text"
                        id={`variant-size-${index}`}
                        value={variant.size}
                        onChange={(e) => handleVariantChange(index, 'size', e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        placeholder="e.g., 2.5mm"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor={`variant-price-${index}`} className="block text-sm font-medium text-gray-700">Price</label>
                      <input
                        type="number"
                        id={`variant-price-${index}`}
                        value={variant.price}
                        onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        placeholder="e.g., 299"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeVariant(index)}
                      className="flex items-center justify-center h-10 w-10 text-red-500 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                      <MinusCircle className="h-5 w-5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addVariant}
                  className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mt-4"
                >
                  <PlusCircle className="h-5 w-5 mr-2" /> Add Variant
                </button>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Features</h3>
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => handleFeatureChange(index, e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      placeholder="e.g., Easy to use"
                    />
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="flex items-center justify-center h-10 w-10 text-red-500 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                      <MinusCircle className="h-5 w-5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addFeature}
                  className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mt-4"
                >
                  <PlusCircle className="h-5 w-5 mr-2" /> Add Feature
                </button>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 font-semibold"
                  disabled={loading}
                >
                  {loading ? 'Adding Product...' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
} 