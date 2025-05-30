import useCartStore from "@/store/cartStore";
import useWholePriceStore from "@/store/useWholePriceStore";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const categories = ["All", "Fruits", "Vegetables", "Dairy", "Grains", "Meat"];

// Modern wholesale skeleton card component
const SkeletonCard = () => {
  return (
    <div className="bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
      <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200"></div>
      <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
        <div className="h-3 sm:h-4 bg-gray-200 rounded-lg w-4/5"></div>
        <div className="flex items-center justify-between">
          <div className="h-5 sm:h-6 bg-gray-200 rounded-lg w-2/5"></div>
          <div className="h-3 bg-gray-200 rounded-lg w-1/4"></div>
        </div>
        <div className="h-4 bg-gray-200 rounded-lg w-3/5"></div>
        <div className="h-8 sm:h-9 bg-gray-200 rounded-lg w-full"></div>
      </div>
    </div>
  );
};

const Wholesales = () => {
  const { wholePriceProducts, loading, fetchWholePriceProducts } = useWholePriceStore();
  const { addToCart } = useCartStore();

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("popularity");
  const [timeLeft, setTimeLeft] = useState(3600);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    fetchWholePriceProducts();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const filteredProducts = wholePriceProducts
    .filter((product) => selectedCategory === "All" || product.category === selectedCategory)
    .sort((a, b) => {
      if (sortBy === "price-low") return a.wholesalePrice - b.wholesalePrice;
      if (sortBy === "price-high") return b.wholesalePrice - a.wholesalePrice;
      return 0;
    });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const displayedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation Bar */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <nav className="text-sm">
            <ol className="flex items-center space-x-2 text-gray-600">
              <li>
                <Link href="/" className="hover:text-blue-600 transition-colors font-medium">
                  Home
                </Link>
              </li>
              <li className="text-gray-400">›</li>
              <li className="text-blue-600 font-semibold">Wholesale</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        {/* Banner with Overlay Content */}
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden mb-6 sm:mb-8">
          <Image
            src='/images/wholesale-banner.png'
            alt="Wholesale Banner"
            width={1200}
            height={400}
            className="w-full h-40 sm:h-56 md:h-72 lg:h-80 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-blue-600/50"></div>
          
          {/* Overlay Content */}
          <div className="absolute inset-0 flex items-center justify-center text-center text-white p-4">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-4">
                Wholesale Marketplace
              </h1>
              <p className="text-sm sm:text-base md:text-lg opacity-90 max-w-2xl">
                Get the best bulk prices for your business needs
              </p>
            </div>
          </div>
        </div>

        {/* Stats & Timer Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 sm:mb-8">
          {/* Timer Card */}
          <div className="sm:col-span-2 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-4 sm:p-6 text-white text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              <h3 className="text-lg sm:text-xl font-bold">Special Offer Ends</h3>
            </div>
            <div className="text-2xl sm:text-3xl font-mono font-bold">
              {formatTime(timeLeft)}
            </div>
          </div>

          {/* Info Cards */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-1">50%+</div>
            <div className="text-sm text-gray-600">Bulk Savings</div>
          </div>
          
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1">1000+</div>
            <div className="text-sm text-gray-600">Products</div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 mb-6">
          {/* Category Pills - Mobile First */}
          <div className="mb-4 sm:mb-6">
            <h3 className="text-lg font-semibold mb-3">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`px-3 sm:px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? "bg-blue-600 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => {
                    setSelectedCategory(category);
                    setCurrentPage(1);
                  }}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Sort & Results */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Sort by:</label>
              <select
                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="popularity">Most Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>

            {!loading && (
              <div className="text-sm text-gray-600">
                <span className="font-semibold text-gray-900">{filteredProducts.length}</span> wholesale products
              </div>
            )}
          </div>
        </div>

        {/* Products Grid - Different Layout */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
          {loading ? (
            Array(12).fill(0).map((_, index) => (
              <SkeletonCard key={`skeleton-${index}`} />
            ))
          ) : (
            displayedProducts.map((product) => (
              <Link key={product.id} href={`/all-products/${product.id}`} passHref>
                <div className="group bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg hover:border-blue-200 transition-all duration-300 cursor-pointer">
                  {/* Product Image */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {/* Wholesale Badge */}
                    <div className="absolute top-2 right-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs px-2 py-1 rounded-lg font-medium shadow-lg">
                      <span className="hidden sm:inline">Bulk</span>
                      <span className="sm:hidden">📦</span>
                    </div>
                    {/* Savings Badge */}
                    <div className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded-lg font-medium">
                      Save {Math.round(((product.originalPrice - product.wholesalePrice) / product.originalPrice) * 100)}%
                    </div>
                  </div>

                  {/* Product Info - Compact Layout */}
                  <div className="p-3 sm:p-4">
                    <h3 className="font-medium text-gray-900 text-xs sm:text-sm line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
                      {product.name}
                    </h3>
                    
                    {/* Price Section */}
                    <div className="space-y-1 mb-3">
                      <div className="flex items-center justify-between">
                        <span className="text-lg sm:text-xl font-bold text-blue-600">
                          GH₵{product.wholesalePrice}
                        </span>
                        <span className="text-xs text-gray-500 line-through">
                          GH₵{product.originalPrice}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600">
                        Minimum order: 10 units
                      </div>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-2 sm:py-2.5 px-3 rounded-lg sm:rounded-xl text-xs sm:text-sm transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      onClick={(e) => {
                        e.preventDefault();
                        addToCart(product);
                      }}
                    >
                      <span className="hidden sm:inline">Add to Cart</span>
                      <span className="sm:hidden">Add</span>
                    </button>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Enhanced Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between mt-8 sm:mt-12 space-y-4 sm:space-y-0">
            <div className="text-sm text-gray-600">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of {filteredProducts.length} products
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-50 shadow-sm border border-gray-200"
                }`}
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="hidden sm:inline">Previous</span>
              </button>

              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                  const pageNum = Math.max(1, currentPage - 1) + i;
                  if (pageNum > totalPages) return null;
                  return (
                    <button
                      key={pageNum}
                      className={`w-10 h-10 rounded-lg font-medium transition-all ${
                        currentPage === pageNum
                          ? "bg-blue-600 text-white shadow-lg"
                          : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                      }`}
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-50 shadow-sm border border-gray-200"
                }`}
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              >
                <span className="hidden sm:inline">Next</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wholesales;