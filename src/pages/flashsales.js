import useCartStore from "@/store/cartStore";
import useFlashSaleStore from "@/store/useFlashSaleStore";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const categories = ["All", "Fruits", "Vegetables", "Dairy", "Grains", "Meat"];

// Modern skeleton card component - Mobile Optimized
const SkeletonCard = () => {
  return (
    <div className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
      <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200"></div>
      <div className="p-2 sm:p-3 md:p-4 space-y-2 sm:space-y-3">
        <div className="h-3 sm:h-4 bg-gray-200 rounded-full w-3/4"></div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-1 sm:space-y-0">
          <div className="h-4 sm:h-5 bg-gray-200 rounded-full w-1/2 sm:w-1/3"></div>
          <div className="h-3 sm:h-4 bg-gray-200 rounded-full w-1/3 sm:w-1/4"></div>
        </div>
        <div className="h-7 sm:h-8 md:h-9 bg-gray-200 rounded-lg sm:rounded-xl w-full"></div>
      </div>
    </div>
  );
};

const FlashSales = () => {
  const { flashProducts, loading, fetchFlashProducts } = useFlashSaleStore();
  const { addToCart } = useCartStore();

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("popularity");
  const [timeLeft, setTimeLeft] = useState(3600);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    fetchFlashProducts();
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

  const filteredProducts = flashProducts
    .filter((product) => selectedCategory === "All" || product.category === selectedCategory)
    .sort((a, b) => {
      if (sortBy === "price-low") return a.salePrice - b.salePrice;
      if (sortBy === "price-high") return b.salePrice - a.salePrice;
      return 0;
    });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const displayedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm  z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          {/* Breadcrumb */}
          <nav className="text-sm mb-4">
            <ol className="flex items-center space-x-2 text-gray-500">
              <li>
                <Link href="/" className="hover:text-gray-900 transition-colors">
                  Home
                </Link>
              </li>
              <li className="text-gray-300">/</li>
              <li className="text-gray-900 font-medium">Flash Sale</li>
            </ol>
          </nav>

          {/* Hero Banner */}
          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden mb-6">
            <Image
              src='/images/flashsale-banner.png'
              alt="Flash Sale Banner"
              width={1200}
              height={400}
              className="w-full h-32 sm:h-48 md:h-64 lg:h-80 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
          </div>

          {/* Timer Section */}
          <div className="relative">
            <div className="bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl p-4 sm:p-6 text-center text-white shadow-lg">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <svg className="w-5 h-5 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <h2 className="text-lg sm:text-xl font-bold">Flash Sale Ends In</h2>
              </div>
              <div className="text-2xl sm:text-3xl font-mono font-bold tracking-wider">
                {formatTime(timeLeft)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Controls Section */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            {/* Category Filter */}
            <div className="flex-1 max-w-xs">
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setCurrentPage(1);
                }}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Filter */}
            <div className="flex-1 max-w-xs">
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
          </div>

          {/* Results Count */}
          {!loading && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-gray-600 text-sm">
                Showing <span className="font-semibold text-gray-900">{filteredProducts.length}</span> products
              </p>
            </div>
          )}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4 lg:gap-6">
          {loading ? (
            Array(12).fill(0).map((_, index) => (
              <SkeletonCard key={`skeleton-${index}`} />
            ))
          ) : (
            displayedProducts.map((product) => (
              <Link key={product.id} href={`/all-products/${product.id}`} passHref>
                <div className="group bg-white rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:border-gray-200 transition-all duration-300 cursor-pointer">
                  {/* Product Image */}
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Flash Sale Badge - Mobile Optimized */}
                    <div className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full font-medium shadow-lg">
                      <span className="text-xs">⚡</span>
                    </div>
                    {/* Discount Badge - Mobile Optimized */}
                    <div className="absolute top-1 left-1 sm:top-2 sm:left-2 bg-green-500 text-white text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full font-medium">
                      -{Math.round(((product.originalPrice - product.salePrice) / product.originalPrice) * 100)}%
                    </div>
                  </div>

                  {/* Product Info - Compact for Mobile */}
                  <div className="p-2 sm:p-3 md:p-4">
                    <h3 className="font-medium text-gray-900 text-xs sm:text-sm md:text-base line-clamp-2 mb-1 sm:mb-2 group-hover:text-blue-600 transition-colors leading-tight">
                      {product.name}
                    </h3>
                    
                    {/* Price Section - Compact */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mb-2 sm:mb-3">
                      <span className="text-sm sm:text-lg md:text-xl font-bold text-red-600">
                        GH₵{product.salePrice}
                      </span>
                      <span className="text-xs sm:text-sm text-gray-500 line-through">
                        GH₵{product.originalPrice}
                      </span>
                    </div>

                    {/* Add to Cart Button - Compact for Mobile */}
                    <button
                      className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-1.5 sm:py-2 md:py-2.5 px-2 sm:px-3 md:px-4 rounded-lg sm:rounded-xl text-xs sm:text-sm transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center items-center mt-8 sm:mt-12 space-x-4">
            <button
              className={`flex items-center space-x-2 px-4 sm:px-6 py-2.5 rounded-xl font-medium transition-all ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50 shadow-sm border border-gray-200 hover:shadow-md"
              }`}
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="hidden sm:inline">Previous</span>
            </button>

            <div className="flex items-center space-x-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    className={`w-10 h-10 rounded-xl font-medium transition-all ${
                      currentPage === pageNum
                        ? "bg-blue-500 text-white shadow-lg"
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
              className={`flex items-center space-x-2 px-4 sm:px-6 py-2.5 rounded-xl font-medium transition-all ${
                currentPage === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50 shadow-sm border border-gray-200 hover:shadow-md"
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
        )}
      </div>
    </div>
  );
};

export default FlashSales;