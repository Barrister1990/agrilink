// app/super-admin/layout.js

import { supabase } from '@/lib/supabaseClient';
import {
  BarChart2,
  Bell,
  Home,
  LogOut,
  Menu,
  Package,
  Search,
  Settings,
  ShoppingBag,
  User,
  Users,
  X
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
  
export default function SuperAdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

 
  const handleLogout = async () => {
    try {
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Error logging out:', error.message);
      } else {
        // Redirect to home page after successful logout
        router.push('/');
      }
    } catch (err) {
      console.error('Unexpected error during logout:', err);
    }
  };

  const navigation = [
    { name: 'Dashboard', href: '/super-admin/dashboard', icon: Home },
    { name: 'Farmers', href: '/super-admin/farmers', icon: Users },
    { name: 'Products', href: '/super-admin/products', icon: Package },
    { name: 'Orders', href: '/super-admin/orders', icon: ShoppingBag },
    { name: 'Analytics', href: '/super-admin/analytics', icon: BarChart2 },
    { name: 'Settings', href: '/super-admin/settings', icon: Settings },
  ];

  const isActive = (path) => {
    if (path === '/super-admin/dashboard' && pathname === '/super-admin/') {
      return true;
    }
    return pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-40 md:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75" 
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        ></div>
        
        <div className="fixed inset-y-0 left-0 flex max-w-xs w-full bg-white">
          <div className="h-full w-full flex flex-col">
            <div className="flex items-center justify-between h-16 flex-shrink-0 px-4 bg-green-600">
              <div className="flex items-center">
                <img
                  className="h-8 w-auto"
                  src="/logo.png"
                  alt="Agrilink"
                />
                <span className="ml-2 text-xl font-bold text-white">Agrilink</span>
              </div>
              <button
                className="text-white focus:outline-none"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            {/* Mobile Navigation */}
            <div className="mt-5 flex-1 overflow-y-auto">
              <nav className="px-2 space-y-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                        isActive(item.href)
                          ? 'bg-green-100 text-green-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon className={`mr-3 flex-shrink-0 h-5 w-5 ${
                        isActive(item.href) ? 'text-green-500' : 'text-gray-400 group-hover:text-gray-500'
                      }`} />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
            
            {/* Mobile Logout */}
            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
              <button 
                className="flex items-center px-4 py-2 text-sm text-red-600"
                onClick={handleLogout}
              >
                <LogOut className="mr-3 h-5 w-5 text-red-500" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:w-64 bg-white shadow-lg">
        <div className="flex items-center h-16 flex-shrink-0 px-4 bg-green-600">
          <img
            className="h-8 w-auto"
            src="/logo.png"
            alt="Agrilink"
          />
          <span className="ml-2 text-xl font-bold text-white">Agrilink</span>
        </div>
        
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
          <div className="mt-5 flex-1 flex flex-col">
            <nav className="flex-1 px-2 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      isActive(item.href)
                        ? 'bg-green-100 text-green-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className={`mr-3 flex-shrink-0 h-5 w-5 ${
                      isActive(item.href) ? 'text-green-500' : 'text-gray-400 group-hover:text-gray-500'
                    }`} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          
          {/* Desktop Logout */}
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <button 
              className="flex items-center px-4 py-2 text-sm text-red-600"
              onClick={handleLogout}
            >
              <LogOut className="mr-3 h-5 w-5 text-red-500" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64 flex flex-col flex-1">
        {/* Top navigation */}
        <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white shadow">
          <button
            className="px-4 border-r border-gray-200 text-gray-500 md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex items-center">
              <div className="max-w-lg w-full">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    placeholder="Search"
                    type="search"
                  />
                </div>
              </div>
            </div>
            
            <div className="ml-4 flex items-center md:ml-6">
              {/* Notifications */}
              <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                <span className="sr-only">View notifications</span>
                <Bell className="h-6 w-6" />
              </button>

              {/* Profile dropdown */}
              <div className="ml-3 relative">
                <div className="flex items-center">
                  <div className="rounded-full p-1 bg-gray-100">
                    <User className="h-6 w-6 text-gray-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-700">Admin User</p>
                    <p className="text-xs text-gray-500">Super Admin</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}