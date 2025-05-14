import { supabase } from "@/lib/supabaseClient"; // Ensure this import points to your Supabase client
import {
    ArrowLeftOnRectangleIcon,
    ChevronRightIcon,
    CreditCardIcon,
    LockClosedIcon,
    MapIcon,
    ShoppingBagIcon,
    UserIcon,
    XCircleIcon
} from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

// Import Components
import AddressBook from "@/components/account/AddressBook";
import AddressForm from "@/components/account/AddressForm";
import CloseAccount from "@/components/account/CloseAccount";
import MyAccount from "@/components/account/MyAccount";
import Orders from "@/components/account/Orders";
import TopSellingItems from "@/components/TopSellingItems";

const Account = () => {
  const [activeSection, setActiveSection] = useState("my-account");
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated using Supabase
    const checkAuthentication = async () => {
      try {
        // Get session from Supabase
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error fetching session:", error);
          setIsAuthenticated(false);
        } else {
          // User is authenticated if session exists and is not expired
          setIsAuthenticated(!!session);
          if (session) {
            setUserId(session.user.id);
          }
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      // Update authentication state when it changes
      setIsAuthenticated(!!session);
      if (session) {
        setUserId(session.user.id);
      } else {
        setUserId(null);
      }
      setIsLoading(false);
    });

    checkAuthentication();

    // Clean up the subscription when component unmounts
    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  // Handle sign out
  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      // Redirect to home or sign-in page after sign out
      router.push("/auth/signup");
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };

  // Sidebar menu items
  const menuItems = [
    {
      id: "my-account",
      name: "My AgriLink Account",
      icon: <UserIcon className="w-5 h-5 mr-3" />,
    },
    {
      id: "orders",
      name: "Orders",
      icon: <ShoppingBagIcon className="w-5 h-5 mr-3" />,
    },
    {
      id: "address-book",
      name: "Address Book",
      icon: <MapIcon className="w-5 h-5 mr-3" />,
    },
    {
      id: "close-account",
      name: "Close Account",
      icon: <XCircleIcon className="w-5 h-5 mr-3" />,
    },
    {
      id: "logout",
      name: "Logout",
      icon: <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-3" />,
      onClick: handleSignOut, // Add sign out handler
    },
  ];

  // Function to render the active section
  const renderSection = () => {
    switch (activeSection) {
      case "my-account":
        return <MyAccount />;
      case "orders":
        return <Orders />;
      case "address-book":
        return <AddressBook userId={userId}/>;
      case "address-form":
        return <AddressForm />;
      case "close-account":
        return <CloseAccount />;
      case "logout":
        return (
          <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg p-4 text-center">
            <ArrowLeftOnRectangleIcon className="w-12 h-12 text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">You have logged out</h2>
            <p className="text-gray-600 mb-4">Thank you for visiting AgriLink.</p>
            <button 
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              onClick={() => router.push("/auth/signin")}
            >
              Sign In Again
            </button>
          </div>
        );
      default:
        return <MyAccount />;
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your account...</p>
        </div>
      </div>
    );
  }

  // Unauthenticated fallback page
  if (!isAuthenticated) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 text-center">
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-full inline-flex items-center justify-center mb-4">
              <LockClosedIcon className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Account Access Required</h1>
            <p className="text-green-100 mt-2">Please sign in to view your AgriLink profile</p>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-green-100 rounded-full p-2">
                  <UserIcon className="h-5 w-5 text-green-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-900">Personal Dashboard</h3>
                  <p className="text-sm text-gray-500">Access your order history and track current orders</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-green-100 rounded-full p-2">
                  <MapIcon className="h-5 w-5 text-green-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-900">Saved Addresses</h3>
                  <p className="text-sm text-gray-500">Manage your shipping and billing addresses</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-green-100 rounded-full p-2">
                  <CreditCardIcon className="h-5 w-5 text-green-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-900">Rewards Program</h3>
                  <p className="text-sm text-gray-500">View your points and available rewards</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 space-y-3">
              <button 
                onClick={() => router.push("/auth/signup")}
                className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Sign In
              </button>
              
              <button 
                onClick={() => router.push("/auth/signup")}
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 text-base font-medium rounded-md text-green-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Create Account
              </button>
              
              <div className="text-center">
                <button 
                  onClick={() => router.push("/")}
                  className="text-sm text-gray-500 hover:text-green-600"
                >
                  Return to Homepage
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated user view (original component)
  return (
    <div className="bg-gray-50 min-h-screen overflow-x-hidden w-full pt-4">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <button 
              className="md:hidden flex items-center text-gray-600 hover:text-green-700"
              onClick={() => setShowMobileSidebar(!showMobileSidebar)}
            >
              <span className="mr-2">{showMobileSidebar ? "Close" : "Menu"}</span>
              {showMobileSidebar ? 
                <XCircleIcon className="w-5 h-5" /> : 
                <UserIcon className="w-5 h-5" />
              }
            </button>
          </div>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className={`md:block ${showMobileSidebar ? 'block' : 'hidden'} w-full md:w-64 flex-shrink-0`}>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="bg-green-700 py-3 px-4">
                <h2 className="text-lg font-semibold text-white">Account Settings</h2>
              </div>
              <nav className="p-3">
                <ul className="space-y-2">
                  {menuItems.map((item) => (
                    <li key={item.id}>
                      <button
                        onClick={() => {
                          if (item.onClick) {
                            item.onClick();
                          } else {
                            setActiveSection(item.id);
                            setShowMobileSidebar(false);
                          }
                        }}
                        className={`flex items-center w-full p-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                          activeSection === item.id
                            ? "bg-green-600 text-white shadow-sm"
                            : "hover:bg-green-50 hover:text-green-700 text-gray-700"
                        }`}
                      >
                        {item.icon} 
                        <span className="truncate">{item.name}</span>
                        {activeSection === item.id && !item.onClick && (
                          <ChevronRightIcon className="w-4 h-4 ml-auto flex-shrink-0" />
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
              
              {/* Farmer Admin Button */}
              <div className="p-3 border-t border-gray-100">
                <button
                onClick={() => router.push('/farmer-unboarding')}
                  className="flex items-center justify-center w-full py-2 px-3 bg-amber-100 text-amber-800 rounded-lg hover:bg-amber-200 transition-colors text-sm"
                >
                  <CreditCardIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="truncate">Login Into Farmer Admin</span>
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-sm mt-4 p-3">
              <h3 className="font-medium text-gray-700 mb-2 text-sm">Account Summary</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Orders</span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Reward Points</span>
                  <span className="font-medium text-green-600">485</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Saved Addresses</span>
                  <span className="font-medium">3</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-lg shadow-sm p-4 overflow-x-auto">
              {renderSection()}
            </div>

            {/* Top Selling Items Section */}
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">Recommended For You</h2>
              <TopSellingItems />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;