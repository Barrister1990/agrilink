import useCartStore from "@/store/cartStore";
import useWholePriceStore from "@/store/useWholePriceStore"; // Import the store
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
const WholePrices = () => {
  const { wholePriceProducts, loading, fetchWholePriceProducts } = useWholePriceStore();
  const { addToCart } = useCartStore();
  const [selectedCategory, setSelectedCategory] = useState("All"); // State for selected category
  const router = useRouter(); 
  // Fetch products when component mounts
  useEffect(() => {
    fetchWholePriceProducts();
    
    // Set up router change event listeners
    const handleRouteChange = () => {
      fetchWholePriceProducts();
    };
    
    // Listen for route change events
    router.events.on('routeChangeComplete', handleRouteChange);
    
    // Clean up event listener on unmount
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router, fetchWholePriceProducts]);
  // Filter products based on selected category
  const filteredProducts =
    selectedCategory === "All"
      ? wholePriceProducts
      : wholePriceProducts.filter((product) => product.category === selectedCategory);

  // Skeleton loader component
  const SkeletonLoader = () => {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md relative animate-pulse">
        {/* Discount Badge Skeleton */}
        <div className="absolute top-2 left-2 bg-gray-300 w-16 h-6 rounded-full"></div>
        
        {/* Image Skeleton */}
        <div className="w-full h-40 bg-gray-300 rounded-md"></div>
        
        {/* Title Skeleton */}
        <div className="mt-2 h-5 bg-gray-300 rounded w-3/4"></div>
        
        {/* Price Skeletons */}
        <div className="mt-2 h-4 bg-gray-300 rounded w-1/2"></div>
        <div className="mt-1 h-6 bg-gray-300 rounded w-2/3"></div>
        
        {/* Stock Skeleton */}
        <div className="mt-1 h-4 bg-gray-300 rounded w-4/5"></div>
        
        {/* Button Skeleton */}
        <div className="mt-3 h-10 bg-gray-300 rounded-md w-full"></div>
      </div>
    );
  };

  return (
    <section className="px-6 lg:px-12 xl:px-20 py-10">
      {/* Whole Prices Header */}
      <div className="flex items-center justify-between bg-green-600 text-white p-4 rounded-md">
        <h2 className="text-xl font-bold">🛒 Wholesale Prices</h2>
        <Link href="/wholesales" className="underline">
          See All
        </Link>
      </div>

      {/* Category Filter */}
      <div className="mt-6">
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Filter by Category
        </label>
        <select
          id="category"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600"
        >
          <option value="All">All Categories</option>
          <option value="Fruits">Fruits</option>
          <option value="Vegetables">Vegetables</option>
          <option value="Dairy">Dairy</option>
          <option value="Grains">Grains</option>
          <option value="Meat">Meat</option>
        </select>
      </div>

      {/* Loading State with Skeletons */}
      {loading && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-6">
          {/* Render 6 skeleton loaders */}
          {[...Array(6)].map((_, index) => (
            <div key={`skeleton-${index}`}>
              <SkeletonLoader />
            </div>
          ))}
        </div>
      )}

      {/* No Products Found Message */}
      {!loading && filteredProducts.length === 0 && (
        <p className="text-center text-gray-500 mt-6">
          No products found in the <span className="font-semibold">{selectedCategory}</span> category.
        </p>
      )}

      {/* Whole Prices Grid */}
      {!loading && filteredProducts.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-6">
          {filteredProducts.slice(0, 10).map((product) => (
            <Link
              key={product.id}
              href={`all-products/${product.id}`}
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition relative cursor-pointer"
            >
              {/* Discount Badge */}
              <span className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 text-xs font-bold rounded-full">
                Wholesale
              </span>

              {/* Product Image */}
              <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded-md" />

              {/* Product Details */}
              <h3 className="mt-2 font-semibold">{product.name}</h3>
              <p className="text-gray-500 line-through">GH₵{product.originalPrice}</p>
              <p className="text-green-600 font-bold">GH₵{product.salePrice}</p>
              <p className="text-sm text-gray-600">{product.stock} in bulk stock</p>

              {/* Add to Cart Button */}
              <button
                onClick={(e) => {
                  e.preventDefault(); // Prevents navigation when clicking "Add to Cart"
                  addToCart(product);
                }}
                className="mt-3 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
              >
                Add to Cart
              </button>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};

export default WholePrices;