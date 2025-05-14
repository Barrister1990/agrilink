// pages/Analytics.jsx
import { supabase } from '@/lib/supabaseClient';
import { Calendar, DollarSign, PercentSquare, ShoppingBag, TrendingUp, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import AdminLayout from './layout';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState({
    salesData: [],
    stats: {
      totalSales: '$0',
      totalOrders: 0,
      avgOrderValue: '$0',
      conversionRate: '0%',
      totalSalesGrowth: '0%',
      totalOrdersGrowth: '0%',
      avgOrderValueGrowth: '0%',
      conversionRateGrowth: '0%'
    },
    customerMetrics: {
      newCustomers: { value: 0, growth: '0%' },
      returningCustomers: { value: 0, growth: '0%' },
      retention: { value: '0%', growth: '0%' },
      abandonment: { value: '0%', growth: '0%' }
    }
  });
  
  // Category data (you might want to fetch this from the database too)
  const [categoriesData, setCategoriesData] = useState([]);
  
  useEffect(() => {
    fetchAnalyticsData(timeRange);
  }, [timeRange]);
  
  const fetchAnalyticsData = async (selectedTimeRange) => {
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
      
      // Determine date range based on selected time range
      const now = new Date();
      let startDate = new Date();
      
      switch (selectedTimeRange) {
        case 'week':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(now.getMonth() - 1);
          break;
        case 'quarter':
          startDate.setMonth(now.getMonth() - 3);
          break;
        case 'year':
          startDate.setFullYear(now.getFullYear() - 1);
          break;
        default:
          startDate.setMonth(now.getMonth() - 1); // Default to month
      }
      
      // Format dates for Supabase query
      const startDateString = startDate.toISOString();
      const endDateString = now.toISOString();
      
      // 1. First get order_items for the current farmer in the date range
      const { data: farmerOrderItems, error: orderItemsError } = await supabase
        .from('order_items')
        .select('order_id, total, created_at')
        .eq('farmer_id', userId)
        .gte('created_at', startDateString)
        .lte('created_at', endDateString)
        .order('created_at', { ascending: false });
      
      if (orderItemsError) throw orderItemsError;
      
      // 2. Extract unique order IDs
      const orderIds = [...new Set(farmerOrderItems.map(item => item.order_id))];
      
      // 3. Fetch order details to check which ones are delivered
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('id, created_at, status')
        .in('id', orderIds);
      
      if (ordersError) throw ordersError;
      
      // 4. Filter to only include delivered orders
      const deliveredOrders = ordersData.filter(order => order.status.toLowerCase() === 'delivered');
      const deliveredOrderIds = deliveredOrders.map(order => order.id);
      
      // 5. Filter order items to only those from delivered orders
      const deliveredOrderItems = farmerOrderItems.filter(item => 
        deliveredOrderIds.includes(item.order_id)
      );
      
      // 6. Calculate total revenue from delivered order items
      const totalRevenue = deliveredOrderItems.reduce((sum, item) => sum + (item.total || 0), 0);
      
      // 7. Get total number of orders this farmer was part of
      const totalOrders = orderIds.length;
      
      // 8. Calculate average order value
      const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
      
      // 9. Fetch total products for this farmer
      const { data: farmerProducts, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('farmer_id', userId);
      
      if (productsError) throw productsError;
      
      const totalProducts = farmerProducts.length;
      
      // 10. Calculate growth rates by comparing with previous period
      // We need to fetch data from the previous period
      let prevStartDate = new Date(startDate);
      let prevEndDate = new Date(startDate);
      
      switch (selectedTimeRange) {
        case 'week':
          prevStartDate.setDate(prevStartDate.getDate() - 7);
          break;
        case 'month':
          prevStartDate.setMonth(prevStartDate.getMonth() - 1);
          break;
        case 'quarter':
          prevStartDate.setMonth(prevStartDate.getMonth() - 3);
          break;
        case 'year':
          prevStartDate.setFullYear(prevStartDate.getFullYear() - 1);
          break;
      }
      
      const prevStartDateString = prevStartDate.toISOString();
      const prevEndDateString = startDate.toISOString();
      
      // Fetch previous period data
      const { data: prevFarmerOrderItems } = await supabase
        .from('order_items')
        .select('order_id, total, created_at')
        .eq('farmer_id', userId)
        .gte('created_at', prevStartDateString)
        .lt('created_at', prevEndDateString)
        .order('created_at', { ascending: false });
      
      const prevOrderIds = [...new Set(prevFarmerOrderItems.map(item => item.order_id))];
      
      const { data: prevOrdersData } = await supabase
        .from('orders')
        .select('id, created_at, status')
        .in('id', prevOrderIds);
      
      const prevDeliveredOrders = prevOrdersData.filter(order => order.status.toLowerCase() === 'delivered');
      const prevDeliveredOrderIds = prevDeliveredOrders.map(order => order.id);
      
      const prevDeliveredOrderItems = prevFarmerOrderItems.filter(item => 
        prevDeliveredOrderIds.includes(item.order_id)
      );
      
      const prevTotalRevenue = prevDeliveredOrderItems.reduce((sum, item) => sum + (item.total || 0), 0);
      const prevTotalOrders = prevOrderIds.length;
      const prevAvgOrderValue = prevTotalOrders > 0 ? prevTotalRevenue / prevTotalOrders : 0;
      
      // Calculate growth percentages
      const calculateGrowthPercent = (current, previous) => {
        if (previous === 0) return current > 0 ? '+100%' : '0%';
        const growthPercent = ((current - previous) / previous) * 100;
        return growthPercent >= 0 ? `+${growthPercent.toFixed(1)}%` : `${growthPercent.toFixed(1)}%`;
      };
      
      const totalSalesGrowth = calculateGrowthPercent(totalRevenue, prevTotalRevenue);
      const totalOrdersGrowth = calculateGrowthPercent(totalOrders, prevTotalOrders);
      const avgOrderValueGrowth = calculateGrowthPercent(avgOrderValue, prevAvgOrderValue);
      
      // 11. Prepare sales data for charts using delivered order items
      const salesData = [];
      
      if (selectedTimeRange === 'week') {
        // Group by day of week
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const dayMap = {};
        
        deliveredOrderItems.forEach(item => {
          const orderDate = new Date(item.created_at);
          const dayName = days[orderDate.getDay() === 0 ? 6 : orderDate.getDay() - 1]; // Convert Sunday (0) to 6
          dayMap[dayName] = (dayMap[dayName] || 0) + (item.total || 0);
        });
        
        days.forEach(day => {
          salesData.push({
            name: day,
            sales: Math.round(dayMap[day] || 0)
          });
        });
      } else if (selectedTimeRange === 'month') {
        // Group by week of month
        for (let i = 1; i <= 4; i++) {
          const weekStart = new Date(startDate);
          weekStart.setDate(weekStart.getDate() + (i - 1) * 7);
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekEnd.getDate() + 6);
          
          const weekSales = deliveredOrderItems.filter(item => {
            const itemDate = new Date(item.created_at);
            return itemDate >= weekStart && itemDate <= weekEnd;
          }).reduce((sum, item) => sum + (item.total || 0), 0);
          
          salesData.push({
            name: `Week ${i}`,
            sales: Math.round(weekSales)
          });
        }
      } else {
        // Group by month
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthMap = {};
        
        deliveredOrderItems.forEach(item => {
          const orderDate = new Date(item.created_at);
          const monthName = monthNames[orderDate.getMonth()];
          monthMap[monthName] = (monthMap[monthName] || 0) + (item.total || 0);
        });
        
        // Determine which months to show based on time range
        let monthsToShow = [];
        
        if (selectedTimeRange === 'quarter') {
          // Show last 3 months
          const currentMonth = now.getMonth();
          for (let i = 2; i >= 0; i--) {
            const monthIndex = (currentMonth - i + 12) % 12; // Handle wrapping around to previous year
            monthsToShow.push(monthNames[monthIndex]);
          }
        } else { // year
          // Show all 12 months
          monthsToShow = monthNames;
        }
        
        monthsToShow.forEach(month => {
          salesData.push({
            name: month,
            sales: Math.round(monthMap[month] || 0)
          });
        });
      }
      
      // 10. Get product category distribution
      const categoriesMap = {};
      farmerProducts.forEach(product => {
        const category = product.category || 'Other';
        categoriesMap[category] = (categoriesMap[category] || 0) + 1;
      });
      
      const categoryColors = {
        'Vegetables': '#22C55E',        // green-500
        'Fruits': '#F97316',            // orange-500
        'Meat': '#DC2626',              // red-600
        'Meat & Poultry': '#EF4444',    // red-500
        'Dairy & Eggs': '#3B82F6',      // blue-500
        'Seafood': '#06B6D4',           // cyan-500
        'Grains': '#A855F7',            // purple-500
        'Other': '#EAB308'              // yellow-500
      };
      
      
      const newCategoriesData = Object.keys(categoriesMap).map(category => ({
        name: category,
        value: Math.round((categoriesMap[category] / totalProducts) * 100),
        color: categoryColors[category] || '#9CA3AF' // Default color for unknown categories
      }));
      
      // 11. Set customer metrics - this would need actual customer data
      // For now let's use placeholder calculations
      const newCustomers = Math.round(totalOrders * 0.3); // 30% of orders from new customers
      const returningCustomers = totalOrders - newCustomers;
      const retention = returningCustomers > 0 ? Math.round((returningCustomers / totalOrders) * 100) : 0;
      const abandonment = 25; // This would need cart abandonment data
      
      // Set all the calculated data
      setAnalyticsData({
        salesData,
        stats: {
          totalSales: `$${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          totalOrders,
          avgOrderValue: `$${avgOrderValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          conversionRate: '3.5%', // This would need visitor data to calculate accurately
          totalSalesGrowth,
          totalOrdersGrowth,
          avgOrderValueGrowth,
          conversionRateGrowth: '+0.2%' // Placeholder
        },
        customerMetrics: {
          newCustomers: { value: newCustomers, growth: '+15%' }, // Placeholder growth values
          returningCustomers: { value: returningCustomers, growth: '+8%' },
          retention: { value: `${retention}%`, growth: '+2%' },
          abandonment: { value: `${abandonment}%`, growth: '-1%' }
        }
      });
      
      setCategoriesData(newCategoriesData);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Custom tooltip for sales chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded shadow-lg">
          <p className="font-bold">{label}</p>
          <p className="text-green-600">Sales: ${payload[0].value.toLocaleString()}</p>
        </div>
      );
    }
    return null;
  };
  
  // Get growth class based on value
  const getGrowthClass = (growth) => {
    if (growth.startsWith('+')) return 'text-green-600';
    if (growth.startsWith('-')) return 'text-red-600';
    return 'text-gray-600';
  };
  
  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading analytics data...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout>
    <div>
      <div className="flex justify-between items-center mb-6 p-2" >
        <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
        
        <div className="flex items-center">
          <span className="mr-2 text-gray-600">
            <Calendar size={18} />
          </span>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>
        </div>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm text-gray-500">Total Sales</h3>
              <p className="text-2xl font-bold">{analyticsData.stats.totalSales}</p>
              <p className={`text-xs ${getGrowthClass(analyticsData.stats.totalSalesGrowth)}`}>
                {analyticsData.stats.totalSalesGrowth} from last period
              </p>
            </div>
            <div className="bg-green-100 p-2 rounded-lg">
              <DollarSign size={20} className="text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm text-gray-500">Total Orders</h3>
              <p className="text-2xl font-bold">{analyticsData.stats.totalOrders}</p>
              <p className={`text-xs ${getGrowthClass(analyticsData.stats.totalOrdersGrowth)}`}>
                {analyticsData.stats.totalOrdersGrowth} from last period
              </p>
            </div>
            <div className="bg-blue-100 p-2 rounded-lg">
              <ShoppingBag size={20} className="text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm text-gray-500">Average Order Value</h3>
              <p className="text-2xl font-bold">{analyticsData.stats.avgOrderValue}</p>
              <p className={`text-xs ${getGrowthClass(analyticsData.stats.avgOrderValueGrowth)}`}>
                {analyticsData.stats.avgOrderValueGrowth} from last period
              </p>
            </div>
            <div className="bg-purple-100 p-2 rounded-lg">
              <TrendingUp size={20} className="text-purple-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm text-gray-500">Conversion Rate</h3>
              <p className="text-2xl font-bold">{analyticsData.stats.conversionRate}</p>
              <p className={`text-xs ${getGrowthClass(analyticsData.stats.conversionRateGrowth)}`}>
                {analyticsData.stats.conversionRateGrowth} from last period
              </p>
            </div>
            <div className="bg-orange-100 p-2 rounded-lg">
              <PercentSquare size={20} className="text-orange-600" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Sales Overview</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={analyticsData.salesData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="sales" fill="#22C55E" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Top Categories</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoriesData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {categoriesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Customer Metrics */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center mb-4">
          <Users size={20} className="text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold">Customer Metrics</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <h4 className="text-gray-500 text-sm">New Customers</h4>
            <p className="text-2xl font-bold">{analyticsData.customerMetrics.newCustomers.value}</p>
            <p className={`text-xs ${getGrowthClass(analyticsData.customerMetrics.newCustomers.growth)}`}>
              {analyticsData.customerMetrics.newCustomers.growth} from last period
            </p>
          </div>
          <div className="text-center">
            <h4 className="text-gray-500 text-sm">Returning Customers</h4>
            <p className="text-2xl font-bold">{analyticsData.customerMetrics.returningCustomers.value}</p>
            <p className={`text-xs ${getGrowthClass(analyticsData.customerMetrics.returningCustomers.growth)}`}>
              {analyticsData.customerMetrics.returningCustomers.growth} from last period
            </p>
          </div>
          <div className="text-center">
            <h4 className="text-gray-500 text-sm">Customer Retention</h4>
            <p className="text-2xl font-bold">{analyticsData.customerMetrics.retention.value}</p>
            <p className={`text-xs ${getGrowthClass(analyticsData.customerMetrics.retention.growth)}`}>
              {analyticsData.customerMetrics.retention.growth} from last period
            </p>
          </div>
          <div className="text-center">
            <h4 className="text-gray-500 text-sm">Cart Abandonment</h4>
            <p className="text-2xl font-bold">{analyticsData.customerMetrics.abandonment.value}</p>
            <p className={`text-xs ${getGrowthClass(analyticsData.customerMetrics.abandonment.growth)}`}>
              {analyticsData.customerMetrics.abandonment.growth} from last period
            </p>
          </div>
        </div>
        
        {/* Customer metrics chart */}
        <div className="mt-6 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={analyticsData.salesData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="sales" 
                name="Revenue Trend"
                stroke="#3B82F6" 
                activeDot={{ r: 8 }} 
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
    </AdminLayout>
  );
};

export default Analytics;