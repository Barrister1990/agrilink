import useFarmerAdminProductStore from '@/store/useFarmerAdminProductStore';
import { AlertCircle, ArrowLeft, CheckCircle, ImageIcon, Loader2, Search, Upload, X } from 'lucide-react';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import AdminLayout from '../layout';

const ProductAddEdit = () => {
    const router = useRouter();
    const { id } = router.query;
    const fileInputRef = useRef(null);
    const [showImageSelector, setShowImageSelector] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: '' });
    const [activeTab, setActiveTab] = useState('basic'); // Tabs for organizing the form
    
    const {
      currentProduct,
      products,
      formData,
      isSubmitting,
      availableImages,
      filteredImages,
      imageSearchQuery,
      fetchProducts,
      fetchStoredImages,
      setCurrentProduct,
      updateFormField,
      setImageSearchQuery,
      updateProductImage,
      uploadImage,
      saveProduct,
      getPromotionTypes,
      getDefaultCategories,
      resetFormData
    } = useFarmerAdminProductStore();
    
    const [errorMessage, setErrorMessage] = useState('');
    const isEditMode = Boolean(id);
    
    // Load product data on initial load
    useEffect(() => {
      fetchProducts();
      fetchStoredImages();
      
      // Reset form when leaving the page
      return () => resetFormData();
    }, [fetchProducts, fetchStoredImages, resetFormData]);
    
    // Set the current product when id is available
    useEffect(() => {
      if (id && products.length > 0) {
        const product = products.find(p => p.id.toString() === id.toString());
        if (product) {
          setCurrentProduct(product);
        } else {
          router.replace('/admin/products');
        }
      }
    }, [id, products, setCurrentProduct, router]);
    
    // Auto-hide toast after 5 seconds
    useEffect(() => {
      if (toast.show) {
        const timer = setTimeout(() => {
          setToast({ ...toast, show: false });
        }, 5000);
        
        return () => clearTimeout(timer);
      }
    }, [toast]);
    
    // Handle file selection
    const handleFileSelect = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      // Check if it's an image file
      if (!file.type.startsWith('image/')) {
        setErrorMessage('Please select an image file.');
        return;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage('Image size should not exceed 5MB.');
        return;
      }
      
      uploadImage(file).then(result => {
        if (!result.success) {
          setErrorMessage('Failed to upload image. Please try again.');
        }
      });
    };
    
    // Handle form submission
    const handleSubmit = async (e) => {
      e.preventDefault();
      setErrorMessage('');
      
      // Basic validation
      if (!formData.name.trim()) {
        setErrorMessage('Product name is required.');
        return;
      }
      
      if (!formData.price.trim() || isNaN(parseFloat(formData.price))) {
        setErrorMessage('Valid price is required.');
        return;
      }
      
      if (!formData.stock.trim() || isNaN(parseInt(formData.stock))) {
        setErrorMessage('Valid stock quantity is required.');
        return;
      }
      
      // Validate promotion price if promotion is not 'None'
      if (formData.promotion !== 'None') {
        if (!formData.promotionPrice.trim() || isNaN(parseFloat(formData.promotionPrice))) {
          setErrorMessage('Valid promotion price is required for this promotion type.');
          return;
        }
        
        const price = parseFloat(formData.price);
        const promoPrice = parseFloat(formData.promotionPrice);
        
        if (promoPrice >= price) {
          setErrorMessage('Promotion price must be lower than regular price.');
          return;
        }
      }
      
      // Save the product
      const result = await saveProduct();
      
      if (result.success) {
        // Show success toast
        setToast({
          show: true,
          message: `Product ${isEditMode ? 'updated' : 'added'} successfully!`,
          type: 'success'
        });
        
        // Redirect after a short delay to allow toast to be seen
        setTimeout(() => {
          router.push('/admin/products');
        }, 1500);
      } else {
        setErrorMessage(result.error || 'Failed to save product. Please try again.');
      }
    };
    
    return (
      <AdminLayout>
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-8">
            <button
              onClick={() => router.back()}
              className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditMode ? 'Edit Product' : 'Add New Product'}
            </h1>
          </div>
          
          {/* Toast Notification */}
          {toast.show && (
            <div 
              className={`fixed top-4 right-4 z-50 flex items-center p-4 mb-4 rounded-lg shadow-md ${
                toast.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-blue-50 text-blue-800 border border-blue-200'
              }`}
              role="alert"
            >
              <CheckCircle size={20} className={`mr-3 ${toast.type === 'success' ? 'text-green-600' : 'text-blue-600'}`} />
              <div className="text-sm font-medium">{toast.message}</div>
              <button 
                type="button" 
                className="ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8"
                onClick={() => setToast({ ...toast, show: false })}
              >
                <X size={16} className="text-gray-500" />
              </button>
            </div>
          )}
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {/* Error message */}
            {errorMessage && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
                <AlertCircle size={20} className="text-red-600 mr-3 mt-0.5" />
                <div className="text-red-700">{errorMessage}</div>
              </div>
            )}
            
            {/* Form Tabs */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="flex -mb-px">
                {["basic", "description", "specifications"].map((tab) => (
                  <button
                    type="button"
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-4 px-6 font-medium text-sm border-b-2 ${
                      activeTab === tab
                        ? "border-indigo-600 text-indigo-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {tab === "basic" ? "Basic Info" : tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </nav>
            </div>
            
            {/* Basic Info Tab */}
            {activeTab === 'basic' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left column */}
                <div className="space-y-6">
                  {/* Product Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) => updateFormField('name', e.target.value)}
                      placeholder="Enter product name"
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  
                  {/* Category */}
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                      Category *
                    </label>
                    <select
                      id="category"
                      value={formData.category}
                      onChange={(e) => updateFormField('category', e.target.value)}
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      required
                    >
                      {getDefaultCategories().map(category => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Price */}
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                      Price ($) *
                    </label>
                    <div className="relative rounded-lg shadow-sm">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <input
                        type="text"
                        id="price"
                        value={formData.price}
                        onChange={(e) => updateFormField('price', e.target.value.replace(/[^0-9.]/g, ''))}
                        placeholder="0.00"
                        className="w-full rounded-lg border-gray-300 pl-7 focus:border-indigo-500 focus:ring-indigo-500"
                        required
                      />
                    </div>
                  </div>
                  
                  {/* Stock */}
                  <div>
                    <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
                      Stock Quantity *
                    </label>
                    <input
                      type="text"
                      id="stock"
                      value={formData.stock}
                      onChange={(e) => updateFormField('stock', e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="Enter quantity available"
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      required
                    />
                  </div>
                </div>
                
                {/* Right column */}
                <div className="space-y-6">
                  {/* Product Image */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Image
                    </label>
                    <div className="mt-1 flex flex-col items-center">
                      <div 
                        className="relative h-40 w-40 bg-gray-100 rounded-lg overflow-hidden border border-gray-300"
                      >
                        <img 
                          src={formData.image} 
                          alt="Product preview" 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      
                      <div className="mt-4 flex space-x-2">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          <Upload size={16} className="mr-2" />
                          Upload New
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowImageSelector(true);
                            fetchStoredImages();
                          }}
                          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          <ImageIcon size={16} className="mr-2" />
                          Select Image
                        </button>
                        <input
                          type="file"
                          ref={fileInputRef}
                          className="hidden"
                          accept="image/*"
                          onChange={handleFileSelect}
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Promotion */}
                  <div>
                    <label htmlFor="promotion" className="block text-sm font-medium text-gray-700 mb-1">
                      Promotion Type
                    </label>
                    <select
                      id="promotion"
                      value={formData.promotion}
                      onChange={(e) => updateFormField('promotion', e.target.value)}
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                      {getPromotionTypes().map(type => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Promotion Price - Only shown if promotion is not 'None' */}
                  {formData.promotion !== 'None' && (
                    <div>
                      <label htmlFor="promotionPrice" className="block text-sm font-medium text-gray-700 mb-1">
                        Promotion Price ($) *
                      </label>
                      <div className="relative rounded-lg shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <span className="text-gray-500 sm:text-sm">$</span>
                        </div>
                        <input
                          type="text"
                          id="promotionPrice"
                          value={formData.promotionPrice}
                          onChange={(e) => updateFormField('promotionPrice', e.target.value.replace(/[^0-9.]/g, ''))}
                          placeholder="0.00"
                          className="w-full rounded-lg border-gray-300 pl-7 focus:border-indigo-500 focus:ring-indigo-500"
                          required={formData.promotion !== 'None'}
                        />
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        Must be lower than the regular price
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Description Tab */}
            {activeTab === 'description' && (
              <div className="space-y-6">
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Product Description
                  </label>
                  <textarea
                    id="description"
                    value={formData.description || ''}
                    onChange={(e) => updateFormField('description', e.target.value)}
                    placeholder="Enter a detailed description of your product"
                    rows={6}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Describe your product&apos;s features, benefits, and key selling points
                  </p>
                </div>
                
                <div>
                  <label htmlFor="keyFeatures" className="block text-sm font-medium text-gray-700 mb-1">
                    Key Features (Optional)
                  </label>
                  <textarea
                    id="keyFeatures"
                    value={formData.keyFeatures || ''}
                    onChange={(e) => updateFormField('keyFeatures', e.target.value)}
                    placeholder="Enter key features, one per line"
                    rows={4}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    One feature per line, e.g., &apos;Freshly harvested for maximum quality&apos;
                  </p>
                </div>
              </div>
            )}
            
            {/* Specifications Tab */}
            {activeTab === 'specifications' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">
                      Brand
                    </label>
                    <input
                      type="text"
                      id="brand"
                      value={formData.brand || ''}
                      onChange={(e) => updateFormField('brand', e.target.value)}
                      placeholder="Brand name"
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="origin" className="block text-sm font-medium text-gray-700 mb-1">
                      Origin
                    </label>
                    <input
                      type="text"
                      id="origin"
                      value={formData.origin || ''}
                      onChange={(e) => updateFormField('origin', e.target.value)}
                      placeholder="Country or region of origin"
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
                      Weight
                    </label>
                    <input
                      type="text"
                      id="weight"
                      value={formData.weight || ''}
                      onChange={(e) => updateFormField('weight', e.target.value)}
                      placeholder="e.g., 1kg, 500g"
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="shelfLife" className="block text-sm font-medium text-gray-700 mb-1">
                      Shelf Life
                    </label>
                    <input
                      type="text"
                      id="shelfLife"
                      value={formData.shelfLife || ''}
                      onChange={(e) => updateFormField('shelfLife', e.target.value)}
                      placeholder="e.g., 7 days, 1 month"
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="storage" className="block text-sm font-medium text-gray-700 mb-1">
                      Storage Instructions
                    </label>
                    <input
                      type="text"
                      id="storage"
                      value={formData.storage || ''}
                      onChange={(e) => updateFormField('storage', e.target.value)}
                      placeholder="e.g., Cool, dry place"
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="isOrganic" className="block text-sm font-medium text-gray-700 mb-1">
                      Organic
                    </label>
                    <select
                      id="isOrganic"
                      value={formData.isOrganic || 'false'}
                      onChange={(e) => updateFormField('isOrganic', e.target.value)}
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="packaging" className="block text-sm font-medium text-gray-700 mb-1">
                      Packaging
                    </label>
                    <input
                      type="text"
                      id="packaging"
                      value={formData.packaging || ''}
                      onChange={(e) => updateFormField('packaging', e.target.value)}
                      placeholder="e.g., Eco-friendly, Plastic-free"
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>
            )}
            
            {/* Submit Button */}
            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={() => router.push('/admin/products')}
                className="mr-4 px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-indigo-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="mr-2 animate-spin" />
                    Saving...
                  </>
                ) : isEditMode ? 'Update Product' : 'Add Product'}
              </button>
            </div>
          </form>
          
          {/* Image Selector Modal */}
          {showImageSelector && (
            <div className="fixed inset-0 z-10 overflow-y-auto">
              <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                  <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>
                
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                  <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-gray-900">Select Product Image</h3>
                      <button
                        type="button"
                        onClick={() => setShowImageSelector(false)}
                        className="bg-white rounded-full p-1 hover:bg-gray-100"
                      >
                        <X size={20} className="text-gray-500" />
                      </button>
                    </div>
                    
                    {/* Search Input */}
                    <div className="mb-4 relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Search size={18} className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="Search images..."
                        value={imageSearchQuery}
                        onChange={e => setImageSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    
                    {/* Image Grid */}
                    <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto p-1">
                      {filteredImages.length > 0 ? (
                        filteredImages.map((image, index) => (
                          <div 
                            key={index} 
                            className="relative h-24 bg-gray-100 rounded-lg overflow-hidden border border-gray-300 cursor-pointer hover:border-indigo-500 transition-colors"
                            onClick={() => {
                              updateProductImage(image);
                              setShowImageSelector(false);
                            }}
                          >
                            <img 
                              src={image.path} 
                              alt={image.name} 
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ))
                      ) : (
                        <div className="col-span-3 py-8 text-center text-gray-500">
                          No images found. Try uploading a new image.
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button
                      type="button"
                      onClick={() => setShowImageSelector(false)}
                      className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </AdminLayout>
    );
  };
  
  export default ProductAddEdit;