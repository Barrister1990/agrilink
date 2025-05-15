import useCartStore from "@/store/cartStore";
import useProductStore from "@/store/useProductStore";
import { ClockIcon, FireIcon } from "@heroicons/react/24/outline";
import {
  AdjustmentsHorizontalIcon,
  ChevronDownIcon,
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

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 20;

  // Sample categories
  const categories = ["All", "Fruits", "Vegetables", "Dairy", "Grains", "Meat"];

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
    if (router.query.category && categories.includes(router.query.category)) {
      setSelectedCategory(router.query.category);
    }
  }, [router.query]);

  useEffect(() => {
    fetchAllProducts();
  }, []);

  // Load recent searches from localStorage on component mount
  useEffect(() => {
    const savedSearches = localStorage.getItem("recentSearches");
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches).slice(0, 5));
    }
  }, []);

  // Handle clicks outside dropdowns
  useEffect(() => {
    function handleClickOutside(event) {
      // Close category dropdown when clicking outside
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      
      // Close suggestions when clicking outside
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
      setSearchResults(results.slice(0, 8)); // Limit to 8 results for UI
      
      // Extract product names for suggestions
      const productSuggestions = results
        .map(product => product.name)
        .filter((name, index, self) => self.indexOf(name) === index) // Remove duplicates
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

    // Apply search filter if search query exists
    if (searchQuery) {
      filtered = searchProducts(searchQuery);
    }

    // Apply category filter
    if (selectedCategory !== "All") {
      filtered = filtered.filter((product) => product.category === selectedCategory);
    }

    // Apply sorting
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
    setCurrentPage(1); // Reset to first page when filters change
  }, [products, selectedCategory, sortBy, searchQuery, searchProducts]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage);

  // Handle search action
  const handleSearch = (query = searchQuery) => {
    if (!query.trim()) return;
    
    console.log("Searching for:", query);
    console.log("Category:", selectedCategory);

    // Show searching animation briefly
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
    }, 800);

    // Save to recent searches
    const updatedSearches = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(updatedSearches);
    localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
    
    // Close suggestions
    setShowSuggestions(false);
    
    // Update URL with search parameters
    router.push({
      pathname: "/all-products",
      query: { 
        search: query, 
        category: selectedCategory !== "All" ? selectedCategory : "" 
      }
    }, undefined, { shallow: true });
    
    // Update search query state
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
    searchInputRef.current.focus();
    
    // Update URL to remove search parameter
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
    
    // Sort by stock in descending order and take first 5
    return [...products]
      .sort((a, b) => b.stock - a.stock)
      .slice(0, 5);
  };

  const popularProducts = getPopularProducts();

  // Handle add to cart
  const handleAddToCart = (e, product) => {
    e.preventDefault(); // Prevent navigation to product page
    addToCart(product);
  };

  // Create skeleton loading cards array for the grid
  const renderSkeletonCards = () => {
    const skeletonCount = 8; // Show 8 skeleton cards while loading
    return Array(skeletonCount).fill().map((_, index) => (
      <div key={`skeleton-${index}`} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden animate-pulse">
        {/* Skeleton image */}
        <div className="w-full pt-[75%] relative bg-gray-200"></div>
        
        {/* Skeleton content */}
        <div className="p-4">
          {/* Title */}
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
          
          {/* Price */}
          <div className="h-5 bg-gray-200 rounded w-1/3 mb-4"></div>
          
          {/* Button */}
          <div className="h-10 bg-gray-200 rounded-lg w-full mt-3"></div>
        </div>
      </div>
    ));
  };

  return (
    <section className="px-4 sm:px-6 lg:px-12 xl:px-20">
      <nav className="text-sm mb-4">
        <ol className="list-none p-0 flex flex-wrap">
          <li className="flex items-center">
            <Link href="/" className="text-green-700 hover:text-green-900">Home</Link>
            <span className="mx-2 text-gray-500">/</span>
          </li>
          <li className="flex items-center">
            <Link href="/all-products" className="text-green-700 hover:text-green-900">All Products</Link>
          </li>
        </ol>
      </nav>
      <div className="max-w-7xl mx-auto">
        {/* 🔍 Modern Search Bar */}
        <div className="mb-8 relative z-20">
          <div className="flex flex-col md:flex-row gap-2">
            {/* Main Search Bar */}
            <div className="flex-1 relative">
              <div className="flex items-center bg-white rounded-full overflow-hidden shadow-lg border border-gray-200 transition-all hover:shadow-xl">
                {/* Search Input */}
                <div className="flex-1 relative flex items-center">
                  <div className="pl-5 pr-3 text-gray-400">
                    <MagnifyingGlassIcon className="h-5 w-5" />
                  </div>
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search farm produce..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    onFocus={() => setIsFocused(true)}
                    className="w-full py-4 text-gray-700 outline-none text-base"
                  />
                  {searchQuery && (
                    <button 
                      onClick={clearSearch}
                      className="p-1 mx-2 rounded-full hover:bg-gray-100"
                    >
                      <XMarkIcon className="h-5 w-5 text-gray-500" />
                    </button>
                  )}
                </div>

                {/* Divider */}
                <div className="w-px h-8 bg-gray-200 mx-1"></div>

                {/* Category Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="hidden md:flex items-center px-4 py-4 text-gray-700 hover:text-green-700 transition"
                  >
                    <span className="truncate max-w-xs">{selectedCategory}</span>
                    <ChevronDownIcon className="h-5 w-5 ml-2 text-gray-600" />
                  </button>

                  {/* Dropdown List */}
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white shadow-xl rounded-lg z-50 overflow-hidden border border-gray-100">
                      {categories.map((category) => (
                        <button
                          key={category}
                          onClick={() => {
                            setSelectedCategory(category);
                            setDropdownOpen(false);
                          }}
                          className={`block w-full text-left px-4 py-3 hover:bg-gray-50 text-gray-700 ${
                            selectedCategory === category ? "bg-green-50 text-green-700 font-medium" : ""
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Search Button */}
                <button
                  onClick={() => handleSearch()}
                  className="bg-green-600 hover:bg-green-700 px-6 md:px-8 py-4 text-white font-semibold transition flex items-center justify-center rounded-r-full"
                >
                  {isSearching ? (
                    <div className="h-5 w-5 rounded-full border-2 border-t-transparent border-white animate-spin"></div>
                  ) : (
                    <span className="hidden md:inline-block">Search</span>
                  )}
                  <MagnifyingGlassIcon className="h-5 w-5 md:ml-2 md:mr-0" />
                </button>
              </div>
            </div>

            {/* Filter Button (Mobile) */}
            <button 
              onClick={() => setFiltersVisible(!filtersVisible)}
              className="md:hidden px-4 py-3 bg-white text-gray-700 rounded-full shadow border border-gray-200 flex items-center justify-center"
            >
              <AdjustmentsHorizontalIcon className="h-5 w-5 mr-2" />
              Filters
            </button>
          </div>

          {/* Search Suggestions Dropdown */}
          {showSuggestions && (
            <div 
              ref={suggestionsRef}
              className="absolute mt-2 w-full bg-white rounded-xl shadow-2xl z-50 text-left overflow-hidden border border-gray-100"
            >
              {/* Active Search Indicator */}
              {isSearching && (
                <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mb-2"></div>
                    <p className="text-sm text-gray-600">Searching...</p>
                  </div>
                </div>
              )}

              {/* Product Search Results */}
              {searchResults.length > 0 && (
                <div className="px-4 py-3">
                  <div className="flex items-center text-gray-500 mb-2">
                    <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">Products</span>
                  </div>
                  <div className="space-y-2">
                    {searchResults.map((product) => (
                      <div 
                        key={product.id}
                        onClick={() => handleProductClick(product.id)}
                        className="py-3 px-3 hover:bg-gray-50 rounded-lg cursor-pointer text-gray-700 flex items-center group"
                      >
                        {product.image && (
                          <div className="h-14 w-14 bg-gray-100 rounded-lg overflow-hidden mr-3 flex-shrink-0 border border-gray-200 group-hover:border-green-300 transition-all">
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
                        <div className="flex-1">
                          <div className="font-medium line-clamp-1 group-hover:text-green-700 transition-colors">{product.name}</div>
                          <div className="flex items-center text-sm">
                            <span className="text-green-700 font-medium">{formatPrice(product.price)}</span>
                            {product.originalPrice > product.price && (
                              <span className="text-gray-500 line-through ml-2">
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

              {/* Search Suggestions */}
              {suggestions.length > 0 && searchResults.length > 0 && (
                <div className="px-4 py-3 border-t border-gray-100">
                  <div className="flex items-center text-gray-500 mb-2">
                    <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">Suggestions</span>
                  </div>
                  <div className="space-y-1">
                    {suggestions.map((suggestion, index) => (
                      <div 
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="py-2 px-3 hover:bg-gray-50 rounded-md cursor-pointer text-gray-700 group"
                      >
                        <span className="group-hover:text-green-700 transition-colors">{suggestion}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="px-4 py-3 border-t border-gray-100">
                  <div className="flex items-center text-gray-500 mb-2">
                    <ClockIcon className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">Recent Searches</span>
                  </div>
                  <div className="space-y-1">
                    {recentSearches.map((search, index) => (
                      <div 
                        key={index}
                        onClick={() => handleSuggestionClick(search)}
                        className="py-2 px-3 hover:bg-gray-50 rounded-md cursor-pointer text-gray-700 flex items-center group"
                      >
                        <ClockIcon className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="group-hover:text-green-700 transition-colors">{search}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Products - shown when input is empty */}
              {!searchQuery && popularProducts.length > 0 && (
                <div className="px-4 py-3 border-t border-gray-100">
                  <div className="flex items-center text-gray-500 mb-2">
                    <FireIcon className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">Popular Products</span>
                  </div>
                  <div className="space-y-2">
                    {popularProducts.map((product) => (
                      <div 
                        key={product.id}
                        onClick={() => handleProductClick(product.id)}
                        className="py-3 px-3 hover:bg-gray-50 rounded-lg cursor-pointer text-gray-700 flex items-center group"
                      >
                        {product.image && (
                          <div className="h-14 w-14 bg-gray-100 rounded-lg overflow-hidden mr-3 flex-shrink-0 border border-gray-200 group-hover:border-green-300 transition-all">
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
                        <div className="flex-1">
                          <div className="font-medium line-clamp-1 group-hover:text-green-700 transition-colors">{product.name}</div>
                          <div className="flex items-center text-sm">
                            <span className="text-green-700 font-medium">{formatPrice(product.price)}</span>
                            {product.originalPrice > product.price && (
                              <span className="text-gray-500 line-through ml-2">
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

              {/* No Results */}
              {searchQuery && searchResults.length === 0 && (
                <div className="px-4 py-8 text-center text-gray-500">
                  <MagnifyingGlassIcon className="h-8 w-8 mx-auto text-gray-300 mb-2" />
                  <p className="text-gray-600">No products found for &apos;<span className="font-medium">{searchQuery}</span>&apos;</p>
                  <p className="text-sm text-gray-500 mt-1">Try checking your spelling or using different keywords</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 🖼️ Banner Slideshow */}
        <div className="mb-8">
          <Swiper
            spaceBetween={20}
            centeredSlides={true}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            modules={[Autoplay, Pagination]}
            className="rounded-xl overflow-hidden shadow-lg"
          >
            {banners.map((banner, index) => (
              <SwiperSlide key={index}>
                <Image
                  src={banner}
                  alt={`Banner ${index + 1}`}
                  width={1200}
                  height={400}
                  className="w-full h-52 sm:h-72 md:h-96 object-cover"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* 🛍️ Category & Sorting Bar - Desktop */}
        <div className="hidden md:flex items-center justify-between mb-6 bg-white rounded-xl shadow-md p-4">
          {/* Categories */}
          <div className="flex space-x-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 text-sm rounded-full transition-all ${
                  selectedCategory === category 
                    ? "bg-green-600 text-white shadow" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Sort By Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 text-sm border rounded-full shadow-sm bg-white pr-10 text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="popularity">Sort by Popularity</option>
              <option value="newArrivals">New Arrivals</option>
              <option value="priceLow">Price: Low to High</option>
              <option value="priceHigh">Price: High to Low</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
              <ChevronDownIcon className="h-4 w-4 text-gray-500" />
            </div>
          </div>
        </div>

        {/* 🛍️ Category & Sorting Bar - Mobile (Collapsible) */}
        <div className={`md:hidden transition-all duration-300 overflow-hidden ${filtersVisible ? 'max-h-96 mb-6' : 'max-h-0'}`}>
          <div className="bg-white rounded-xl shadow-md p-4">
            {/* Categories */}
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Categories</h3>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-2 text-sm rounded-lg transition-all text-center ${
                      selectedCategory === category 
                        ? "bg-green-600 text-white shadow" 
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Sort By */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Sort By</h3>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 text-sm border rounded-lg shadow-sm bg-white text-gray-700"
              >
                <option value="popularity">Sort by Popularity</option>
                <option value="newArrivals">New Arrivals</option>
                <option value="priceLow">Price: Low to High</option>
                <option value="priceHigh">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results summary when search is active */}
        {searchQuery && (
          <div className="mb-6 bg-green-50 p-4 rounded-xl shadow-sm border border-green-100">
            <p className="text-green-800">
              Showing results for: <span className="font-semibold">&apos;{searchQuery}&apos;</span>
              {selectedCategory !== "All" && (
                <span> in <span className="font-semibold">{selectedCategory}</span></span>
              )}
              <span className="ml-2 text-sm">({filteredProducts.length} products found)</span>
            </p>
          </div>
        )}

        {/* 📦 Products Grid with Modern Loading - Using Skeleton Cards */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {renderSkeletonCards()}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {paginatedProducts.length > 0 ? (
                paginatedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="relative bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all group overflow-hidden flex flex-col"
                  >
                    {/* Discount Badge */}
                    {product.discount > 0 && (
                      <div className="absolute top-2 left-2 z-10">
                        <span className="inline-flex items-center bg-red-500 text-white px-1.5 py-0.5 text-xs font-bold rounded-md">
                          -{product.discount}%
                        </span>
                      </div>
                    )}

                    {/* Quick Add to Cart Button - Desktop Only */}
                    <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block">
                      <button
                        onClick={(e) => handleAddToCart(e, product)}
                        className="bg-green-600 text-white p-1.5 rounded-full hover:bg-green-700 shadow-md transition-all"
                        aria-label="Add to cart"
                      >
                        <ShoppingCartIcon className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Product Image - Improved mobile touch target */}
                    <Link href={`/all-products/${product.id}`} className="block relative pt-[75%] overflow-hidden bg-gray-50 w-full">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="absolute top-0 left-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300" 
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/placeholder.png";
                        }}
                      />
                    </Link>

                 <div className="p-4 flex flex-col flex-1">
                      <Link href={`/all-products/${product.id}`} className="block">
                        <h3 className="text-sm font-medium mb-1 text-gray-800 line-clamp-2 min-h-[2.5rem] group-hover:text-green-700 transition-colors">
                          {product.name}
                        </h3>
                        
                        {/* Stock indicator */}
                        <div className="mb-2">
                          {product.stock > 10 ? (
                            <span className="text-xs text-green-700 font-medium">In Stock</span>
                          ) : product.stock > 0 ? (
                            <span className="text-xs text-orange-500 font-medium">Low Stock</span>
                          ) : (
                            <span className="text-xs text-red-500 font-medium">Out of Stock</span>
                          )}
                        </div>
                      </Link>
                      
                      {/* Price */}
                      <div className="flex items-center mb-3 mt-auto">
                        <span className="text-green-700 font-semibold">{formatPrice(product.price)}</span>
                        {product.originalPrice > product.price && (
                          <span className="text-gray-500 text-sm line-through ml-2">
                            {formatPrice(product.originalPrice)}
                          </span>
                        )}
                      </div>
                      
                      {/* Add to Cart Button */}
                      <button
                        onClick={(e) => handleAddToCart(e, product)}
                        disabled={product.stock === 0}
                        className={`w-full py-2 px-3 rounded-lg text-sm font-medium text-center ${
                          product.stock === 0
                            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                            : "bg-green-600 hover:bg-green-700 text-white shadow-sm transition-colors"
                        }`}
                      >
                        {product.stock === 0 ? (
                          "Out of Stock"
                        ) : (
                          <>
                            <ShoppingCartIcon className="h-4 w-4 inline-block mr-1" />
                            Add to Cart
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full bg-white rounded-xl shadow p-8 text-center">
                  <MagnifyingGlassIcon className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-800 mb-1">No products found</h3>
                  <p className="text-gray-500">
                    {searchQuery 
                      ? `We couldn't find any products matching '${searchQuery}'` 
                      : "No products available in this category"}
                  </p>
                  {searchQuery && (
                    <button
                      onClick={clearSearch}
                      className="mt-4 text-green-600 hover:text-green-800 font-medium"
                    >
                      Clear search
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Pagination */}
            {filteredProducts.length > productsPerPage && (
              <div className="mt-8 flex justify-center">
                <div className="inline-flex items-center rounded-md shadow">
                  {/* Previous Page */}
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`px-3 py-2 rounded-l-md border ${
                      currentPage === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    &laquo; Previous
                  </button>
                  
                  {/* Page Numbers */}
                  <div className="border-t border-b">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      // Show pages around current page
                      let pageToShow;
                      if (totalPages <= 5) {
                        pageToShow = i + 1;
                      } else if (currentPage <= 3) {
                        pageToShow = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageToShow = totalPages - 4 + i;
                      } else {
                        pageToShow = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageToShow}
                          onClick={() => setCurrentPage(pageToShow)}
                          className={`px-4 py-2 border-l border-r ${
                            currentPage === pageToShow
                              ? "bg-green-600 text-white font-medium"
                              : "bg-white text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {pageToShow}
                        </button>
                      );
                    })}
                  </div>
                  
                  {/* Next Page */}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-2 rounded-r-md border ${
                      currentPage === totalPages
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    Next &raquo;
                  </button>
                </div>
              </div>
            )}
          </>
        )}
        
    
        {!loading && filteredProducts.length > 0 && (
          <div className="mt-6 text-sm text-gray-500 text-center">
            Showing {startIndex + 1}-{Math.min(startIndex + productsPerPage, filteredProducts.length)} of {filteredProducts.length} products
          </div>
        )}
      </div>
    </section>
  );
};

export default AllProducts;