import useDashboardStore from '@/store/dashboardStore';
import useFarmerStore from '@/store/farmerStore';
import useOrderStore from '@/store/orderStore';
import {
  AlertCircle,
  Loader2,
  ShoppingBag,
  Truck,
  Users
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import SuperAdminLayout from './layout';
export default function Dashboard() {
    const router = useRouter();
  // Get state and actions from our separate Zustand stores
  const { 
    stats, 
    isLoading: dashboardLoading, 
    fetchDashboardStats 
  } = useDashboardStore();

  const { 
    farmers, 
    isLoading: farmersLoading, 
    updateFarmerStatus,
    fetchFarmers
  } = useFarmerStore();
  
  const {
    orders,
    isLoading: ordersLoading,
    updateOrderStatus,
    fetchOrders
  } = useOrderStore();
  
  // Display only the 5 most recent applications/orders for the dashboard
  const recentFarmers = farmers.slice(0, 5);
  const recentOrders = orders.slice(0, 5);
  
  // Fetch data on component mount
  useEffect(() => {
    // This will automatically fetch farmers and orders if needed
    fetchDashboardStats();
  }, [fetchDashboardStats]);

  // Map icon names to actual components
  const iconMap = {
    Users: Users,
    AlertCircle: AlertCircle,
    ShoppingBag: ShoppingBag,
    Truck: Truck
  };

  // Check if any data is still loading
  const isLoading = dashboardLoading || farmersLoading || ordersLoading;


  const handleViewFarmer = (id, name) => {
    // Use the farmer's ID for the query, but include the name in the URL for SEO
    const formattedName = name.toLowerCase().replace(/\s+/g, '-');
    router.push({
      pathname: `/super-admin/farmers/${formattedName}`,
      query: { id }
    });
  };

  if (isLoading) {
    return (
      <SuperAdminLayout>
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="h-8 w-8 text-green-600 animate-spin" />
          <span className="ml-2 text-lg">Loading dashboard data...</span>
        </div>
      </SuperAdminLayout>
    );
  }

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
          <p className="text-gray-600">Welcome back, Admin! Here's what's happening today.</p>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const StatIcon = iconMap[stat.icon];
            return (
              <div key={stat.title} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.color}`}>
                    <StatIcon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Recent Applications */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-800">Recent Farmer Applications</h2>
              <Link href="/super-admin/farmers" className="text-sm text-green-600 hover:text-green-700">
                View All
              </Link>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3 text-left">ID</th>
                  <th className="px-6 py-3 text-left">Farmer</th>
                  <th className="px-6 py-3 text-left">Date</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentFarmers.map((farmer) => (
                  <tr key={farmer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {farmer.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {farmer.farmer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {farmer.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${farmer.status === 'Approved' ? 'bg-green-100 text-green-800' : 
                          farmer.status === 'Rejected' ? 'bg-red-100 text-red-800' : 
                          'bg-yellow-100 text-yellow-800'}`}
                      >
                        {farmer.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button 
                          className="text-blue-600 hover:text-blue-800"
                          onClick={() => handleViewFarmer(farmer.id, farmer.farmer)}
                        >
                          View
                        </button>
                        {farmer.status === 'Pending' && (
                          <>
                            <button 
                              className="text-green-600 hover:text-green-800"
                              onClick={() => {
                                updateFarmerStatus(farmer.id, 'Approved');
                                // Refresh dashboard stats after updating
                                fetchDashboardStats();
                              }}
                            >
                              Approve
                            </button>
                            <button 
                              className="text-red-600 hover:text-red-800"
                              onClick={() => {
                                updateFarmerStatus(farmer.id, 'Rejected');
                                // Refresh dashboard stats after updating
                                fetchDashboardStats();
                              }}
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
{/* Recent Orders */}
<div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
  {/* Header */}
  <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
    <h2 className="text-xl font-semibold text-gray-800">Recent Orders</h2>
    <Link 
      href="/super-admin/orders" 
      className="text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors flex items-center gap-1"
    >
      View All
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  </div>
  
  {/* Table */}
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead className="bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
        <tr>
          <th className="px-6 py-3 text-left">Order ID</th>
          <th className="px-6 py-3 text-left">Customer</th>
          <th className="px-6 py-3 text-left">Amount</th>
          <th className="px-6 py-3 text-left">Status</th>
          <th className="px-6 py-3 text-left">Action</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {recentOrders.map((order) => (
          <tr key={order.id} className="hover:bg-gray-50 transition-colors">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              #{order.id.substring(0, 8)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
              {order.customer}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {order.amount}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm">
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium
                ${order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' : 
                  order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' : 
                  'bg-amber-100 text-amber-800'}`}
              >
                <span className={`w-2 h-2 rounded-full mr-1.5
                  ${order.status === 'Delivered' ? 'bg-emerald-500' : 
                    order.status === 'Shipped' ? 'bg-blue-500' : 
                    'bg-amber-500'}`}>
                </span>
                {order.status}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm">
              <div className="flex items-center space-x-3">
                <Link 
                  href={`/super-admin/orders/${order.id}`}
                  className="text-gray-600 hover:text-gray-800 transition-colors flex items-center gap-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  View
                </Link>
                
                {order.status === 'Processing' && (
                  <button 
                    className="text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1"
                    onClick={() => {
                      updateOrderStatus(order.id, 'Shipped');
                      // Refresh dashboard stats after updating
                      fetchDashboardStats();
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Ship
                  </button>
                )}
                
                {order.status === 'Shipped' && (
                  <button 
                    className="text-emerald-600 hover:text-emerald-800 transition-colors flex items-center gap-1"
                    onClick={() => {
                      updateOrderStatus(order.id, 'Delivered');
                      // Refresh dashboard stats after updating
                      fetchDashboardStats();
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Deliver
                  </button>
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  
  {/* Empty state - show when no orders */}
  {recentOrders.length === 0 && (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
      <h3 className="text-lg font-medium text-gray-800 mb-1">No recent orders</h3>
      <p className="text-sm text-gray-500">New orders will appear here when customers place them.</p>
    </div>
  )}
</div>
      </div>
    </SuperAdminLayout>
  );
}