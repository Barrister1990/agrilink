import useTopSellingStore from "@/store/useTopSellingStore";
import Link from "next/link";
import { useEffect } from "react";

const TopSellingItems = () => {
  const { topSellingProducts, loading, fetchTopSellingProducts } = useTopSellingStore();

  useEffect(() => {
    fetchTopSellingProducts();
  }, []);

  // Modern skeleton loader component
  const SkeletonLoader = () => {
    return (
      <div className="group relative">
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 animate-pulse">
          {/* Bestseller Badge Skeleton */}
          <div className="absolute top-3 left-3 z-10 bg-gray-300 w-14 h-5 rounded-full"></div>
          
          {/* Image Container */}
          <div className="relative overflow-hidden">
            <div className="w-full h-32 sm:h-36 md:h-40 lg:h-44 xl:h-48 bg-gradient-to-br from-gray-200 to-gray-300 rounded-t-2xl"></div>
          </div>
          
          {/* Content */}
          <div className="p-3 sm:p-4 space-y-2">
            {/* Title Skeleton */}
            <div className="h-4 sm:h-5 bg-gray-300 rounded-lg w-4/5"></div>
            
            {/* Price Skeletons */}
            <div className="space-y-1">
              <div className="h-3 sm:h-4 bg-gray-300 rounded w-1/2"></div>
              <div className="h-4 sm:h-5 bg-gray-300 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="px-4 sm:px-6 lg:px-12 xl:px-20 py-8 sm:py-10 lg:py-12">
      <div className="max-w-7xl mx-auto">
        {/* Modern Section Header */}
        <div className="mb-6 sm:mb-8 lg:mb-10">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1 h-6 sm:h-8 bg-gradient-to-b from-orange-500 to-red-500 rounded-full"></div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Top Selling Items
            </h2>
            <span className="text-lg sm:text-xl">🔥</span>
          </div>
          <p className="text-gray-600 text-sm sm:text-base ml-3">Discover the most popular farm products</p>
        </div>

        {/* Responsive Grid Layout */}
        <div className="relative">
          {loading ? (
            <>
              {/* Mobile: Horizontal scroll */}
              <div className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide pb-4 sm:hidden">
                {[...Array(6)].map((_, index) => (
                  <div key={`skeleton-mobile-${index}`} className="flex-shrink-0 w-40">
                    <SkeletonLoader />
                  </div>
                ))}
              </div>
              
              {/* Tablet and Desktop: Grid */}
              <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
                {[...Array(10)].map((_, index) => (
                  <div key={`skeleton-grid-${index}`}>
                    <SkeletonLoader />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              {/* Mobile: Horizontal scroll */}
              <div className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide pb-4 sm:hidden">
                {topSellingProducts.map((product) => (
                  <Link
                    key={`mobile-${product.id}`}
                    href={`all-products/${product.id}`}
                    className="group relative flex-shrink-0 w-40"
                  >
                    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:scale-105 transition-all duration-300 hover:border-orange-300">
                      {/* Bestseller Badge */}
                      <div className="absolute top-2 left-2 z-10 bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-0.5 text-xs font-semibold rounded-full shadow-lg">
                        🏆 Best
                      </div>
                      
                      {/* Image Container */}
                      <div className="relative overflow-hidden">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-500" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                      
                      {/* Content */}
                      <div className="p-3 space-y-1">
                        <h3 className="font-semibold text-gray-800 text-sm line-clamp-1 group-hover:text-orange-700 transition-colors">
                          {product.name}
                        </h3>
                        <div className="space-y-0.5">
                          <p className="text-xs text-gray-500 line-through">GHS {product.originalPrice}</p>
                          <p className="text-sm font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                            GHS {product.sellingPrice}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              
              {/* Tablet and Desktop: Modern Grid */}
              <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
                {topSellingProducts.map((product) => (
                  <Link
                    key={`grid-${product.id}`}
                    href={`all-products/${product.id}`}
                    className="group relative"
                  >
                    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:scale-105 transition-all duration-300 hover:border-orange-300">
                      {/* Bestseller Badge */}
                      <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-red-500 to-pink-500 text-white px-2.5 py-1 text-xs font-semibold rounded-full shadow-lg backdrop-blur-sm">
                        🏆 Bestseller
                      </div>
                      
                      {/* Image Container */}
                      <div className="relative overflow-hidden">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-full h-36 md:h-40 lg:h-44 xl:h-48 object-cover group-hover:scale-110 transition-transform duration-500" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                      
                      {/* Content */}
                      <div className="p-4 space-y-2">
                        <h3 className="font-semibold text-gray-800 text-sm md:text-base line-clamp-2 group-hover:text-orange-700 transition-colors leading-tight">
                          {product.name}
                        </h3>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-500 line-through">GHS {product.originalPrice}</p>
                          <p className="text-lg font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                            GHS {product.sellingPrice}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
          
          {/* Show All Button */}
          {!loading && topSellingProducts.length > 0 && (
            <div className="mt-6 sm:mt-8 text-center">
              <Link
                href="/all-products"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 sm:px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <span>View All Products</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default TopSellingItems;