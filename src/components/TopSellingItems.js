import useTopSellingStore from "@/store/useTopSellingStore";
import Link from "next/link";
import { useEffect } from "react";

const TopSellingItems = () => {
  const { topSellingProducts, loading, fetchTopSellingProducts } = useTopSellingStore();

  useEffect(() => {
    fetchTopSellingProducts();
  }, []);

  // Skeleton loader component
  const SkeletonLoader = () => {
    return (
      <div className="bg-white border border-orange-300 p-4 rounded-lg shadow-md min-w-[220px] sm:min-w-[250px] md:min-w-[280px] lg:min-w-[300px] flex-shrink-0 relative animate-pulse">
        {/* Bestseller Badge Skeleton */}
        <div className="absolute top-2 left-2 bg-gray-300 w-16 h-6 rounded-full"></div>
        
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
    <section className="px-6 lg:px-12 xl:px-20 py-10 mt-3">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-orange-600">🔥 Top Selling Items</h2>
          <p className="text-gray-600">Discover the most popular farm products.</p>
        </div>

        {/* Top Selling Items Grid */}
        {loading ? (
          <div className="flex space-x-6 overflow-x-auto scrollbar-hide">
            {/* Render 6 skeleton loaders */}
            {[...Array(6)].map((_, index) => (
              <div key={`skeleton-${index}`}>
                <SkeletonLoader />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex space-x-6 overflow-x-auto scrollbar-hide">
            {topSellingProducts.map((product) => (
              <Link
                key={product.id}
                href={`all-products/${product.id}`}
                className="bg-white border border-orange-300 p-4 rounded-lg shadow-md hover:shadow-lg transition min-w-[220px] sm:min-w-[250px] md:min-w-[280px] lg:min-w-[300px] flex-shrink-0 cursor-pointer hover:bg-orange-50"
              >
                {/* Product Image */}
                <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded-md" />

                {/* Product Details */}
                <h3 className="mt-2 font-semibold text-orange-700">{product.name}</h3>
                <p className="text-gray-500 line-through">GHS {product.originalPrice}</p>
                <p className="text-orange-700 font-bold">GHS {product.sellingPrice}</p>

                {/* Bestseller Badge */}
                <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs font-bold rounded-full">
                  Bestseller
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TopSellingItems;