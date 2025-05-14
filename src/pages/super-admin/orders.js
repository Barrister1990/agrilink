import useOrderStore from '@/store/orderStore';
import { ChevronLeft, ChevronRight, Eye, Filter, Search, Truck } from 'lucide-react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import SuperAdminLayout from './layout';

export default function OrdersPage() {
  const router = useRouter();
  
  // Get orders and actions from the store
  const { 
    orders, 
    isLoading, 
    error, 
    fetchOrders, 
    updateOrderStatus 
  } = useOrderStore();

  // Local state for search and filtering
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of orders per page
  
  // Fetch orders on component mount
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Handle status updates
  const handleUpdateStatus = (id, newStatus) => {
    updateOrderStatus(id, newStatus);
  };

  // Handle view order details
  const handleViewOrderDetails = (orderId) => {
    router.push(`/super-admin/orders/${orderId}`);
  };

  // Filter and search orders
  const filteredOrders = orders.filter(order => {
    // Apply status filter
    const statusMatch = statusFilter === 'all' || order.status.toLowerCase() === statusFilter.toLowerCase();
    
    // Apply search filter - search in id, customer name, and location
    const searchMatch = searchTerm === '' || 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.location && order.location.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return statusMatch && searchMatch;
  });

  // Enhance orders with email and payment status (since these aren't in the original store data)
  const enhancedOrders = filteredOrders.map(order => ({
    ...order,
    email: `${order.customer.toLowerCase().replace(' ', '.')}@example.com`, // Generate email from customer name
    paymentStatus: order.status === 'Delivered' ? 'Paid' : (Math.random() > 0.3 ? 'Paid' : 'Pending') // Randomize payment status
  }));

  // Calculate pagination values
  const totalPages = Math.ceil(enhancedOrders.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = enhancedOrders.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const goToPreviousPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

  // Generate pagination buttons
  const getPaginationButtons = () => {
    const buttons = [];
    const maxButtons = 5; // Max number of page buttons to show
    
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);
    
    if (endPage - startPage + 1 < maxButtons) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => paginate(i)}
          className={`relative inline-flex items-center px-4 py-2 border ${
            currentPage === i
              ? 'z-10 bg-green-50 border-green-500 text-green-600'
              : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
          } text-sm font-medium`}
        >
          {i}
        </button>
      );
    }
    
    return buttons;
  };

  if (isLoading) {
    return (
      <SuperAdminLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-lg text-gray-600">Loading orders data...</p>
        </div>
      </SuperAdminLayout>
    );
  }

  if (error) {
    return (
      <SuperAdminLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-lg text-red-600">Error: {error}</p>
        </div>
      </SuperAdminLayout>
    );
  }

  return (
    <SuperAdminLayout>
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Orders Management</h1>
        <p className="text-gray-600">View and manage customer orders</p>
      </div>
      
      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search orders..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </button>
          
          <select 
            className="pl-4 pr-8 py-2 border border-gray-300 rounded-md shadow-sm text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Orders</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>
      </div>
      
      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3 text-left">Order ID</th>
                <th className="px-6 py-3 text-left">Customer</th>
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-left">Amount</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Payment</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentItems.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>{order.customer}</div>
                    <div className="text-xs text-gray-400">{order.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 
                        order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' : 
                        'bg-yellow-100 text-yellow-800'}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${order.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' : 
                        'bg-yellow-100 text-yellow-800'}`}
                    >
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <button 
                        className="p-1 rounded-full text-blue-600 hover:bg-blue-100"
                        title="View Order Details"
                        onClick={() => handleViewOrderDetails(order.id)}
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      
                      {order.status !== 'Delivered' && (
                        <button 
                          className="p-1 rounded-full text-purple-600 hover:bg-purple-100"
                          title={order.status === 'Processing' ? 'Mark as Shipped' : 'Mark as Delivered'}
                          onClick={() => handleUpdateStatus(
                            order.id, 
                            order.status === 'Processing' ? 'Shipped' : 'Delivered'
                          )}
                        >
                          <Truck className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(indexOfLastItem, enhancedOrders.length)}
                </span>{' '}
                of <span className="font-medium">{enhancedOrders.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button 
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                    currentPage === 1 
                      ? 'text-gray-300 cursor-not-allowed' 
                      : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeft className="h-5 w-5" />
                </button>
                
                {getPaginationButtons()}
                
                <button 
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                    currentPage === totalPages 
                      ? 'text-gray-300 cursor-not-allowed' 
                      : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <span className="sr-only">Next</span>
                  <ChevronRight className="h-5 w-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
    </SuperAdminLayout>
  );
}