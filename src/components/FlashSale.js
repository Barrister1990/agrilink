import useCartStore from "@/store/cartStore";
import useFlashSaleStore from "@/store/useFlashSaleStore";
import Link from "next/link";
import { useEffect, useState } from "react";

const FlashSale = ({ saleEndTime }) => {
  const { flashProducts, loading, fetchFlashProducts } = useFlashSaleStore();
  const { addToCart } = useCartStore();
  const [timeLeft, setTimeLeft] = useState("");

  // Fetch flash sale products when component mounts
  useEffect(() => {
    fetchFlashProducts();
  }, []);

  // Timer for sale countdown
  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const saleEnd = new Date(saleEndTime);
      const diff = saleEnd - now;

      if (diff > 0) {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      } else {
        setTimeLeft("Sale Ended");
      }
    };

    const timer = setInterval(updateTimer, 1000);
    updateTimer();

    return () => clearInterval(timer);
  }, [saleEndTime]);

  // Modern skeleton loader component
  const SkeletonLoader = () => {
    return (
      <div className="group relative bg-white/80 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-sm overflow-hidden animate-pulse">
        {/* Discount Badge Skeleton */}
        <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-gray-300 to-gray-400 w-8 h-4 sm:w-10 sm:h-5 md:w-12 md:h-6 rounded-full"></div>
        
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
      {/* Modern Flash Sale Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 text-white rounded-3xl shadow-2xl mb-6">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-4 left-4 w-20 h-20 bg-white rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-4 right-4 w-16 h-16 bg-yellow-300 rounded-full blur-xl animate-bounce"></div>
        </div>
        
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between p-4 sm:p-6 gap-3 sm:gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-2xl">
              <span className="text-xl sm:text-2xl">🔥</span>
            </div>
            <div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold">Flash Sale</h2>
              <p className="text-xs sm:text-sm text-white/80">Limited time offers</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="text-center">
              <div className="bg-white/20 backdrop-blur-sm px-3 py-2 rounded-xl border border-white/20">
                <span className="text-sm sm:text-base font-bold block">{timeLeft}</span>
                <span className="text-xs text-white/80">Time Left</span>
              </div>
            </div>
            
            <Link 
              href="/flashsales" 
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 px-4 py-2 rounded-xl border border-white/20 text-sm font-medium transition-all duration-200 hover:scale-105"
            >
              See All
            </Link>
          </div>
        </div>
      </div>

      {/* Loading State with Skeletons */}
      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
          {[...Array(12)].map((_, index) => (
            <SkeletonLoader key={`skeleton-${index}`} />
          ))}
        </div>
      )}

      {/* Flash Sale Products - Unified Responsive Grid */}
      {!loading && flashProducts.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
          {flashProducts.slice(0, 12).map((product) => (
            <div
              key={product.id}
              className="group relative bg-white/80 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden"
            >
              <Link href={`/all-products/${product.id}`} className="block">
                {/* Discount Badge */}
                <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-1 text-[10px] sm:text-xs font-bold rounded-full shadow-lg animate-pulse">
                  -{product.discount}%
                </div>

                {/* Stock Urgency Badge */}
                {product.stock <= 5 && (
                  <div className="absolute top-3 right-3 z-10 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 text-[8px] sm:text-[10px] font-bold rounded-full shadow-lg">
                    Only {product.stock} left!
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
                  
                  {/* Flash effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </div>

                {/* Product Details */}
                <div className="p-2 sm:p-3 md:p-4 space-y-1 md:space-y-2">
                  <h3 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base line-clamp-2 group-hover:text-orange-600 transition-colors leading-tight">
                    {product.name}
                  </h3>
                  
                  <div className="space-y-1">
                    <p className="text-gray-400 text-[10px] sm:text-xs md:text-sm line-through">
                      GH₵{product.originalPrice}
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="text-orange-600 font-bold text-sm sm:text-base md:text-lg">
                        GH₵{product.salePrice}
                      </p>
                      <div className="text-[8px] sm:text-[10px] md:text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full font-medium">
                        Save GH₵{(product.originalPrice - product.salePrice).toFixed(2)}
                      </div>
                    </div>
                  </div>
                  
                  {/* Stock indicator */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="bg-gradient-to-r from-orange-400 to-red-500 h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((product.stock / 20) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-[8px] sm:text-[10px] md:text-xs text-gray-600 font-medium">
                      {product.stock} left
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
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-3 py-2 md:py-3 rounded-xl font-medium text-xs sm:text-sm md:text-base transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95 relative overflow-hidden group/btn"
                >
                  <span className="relative z-10">Add to Cart</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-500"></div>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modern Empty State */}
      {!loading && flashProducts.length === 0 && (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-100 to-red-100 rounded-full mb-6">
            <span className="text-3xl">⚡</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Flash Sales Right Now</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Stay tuned for amazing flash deals! Our next sale is coming soon with incredible discounts.
          </p>
          <div className="mt-6">
            <Link 
              href="/all-products" 
              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200 hover:scale-105"
            >
              Browse All Products
              <span>→</span>
            </Link>
          </div>
        </div>
      )}
    </section>
  );
};

export default FlashSale;