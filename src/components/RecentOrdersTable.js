import { supabase } from '@/lib/supabaseClient';
import { format } from 'date-fns'; // Recommended for date formatting
import { useEffect, useState } from 'react';

const RecentOrdersTable = () => {
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentOrders = async () => {
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
          .select('order_id, total')
          .eq('farmer_id', userId)
          .order('created_at', { ascending: false });
          
        if (orderItemsError) {
          console.error('Error fetching order items:', orderItemsError);
          return;
        }
        
        // Group order items by order_id and sum totals
        const orderTotals = {};
        const orderIds = [];
        
        farmerOrderItems.forEach(item => {
          if (!orderTotals[item.order_id]) {
            orderTotals[item.order_id] = 0;
            orderIds.push(item.order_id);
          }
          orderTotals[item.order_id] += item.total;
        });
        
        // Limit to 5 most recent order IDs
        const recentOrderIds = orderIds.slice(0, 5);
        
        if (recentOrderIds.length === 0) {
          setRecentOrders([]);
          setLoading(false);
          return;
        }
        
        // Fetch order details for these order IDs
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select('id, created_at, status')
          .in('id', recentOrderIds)
          .order('created_at', { ascending: false });
          
        if (ordersError) {
          console.error('Error fetching orders:', ordersError);
          return;
        }
        
       
        // Format the data for display
        const formattedOrders = ordersData.map(order => {
          const shortId = order.id.split('-')[0]
          return {
            id: `#ORD-${shortId}`,
            date: format(new Date(order.created_at), 'dd MMM yyyy'),
            status: formatStatus(order.status),
            rawStatus: order.status.toLowerCase(), // Keep the original status for color coding
            amount: `${orderTotals[order.id].toFixed(2)}`
          };
        });
        
        setRecentOrders(formattedOrders);
      } catch (error) {
        console.error('Error in fetchRecentOrders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentOrders();
  }, []);

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

  return (
    <div className="overflow-x-auto">
      {loading ? (
        <div className="flex justify-center py-4">
          <span className="text-gray-500">Loading recent orders...</span>
        </div>
      ) : recentOrders.length === 0 ? (
        <div className="text-center py-4 text-gray-500">
          No recent orders found.
        </div>
      ) : (
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {recentOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-blue-600">{order.id}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{order.date}</td>
                <td className="px-4 py-3 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.rawStatus)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm font-medium">{order.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RecentOrdersTable;