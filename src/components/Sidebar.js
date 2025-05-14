import { BarChart2, Home, LogOut, Package, Settings, ShoppingCart, Users } from "lucide-react";

const Sidebar = ({ currentPage, setCurrentPage, isOpen, onLogout }) => {
  // Navigation items for the sidebar
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: <Home size={20} /> },
    { id: "products", label: "Products", icon: <Package size={20} /> },
    { id: "orders", label: "Orders", icon: <ShoppingCart size={20} /> },
    { id: "customers", label: "Customers", icon: <Users size={20} /> },
    { id: "analytics", label: "Analytics", icon: <BarChart2 size={20} /> },
    { id: "settings", label: "Settings", icon: <Settings size={20} /> },
  ];

  return (
    <div className={`bg-white shadow-lg transition-all duration-300 flex flex-col h-screen ${isOpen ? "w-64" : "w-20"}`}>
      {/* Logo */}
      <div className="p-4 flex items-center justify-center">
        <img src="/profile.jpeg" alt="Farm Logo" className="h-10 w-10" />
        {isOpen && <h1 className="ml-2 text-xl font-bold text-green-700">FarmAdmin</h1>}
      </div>

      {/* Navigation Links */}
      <nav className="mt-8 flex-1">
        <ul>
          {navItems.map((item) => (
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
                {isOpen && <span className="ml-4">{item.label}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-4">
        <button
          onClick={onLogout} // Call the logout function
          className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-100"
        >
          <LogOut size={20} />
          {isOpen && <span className="ml-4">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
