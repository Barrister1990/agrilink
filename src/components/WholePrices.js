import useCartStore from "@/store/cartStore";
import useWholePriceStore from "@/store/useWholePriceStore";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const WholePrices = () => {
  const { wholePriceProducts, loading, fetchWholePriceProducts } = useWholePriceStore();
  const { addToCart } = useCartStore();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const router = useRouter(); 
  
  // Fetch products when component mounts
  useEffect(() => {
    fetchWholePriceProducts();
    
    const handleRouteChange = () => {
      fetchWholePriceProducts();
    };
    
    router.events.on('routeChangeComplete', handleRouteChange);
    
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router, fetchWholePriceProducts]);

  // Filter products based on selected category
  const filteredProducts =
    selectedCategory === "All"
      ? wholePriceProducts
      : wholePriceProducts.filter((product) => product.category === selectedCategory);

  // Get category icons
  const getCategoryIcon = (category) => {
    const icons = {
      All: "🛒",
      Fruits: "🍎",
      Vegetables: "🥕",
      Dairy: "🥛",
      Grains: "🌾",
      Meat: "🥩"
    };
    return icons[category] || "📦";
  };

  // Modern skeleton loader component
  const SkeletonLoader = () => {
    return (
      <div className="group relative bg-white/80 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-sm overflow-hidden animate-pulse">
        {/* Wholesale Badge Skeleton */}
        <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-gray-300 to-gray-400 w-12 h-5 sm:w-14 sm:h-6 md:w-16 md:h-6 rounded-full"></div>
        
        {/* Image Container */}
        <div className="relative overflow-hidden rounded-t-2xl">
          <div className="w-full h-24 sm:h-28 md:h-40 bg-gradient-to-br from-gray-200 to-gray-300"></div>
        </div>
        
        {/* Content */}
        <div className="p-2 sm:p-3 md:p-4 space-y-2 md:space-y-3">
          {/* Title Skeleton */}
          <div className="space-y-1">
            <div className="h-3 md:h-4 bg-gray-300 rounded-lg w-full"></div>
            <div className="h-3 md:h-4 bg-gray-300 rounded-lg w-3/4"></div>
          </div>
          
          {/* Price Skeletons */}
          <div className="space-y-1">
            <div className="h-2 md:h-3 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 md:h-5 bg-gray-300 rounded w-2/3"></div>
          </div>
          
          {/* Stock Skeleton */}
          <div className="h-2 md:h-3 bg-gray-200 rounded w-3/4"></div>
          
          {/* Button Skeleton */}
          <div className="h-7 md:h-10 bg-gradient-to-r from-gray-300 to-gray-400 rounded-xl"></div>
        </div>
      </div>
    );
  };

  return (
    <section className="px-3 sm:px-6 lg:px-12 xl:px-20 py-6 md:py-10">
      {/* Modern Wholesale Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 text-white rounded-3xl shadow-2xl mb-6">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-4 left-4 w-24 h-24 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-4 right-4 w-20 h-20 bg-yellow-300 rounded-full blur-xl animate-bounce"></div>
        </div>
        
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between p-4 sm:p-6 gap-3 sm:gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-2xl">
              <span className="text-xl sm:text-2xl">🛒</span>
            </div>
            <div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold">Wholesale Prices</h2>
              <p className="text-xs sm:text-sm text-white/80">Bulk purchases, bulk savings</p>
            </div>
          </div>
          
          <Link 
            href="/wholesales" 
            className="bg-white/20 backdrop-blur-sm hover:bg-white/30 px-4 py-2 rounded-xl border border-white/20 text-sm font-medium transition-all duration-200 hover:scale-105"
          >
            See All
          </Link>
        </div>
      </div>

      {/* Modern Category Filter */}
      <div className="mb-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {["All", "Fruits", "Vegetables", "Dairy", "Grains", "Meat"].map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-medium whitespace-nowrap flex-shrink-0 transition-all duration-200 ${
                selectedCategory === category
                  ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg scale-105"
                  : "bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white border border-gray-200 hover:shadow-md hover:scale-105"
              }`}
            >
              <span className="text-base">{getCategoryIcon(category)}</span>
              <span>{category === "All" ? "All Categories" : category}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
          {[...Array(12)].map((_, index) => (
            <SkeletonLoader key={`skeleton-${index}`} />
          ))}
        </div>
      )}

      {/* No Products Found */}
      {!loading && filteredProducts.length === 0 && (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full mb-6">
            <span className="text-3xl">{getCategoryIcon(selectedCategory)}</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Products Found</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            No wholesale products found in the <span className="font-semibold text-green-600">{selectedCategory}</span> category.
            Try selecting a different category or check back later.
          </p>
          <div className="mt-6">
            <button
              onClick={() => setSelectedCategory("All")}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200 hover:scale-105"
            >
              View All Categories
              <span>→</span>
            </button>
          </div>
        </div>
      )}

      {/* Wholesale Products - Unified Responsive Grid */}
      {!loading && filteredProducts.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
          {filteredProducts.slice(0, 12).map((product) => (
            <div
              key={product.id}
              className="group relative bg-white/80 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden"
            >
              <Link href={`all-products/${product.id}`} className="block">
                {/* Wholesale Badge */}
                <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-2 py-1 text-[10px] sm:text-xs font-bold rounded-full shadow-lg">
                  Wholesale
                </div>

                {/* Bulk Quantity Badge */}
                {product.stock && (
                  <div className="absolute top-3 right-3 z-10 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-2 py-1 text-[8px] sm:text-[10px] font-bold rounded-full shadow-lg">
                    Bulk: {product.stock}
                  </div>
                )}

                {/* Product Image Container */}
                <div className="relative overflow-hidden rounded-t-2xl bg-gradient-to-br from-gray-50 to-gray-100">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-24 sm:h-28 md:h-40 object-cover group-hover:scale-110 transition-transform duration-500" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Wholesale pattern overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-500/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </div>

                {/* Product Details */}
                <div className="p-2 sm:p-3 md:p-4 space-y-1 md:space-y-2">
                  <h3 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base line-clamp-2 group-hover:text-green-600 transition-colors leading-tight">
                    {product.name}
                  </h3>
                  
                  <div className="space-y-1">
                    <p className="text-gray-400 text-[10px] sm:text-xs md:text-sm line-through">
                      GH₵{product.originalPrice}
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="text-green-600 font-bold text-sm sm:text-base md:text-lg">
                        GH₵{product.salePrice}
                      </p>
                      <div className="text-[8px] sm:text-[10px] md:text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full font-medium">
                        Save GH₵{(product.originalPrice - product.salePrice).toFixed(2)}
                      </div>
                    </div>
                  </div>
                  
                  {/* Stock indicator with wholesale styling */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="bg-gradient-to-r from-green-400 to-emerald-500 h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((product.stock / 100) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-[8px] sm:text-[10px] md:text-xs text-gray-600 font-medium">
                      {product.stock} bulk
                    </span>
                  </div>
                </div>
              </Link>

              {/* Modern Add to Cart Button */}
              <div className="p-2 sm:p-3 md:p-4 pt-0">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    addToCart(product);
                  }}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-3 py-2 md:py-3 rounded-xl font-medium text-xs sm:text-sm md:text-base transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95 relative overflow-hidden group/btn"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add to Cart
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-green-400/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-500"></div>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

 
    </section>
  );
};

export default WholePrices;