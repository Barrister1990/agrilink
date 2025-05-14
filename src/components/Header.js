// components/Header.jsx
import { Bell, Menu, Search } from 'lucide-react';
import { useState } from 'react';

const Header = ({ toggleSidebar, sidebarOpen }) => {
  const [notifications, setNotifications] = useState(3);
  
  return (
    <header className="bg-white shadow-sm z-10">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <button 
            onClick={toggleSidebar} 
            className="p-2 rounded-md hover:bg-gray-100 focus:outline-none"
          >
            <Menu size={24} />
          </button>
          <div className="ml-4 relative hidden md:block">
            <div className="flex items-center border rounded-md bg-gray-50 px-3 py-2">
              <Search size={18} className="text-gray-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="ml-2 bg-transparent focus:outline-none w-64"
              />
            </div>
          </div>
        </div>
        <div className="flex items-center">
          <button className="p-2 mx-2 rounded-md hover:bg-gray-100 relative">
            <Bell size={20} />
            {notifications > 0 && (
              <span className="absolute top-1 right-1 bg-red-500 rounded-full w-4 h-4 flex items-center justify-center text-white text-xs">
                {notifications}
              </span>
            )}
          </button>
          <div className="ml-2 flex items-center">
            <img 
              src="/profile.jpeg" 
              alt="User avatar" 
              className="h-8 w-8 rounded-full" 
            />
            <span className="ml-2 font-medium text-sm hidden md:block">John Farmer</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;