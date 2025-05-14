import useProductStore from "@/store/useProductStore";
import { ClockIcon, FireIcon } from "@heroicons/react/24/outline";
import { ChevronDownIcon, MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

const heroImages = [
  "/hero-1.png", // Replace with actual images
  "/hero-2.png",
  "/hero-3.png",
];

const categories = ["All", "Fruits", "Vegetables", "Grains", "Dairy", "Meat"];

const Hero = ({ onSearch }) => {
  const router = useRouter();
  const { products, loading, fetchAllProducts, searchProducts } = useProductStore();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Fetch products on component mount
  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

  // Load recent searches from localStorage on component mount
  useEffect(() => {
    const savedSearches = localStorage.getItem("recentSearches");
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches).slice(0, 5));
    }
  }, []);

  // Image slideshow effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
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

  // Generate suggestions based on search query using the product store
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

  // Handle search action
  const handleSearch = (query = searchQuery) => {
    if (!query.trim()) return;
    
    console.log("Searching for:", query);
    console.log("Category:", selectedCategory);

    // Save to recent searches
    const updatedSearches = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(updatedSearches);
    localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
    
    // Close suggestions
    setShowSuggestions(false);
    
    // Call parent search handler if provided
    if (onSearch) {
      onSearch(query, selectedCategory);
    } else {
      // If no parent handler, redirect to products page with search query
      router.push({
        pathname: "/all-products",
        query: { search: query, category: selectedCategory !== "All" ? selectedCategory : "" }
      });
    }
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

  // Handle product result click
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
  };

  // Format price for display
  const formatPrice = (price) => {
    return `$${parseFloat(price).toFixed(2)}`;
  };

  // Get popular products based on stock or other criteria
  const getPopularProducts = () => {
    if (loading || products.length === 0) return [];
    
    // Sort by stock in descending order and take first 5
    // In a real app, you might want to sort by popularity or sales
    return [...products]
      .sort((a, b) => b.stock - a.stock)
      .slice(0, 5);
  };

  const popularProducts = getPopularProducts();

  return (
    <section className="relative h-[95vh] flex items-center justify-center text-center text-white">
      {/* Background Image Slider */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
        style={{ backgroundImage: `url(${heroImages[currentIndex]})` }}
      ></div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-3xl px-6">
        <h1 className="text-4xl md:text-6xl font-bold">
          Fresh & Organic Farm Produce
        </h1>
        <p className="mt-4 text-lg md:text-xl">
          Buy directly from trusted farmers. 100% organic, high quality, and delivered fast.
        </p>

        {/* Advanced Search Bar with Category Selection */}
        <div className="mt-6 relative">
          <div className="flex items-center bg-white rounded-full overflow-hidden shadow-lg w-full max-w-md mx-auto">
            {/* Category Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center px-4 py-3 bg-gray-100 text-gray-700 rounded-l-full hover:bg-gray-200 transition"
              >
                {selectedCategory}
                <ChevronDownIcon className="h-5 w-5 ml-2 text-gray-600" />
              </button>

              {/* Dropdown List */}
              {dropdownOpen && (
                <div className="absolute left-0 mt-1 w-40 bg-white shadow-lg rounded-lg z-50">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => {
                        setSelectedCategory(category);
                        setDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
                    >
                      {category}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Search Input */}
            <div className="flex-1 relative flex items-center">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search farm produce..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                onFocus={() => setIsFocused(true)}
                className="w-full px-4 py-3 text-gray-700 outline-none"
              />
              {searchQuery && (
                <button 
                  onClick={clearSearch}
                  className="absolute right-14 p-1 rounded-full hover:bg-gray-100"
                >
                  <XMarkIcon className="h-5 w-5 text-gray-500" />
                </button>
              )}
            </div>

            {/* Search Button */}
            <button
              onClick={() => handleSearch()}
              className="bg-[#F68B1E] px-6 py-3 text-white font-semibold hover:bg-orange-600 transition flex items-center"
            >
              <MagnifyingGlassIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Search Suggestions Dropdown */}
          {showSuggestions && (
            <div 
              ref={suggestionsRef}
              className="absolute mt-2 w-full max-w-md mx-auto bg-white rounded-lg shadow-lg z-50 text-left overflow-hidden"
            >
              {/* Product Search Results */}
              {searchResults.length > 0 && (
                <div className="px-4 py-2">
                  <div className="flex items-center text-gray-500 mb-2">
                    <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">Products</span>
                  </div>
                  <div className="space-y-2">
                    {searchResults.map((product) => (
                      <div 
                        key={product.id}
                        onClick={() => handleProductClick(product.id)}
                        className="py-2 px-2 hover:bg-gray-100 rounded cursor-pointer text-gray-700 flex items-center"
                      >
                        {product.image && (
                          <div className="h-12 w-12 bg-gray-200 rounded overflow-hidden mr-3 flex-shrink-0">
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
                          <div className="font-medium line-clamp-1">{product.name}</div>
                          <div className="flex items-center text-sm">
                            <span className="text-[#F68B1E] font-medium">{formatPrice(product.salePrice)}</span>
                            {product.originalPrice > product.salePrice && (
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
                <div className="px-4 py-2 border-t border-gray-100">
                  <div className="flex items-center text-gray-500 mb-2">
                    <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">Suggestions</span>
                  </div>
                  <div className="space-y-1">
                    {suggestions.map((suggestion, index) => (
                      <div 
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="py-1 px-2 hover:bg-gray-100 rounded cursor-pointer text-gray-700"
                      >
                        {suggestion}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="px-4 py-2 border-t border-gray-100">
                  <div className="flex items-center text-gray-500 mb-2">
                    <ClockIcon className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">Recent Searches</span>
                  </div>
                  <div className="space-y-1">
                    {recentSearches.map((search, index) => (
                      <div 
                        key={index}
                        onClick={() => handleSuggestionClick(search)}
                        className="py-1 px-2 hover:bg-gray-100 rounded cursor-pointer text-gray-700 flex items-center"
                      >
                        <ClockIcon className="h-4 w-4 mr-2 text-gray-400" />
                        {search}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Products - shown when input is empty */}
              {!searchQuery && popularProducts.length > 0 && (
                <div className="px-4 py-2 border-t border-gray-100">
                  <div className="flex items-center text-gray-500 mb-2">
                    <FireIcon className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">Popular Products</span>
                  </div>
                  <div className="space-y-2">
                    {popularProducts.map((product) => (
                      <div 
                        key={product.id}
                        onClick={() => handleProductClick(product.id)}
                        className="py-2 px-2 hover:bg-gray-100 rounded cursor-pointer text-gray-700 flex items-center"
                      >
                        {product.image && (
                          <div className="h-12 w-12 bg-gray-200 rounded overflow-hidden mr-3 flex-shrink-0">
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
                          <div className="font-medium line-clamp-1">{product.name}</div>
                          <div className="flex items-center text-sm">
                            <span className="text-[#F68B1E] font-medium">{formatPrice(product.salePrice)}</span>
                            {product.originalPrice > product.salePrice && (
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
                <div className="px-4 py-6 text-center text-gray-500">
                  No products found for &apos;{searchQuery}&apos;
                </div>
              )}
            </div>
          )}
        </div>

        {/* CTA Button */}
        <Link href="/all-products">
          <button className="mt-6 px-6 py-3 bg-[#F68B1E] text-white font-semibold rounded-lg hover:bg-orange-600 transition shadow-md">
            Shop Now
          </button>
        </Link>
      </div>
    </section>
  );
};

export default Hero;