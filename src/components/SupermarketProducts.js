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

  // Skeleton loader component
  const SkeletonLoader = () => {
    return (
      <div className="relative bg-white border border-gray-300 p-4 rounded-lg shadow-md min-w-[220px] sm:min-w-[250px] md:w-full flex-shrink-0 md:flex-shrink animate-pulse">
        {/* Discount Badge Skeleton */}
        <div className="absolute top-2 left-2 bg-gray-300 w-12 h-6 rounded-full"></div>
        
        {/* Image Skeleton */}
        <div className="w-full h-40 bg-gray-300 rounded-md"></div>
        
        {/* Title Skeleton */}
        <div className="mt-2 h-5 bg-gray-300 rounded w-3/4"></div>
        
        {/* Price Skeletons */}
        <div className="mt-2 h-4 bg-gray-300 rounded w-1/2"></div>
        <div className="mt-1 h-6 bg-gray-300 rounded w-2/3"></div>
        
        {/* Button Skeleton */}
        <div className="mt-3 h-10 bg-gray-300 rounded-md w-full"></div>
      </div>
    );
  };

  return (
    <section className="px-4 sm:px-6 lg:px-12 xl:px-20 py-10 bg-amber-200">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-blue-800">🛒 Supermarket Prices</h2>
          <p className="text-gray-600">Everyday fresh produce at great prices.</p>
        </div>

        {/* Supermarket Products Grid (Responsive) */}
        {loading ? (
          <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 overflow-x-auto md:overflow-hidden scrollbar-hide">
            {/* Render 6 skeleton loaders */}
            {[...Array(6)].map((_, index) => (
              <div key={`skeleton-${index}`}>
                <SkeletonLoader />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 overflow-x-auto md:overflow-hidden scrollbar-hide">
            {supermarketProducts.map((product) => (
              <div
                key={product.id}
                className="relative bg-white border border-gray-300 p-4 rounded-lg shadow-md hover:shadow-lg transition min-w-[220px] sm:min-w-[250px] md:w-full flex-shrink-0 md:flex-shrink"
              >
                <Link href={`all-products/${product.id}`} className="block">
                  {/* Discount Badge */}
                  <span className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 text-xs font-bold rounded-full">
                    -{product.discount}%
                  </span>

                  {/* Product Image */}
                  <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded-md" />

                  {/* Product Details */}
                  <h3 className="mt-2 font-semibold text-gray-900 text-sm sm:text-base">{product.name}</h3>
                  <p className="text-gray-500 text-sm sm:text-base line-through">GH₵{product.originalPrice}</p>
                  <p className="text-blue-600 font-bold text-sm sm:text-lg">GH₵{product.supermarketPrice}</p>
                </Link>

                {/* Add to Cart Button */}
                <button
                  onClick={() => addToCart(product)}
                  className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition w-full text-sm sm:text-base"
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default SupermarketProducts;