
import useCartStore from "@/store/cartStore";
import useFlashSaleStore from "@/store/useFlashSaleStore";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const categories = ["All", "Fruits", "Vegetables", "Dairy", "Grains", "Meat"];

// Skeleton card component for loading state
const SkeletonCard = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md animate-pulse">
      <div className="w-full h-40 bg-gray-200 rounded mb-3"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-5 bg-gray-200 rounded w-1/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-2/4 mb-3"></div>
      <div className="h-10 bg-gray-200 rounded w-full"></div>
    </div>
  );
};

const FlashSales = () => {
  const { flashProducts, loading, fetchFlashProducts } = useFlashSaleStore();
  const { addToCart } = useCartStore();

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("popularity");
  const [timeLeft, setTimeLeft] = useState(3600);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    fetchFlashProducts();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  const filteredProducts = flashProducts
    .filter((product) => selectedCategory === "All" || product.category === selectedCategory)
    .sort((a, b) => {
      if (sortBy === "price-low") return a.salePrice - b.salePrice;
      if (sortBy === "price-high") return b.salePrice - a.salePrice;
      return 0;
    });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const displayedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="container mx-auto px-4 py-6 pt-10">
      <nav className="text-sm mb-6">
        <ol className="list-none p-0 flex flex-wrap">
          <li className="flex items-center">
            <Link href="/" className="text-green-700 hover:text-green-900">Home</Link>
            <span className="mx-2 text-gray-500">/</span>
          </li>
          <li className="flex items-center">
            <Link href="/flashsales" className="text-green-700 hover:text-green-900">Flash Sale</Link>
          </li>
        </ol>
      </nav>
      
      {/* Banner */}
      <div className="w-full h-52 sm:h-72 md:h-96 object-cover rounded-lg">
        <Image
          src='/images/flashsale-banner.png'
          alt={`flashsale-banner`}
          width={1200}
          height={400}
          className="w-full h-52 sm:h-72 md:h-96 object-cover rounded-lg"
        />
      </div>
      
      {/* Flash Sale Timer */}
      <div className="bg-red-600 text-white p-3 mt-4 rounded-lg text-center">
        <h3 className="text-lg font-bold">Flash Sale Ends In: {formatTime(timeLeft)}</h3>
      </div>
      
      {/* Filter Controls (for mobile) */}
      <div className="flex flex-col md:flex-row justify-between items-center mt-6">
        {/* Category Dropdown (for mobile) */}
        <div className="w-full md:w-auto mb-4 md:mb-0">
          <select
            className="w-full md:hidden p-2 border rounded"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Sorting Dropdown */}
        <select
          className="border p-2 rounded"
          value={sortBy}
          onChange={(e) => {
            setSortBy(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="popularity">Popularity</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
        </select>
      </div>

      <div className="flex flex-col md:flex-row gap-6 mt-6">
        {/* Categories Sidebar (visible on larger screens) */}
        <aside className="hidden md:block w-1/4 bg-white p-4 shadow-md rounded-md">
          <h3 className="text-lg font-semibold mb-3">Categories</h3>
          <ul>
            {categories.map((category) => (
              <li
                key={category}
                className={`cursor-pointer py-2 px-3 rounded-md ${
                  selectedCategory === category ? "bg-red-200 font-bold" : ""
                }`}
                onClick={() => {
                  setSelectedCategory(category);
                  setCurrentPage(1);
                }}
              >
                {category}
              </li>
            ))}
          </ul>
        </aside>

        {/* Product List */}
        <div className="flex-1">
          <h2 className="text-xl font-bold mb-4">
            Flash Sales - Top Daily Deals & Offers
            {!loading && (
              <span> ({filteredProducts.length} products)</span>
            )}
          </h2>

          {/* Products Grid with Skeleton Loading */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {loading ? (
              // Show skeleton cards when loading
              Array(8).fill(0).map((_, index) => (
                <SkeletonCard key={`skeleton-${index}`} />
              ))
            ) : (
              // Show actual products when loaded
              displayedProducts.map((product) => (
                <Link key={product.id} href={`/all-products/${product.id}`} passHref>
                  <div className="relative bg-white p-4 rounded-lg shadow-md cursor-pointer transition-transform transform hover:scale-105">
                    {/* Flash Sale Tag */}
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                      Flash Sale
                    </div>

                    <img
                      src={product.image}
                      alt={product.name}
                      width={200}
                      height={200}
                      className="w-full h-40 object-cover"
                    />
                    <h3 className="font-semibold mt-2 truncate">{product.name}</h3>
                    <p className="text-red-500 text-lg font-bold">GH₵{product.salePrice}</p>
                    <p className="line-through text-gray-500 text-sm">GH₵{product.originalPrice}</p>
                    <button
                      className="mt-2 bg-blue-500 text-white w-full px-4 py-2 rounded hover:bg-blue-600"
                      onClick={(e) => {
                        e.preventDefault(); // Prevents the link from triggering when clicking the button
                        addToCart(product);
                      }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </Link>
              ))
            )}
          </div>

          {/* Pagination (responsive) - Only show when not loading */}
          {!loading && totalPages > 0 && (
            <div className="flex justify-center items-center mt-6 gap-4">
              <button
                className={`px-4 py-2 rounded bg-gray-200 ${
                  currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              >
                Previous
              </button>

              <span className="text-lg font-semibold">
                Page {currentPage} of {totalPages}
              </span>

              <button
                className={`px-4 py-2 rounded bg-gray-200 ${
                  currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlashSales;