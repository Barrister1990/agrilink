import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
// Updated import path for heroicons
import {
  BellIcon,
  ChartBarIcon,
  ClipboardIcon,
  CogIcon,
  HomeIcon,
  Bars3Icon as MenuIcon,
  MagnifyingGlassIcon as SearchIcon,
  ShoppingBagIcon,
  XMarkIcon as XIcon
} from '@heroicons/react/24/outline';



const navItems = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: <HomeIcon className="w-5 h-5" /> },
  { name: 'Analytics', path: '/admin/analytics', icon: <ChartBarIcon className="w-5 h-5" /> },
  { name: 'Products', path: '/admin/products', icon: <ShoppingBagIcon className="w-5 h-5" /> },
  { name: 'Orders', path: '/admin/orders', icon: <ClipboardIcon className="w-5 h-5" /> },
  { name: 'Settings', path: '/admin/settings', icon: <CogIcon className="w-5 h-5" /> },
];

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pageTitle, setPageTitle] = useState('Dashboard');
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState({
    firstName: '',
    lastName: ''
  });
  const [loading, setLoading] = useState(true);
  
  // Set page title based on current route
  useEffect(() => {
    const currentPage = navItems.find(item => item.path === router.pathname);
    if (currentPage) {
      setPageTitle(currentPage.name);
    }
  }, [router.pathname]);

  // Check for authenticated user and fetch their profile
  useEffect(() => {
    // Get current authenticated user
    const getCurrentUser = async () => {
      try {
        setLoading(true);
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) {
          console.error('Error fetching user:', error);
          setLoading(false);
          return;
        }
        
        if (user) {
          setUser(user);
          // Fetch user profile from profiles table
          const { data, error: profileError } = await supabase
            .from('farmer_profiles')
            .select('first_name, last_name')
            .eq('user_id', user.id)
            .single();
            
          if (profileError) {
            console.error('Error fetching profile:', profileError);
          } else if (data) {
            setUserProfile({
              firstName: data.first_name || '',
              lastName: data.last_name || ''
            });
          }
        }
      } catch (err) {
        console.error('Unexpected error:', err);
      } finally {
        setLoading(false);
      }
    };
    
    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          await getCurrentUser();
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setUserProfile({ firstName: '', lastName: '' });
        }
      }
    );
    
    getCurrentUser();
    
    // Cleanup auth listener on unmount
    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  // Get user initials for avatar
  const getUserInitials = () => {
    if (userProfile.firstName && userProfile.lastName) {
      return `${userProfile.firstName.charAt(0)}${userProfile.lastName.charAt(0)}`;
    } else if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  // Get full name or fallback
  const getDisplayName = () => {
    if (userProfile.firstName && userProfile.lastName) {
      return `${userProfile.firstName} ${userProfile.lastName}`;
    } else if (user?.email) {
      return user.email;
    }
    return 'User';
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed inset-y-0 left-0 z-30 w-64 transition duration-300 transform 
          bg-gradient-to-b from-emerald-800 to-emerald-700 text-white 
          lg:translate-x-0 lg:static lg:inset-0 
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex items-center justify-between px-6 py-5">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 text-emerald-700" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
            </div>
            <span className="text-xl font-semibold">
              <Link href="/">
              AgriLink
              </Link>
              </span>
          </div>
          <button 
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="px-4 py-2">
          <div className="bg-emerald-900 bg-opacity-40 rounded-lg p-2 mb-6">
            <div className="flex items-center space-x-3 px-2 py-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
                {loading ? '...' : getUserInitials()}
              </div>
              <div>
                <h3 className="font-medium">
                  {loading ? 'Loading...' : getDisplayName()}
                </h3>
                <p className="text-sm text-emerald-200">Farm Manager</p>
              </div>
            </div>
          </div>
        </div>

        <nav className="mt-2 px-4">
          <div className="space-y-1">
            {navItems.map(item => (
             <Link 
             href={item.path}
             key={item.name}
             className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200
               ${router.pathname === item.path 
                 ? 'bg-white text-emerald-800' 
                 : 'text-white hover:bg-emerald-600'}
             `}
           >
             {item.icon}
             {item.name}
           </Link>
           
            ))}
          </div>
        </nav>
        
        <div className="absolute bottom-0 w-full p-4">
          <div className="bg-emerald-900 bg-opacity-40 rounded-lg p-4">
            <h4 className="text-emerald-100 text-sm font-medium mb-2">Need help?</h4>
            <p className="text-xs text-emerald-200 mb-3">Contact our support team for assistance</p>
            <Link href="/about-us" className="w-full py-2 bg-white text-emerald-800 rounded-lg text-sm font-medium px-4">
     
              Contact Support
      
            </Link>
            
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm z-10">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <button
                  className="lg:hidden text-gray-500 mr-3"
                  onClick={() => setSidebarOpen(true)}
                >
                  <MenuIcon className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-semibold text-gray-800">{pageTitle}</h1>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Search */}
                <div className="hidden md:block relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Search..."
                  />
                </div>
                
                {/* Notifications */}
                <button className="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none">
                  <span className="sr-only">View notifications</span>
                  <div className="relative">
                    <BellIcon className="h-6 w-6" />
                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full ring-2 ring-white bg-emerald-500" />
                  </div>
                </button>
                
                {/* Profile dropdown */}
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-emerald-700 flex items-center justify-center text-white">
                    {loading ? '...' : getUserInitials()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main View */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6 lg:p-8">
          <div className="bg-white rounded-lg shadow">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}