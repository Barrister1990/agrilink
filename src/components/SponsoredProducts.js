import useSponsoredStore from "@/store/useSponsoredStore";
import Link from "next/link";
import { useEffect } from "react";

const SponsoredProducts = () => {
  const { sponsoredProducts, loading, fetchSponsoredProducts } = useSponsoredStore();
    
  useEffect(() => {
    fetchSponsoredProducts();
  }, []);
    
  // Modern skeleton loader component
  const SkeletonLoader = () => {
    return (
      <div className="group relative bg-white/80 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
        <div className="animate-pulse">
          {/* Discount Badge Skeleton */}
          <div className="absolute top-3 left-3 bg-gradient-to-r from-gray-200 to-gray-300 w-10 h-5 rounded-full z-10"></div>
          
          {/* Image Skeleton */}
          <div className="aspect-square bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 rounded-t-2xl"></div>
          
          {/* Content Skeleton */}
          <div className="p-3 space-y-2">
            {/* Title Skeleton */}
            <div className="space-y-1">
              <div className="h-3 bg-gray-200 rounded-md w-full"></div>
              <div className="h-3 bg-gray-200 rounded-md w-3/4"></div>
            </div>
            
            {/* Price Skeletons */}
            <div className="flex items-center gap-2 pt-1">
              <div className="h-4 bg-gray-200 rounded-md w-16"></div>
              <div className="h-3 bg-gray-200 rounded-md w-12"></div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="px-4 py-8 bg-gradient-to-br from-gray-50 to-white min-h-[400px] sm:px-6 lg:px-8 lg:py-12">
      <div className="max-w-7xl mx-auto">
        {/* Modern Section Header */}
        <div className="mb-6 text-center sm:text-left lg:mb-8">
          <div className="inline-flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full border border-green-100 mb-3">
            <span className="text-green-600 text-sm font-medium">🌿 Sponsored</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2 sm:text-3xl lg:text-4xl">
            Special Offers
          </h2>
          <p className="text-gray-600 text-sm sm:text-base max-w-2xl">
            Discover premium farm produce with exclusive bulk discounts and seasonal deals.
          </p>
        </div>
        
        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
            {[...Array(8)].map((_, index) => (
              <SkeletonLoader key={`skeleton-${index}`} />
            ))}
          </div>
        )}

        {/* Sponsored Products */}
        {!loading && sponsoredProducts.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
            {sponsoredProducts.map((product) => (
              <Link
                key={product.id}
                href={`all-products/${product.id}`}
                className="group relative bg-white/80 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 overflow-hidden hover:border-green-200"
              >
                {/* Discount Badge */}
                <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-1 text-xs font-bold rounded-full z-10 shadow-lg">
                  -{product.discount}%
                </div>
                
                {/* Heart/Wishlist Icon (Optional) */}
                <div className="absolute top-3 right-3 w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                  <svg className="w-4 h-4 text-gray-400 hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                
                {/* Product Image */}
                <div className="aspect-square overflow-hidden rounded-t-2xl bg-gray-50">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  />
                </div>
                
                {/* Product Details */}
                <div className="p-3">
                  <h3 className="font-semibold text-gray-900 text-xs leading-tight line-clamp-2 mb-2 group-hover:text-green-700 transition-colors sm:text-sm lg:text-base">
                    {product.name}
                  </h3>
                  
                  {/* Price Section */}
                  <div className="flex items-center gap-2">
                    <span className="text-green-700 font-bold text-sm sm:text-base lg:text-lg">
                      GH₵{product.sponsoredPrice}
                    </span>
                    <span className="text-gray-400 text-xs line-through sm:text-sm">
                      GH₵{product.originalPrice}
                    </span>
                  </div>
                  
                  {/* Rating/Reviews (Optional Enhancement) */}
                  <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-3 h-3 text-yellow-400 fill-current" viewBox="0 0 20 20">
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                        </svg>
                      ))}
                    </div>
                    <span className="text-xs text-gray-500 ml-1">(4.5)</span>
                  </div>
                </div>
                
                {/* Gradient Overlay for Enhanced Visual Appeal */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"></div>
              </Link>
            ))}
          </div>
        )}
        
        {/* Empty State */}
        {!loading && sponsoredProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No sponsored products available</h3>
            <p className="text-gray-500 text-sm">Check back later for exciting deals and offers!</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default SponsoredProducts;