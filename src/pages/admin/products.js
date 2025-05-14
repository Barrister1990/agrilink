import useFarmerAdminProductStore from '@/store/useFarmerAdminProductStore';
import { ChevronLeft, ChevronRight, Edit2, Filter, Plus, Search, Trash2 } from 'lucide-react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import AdminLayout from './layout';

const Products = () => {
  const router = useRouter();
  
  const {
    products,
    isLoading,
    searchQuery,
    categoryFilter,
    categories,
    currentPage,
    productsPerPage,
    fetchProducts,
    fetchStoredImages,
    setSearchQuery,
    setCategoryFilter,
    setCurrentPage,
    deleteProduct,
    setCurrentProduct,
    calculateSavings,
    getPromotionBadgeColor
  } = useFarmerAdminProductStore();
  
  useEffect(() => {
    fetchProducts();
    fetchStoredImages();
  }, [fetchProducts, fetchStoredImages]);
  
  // Filter and search products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  
  // Navigation to add/edit product page
  const handleAddEditProduct = (product = null) => {
    if (product) {
      // Set the current product in the store and navigate to edit page
      setCurrentProduct(product);
      router.push(`/admin/products/add-edit?id=${product.id}`);
    } else {
      // Reset current product and navigate to add page
      setCurrentProduct(null);
      router.push('/admin/products/add-edit');
    }
  };
  
  // Handle product deletion
  const handleDeleteProduct = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    const result = await deleteProduct(productId);
    if (!result.success) {
      alert('Failed to delete product. Please try again.');
    }
  };
  
  // Pagination controls
  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };
  
  // Generate pagination buttons
  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisibleButtons = 5;
    
    // Previous button
    buttons.push(
      <button
        key="prev"
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        className={`p-2 rounded-md ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
        aria-label="Previous page"
      >
        <ChevronLeft size={16} />
      </button>
    );
    
    // Calculate range of page buttons to show
    let startPage = Math.max(1, currentPage - Math.floor(maxVisibleButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1);
    
    // Adjust if we're near the end
    if (endPage - startPage + 1 < maxVisibleButtons) {
      startPage = Math.max(1, endPage - maxVisibleButtons + 1);
    }
    
    // First page and ellipsis
    if (startPage > 1) {
      buttons.push(
        <button
          key="1"
          onClick={() => goToPage(1)}
          className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-100"
          aria-label="Go to first page"
        >
          1
        </button>
      );
      
      if (startPage > 2) {
        buttons.push(
          <span key="start-ellipsis" className="px-2">...</span>
        );
      }
    }
    
    // Page buttons
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => goToPage(i)}
          className={`w-8 h-8 flex items-center justify-center rounded-md ${
            currentPage === i ? 'bg-indigo-600 text-white' : 'hover:bg-gray-100'
          }`}
          aria-label={`Go to page ${i}`}
          aria-current={currentPage === i ? 'page' : undefined}
        >
          {i}
        </button>
      );
    }
    
    // Last page and ellipsis
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        buttons.push(
          <span key="end-ellipsis" className="px-2">...</span>
        );
      }
      
      buttons.push(
        <button
          key={totalPages}
          onClick={() => goToPage(totalPages)}
          className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-100"
          aria-label={`Go to page ${totalPages}`}
        >
          {totalPages}
        </button>
      );
    }
    
    // Next button
    buttons.push(
      <button
        key="next"
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`p-2 rounded-md ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
        aria-label="Next page"
      >
        <ChevronRight size={16} />
      </button>
    );
    
    return buttons;
  };
  
  return (
    <AdminLayout>
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <button 
            onClick={() => handleAddEditProduct()}
            className="mt-4 md:mt-0 flex items-center justify-center px-4 py-2.5 bg-indigo-600 text-white rounded-lg shadow-sm hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <Plus size={18} className="mr-2" />
            Add Product
          </button>
        </div>
        
        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between p-4 space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2.5 w-full md:w-80 border-0 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter size={18} className="text-gray-500" />
                <select 
                  value={categoryFilter}
                  onChange={e => setCategoryFilter(e.target.value)}
                  className="border-0 bg-gray-50 rounded-lg py-2.5 pl-3 pr-8 focus:ring-2 focus:ring-indigo-500 text-gray-700"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
        
        {/* Loading State */}
        {isLoading && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="w-12 h-12 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin"></div>
              <p className="text-gray-500 font-medium">Loading products...</p>
            </div>
          </div>
        )}
        
        {/* Products Grid */}
        {!isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentProducts.map(product => (
              <div key={product.id} className="group bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow border border-gray-200">
                <div className="h-48 bg-gray-100 relative overflow-hidden">
                  <img 
                    src={product.imageUrl || product.image} 
                    alt={product.name} 
                    className="h-full w-full object-cover transform group-hover:scale-105 transition-transform duration-300" 
                  />
                  
                  {/* Promotion badge */}
                  {product.promotion !== 'None' && (
                    <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-medium ${getPromotionBadgeColor(product.promotion)}`}>
                      {product.promotion}
                    </span>
                  )}
                  
                  {/* Discount badge */}
                  {product.promotionPrice && (
                    <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                      {product.savingsPercentage || calculateSavings(product.price, product.promotionPrice)}% OFF
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-lg text-gray-900 mb-1">{product.name}</h3>
                    <span className="text-xs px-2.5 py-1 bg-gray-100 rounded-full text-gray-600">{product.category}</span>
                  </div>
                  
                  <div className="mt-3 flex justify-between items-center">
                    {product.promotionPrice ? (
                      <div className="flex items-center">
                        <span className="font-bold text-lg text-indigo-600">{product.promotionPrice}</span>
                        <span className="text-gray-500 text-sm line-through ml-2">{product.price}</span>
                      </div>
                    ) : (
                      <span className="font-bold text-lg text-indigo-600">{product.price}</span>
                    )}
                    
                    <span className="text-sm text-gray-500">Stock: {product.stock}</span>
                  </div>
                  
                  {/* Action buttons */}
                  <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end space-x-2">
                    <button 
                      onClick={() => handleAddEditProduct(product)}
                      className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                      aria-label="Edit product"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => handleDeleteProduct(product.id)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                      aria-label="Delete product"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Empty State */}
        {!isLoading && filteredProducts.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="p-3 bg-gray-100 rounded-full">
                <Search size={24} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">No products found</h3>
              <p className="text-gray-500 max-w-sm">Try adjusting your search or filter settings to find what you&apos;re looking for.</p>
            </div>
          </div>
        )}
        
        {/* Pagination */}
        {!isLoading && filteredProducts.length > 0 && (
          <div className="mt-8 flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="text-sm text-gray-500">
              Showing {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, filteredProducts.length)} of {filteredProducts.length} products
            </div>
            
            <div className="flex items-center space-x-1">
              {renderPaginationButtons()}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Products;