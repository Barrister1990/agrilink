import { BarChart2, Home, LogOut, Package, Settings, ShoppingCart, Users } from "lucide-react";
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

// Page components

const AdminDashboard = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const router = useRouter();

  // Update URL when currentPage changes
  useEffect(() => {
    router.push(`/admin/${currentPage}`);
  }, [currentPage, router]);

  // Update the currentPage state based on the URL when component mounts
  useEffect(() => {
    const path = router.pathname;
    const pathSegments = path.split('/');
    const currentPath = pathSegments[pathSegments.length - 1];
    
    if (currentPath && currentPath !== '[page]') {
      setCurrentPage(currentPath);
    } else {
      // Default to dashboard if no valid path
      setCurrentPage('dashboard');
    }
  }, [router.pathname]);

  // With Next.js file-based routing, we don't need to manually render components
  // The router will handle rendering the appropriate page

  // Handle logout
  const handleLogout = () => {
    // Implement logout functionality here
    console.log('Logging out...');
    // Example: router.push('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar Component */}
      <div className={`bg-white shadow-lg transition-all duration-300 flex flex-col h-screen ${sidebarOpen ? "w-64" : "w-20"}`}>
        {/* Logo */}
        <div className="p-4 flex items-center justify-center">
          <img src="/profile.jpeg" alt="Farm Logo" className="h-10 w-10" />
          {sidebarOpen && <h1 className="ml-2 text-xl font-bold text-green-700">FarmAdmin</h1>}
        </div>

        {/* Navigation Links */}
        <nav className="mt-8 flex-1">
          <ul>
            {[
              { id: "dashboard", label: "Dashboard", icon: <Home size={20} /> },
              { id: "products", label: "Products", icon: <Package size={20} /> },
              { id: "orders", label: "Orders", icon: <ShoppingCart size={20} /> },
              { id: "customers", label: "Customers", icon: <Users size={20} /> },
              { id: "analytics", label: "Analytics", icon: <BarChart2 size={20} /> },
              { id: "settings", label: "Settings", icon: <Settings size={20} /> },
            ].map((item) => (
              <li key={item.id} className="mb-2">
                <button
                  onClick={() => setCurrentPage(item.id)}
                  className={`flex items-center w-full px-4 py-3 ${
                    currentPage === item.id
                      ? "bg-green-100 text-green-700 border-l-4 border-green-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <span className="flex items-center justify-center">{item.icon}</span>
                  {sidebarOpen && <span className="ml-4">{item.label}</span>}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="p-4">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-100"
          >
            <LogOut size={20} />
            {sidebarOpen && <span className="ml-4">Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header Component */}
        <header className="bg-white shadow-sm z-10">
          <div className="px-4 py-3 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-500 focus:outline-none focus:text-gray-700"
            >
              <svg 
                className="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M4 6h16M4 12h16M4 18h16" 
                />
              </svg>
            </button>
            <div className="text-xl font-semibold text-gray-700 capitalize">
              {currentPage}
            </div>
            <div className="flex items-center">
              <div className="relative">
                <button className="flex items-center focus:outline-none">
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700">
                    A
                  </div>
                  <span className="ml-2 text-gray-700">Admin</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* The Main Content Area will be rendered by Next.js */}
      </div>
    </div>
  );
};

export default AdminDashboard;