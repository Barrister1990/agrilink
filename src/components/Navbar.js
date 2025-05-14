import CartModal from "@/components/CartModal";
import SearchModal from "@/components/SearchModal";
import { supabase } from "@/lib/supabaseClient";
import useCartStore from "@/store/cartStore";
import {
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  ClipboardDocumentListIcon,
  HomeIcon,
  InformationCircleIcon,
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  UserCircleIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const cart = useCartStore((state) => state.cart);
  const accountDropdownRef = useRef(null);
  const [searchOpen, setSearchOpen] = useState(false);
  
  // Check authentication status on load
  useEffect(() => {
    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        setUser(session.user);
        
        // Fetch user profile to get first name
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
    
    // Subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          setUser(session.user);
          
          // Fetch user profile
          const { data } = await supabase
            .from('user_profiles')
            .select('first_name')
            .eq('user_id', session.user.id)
            .single();
          console.log(data)
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

  // Close account dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (accountDropdownRef.current && !accountDropdownRef.current.contains(event.target)) {
        setAccountOpen(false);
      }
    }

    if (accountOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [accountOpen]);

  // Handle search action
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    if (!searchOpen) setSearchOpen(true);
  };

  // Handle search submission
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

  // Handle logout
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setAccountOpen(false);
      // You can add redirect or toast notification here if desired
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  };

  return (
    <>
      <nav className="bg-white shadow-lg fixed w-full top-0 z-[100]">
        <div className="container mx-auto flex justify-between items-center p-3">
          {/* Left - Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-[#F68B1E] text-white p-2 rounded-full">
              <HomeIcon className="h-5 w-5" />
            </div>
            <span className="text-2xl font-bold text-[#F68B1E]">AgriLink</span>
          </Link>

          {/* Middle - Search Bar */}
          <div className="hidden md:flex flex-grow mx-8 max-w-xl relative">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => setSearchOpen(true)}
                onKeyPress={handleKeyPress}
                placeholder="Search for fresh produce..."
                className="w-full border border-gray-300 p-2.5 pl-10 rounded-full focus:outline-none focus:ring-2 focus:ring-[#F68B1E] focus:border-transparent pr-12"
              />
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
              <button
                onClick={handleSearch}
                className="absolute right-1 top-1 bg-[#F68B1E] text-white p-1.5 rounded-full hover:bg-orange-600 transition"
              >
                <MagnifyingGlassIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Right - Account and Cart */}
          <div className="flex items-center gap-5">
            {/* About Us Link - Desktop */}
            <Link href="/about-us" className="hidden md:flex items-center gap-1.5 text-gray-700 hover:text-[#F68B1E] transition py-2">
              <InformationCircleIcon className="h-6 w-6" />
              <span>About Us</span>
            </Link>
            
            {/* Account Section */}
            <div className="relative" ref={accountDropdownRef}>
              <button
                onClick={() => setAccountOpen(!accountOpen)}
                className="flex items-center gap-1.5 text-gray-700 hover:text-[#F68B1E] transition py-2"
              >
                <UserCircleIcon className="h-6 w-6" />
                <span className="hidden sm:inline">
                  {user && userProfile ? userProfile.first_name : "Account"}
                </span>
              </button>

              {/* Modern Dropdown */}
              {accountOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white shadow-xl rounded-lg border border-gray-100 overflow-hidden z-50 transform origin-top-right transition-all duration-200">
                  <div className="p-4 bg-gradient-to-r from-orange-100 to-orange-50 border-b border-gray-100">
                    <h3 className="font-medium text-gray-800">Your Account</h3>
                    <p className="text-sm text-gray-500">
                      {user ? `Welcome, ${userProfile?.first_name || 'User'}` : 'Access your account details'}
                    </p>
                  </div>

                  <div className="py-2">
                    {!user ? (
                      <Link href="/auth/signup" className="flex items-center px-4 py-3 hover:bg-orange-50 transition">
                        <span className="bg-orange-100 p-1.5 rounded-full mr-3">
                          <UserCircleIcon className="h-4 w-4 text-[#F68B1E]" />
                        </span>
                        <span>Sign In / Register</span>
                      </Link>
                    ) : null}
                    
                    <Link href="/account" className="flex items-center px-4 py-3 hover:bg-orange-50 transition">
                      <span className="bg-orange-100 p-1.5 rounded-full mr-3">
                        <UserCircleIcon className="h-4 w-4 text-[#F68B1E]" />
                      </span>
                      <span>My Profile</span>
                    </Link>
                    <Link href="/orders" className="flex items-center px-4 py-3 hover:bg-orange-50 transition">
                      <span className="bg-orange-100 p-1.5 rounded-full mr-3">
                        <ShoppingCartIcon className="h-4 w-4 text-[#F68B1E]" />
                      </span>
                      <span>My Orders</span>
                    </Link>
                    
                    {/* Farmers Admin Link - Only show if user is authenticated */}
                    {user && (
                      <Link href="/admin" className="flex items-center px-4 py-3 hover:bg-orange-50 transition">
                        <span className="bg-orange-100 p-1.5 rounded-full mr-3">
                          <ClipboardDocumentListIcon className="h-4 w-4 text-[#F68B1E]" />
                        </span>
                        <span>Farmers Admin</span>
                      </Link>
                    )}
                    
                    {/* Logout Button - Only show if user is authenticated */}
                    {user && (
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-3 hover:bg-orange-50 transition"
                      >
                        <span className="bg-orange-100 p-1.5 rounded-full mr-3">
                          <ArrowLeftOnRectangleIcon className="h-4 w-4 text-[#F68B1E]" />
                        </span>
                        <span>Logout</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Cart Section */}
            <button
              className="relative flex items-center gap-1.5 text-gray-700 hover:text-[#F68B1E] transition py-2"
              onClick={() => setCartOpen(true)}
            >
              <ShoppingCartIcon className="h-6 w-6" />
              <span className="hidden sm:inline">Cart</span>
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#F68B1E] text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-medium">
                  {cart.length}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden bg-gray-100 p-2 rounded-md hover:bg-gray-200 transition"
            >
              {menuOpen ? (
                <XMarkIcon className="h-5 w-5 text-gray-700" />
              ) : (
                <Bars3Icon className="h-5 w-5 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="absolute top-full left-0 w-full bg-white shadow-lg md:hidden transition-all duration-300 ease-in-out">
            <div className="p-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Search for fresh produce..."
                  className="w-full border border-gray-300 p-2.5 pl-10 rounded-full focus:outline-none focus:ring-2 focus:ring-[#F68B1E] focus:border-transparent"
                />
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                <button
                  onClick={handleSearch}
                  className="absolute right-1 top-1 bg-[#F68B1E] text-white p-1.5 rounded-full hover:bg-orange-600 transition"
                >
                  <MagnifyingGlassIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="divide-y divide-gray-100">
              {/* About Us Link - Mobile */}
              <Link href="/about-us" className="flex items-center p-4 hover:bg-orange-50">
                <InformationCircleIcon className="h-5 w-5 mr-3 text-[#F68B1E]" />
                <span>About Us</span>
              </Link>
              
              {!user ? (
                <Link href="/auth/signup" className="flex items-center p-4 hover:bg-orange-50">
                  <UserCircleIcon className="h-5 w-5 mr-3 text-[#F68B1E]" />
                  <span>Sign In / Register</span>
                </Link>
              ) : null}
              
              <Link href="/account" className="flex items-center p-4 hover:bg-orange-50">
                <UserCircleIcon className="h-5 w-5 mr-3 text-[#F68B1E]" />
                <span>My Profile</span>
              </Link>
              <Link href="/orders" className="flex items-center p-4 hover:bg-orange-50">
                <ShoppingCartIcon className="h-5 w-5 mr-3 text-[#F68B1E]" />
                <span>My Orders</span>
              </Link>
              
              {/* Farmers Admin Link - Mobile (Only show if user is authenticated) */}
              {user && (
                <Link href="/admin" className="flex items-center p-4 hover:bg-orange-50">
                  <ClipboardDocumentListIcon className="h-5 w-5 mr-3 text-[#F68B1E]" />
                  <span>Farmers Admin</span>
                </Link>
              )}
              
              {/* Logout Button - Only show if user is authenticated */}
              {user && (
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full p-4 hover:bg-orange-50"
                >
                  <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-3 text-[#F68B1E]" />
                  <span>Logout</span>
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Spacer to prevent content from being hidden under fixed navbar */}
      <div className="h-16"></div>

      {/* Cart Modal */}
      <CartModal isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} searchQuery={searchQuery} />
    </>
  );
};

export default Navbar;