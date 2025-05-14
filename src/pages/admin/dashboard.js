import { supabase } from '@/lib/supabaseClient';
import { DollarSign, Package, ShoppingCart, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import RecentOrdersTable from '../../components/RecentOrdersTable';
import StatCard from '../../components/StatCard';
import TopSellingProducts from '../../components/TopSellingProducts';
import AdminLayout from './layout';

const Dashboard = () => {
  const [stats, setStats] = useState([
    { id: 1, title: 'Total Revenue', value: '$0', change: '0%', icon: <DollarSign size={20} />, color: 'bg-blue-500' },
    { id: 2, title: 'Total Orders', value: '0', change: '0%', icon: <ShoppingCart size={20} />, color: 'bg-green-500' },
    { id: 3, title: 'Total Products', value: '0', change: '0%', icon: <Package size={20} />, color: 'bg-yellow-500' },
    { id: 4, title: 'Growth Rate', value: '0%', change: '0%', icon: <TrendingUp size={20} />, color: 'bg-purple-500' },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
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
        console.log(userId)
        
        // Fetch total revenue
        const totalRevenue = await fetchTotalRevenue(userId);
        
        // Fetch total orders data
        const ordersData = await fetchOrdersData(userId);
        
        // Fetch total products
        const productsData = await fetchProductsData(userId);
        
        // Calculate growth rate
        const growthRate = calculateGrowthRate(ordersData, totalRevenue);
        
        // Update stats
        setStats([
          { 
            id: 1, 
            title: 'Total Revenue', 
            value: `$${totalRevenue.current.toFixed(2)}`, 
            change: `${totalRevenue.percentChange}%`, 
            icon: <DollarSign size={20} />, 
            color: 'bg-blue-500' 
          },
          { 
            id: 2, 
            title: 'Total Orders', 
            value: ordersData.current.toString(), 
            change: `${ordersData.percentChange}%`, 
            icon: <ShoppingCart size={20} />, 
            color: 'bg-green-500' 
          },
          { 
            id: 3, 
            title: 'Total Products', 
            value: productsData.current.toString(), 
            change: `${productsData.percentChange}%`, 
            icon: <Package size={20} />, 
            color: 'bg-yellow-500' 
          },
          { 
            id: 4, 
            title: 'Growth Rate', 
            value: `${growthRate.current}%`, 
            change: `${growthRate.percentChange}%`, 
            icon: <TrendingUp size={20} />, 
            color: 'bg-purple-500' 
          },
        ]);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Fetch total revenue from delivered orders for the current farmer
  const fetchTotalRevenue = async (userId) => {
    try {
      // Current month
      const currentDate = new Date();
      const firstDayOfCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const lastDayOfCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      
      // Previous month
      const firstDayOfPreviousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
      const lastDayOfPreviousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
      
      // Step 1: Get all completed orders
      const { data: deliveredOrders } = await supabase
        .from('orders')
        .select('id')
        .eq('status', 'delivered');
      
      if (!deliveredOrders || deliveredOrders.length === 0) {
        return { current: 0, previous: 0, percentChange: 0 };
      }
      
      const orderIds = deliveredOrders.map(order => order.id);
      
      // Current month revenue
      const { data: currentOrderItems } = await supabase
        .from('order_items')
        .select('total')
        .eq('farmer_id', userId)
        .in('order_id', orderIds)
        .gte('created_at', firstDayOfCurrentMonth.toISOString())
        .lte('created_at', lastDayOfCurrentMonth.toISOString());
      
      // Previous month revenue
      const { data: previousOrderItems } = await supabase
        .from('order_items')
        .select('total')
        .eq('farmer_id', userId)
        .in('order_id', orderIds)
        .gte('created_at', firstDayOfPreviousMonth.toISOString())
        .lte('created_at', lastDayOfPreviousMonth.toISOString());
      
      // Calculate totals
      const currentRevenue = currentOrderItems?.reduce((sum, item) => sum + item.total, 0) || 0;
      const previousRevenue = previousOrderItems?.reduce((sum, item) => sum + item.total, 0) || 0;
      
      // Calculate percent change
      let percentChange = 0;
      if (previousRevenue > 0) {
        percentChange = ((currentRevenue - previousRevenue) / previousRevenue) * 100;
      } else if (currentRevenue > 0) {
        percentChange = 100; // If previous was 0 and current is positive, that's 100% growth
      }
      
      return {
        current: currentRevenue,
        previous: previousRevenue,
        percentChange: percentChange > 0 ? `+${percentChange.toFixed(1)}` : percentChange.toFixed(1)
      };
    } catch (error) {
      console.error('Error fetching total revenue:', error);
      return { current: 0, previous: 0, percentChange: 0 };
    }
  };

  // Fetch orders data for the current farmer
  const fetchOrdersData = async (userId) => {
    try {
      // Current month
      const currentDate = new Date();
      const firstDayOfCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const lastDayOfCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      
      // Previous month
      const firstDayOfPreviousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
      const lastDayOfPreviousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
      
      // Find orders that contain items from this farmer
      const { data: orderItemsWithFarmer } = await supabase
        .from('order_items')
        .select('order_id')
        .eq('farmer_id', userId);
      
      if (!orderItemsWithFarmer || orderItemsWithFarmer.length === 0) {
        return { current: 0, previous: 0, percentChange: 0 };
      }
      
      const orderIds = [...new Set(orderItemsWithFarmer.map(item => item.order_id))];
      
      // Current month orders count
      const { count: currentOrders } = await supabase
        .from('orders')
        .select('id', { count: 'exact', head: false })
        .in('id', orderIds)
        .gte('created_at', firstDayOfCurrentMonth.toISOString())
        .lte('created_at', lastDayOfCurrentMonth.toISOString());
      
      // Previous month orders count
      const { count: previousOrders } = await supabase
        .from('orders')
        .select('id', { count: 'exact', head: false })
        .in('id', orderIds)
        .gte('created_at', firstDayOfPreviousMonth.toISOString())
        .lte('created_at', lastDayOfPreviousMonth.toISOString());
      
      // Calculate percent change
      let percentChange = 0;
      if (previousOrders > 0) {
        percentChange = ((currentOrders - previousOrders) / previousOrders) * 100;
      } else if (currentOrders > 0) {
        percentChange = 100; // If previous was 0 and current is positive, that's 100% growth
      }
      
      return {
        current: currentOrders || 0,
        previous: previousOrders || 0,
        percentChange: percentChange > 0 ? `+${percentChange.toFixed(1)}` : percentChange.toFixed(1)
      };
    } catch (error) {
      console.error('Error fetching orders data:', error);
      return { current: 0, previous: 0, percentChange: 0 };
    }
  };

  // Fetch products data for the current farmer
  const fetchProductsData = async (userId) => {
    try {
      // Get current count of products
      const { count: currentCount } = await supabase
        .from('products')
        .select('id', { count: 'exact', head: false })
        .eq('farmer_id', userId);
      
      // Get count from a month ago (estimate by checking created_at)
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      
      const { count: oldCount } = await supabase
        .from('products')
        .select('id', { count: 'exact', head: false })
        .eq('farmer_id', userId)
        .lte('created_at', oneMonthAgo.toISOString());
      
      // Calculate products added in the last month
      const previousCount = oldCount || 0;
      
      // Calculate percent change
      let percentChange = 0;
      if (previousCount > 0) {
        percentChange = ((currentCount - previousCount) / previousCount) * 100;
      } else if (currentCount > 0) {
        percentChange = 100; // If previous was 0 and current is positive, that's 100% growth
      }
      
      return {
        current: currentCount || 0,
        previous: previousCount,
        percentChange: percentChange > 0 ? `+${percentChange.toFixed(1)}` : percentChange.toFixed(1)
      };
    } catch (error) {
      console.error('Error fetching products data:', error);
      return { current: 0, previous: 0, percentChange: 0 };
    }
  };

  // Calculate overall growth rate based on orders and revenue trends
  const calculateGrowthRate = (ordersData, revenueData) => {
    // Simple average of order growth and revenue growth
    const orderGrowth = parseFloat(ordersData.percentChange);
    const revenueGrowth = parseFloat(revenueData.percentChange);
    
    const growthRate = (orderGrowth + revenueGrowth) / 2;
    
    // Calculate month-over-month change (simplified)
    // For a real application, you might want to use a more sophisticated algorithm
    const previousGrowthRate = growthRate * 0.9; // Simplified assumption
    const growthRateChange = growthRate - previousGrowthRate;
    
    return {
      current: growthRate.toFixed(1),
      previous: previousGrowthRate.toFixed(1),
      percentChange: growthRateChange > 0 ? `+${growthRateChange.toFixed(1)}` : growthRateChange.toFixed(1)
    };
  };

  return (
    <AdminLayout>
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <StatCard key={stat.id} {...stat} />
        ))}
      </div>
      
      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <span className="text-gray-500">Loading dashboard data...</span>
        </div>
      )}

      {/* Charts and Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
          <RecentOrdersTable />
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Top Selling Products</h3>
          <TopSellingProducts />
        </div>
      </div>
    </div>
    </AdminLayout>
  );
};

export default Dashboard;