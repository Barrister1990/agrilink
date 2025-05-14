import useSponsoredStore from "@/store/useSponsoredStore";
import Link from "next/link";
import { useEffect } from "react";

const SponsoredProducts = () => {
  const { sponsoredProducts, loading, fetchSponsoredProducts } = useSponsoredStore();
  
  useEffect(() => {
    fetchSponsoredProducts();
  }, []);
  
  // Skeleton loader component
  const SkeletonLoader = () => {
    return (
      <div className="bg-white border border-green-300 p-4 rounded-lg shadow-md min-w-[220px] sm:min-w-[250px] md:w-full flex-shrink-0 md:flex-shrink animate-pulse">
        {/* Discount Badge Skeleton */}
        <div className="absolute top-2 left-2 bg-gray-300 w-12 h-6 rounded-full"></div>
        
        {/* Image Skeleton */}
        <div className="w-full h-40 bg-gray-300 rounded-md"></div>
        
        {/* Title Skeleton */}
        <div className="mt-2 h-5 bg-gray-300 rounded w-3/4"></div>
        
        {/* Price Skeletons */}
        <div className="mt-2 h-4 bg-gray-300 rounded w-1/2"></div>
        <div className="mt-1 h-6 bg-gray-300 rounded w-2/3"></div>
      </div>
    );
  };

  return (
    <section className="px-4 sm:px-6 lg:px-12 xl:px-20 py-10 bg-gray-200">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-green-800">🌿 Sponsored Products</h2>
          <p className="text-gray-600">Get bulk discounts on farm produce.</p>
        </div>
        
        {/* Sponsored Products Grid (Responsive) */}
        {loading ? (
          <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 overflow-x-auto md:overflow-hidden scrollbar-hide">
            {/* Render 6 skeleton loaders */}
            {[...Array(6)].map((_, index) => (
              <div key={`skeleton-${index}`} className="relative">
                <SkeletonLoader />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 overflow-x-auto md:overflow-hidden scrollbar-hide">
            {sponsoredProducts.map((product) => (
              <Link
                key={product.id}
                href={`all-products/${product.id}`}
                className="relative bg-white border border-green-300 p-4 rounded-lg shadow-md hover:shadow-lg transition min-w-[220px] sm:min-w-[250px] md:w-full flex-shrink-0 md:flex-shrink"
              >
                {/* Discount Badge */}
                <span className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 text-xs font-bold rounded-full">
                  -{product.discount}%
                </span>
                
                {/* Product Image */}
                <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded-md" />
                
                {/* Product Details */}
                <h3 className="mt-2 font-semibold text-green-800 text-sm sm:text-base">{product.name}</h3>
                <p className="text-gray-500 text-sm sm:text-base line-through">GH₵{product.originalPrice}</p>
                <p className="text-green-700 font-bold text-sm sm:text-lg">GH₵{product.sponsoredPrice}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default SponsoredProducts;