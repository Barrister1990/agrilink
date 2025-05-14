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

  // Skeleton loader component
  const SkeletonLoader = () => {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md relative animate-pulse">
        {/* Discount Badge Skeleton */}
        <div className="absolute top-2 left-2 bg-gray-300 w-12 h-6 rounded-full"></div>
        
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
      {/* Flash Sale Header */}
      <div className="flex items-center justify-between bg-orange-500 text-white p-4 rounded-md">
        <h2 className="text-xl font-bold">🔥 Flash Sale</h2>
        <span className="text-lg font-semibold">Time Left: {timeLeft}</span>
        <Link href="/flashsales" className="underline">
          See All
        </Link>
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

      {/* Flash Sale Products Grid */}
      {!loading && flashProducts.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-6">
          {flashProducts.slice(0, 10).map((product) => (
            <Link
              key={product.id}
              href={`/all-products/${product.id}`}
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition relative cursor-pointer"
            >
              {/* Discount Badge */}
              <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs font-bold rounded-full">
                -{product.discount}%
              </span>

              {/* Product Image */}
              <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded-md" />

              {/* Product Details */}
              <h3 className="mt-2 font-semibold">{product.name}</h3>
              <p className="text-gray-500 line-through">GH₵{product.originalPrice}</p>
              <p className="text-orange-600 font-bold">GH₵{product.salePrice}</p>
              <p className="text-sm text-gray-600">{product.stock} left in stock</p>

              {/* Add to Cart Button */}
              <button
                onClick={(e) => {
                  e.preventDefault(); // Prevent navigation when clicking "Add to Cart"
                  addToCart(product);
                }}
                className="mt-3 bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition"
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

export default FlashSale;