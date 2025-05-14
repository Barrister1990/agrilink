// pages/Orders.jsx
import { supabase } from '@/lib/supabaseClient';
import { format } from 'date-fns'; // For date formatting
import { Download, Eye, Filter, Printer, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import AdminLayout from './layout';

const Orders = () => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState({});
  
  useEffect(() => {
    fetchOrders();
  }, []);
  
  // Fetch orders from Supabase
  const fetchOrders = async () => {
    try {
      setLoading(true);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error('No user found');
        setLoading(false);
        return;
      }
      
      const userId = user.id;
      
      // First get order_items for the current farmer
      const { data: farmerOrderItems, error: orderItemsError } = await supabase
        .from('order_items')
        .select('order_id, product_id, quantity, total, created_at')
        .eq('farmer_id', userId)
        .order('created_at', { ascending: false });
        
      if (orderItemsError) {
        console.error('Error fetching order items:', orderItemsError);
        return;
      }
      
      // Get unique order IDs
      const uniqueOrderIds = [...new Set(farmerOrderItems.map(item => item.order_id))];
      
      if (uniqueOrderIds.length === 0) {
        setOrders([]);
        setLoading(false);
        return;
      }
      
      // Fetch order details for these order IDs
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('id, created_at, status, user_id')
        .in('id', uniqueOrderIds)
        .order('created_at', { ascending: false });
        
      if (ordersError) {
        console.error('Error fetching orders:', ordersError);
        return;
      }
      
      // Fetch customer information
      const customerIds = [...new Set(ordersData.map(order => order.user_id))];
      
      const { data: customersData, error: customersError } = await supabase
        .from('user_profiles')
        .select('id, first_name')
        .in('id', customerIds);
        
      if (customersError) {
        console.error('Error fetching customers:', customersError);
        return;
      }
      
      // Create a map of customer IDs to names
      const customerMap = {};
      customersData.forEach(customer => {
        customerMap[customer.id] = customer.first_name;
      });
      
      // Fetch product information for all order items
      const productIds = [...new Set(farmerOrderItems.map(item => item.product_id))];
      
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('id, name, price')
        .in('id', productIds);
        
      if (productsError) {
        console.error('Error fetching products:', productsError);
        return;
      }
      
      // Create a map of product IDs to product info
      const productMap = {};
      productsData.forEach(product => {
        productMap[product.id] = {
          name: product.name,
          price: product.price
        };
      });
      
      // Group order items by order_id
      const orderItemsMap = {};
      farmerOrderItems.forEach(item => {
        if (!orderItemsMap[item.order_id]) {
          orderItemsMap[item.order_id] = [];
        }
        
        // Add product information to order item
        const product = productMap[item.product_id] || { name: 'Unknown Product', price: 0 };
        
        orderItemsMap[item.order_id].push({
          product_id: item.product_id,
          name: product.name,
          price: `$${product.price}`,
          quantity: item.quantity,
          total: item.total
        });
      });
      
      // Calculate total for each order
      const orderTotals = {};
      Object.keys(orderItemsMap).forEach(orderId => {
        orderTotals[orderId] = orderItemsMap[orderId].reduce((sum, item) => sum + item.total, 0);
      });
      
      // Format the data for display
      const formattedOrders = ordersData.map(order => {
        const shortId = order.id.split('-')[0];
        const items = orderItemsMap[order.id] || [];
        const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
        
        return {
          id: `#ORD-${shortId}`,
          rawId: order.id,
          customer: customerMap[order.user_id] || 'Unknown Customer',
          date: format(new Date(order.created_at), 'dd MMM yyyy'),
          status: formatStatus(order.status),
          rawStatus: order.status.toLowerCase(),
          amount: `$${orderTotals[order.id].toFixed(2)}`,
          items: totalItems,
          products: items
        };
      });
      
      setOrders(formattedOrders);
      
      // Create a map of order details for quick lookup
      const detailsMap = {};
      formattedOrders.forEach(order => {
        detailsMap[order.id] = order;
      });
      
      setOrderDetails(detailsMap);
      
    } catch (error) {
      console.error('Error in fetchOrders:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Function to format status from database values to display values
  const formatStatus = (status) => {
    const statusMap = {
      'pending': 'Order Placed',
      'confirmed': 'Order Confirmed',
      'processing': 'Waiting to be Shipped',
      'shipped': 'Shipped',
      'delivered': 'Delivered',
      'cancelled': 'Cancelled'
    };
    
    return statusMap[status.toLowerCase()] || status;
  };
  
  // Filter and search orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         order.customer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.rawStatus === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });
  
  // Get unique statuses for filter
  const statuses = ['all', ...new Set(orders.map(o => o.rawStatus))];
  
  // Function to get status badge color
  const getStatusColor = (status) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-indigo-100 text-indigo-800';
      case 'pending':
        return 'bg-purple-100 text-purple-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Function to handle exporting orders as CSV
  const handleExport = () => {
    const headers = ['Order ID', 'Customer', 'Date', 'Items', 'Status', 'Amount'];
    const csvContent = [
      headers.join(','),
      ...filteredOrders.map(order => [
        order.id,
        `"${order.customer}"`, // Quotes to handle commas in names
        order.date,
        order.items,
        order.status,
        order.amount
      ].join(','))
    ].join('\n');
    
    // Create a blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `orders-export-${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Function to handle viewing order details
  const handleView = (order) => {
    setSelectedOrder(order);
    setIsViewModalOpen(true);
  };
  
  // Function to handle printing an order
  const handlePrint = (order) => {
    setSelectedOrder(order);
    
    // Create a printable version
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Order ${order.id}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { display: flex; justify-content: space-between; border-bottom: 1px solid #eee; padding-bottom: 10px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
            th { background-color: #f5f5f5; }
            .footer { margin-top: 30px; text-align: center; color: #888; font-size: 12px; }
            .total { text-align: right; margin-top: 20px; font-weight: bold; }
            @media print {
              .no-print { display: none; }
              body { margin: 0; padding: 15px; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1>Order Invoice</h1>
              <p>Date: ${order.date}</p>
              <p>Order ID: ${order.id}</p>
             
            </div>
          </div>
          
          <h3>Order Summary</h3>
          <p>Status: ${order.status}</p>
          
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.products.map(product => `
                <tr>
                  <td>${product.name}</td>
                  <td>${product.quantity}</td>
                  <td>${product.price}</td>
                  <td>$${product.total.toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="total">
            <p>Total Amount: ${order.amount}</p>
          </div>
          
          <div class="footer">
            <p>Thank you for your business!</p>
          </div>
          
          <div class="no-print" style="margin-top: 20px; text-align: center;">
            <button onclick="window.print();" style="padding: 10px 20px; background: #4CAF50; color: white; border: none; cursor: pointer; font-size: 16px; border-radius: 4px;">
              Print Invoice
            </button>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };
  
  return (
    <AdminLayout>
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Orders</h2>
        <button 
          onClick={handleExport}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <Download size={18} className="mr-1" />
          Export
        </button>
      </div>
      
      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-3 md:space-y-0">
          <div className="flex items-center space-x-2">
            <Filter size={20} className="text-gray-400" />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status === 'all' ? 'All Statuses' : formatStatus(status)}
                </option>
              ))}
            </select>
          </div>
          
          <div className="relative">
            <Search size={20} className="absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders or customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-md w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
      </div>
      
      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">Loading orders...</p>
            </div>
          ) : (
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-blue-600">{order.id}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{order.date}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{order.items}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.rawStatus)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium">{order.amount}</td>
                    <td className="px-4 py-3 text-sm text-right">
                      <button 
                        onClick={() => handleView(order)}
                        className="text-blue-600 hover:text-blue-800 text-sm mr-3 items-center inline-flex"
                      >
                        <Eye size={16} className="mr-1" />
                        View
                      </button>
                      <button 
                        onClick={() => handlePrint(order)}
                        className="text-gray-600 hover:text-gray-800 text-sm inline-flex items-center"
                      >
                        <Printer size={16} className="mr-1" />
                        Print
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        
        {!loading && filteredOrders.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-gray-500">No orders found. Try adjusting your filters.</p>
          </div>
        )}
        
        {/* Pagination */}
        {!loading && filteredOrders.length > 0 && (
          <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredOrders.length}</span> of{" "}
                  <span className="font-medium">{filteredOrders.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    Previous
                  </button>
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                    1
                  </button>
                  <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* View Order Modal */}
      {isViewModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center border-b p-4">
              <h3 className="text-lg font-bold">Order Details: {selectedOrder.id}</h3>
              <button 
                onClick={() => setIsViewModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              
                <div>
                  <h4 className="font-medium text-gray-500">Order Information</h4>
                  <p><span className="font-medium">Date:</span> {selectedOrder.date}</p>
                  <p>
                    <span className="font-medium">Status:</span> 
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusColor(selectedOrder.rawStatus)}`}>
                      {selectedOrder.status}
                    </span>
                  </p>
                  <p><span className="font-medium">Total:</span> {selectedOrder.amount}</p>
                </div>
              </div>
              
              <h4 className="font-medium text-gray-500 mt-6 mb-2">Order Items</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {selectedOrder.products.map((product, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2">{product.name}</td>
                        <td className="px-4 py-2">{product.price}</td>
                        <td className="px-4 py-2">{product.quantity}</td>
                        <td className="px-4 py-2">
                          ${product.total.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="text-right mt-6">
                <span className="font-bold">Total Amount: {selectedOrder.amount}</span>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 p-4 border-t">
              <button 
                onClick={() => handlePrint(selectedOrder)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded flex items-center"
              >
                <Printer size={16} className="mr-2" />
                Print
              </button>
              <button 
                onClick={() => setIsViewModalOpen(false)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </AdminLayout>
  );
};

export default Orders;