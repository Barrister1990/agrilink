import CartModal from "@/components/CartModal";
import SearchModal from "@/components/SearchModal";
import { supabase } from "@/lib/supabaseClient";
import useCartStore from "@/store/cartStore";
import {
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  ChevronDownIcon,
  ClipboardDocumentListIcon,
  HomeIcon,
  InformationCircleIcon,
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  UserCircleIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  const cart = useCartStore((state) => state.cart);
  const dropdownRef = useRef(null);
  const router = useRouter();
  
  // Check authentication status on load
  useEffect(() => {
    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        setUser(session.user);
        
        const { data, error } = await supabase
          .from('user_profiles')
          .select('first_name')
          .eq('user_id', session.user.id)
          .single();
        
        if (!error && data) {
          setUserProfile(data);
        }
      }
    }
    
    checkAuth();
    
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          setUser(session.user);
          
          const { data } = await supabase
            .from('user_profiles')
            .select('first_name')
            .eq('user_id', session.user.id)
            .single();
            
          if (data) {
            setUserProfile(data);
          }
        } else {
          setUser(null);
          setUserProfile(null);
        }
      }
    );
    
    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Close all dropdowns on route change
  useEffect(() => {
    const handleRouteChange = () => {
      setIsDropdownOpen(false);
      setIsMenuOpen(false);
    };

    router.events.on('routeChangeStart', handleRouteChange);
    return () => router.events.off('routeChangeStart', handleRouteChange);
  }, [router]);

  // Search handlers
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    if (!searchOpen) setSearchOpen(true);
  };

  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      setSearchOpen(true);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      closeAllDropdowns();
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  };

  // Close all dropdowns
  const closeAllDropdowns = () => {
    setIsDropdownOpen(false);
    setIsMenuOpen(false);
  };

  // Navigation link component
  const NavLink = ({ href, children, className, onClick }) => {
    const handleClick = () => {
      closeAllDropdowns();
      if (onClick) onClick();
    };

    return (
      <Link href={href} onClick={handleClick} className={className}>
        {children}
      </Link>
    );
  };

  const cartItemCount = cart.length;

  return (
    <>
      {/* Main Navbar */}
      <nav className="bg-white/95 backdrop-blur-md shadow-lg border-b border-orange-100/50 fixed w-full top-0 z-[100]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 flex-shrink-0">
              <div className="bg-gradient-to-br from-[#F68B1E] to-orange-600 text-white p-2.5 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-200">
                <HomeIcon className="h-5 w-5" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-[#F68B1E] to-orange-600 bg-clip-text text-transparent">
                AgriLink
              </span>
            </Link>

            {/* Desktop Search Bar */}
            <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
              <div className="relative w-full group">
                <div className={`absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-600 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 ${isSearchFocused ? 'opacity-20' : ''}`}></div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => {
                    setSearchOpen(true);
                    setIsSearchFocused(true);
                  }}
                  onBlur={() => setIsSearchFocused(false)}
                  onKeyPress={handleKeyPress}
                  placeholder="Search for fresh produce, farmers, and more..."
                  className="relative w-full bg-gray-50/80 backdrop-blur-sm border-2 border-gray-200 focus:border-orange-300 focus:bg-white rounded-2xl py-3 pl-12 pr-14 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-orange-100 transition-all duration-300"
                />
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                <button
                  onClick={handleSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-[#F68B1E] to-orange-600 text-white p-2 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200"
                >
                  <MagnifyingGlassIcon className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {/* About Us */}
              <NavLink 
                href="/about-us" 
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-[#F68B1E] hover:bg-orange-50 rounded-xl transition-all duration-200"
              >
                <InformationCircleIcon className="h-5 w-5" />
                <span className="font-medium">About</span>
              </NavLink>
              
              {/* Cart */}
              <button
                onClick={() => setCartOpen(true)}
                className="relative flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-[#F68B1E] hover:bg-orange-50 rounded-xl transition-all duration-200"
              >
                <ShoppingCartIcon className="h-5 w-5" />
                <span className="font-medium">Cart</span>
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs w-6 h-6 flex items-center justify-center rounded-full font-bold shadow-lg animate-pulse">
                    {cartItemCount}
                  </span>
                )}
              </button>

              {/* Account Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-[#F68B1E] hover:bg-orange-50 rounded-xl transition-all duration-200"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-[#F68B1E] to-orange-600 rounded-full flex items-center justify-center">
                    <UserCircleIcon className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-medium">
                    {user && userProfile ? userProfile.first_name : "Account"}
                  </span>
                  <ChevronDownIcon className={`h-4 w-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-72 bg-white/95 backdrop-blur-xl shadow-2xl rounded-2xl border border-gray-100 overflow-hidden transform transition-all duration-200 scale-100">
                    <div className="p-5 bg-gradient-to-r from-orange-50 to-orange-100/50 border-b border-orange-200/50">
                      <h3 className="font-semibold text-gray-800 text-lg">Your Account</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {user ? `Welcome back, ${userProfile?.first_name || 'User'}!` : 'Access your personalized dashboard'}
                      </p>
                    </div>

                    <div className="py-2">
                      {!user && (
                        <NavLink 
                          href="/auth/signup" 
                          className="flex items-center px-5 py-3 hover:bg-orange-50 transition-colors duration-200 group"
                        >
                          <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-2 rounded-xl mr-3 group-hover:scale-105 transition-transform duration-200">
                            <UserCircleIcon className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <span className="font-medium text-gray-800">Sign In / Register</span>
                            <p className="text-xs text-gray-500">Join our community</p>
                          </div>
                        </NavLink>
                      )}
                      
                      <NavLink 
                        href="/account" 
                        className="flex items-center px-5 py-3 hover:bg-orange-50 transition-colors duration-200 group"
                      >
                        <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-2 rounded-xl mr-3 group-hover:scale-105 transition-transform duration-200">
                          <UserCircleIcon className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <span className="font-medium text-gray-800">My Profile</span>
                          <p className="text-xs text-gray-500">Personal information</p>
                        </div>
                      </NavLink>
                      
                      <NavLink 
                        href="/orders" 
                        className="flex items-center px-5 py-3 hover:bg-orange-50 transition-colors duration-200 group"
                      >
                        <div className="bg-gradient-to-br from-green-100 to-green-200 p-2 rounded-xl mr-3 group-hover:scale-105 transition-transform duration-200">
                          <ShoppingCartIcon className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <span className="font-medium text-gray-800">My Orders</span>
                          <p className="text-xs text-gray-500">Track your purchases</p>
                        </div>
                      </NavLink>
                      
                      {user && (
                        <NavLink 
                          href="/admin" 
                          className="flex items-center px-5 py-3 hover:bg-orange-50 transition-colors duration-200 group"
                        >
                          <div className="bg-gradient-to-br from-amber-100 to-amber-200 p-2 rounded-xl mr-3 group-hover:scale-105 transition-transform duration-200">
                            <ClipboardDocumentListIcon className="h-5 w-5 text-amber-600" />
                          </div>
                          <div>
                            <span className="font-medium text-gray-800">Farmers Admin</span>
                            <p className="text-xs text-gray-500">Manage your farm</p>
                          </div>
                        </NavLink>
                      )}
                      
                      {user && (
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-5 py-3 hover:bg-red-50 transition-colors duration-200 group border-t border-gray-100 mt-2"
                        >
                          <div className="bg-gradient-to-br from-red-100 to-red-200 p-2 rounded-xl mr-3 group-hover:scale-105 transition-transform duration-200">
                            <ArrowLeftOnRectangleIcon className="h-5 w-5 text-red-600" />
                          </div>
                          <div>
                            <span className="font-medium text-gray-800">Logout</span>
                            <p className="text-xs text-gray-500">Sign out of your account</p>
                          </div>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Navigation Icons - Cart + Menu */}
            <div className="lg:hidden flex items-center space-x-2">
              {/* Mobile Cart Button */}
              <button
                onClick={() => setCartOpen(true)}
                className="relative bg-gray-100 hover:bg-orange-100 p-2.5 rounded-xl transition-all duration-200 group"
              >
                <ShoppingCartIcon className="h-6 w-6 text-gray-700 group-hover:text-[#F68B1E]" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs min-w-[20px] h-5 flex items-center justify-center rounded-full font-bold shadow-lg animate-pulse px-1">
                    {cartItemCount > 99 ? '99+' : cartItemCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="bg-gray-100 hover:bg-gray-200 p-2.5 rounded-xl transition-colors duration-200"
              >
                {isMenuOpen ? (
                  <XMarkIcon className="h-6 w-6 text-gray-700" />
                ) : (
                  <Bars3Icon className="h-6 w-6 text-gray-700" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-gray-100 shadow-xl">
            {/* Mobile Search */}
            <div className="p-4 border-b border-gray-100">
              <div className="relative group">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Search for fresh produce..."
                  className="w-full bg-gray-50 border-2 border-gray-200 focus:border-orange-300 focus:bg-white rounded-2xl py-3 pl-12 pr-14 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-orange-100 transition-all duration-300"
                />
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                <button
                  onClick={handleSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-[#F68B1E] to-orange-600 text-white p-2 rounded-xl"
                >
                  <MagnifyingGlassIcon className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Mobile Navigation Links */}
            <div className="py-2">
              <NavLink 
                href="/about-us" 
                className="flex items-center px-6 py-4 hover:bg-orange-50 transition-colors duration-200"
              >
                <InformationCircleIcon className="h-6 w-6 mr-4 text-[#F68B1E]" />
                <span className="font-medium">About Us</span>
              </NavLink>
              
              {!user && (
                <NavLink 
                  href="/auth/signup" 
                  className="flex items-center px-6 py-4 hover:bg-orange-50 transition-colors duration-200"
                >
                  <UserCircleIcon className="h-6 w-6 mr-4 text-[#F68B1E]" />
                  <span className="font-medium">Sign In / Register</span>
                </NavLink>
              )}
              
              <NavLink 
                href="/account" 
                className="flex items-center px-6 py-4 hover:bg-orange-50 transition-colors duration-200"
              >
                <UserCircleIcon className="h-6 w-6 mr-4 text-[#F68B1E]" />
                <span className="font-medium">My Profile</span>
              </NavLink>
              
              <NavLink 
                href="/orders" 
                className="flex items-center px-6 py-4 hover:bg-orange-50 transition-colors duration-200"
              >
                <ShoppingCartIcon className="h-6 w-6 mr-4 text-[#F68B1E]" />
                <span className="font-medium">My Orders</span>
              </NavLink>
              
              {user && (
                <NavLink 
                  href="/admin" 
                  className="flex items-center px-6 py-4 hover:bg-orange-50 transition-colors duration-200"
                >
                  <ClipboardDocumentListIcon className="h-6 w-6 mr-4 text-[#F68B1E]" />
                  <span className="font-medium">Farmers Admin</span>
                </NavLink>
              )}
              
              {user && (
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-6 py-4 hover:bg-red-50 transition-colors duration-200 border-t border-gray-100"
                >
                  <ArrowLeftOnRectangleIcon className="h-6 w-6 mr-4 text-red-500" />
                  <span className="font-medium text-red-600">Logout</span>
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Spacer */}
      <div className="h-16"></div>

      {/* Modals */}
      <CartModal isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} searchQuery={searchQuery} />
    </>
  );
};

export default Navbar;