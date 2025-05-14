import {
    BarChart2,
    CheckSquare,
    Home,
    LogOut,
    Settings,
    ShoppingBag, Truck,
    Users
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();
  
  const navItems = [
    { name: 'Dashboard', href: '/super-admin', icon: Home },
    { name: 'Farmer Applications', href: '/super-admin/farmers', icon: CheckSquare },
    { name: 'Orders', href: '/super-admin/orders', icon: ShoppingBag },
    { name: 'Products', href: '/super-admin/products', icon: Users },
    { name: 'Deliveries', href: '/super-admin/deliveries', icon: Truck },
    { name: 'Analytics', href: '/super-admin/analytics', icon: BarChart2 },
    { name: 'Settings', href: '/super-admin/settings', icon: Settings },
  ];

  return (
    <div className="bg-green-800 text-white w-64 flex flex-col h-full">
      <div className="p-5">
        <h1 className="text-2xl font-bold">Agrilink</h1>
        <p className="text-green-300 text-sm">Super Admin Panel</p>
      </div>
      
      <nav className="mt-5 flex-1">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link 
                  href={item.href}
                  className={`flex items-center px-4 py-3 text-sm rounded-lg transition-colors duration-200 ${
                    isActive 
                      ? 'bg-green-700 text-white' 
                      : 'text-green-100 hover:bg-green-700'
                  }`}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-green-700">
        <button className="flex items-center px-4 py-2 text-sm text-green-100 hover:bg-green-700 rounded-lg w-full transition-colors duration-200">
          <LogOut className="h-5 w-5 mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
}