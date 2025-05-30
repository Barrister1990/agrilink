import useCartStore from "@/store/cartStore";
import useProductStore from "@/store/useProductStore";
import { ClockIcon, FireIcon, StarIcon } from "@heroicons/react/24/outline";
import {
  AdjustmentsHorizontalIcon,
  ChevronDownIcon,
  HeartIcon,
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  XMarkIcon
} from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const AllProducts = () => {
  const router = useRouter();
  const { products, loading, fetchAllProducts, searchProducts } = useProductStore();
  const { addToCart } = useCartStore();

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [banners, setBanners] = useState([
    "/images/banner1.png",
    "/images/banner2.png",
    "/images/banner3.png",
  ]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("popularity");
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [viewMode, setViewMode] = useState("grid"); // grid or list

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 20;

  // Sample categories with icons
  const categories = [
    { name: "All", icon: "🛒" },
    { name: "Fruits", icon: "🍎" },
    { name: "Vegetables", icon: "🥕" },
    { name: "Dairy", icon: "🥛" },
    { name: "Grains", icon: "🌾" },
    { name: "Meat", icon: "🥩" }
  ];

  // Search functionality from Hero component
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Initialize with query parameters if they exist
  useEffect(() => {
    if (router.query.search) {
      setSearchQuery(router.query.search);
    }
    if (router.query.category && categories.find(cat => cat.name === router.query.category)) {
      setSelectedCategory(router.query.category);
    }
  }, [router.query]);

  useEffect(() => {
    fetchAllProducts();
  }, []);

  // Load recent searches from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSearches = localStorage.getItem("recentSearches");
      if (savedSearches) {
        setRecentSearches(JSON.parse(savedSearches).slice(0, 5));
      }
    }
  }, []);

  // Handle clicks outside dropdowns
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target) && 
          searchInputRef.current !== event.target) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Generate suggestions based on search query
  useEffect(() => {
    if (searchQuery.length > 0) {
      const results = searchProducts(searchQuery);
      setSearchResults(results.slice(0, 8));
      
      const productSuggestions = results
        .map(product => product.name)
        .filter((name, index, self) => self.indexOf(name) === index)
        .slice(0, 5);
      
      setSuggestions(productSuggestions);
      setShowSuggestions(isFocused);
    } else {
      setSuggestions([]);
      setSearchResults([]);
      setShowSuggestions(isFocused);
    }
  }, [searchQuery, isFocused, products, searchProducts]);

  // Handle product filtering based on search, category and sorting
  useEffect(() => {
    let filtered = [...products];

    if (searchQuery) {
      filtered = searchProducts(searchQuery);
    }

    if (selectedCategory !== "All") {
      filtered = filtered.filter((product) => product.category === selectedCategory);
    }

    switch (sortBy) {
      case "priceLow":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "priceHigh":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "newArrivals":
        filtered.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [products, selectedCategory, sortBy, searchQuery, searchProducts]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage);

  // Handle search action
  const handleSearch = (query = searchQuery) => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
    }, 800);

    const updatedSearches = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(updatedSearches);
    if (typeof window !== 'undefined') {
      localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
    }
    
    setShowSuggestions(false);
    
    router.push({
      pathname: "/all-products",
      query: { 
        search: query, 
        category: selectedCategory !== "All" ? selectedCategory : "" 
      }
    }, undefined, { shallow: true });
    
    setSearchQuery(query);
  };

  // Navigate to product details page
  const navigateToProduct = (productId) => {
    setShowSuggestions(false);
    router.push(`/all-products/${productId}`);
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    handleSearch(suggestion);
  };

  // Handle product result click from suggestions
  const handleProductClick = (productId) => {
    navigateToProduct(productId);
  };

  // Handle key press for search
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Clear search input
  const clearSearch = () => {
    setSearchQuery("");
    searchInputRef.current?.focus();
    
    router.push({
      pathname: "/all-products",
      query: selectedCategory !== "All" ? { category: selectedCategory } : {}
    }, undefined, { shallow: true });
  };

  // Format price for display
  const formatPrice = (price) => {
    return `GH₵${parseFloat(price).toFixed(2)}`;
  };

  // Get popular products based on stock or other criteria
  const getPopularProducts = () => {
    if (loading || products.length === 0) return [];
    
    return [...products]
      .sort((a, b) => b.stock - a.stock)
      .slice(0, 5);
  };

  const popularProducts = getPopularProducts();

  // Handle add to cart
  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  // Create skeleton loading cards array for the grid
  const renderSkeletonCards = () => {
    const skeletonCount = 12;
    return Array(skeletonCount).fill().map((_, index) => (
      <div key={`skeleton-${index}`} className="bg-white rounded-2xl shadow-sm overflow-hidden animate-pulse border border-gray-100">
        <div className="aspect-[4/3] bg-gray-200"></div>
        <div className="p-3 sm:p-4">
          <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
          <div className="h-8 bg-gray-200 rounded-lg w-full"></div>
        </div>
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile-first Container with proper padding */}
      <div className="px-4 sm:px-6 lg:px-8 xl:px-12 pt-4 pb-8">
        {/* Breadcrumb - Hidden on mobile for cleaner look */}
        <nav className="hidden sm:block text-sm mb-4">
          <ol className="flex items-center space-x-2 text-gray-600">
            <li>
              <Link href="/" className="hover:text-green-600 transition-colors">Home</Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-900 font-medium">All Products</li>
          </ol>
        </nav>

        {/* Modern Search Bar - Mobile Optimized */}
        <div className="mb-6 relative z-20">
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden backdrop-blur-sm">
              <div className="flex items-center">
                {/* Search Icon */}
                <div className="pl-4 pr-2 text-gray-400">
                  <MagnifyingGlassIcon className="h-5 w-5" />
                </div>
                
                {/* Search Input */}
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search fresh produce..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  onFocus={() => setIsFocused(true)}
                  className="flex-1 py-4 text-gray-700 placeholder-gray-400 outline-none text-base"
                />
                
                {/* Clear Button */}
                {searchQuery && (
                  <button 
                    onClick={clearSearch}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <XMarkIcon className="h-4 w-4 text-gray-500" />
                  </button>
                )}

                {/* Search Button */}
                <button
                  onClick={() => handleSearch()}
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 px-6 py-4 text-white font-medium transition-all flex items-center justify-center min-w-[60px]"
                >
                  {isSearching ? (
                    <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-white animate-spin"></div>
                  ) : (
                    <>
                      <span className="hidden sm:inline-block mr-2">Search</span>
                      <MagnifyingGlassIcon className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Search Suggestions - Modern Design */}
            {showSuggestions && (
              <div 
                ref={suggestionsRef}
                className="absolute mt-2 w-full bg-white rounded-2xl shadow-2xl z-50 overflow-hidden border border-gray-100 backdrop-blur-sm"
              >
                {isSearching && (
                  <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-10 rounded-2xl">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mb-2"></div>
                      <p className="text-sm text-gray-600">Searching...</p>
                    </div>
                  </div>
                )}

                {/* Product Search Results */}
                {searchResults.length > 0 && (
                  <div className="p-4">
                    <div className="flex items-center text-gray-500 mb-3">
                      <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
                      <span className="text-sm font-medium">Products</span>
                    </div>
                    <div className="space-y-2">
                      {searchResults.map((product) => (
                        <div 
                          key={product.id}
                          onClick={() => handleProductClick(product.id)}
                          className="p-3 hover:bg-gray-50 rounded-xl cursor-pointer flex items-center group transition-all"
                        >
                          {product.image && (
                            <div className="h-12 w-12 bg-gray-100 rounded-lg overflow-hidden mr-3 flex-shrink-0 border border-gray-200">
                              <img 
                                src={product.image} 
                                alt={product.name} 
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = "/placeholder.png";
                                }}
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-900 truncate group-hover:text-green-700 transition-colors">{product.name}</div>
                            <div className="flex items-center text-sm">
                              <span className="text-green-700 font-semibold">{formatPrice(product.price)}</span>
                              {product.originalPrice > product.price && (
                                <span className="text-gray-500 line-through ml-2 text-xs">
                                  {formatPrice(product.originalPrice)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recent Searches */}
                {recentSearches.length > 0 && searchQuery === "" && (
                  <div className="p-4 border-t border-gray-100">
                    <div className="flex items-center text-gray-500 mb-3">
                      <ClockIcon className="h-4 w-4 mr-2" />
                      <span className="text-sm font-medium">Recent</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((search, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(search)}
                          className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors"
                        >
                          {search}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Popular Products */}
                {!searchQuery && popularProducts.length > 0 && (
                  <div className="p-4 border-t border-gray-100">
                    <div className="flex items-center text-gray-500 mb-3">
                      <FireIcon className="h-4 w-4 mr-2" />
                      <span className="text-sm font-medium">Trending</span>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      {popularProducts.slice(0, 3).map((product) => (
                        <div 
                          key={product.id}
                          onClick={() => handleProductClick(product.id)}
                          className="p-3 hover:bg-gray-50 rounded-xl cursor-pointer flex items-center group transition-all"
                        >
                          {product.image && (
                            <div className="h-10 w-10 bg-gray-100 rounded-lg overflow-hidden mr-3 flex-shrink-0">
                              <img 
                                src={product.image} 
                                alt={product.name} 
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = "/placeholder.png";
                                }}
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-900 truncate text-sm group-hover:text-green-700 transition-colors">{product.name}</div>
                            <div className="text-green-700 font-semibold text-sm">{formatPrice(product.price)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Modern Banner Slideshow - Compact on Mobile */}
        <div className="mb-6">
          <Swiper
            spaceBetween={0}
            centeredSlides={true}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            modules={[Autoplay, Pagination]}
            className="rounded-2xl overflow-hidden shadow-lg"
          >
            {banners.map((banner, index) => (
              <SwiperSlide key={index}>
                <Image
                  src={banner}
                  alt={`Banner ${index + 1}`}
                  width={1200}
                  height={400}
                  className="w-full h-32 sm:h-48 md:h-64 lg:h-80 object-cover"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Categories - Horizontal Scroll on Mobile */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Categories</h2>
            <button 
              onClick={() => setFiltersVisible(!filtersVisible)}
              className="sm:hidden p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <AdjustmentsHorizontalIcon className="h-5 w-5" />
            </button>
          </div>
          
          {/* Mobile: Horizontal Scroll */}
          <div className="sm:hidden overflow-x-auto scrollbar-hide">
            <div className="flex space-x-3 pb-2">
              {categories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                    selectedCategory === category.name 
                      ? "bg-green-600 text-white shadow-lg" 
                      : "bg-white text-gray-700 border border-gray-200 hover:border-green-300"
                  }`}
                >
                  <span className="mr-1">{category.icon}</span>
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Desktop: Grid Layout */}
          <div className="hidden sm:flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category.name 
                    ? "bg-green-600 text-white shadow-lg" 
                    : "bg-white text-gray-700 border border-gray-200 hover:border-green-300 hover:shadow-sm"
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Filters and Sort - Mobile Collapsible */}
        <div className={`sm:hidden transition-all duration-300 overflow-hidden ${filtersVisible ? 'max-h-96 mb-6' : 'max-h-0'}`}>
          <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-900">Sort By</h3>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="popularity">Popular</option>
                <option value="newArrivals">New</option>
                <option value="priceLow">Price ↑</option>
                <option value="priceHigh">Price ↓</option>
              </select>
            </div>
          </div>
        </div>

        {/* Desktop Sort Bar */}
        <div className="hidden sm:flex items-center justify-between mb-6 bg-white rounded-2xl shadow-sm p-4 border border-gray-200">
          <div className="flex items-center space-x-4">
            <span className="text-gray-600 font-medium">
              {filteredProducts.length} products found
            </span>
            {searchQuery && (
              <span className="text-sm text-gray-500">
                for &apos;{searchQuery}&apos;
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="popularity">Sort by Popularity</option>
              <option value="newArrivals">New Arrivals</option>
              <option value="priceLow">Price: Low to High</option>
              <option value="priceHigh">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Results Summary for Search */}
        {searchQuery && (
          <div className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-2xl border border-green-100">
            <p className="text-green-800 font-medium">
              Results for &apos;{searchQuery}&apos;
              {selectedCategory !== "All" && (
                <span className="text-green-600"> in {selectedCategory}</span>
              )}
              <span className="ml-2 text-sm font-normal">({filteredProducts.length} found)</span>
            </p>
          </div>
        )}

        {/* Products Grid - Mobile-First Responsive Design */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {renderSkeletonCards()}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
              {paginatedProducts.length > 0 ? (
                paginatedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 hover:border-green-200 flex flex-col relative"
                  >
                    {/* Discount Badge */}
                    {product.discount > 0 && (
                      <div className="absolute top-2 left-2 z-10">
                        <span className="bg-red-500 text-white px-2 py-0.5 text-xs font-bold rounded-full">
                          -{product.discount}%
                        </span>
                      </div>
                    )}

                    {/* Quick Actions - Desktop Only */}
                    <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex flex-col space-y-1">
                      <button
                        onClick={(e) => handleAddToCart(e, product)}
                        className="bg-white text-green-600 p-1.5 rounded-full shadow-md hover:bg-green-50 transition-all"
                        aria-label="Add to cart"
                      >
                        <ShoppingCartIcon className="h-4 w-4" />
                      </button>
                      <button
                        className="bg-white text-gray-600 p-1.5 rounded-full shadow-md hover:bg-gray-50 transition-all"
                        aria-label="Add to wishlist"
                      >
                        <HeartIcon className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Product Image */}
                    <Link href={`/all-products/${product.id}`} className="block">
                      <div className="aspect-[4/3] overflow-hidden bg-gray-50 relative">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/placeholder.png";
                          }}
                        />
                      </div>
                    </Link>

                    {/* Product Info */}
                    <div className="p-3 sm:p-4 flex flex-col flex-1">
                      <Link href={`/all-products/${product.id}`} className="block mb-2">
                        <h3 className="text-sm sm:text-base font-medium text-gray-900 line-clamp-2 group-hover:text-green-700 transition-colors leading-tight">
                          {product.name}
                        </h3>
                      </Link>
                      
                      {/* Rating - Hidden on mobile for space */}
                      <div className="hidden sm:flex items-center mb-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <StarIcon key={i} className="h-3 w-3 text-yellow-400 fill-current" />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500 ml-1">(4.5)</span>
                      </div>
                      
                      {/* Stock Status - Compact */}
                      <div className="mb-2">
                        {product.stock > 10 ? (
                          <span className="text-xs text-green-600 font-medium">In Stock</span>
                        ) : product.stock > 0 ? (
                          <span className="text-xs text-orange-500 font-medium">Low Stock</span>
                        ) : (
                          <span className="text-xs text-red-500 font-medium">Out of Stock</span>
                        )}
                      </div>
                      
                      {/* Price */}
                      <div className="flex items-center mb-3 mt-auto">
                        <span className="text-green-700 font-bold text-sm sm:text-base">
                          {formatPrice(product.price)}
                        </span>
                        {product.originalPrice > product.price && (
                          <span className="text-gray-500 text-xs line-through ml-2">
                            {formatPrice(product.originalPrice)}
                          </span>
                        )}
                      </div>
                      
                      {/* Add to Cart Button - Responsive */}
                      <button
                        onClick={(e) => handleAddToCart(e, product)}
                        disabled={product.stock === 0}
                        className={`w-full py-2 px-3 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                          product.stock === 0
                            ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                            : "bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow-md active:scale-95"
                        }`}
                      >
                        {product.stock === 0 ? (
                          "Out of Stock"
                        ) : (
                          <>
                            <ShoppingCartIcon className="h-3 w-3 sm:h-4 sm:w-4 inline mr-1" />
                            Add to Cart
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-16">
                  <div className="text-center">
                    <MagnifyingGlassIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                    <p className="text-gray-500 mb-4">
                      {searchQuery 
                        ? `No products match "${searchQuery}" ${selectedCategory !== "All" ? `in ${selectedCategory}` : ""}`
                        : "No products available in this category"
                      }
                    </p>
                    {searchQuery && (
                      <button
                        onClick={clearSearch}
                        className="text-green-600 hover:text-green-700 font-medium text-sm"
                      >
                        Clear search and view all products
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Pagination - Mobile Optimized */}
            {totalPages > 1 && (
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-between bg-white rounded-2xl shadow-sm p-4 border border-gray-200">
                <div className="text-sm text-gray-700 mb-4 sm:mb-0">
                  Showing {startIndex + 1} to {Math.min(startIndex + productsPerPage, filteredProducts.length)} of {filteredProducts.length} products
                </div>
                
                <div className="flex items-center space-x-2">
                  {/* Previous Button */}
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      currentPage === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-green-300"
                    }`}
                  >
                    Previous
                  </button>

                  {/* Page Numbers - Simplified for Mobile */}
                  <div className="hidden sm:flex items-center space-x-1">
                    {[...Array(Math.min(totalPages, 5))].map((_, index) => {
                      let pageNumber;
                      if (totalPages <= 5) {
                        pageNumber = index + 1;
                      } else if (currentPage <= 3) {
                        pageNumber = index + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNumber = totalPages - 4 + index;
                      } else {
                        pageNumber = currentPage - 2 + index;
                      }

                      return (
                        <button
                          key={pageNumber}
                          onClick={() => setCurrentPage(pageNumber)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                            currentPage === pageNumber
                              ? "bg-green-600 text-white shadow-md"
                              : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-green-300"
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}
                  </div>

                  {/* Mobile Page Info */}
                  <div className="sm:hidden px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-600">
                    {currentPage} of {totalPages}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      currentPage === totalPages
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-green-300"
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Back to Top Button */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all z-40"
          aria-label="Back to top"
        >
          <ChevronDownIcon className="h-5 w-5 transform rotate-180" />
        </button>
      </div>
    </div>
  );
};

export default AllProducts;