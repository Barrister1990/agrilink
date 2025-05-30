import useCartStore from "@/store/cartStore";
import useSupermarketStore from "@/store/useSupermarketStore";
import Link from "next/link";
import { useEffect } from "react";

const SupermarketProducts = () => {
  const { supermarketProducts, loading, fetchSupermarketProducts } = useSupermarketStore();
  const { addToCart } = useCartStore();

  useEffect(() => {
    fetchSupermarketProducts();
  }, []);

  // Modern Skeleton loader component
  const SkeletonLoader = () => {
    return (
      <div className="group relative bg-white/80 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden animate-pulse">
        {/* Discount Badge Skeleton */}
        <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-gray-300 to-gray-400 w-10 h-5 md:w-12 md:h-6 rounded-full"></div>
        
        {/* Image Container */}
        <div className="relative overflow-hidden rounded-t-2xl">
          <div className="w-full h-24 sm:h-28 md:h-40 bg-gradient-to-br from-gray-200 to-gray-300"></div>
        </div>
        
        {/* Content */}
        <div className="p-2 sm:p-3 md:p-4 space-y-2 md:space-y-3">
          {/* Title Skeleton */}
          <div className="h-3 md:h-4 bg-gray-300 rounded-lg w-4/5"></div>
          
          {/* Price Skeletons */}
          <div className="space-y-1">
            <div className="h-2 md:h-3 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 md:h-5 bg-gray-300 rounded w-2/3"></div>
          </div>
          
          {/* Button Skeleton */}
          <div className="h-7 md:h-10 bg-gradient-to-r from-gray-300 to-gray-400 rounded-xl"></div>
        </div>
      </div>
    );
  };

  return (
    <section className="px-3 sm:px-6 lg:px-12 xl:px-20 py-8 md:py-12 bg-gradient-to-br from-amber-50 via-amber-100 to-orange-100 ">
      <div className="max-w-7xl mx-auto">
        {/* Modern Section Header */}
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center gap-3 bg-white/70 backdrop-blur-sm px-6 py-3 rounded-2xl border border-white/20 shadow-lg mb-4">
            <span className="text-2xl">🛒</span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-700 to-blue-900 bg-clip-text text-transparent">
              Supermarket Prices
            </h2>
          </div>
          <p className="text-gray-600 text-sm md:text-base max-w-md mx-auto">
            Discover everyday fresh produce at unbeatable prices
          </p>
        </div>

        {/* Products Grid - Mobile First Responsive */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
            {[...Array(10)].map((_, index) => (
              <SkeletonLoader key={`skeleton-${index}`} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
            {supermarketProducts.map((product) => (
              <div
                key={product.id}
                className="group relative bg-white/80 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden"
              >
                <Link href={`all-products/${product.id}`} className="block">
                  {/* Discount Badge */}
                  <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-1 text-[10px] sm:text-xs font-bold rounded-full shadow-lg">
                    -{product.discount}%
                  </div>

                  {/* Product Image Container */}
                  <div className="relative overflow-hidden rounded-t-2xl bg-gradient-to-br from-gray-50 to-gray-100">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-24 sm:h-28 md:h-40 object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  {/* Product Details */}
                  <div className="p-2 sm:p-3 md:p-4 space-y-1 md:space-y-2">
                    <h3 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base line-clamp-2 group-hover:text-blue-700 transition-colors">
                      {product.name}
                    </h3>
                    
                    <div className="space-y-1">
                      <p className="text-gray-400 text-[10px] sm:text-xs md:text-sm line-through">
                        GH₵{product.originalPrice}
                      </p>
                      <p className="text-blue-600 font-bold text-sm sm:text-base md:text-lg">
                        GH₵{product.supermarketPrice}
                      </p>
                    </div>
                  </div>
                </Link>

                {/* Modern Add to Cart Button */}
                <div className="p-2 sm:p-3 md:p-4 pt-0">
                  <button
                    onClick={() => addToCart(product)}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-3 py-2 md:py-3 rounded-xl font-medium text-xs sm:text-sm md:text-base transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modern Empty State (if no products) */}
        {!loading && supermarketProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <span className="text-2xl">📦</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No products available</h3>
            <p className="text-gray-500">Check back later for amazing deals!</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default SupermarketProducts;