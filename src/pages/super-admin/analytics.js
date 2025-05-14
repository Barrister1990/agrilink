// app/super-admin/analytics/page.js

import {
    Calendar,
    ChevronDown,
    CreditCard,
    Download,
    Filter,
    ShoppingBag,
    TrendingUp,
    Users
} from 'lucide-react';
import SuperAdminLayout from './layout';
  
  export default function AnalyticsPage() {
    // Sample data for charts and analytics
    const monthlyRevenue = [
      { month: 'Jan', revenue: 15000 },
      { month: 'Feb', revenue: 18000 },
      { month: 'Mar', revenue: 22000 },
      { month: 'Apr', revenue: 24000 },
      { month: 'May', revenue: 28000 },
      { month: 'Jun', revenue: 32000 },
      { month: 'Jul', revenue: 35000 },
      { month: 'Aug', revenue: 38000 },
      { month: 'Sep', revenue: 42000 },
      { month: 'Oct', revenue: 45000 },
      { month: 'Nov', revenue: 48000 },
      { month: 'Dec', revenue: 52000 },
    ];
  
    const productPerformance = [
      { name: 'Organic Apples', sales: 4500, revenue: 18000, growth: 12 },
      { name: 'Fresh Carrots', sales: 3800, revenue: 15200, growth: 8 },
      { name: 'Organic Lettuce', sales: 3200, revenue: 12800, growth: 15 },
      { name: 'Free-range Eggs', sales: 2900, revenue: 11600, growth: 10 },
      { name: 'Natural Honey', sales: 2600, revenue: 10400, growth: 18 },
    ];
  
    const customerMetrics = {
      totalCustomers: 8240,
      newCustomers: 342,
      returningCustomers: 7898,
      averageOrderValue: 85.6,
      churnRate: 2.3
    };
  
    const farmerMetrics = {
      totalFarmers: 1204,
      activeFarmers: 980,
      newFarmers: 48,
      topCategories: ['Fruits', 'Vegetables', 'Dairy', 'Honey']
    };
  
    return (
        <SuperAdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Analytics</h1>
            <p className="text-gray-600">Data insights and business performance metrics</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-gray-400" />
              <select className="pl-2 pr-8 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-green-500">
                <option value="2025">2025</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
              </select>
            </div>
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </button>
          </div>
        </div>
        
        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-500">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                <h3 className="mt-1 text-xl font-semibold text-gray-900">$245,890</h3>
                <p className="mt-1 text-sm text-green-600">+22% from last month</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-500">
                <ShoppingBag className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Orders</p>
                <h3 className="mt-1 text-xl font-semibold text-gray-900">8,342</h3>
                <p className="mt-1 text-sm text-green-600">+18% from last month</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-500">
                <Users className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Customers</p>
                <h3 className="mt-1 text-xl font-semibold text-gray-900">8,240</h3>
                <p className="mt-1 text-sm text-green-600">+8% from last month</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-500">
                <CreditCard className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Avg Order Value</p>
                <h3 className="mt-1 text-xl font-semibold text-gray-900">$85.60</h3>
                <p className="mt-1 text-sm text-green-600">+4% from last month</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Revenue Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Revenue Trends</h2>
            <div className="flex items-center space-x-2">
              <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500">
                <Filter className="h-4 w-4 mr-1" />
                Filter
                <ChevronDown className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>
          
          <div className="h-72 w-full">
            {/* This would be a chart component in a real application */}
            <div className="relative h-full">
              <div className="absolute bottom-0 left-0 right-0 h-64 flex items-end justify-between px-4">
                {monthlyRevenue.map((item, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div 
                      className="bg-green-500 rounded-t w-8"
                      style={{ height: `${(item.revenue / 52000) * 100}%` }}
                    ></div>
                    <div className="text-xs text-gray-500 mt-1">{item.month}</div>
                  </div>
                ))}
              </div>
              
              {/* Y-axis labels */}
              <div className="absolute top-0 left-0 bottom-0 flex flex-col justify-between py-2">
                <span className="text-xs text-gray-500">$50K</span>
                <span className="text-xs text-gray-500">$40K</span>
                <span className="text-xs text-gray-500">$30K</span>
                <span className="text-xs text-gray-500">$20K</span>
                <span className="text-xs text-gray-500">$10K</span>
                <span className="text-xs text-gray-500">$0</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Top Products */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Top Performing Products</h2>
            </div>
            <div className="p-6">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Sales</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Growth</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {productPerformance.map((product, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3 text-sm text-gray-900">{product.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-500 text-right">{product.sales}</td>
                      <td className="px-4 py-3 text-sm text-gray-500 text-right">${product.revenue}</td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-sm text-green-600">+{product.growth}%</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Customer Metrics */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Customer Metrics</h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Total Customers</p>
                  <p className="mt-1 text-xl font-semibold text-gray-900">{customerMetrics.totalCustomers}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">New Customers</p>
                  <p className="mt-1 text-xl font-semibold text-gray-900">{customerMetrics.newCustomers}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Returning Customers</p>
                  <p className="mt-1 text-xl font-semibold text-gray-900">{customerMetrics.returningCustomers}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Churn Rate</p>
                  <p className="mt-1 text-xl font-semibold text-gray-900">{customerMetrics.churnRate}%</p>
                </div>
              </div>
              
              {/* Customer Doughnut Chart Placeholder */}
              <div className="mt-6">
                <div className="relative h-48 w-48 mx-auto">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-36 w-36 rounded-full border-8 border-green-500"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-sm text-gray-500">Retention</p>
                        <p className="text-xl font-bold text-gray-900">96%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Farmer Analytics */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Farmer Analytics</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <p className="text-sm text-gray-500">Total Farmers</p>
                <p className="mt-1 text-xl font-semibold text-gray-900">{farmerMetrics.totalFarmers}</p>
              </div>
              <div>
              <p className="text-sm text-gray-500">Active Farmers</p>
              <p className="mt-1 text-xl font-semibold text-gray-900">{farmerMetrics.activeFarmers}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">New Farmers</p>
              <p className="mt-1 text-xl font-semibold text-gray-900">{farmerMetrics.newFarmers}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Top Categories</p>
              <div className="mt-1 flex flex-wrap">
                {farmerMetrics.topCategories.map((category, index) => (
                  <span key={index} className="mr-2 mb-2 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                    {category}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          {/* Farmer Metrics Chart Placeholder */}
          <div className="mt-6">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-700">Farmer Activity</h3>
                <select className="pl-2 pr-8 py-1 border border-gray-300 rounded-md shadow-sm text-xs text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-green-500">
                  <option value="month">Last Month</option>
                  <option value="quarter">Last Quarter</option>
                  <option value="year">Last Year</option>
                </select>
              </div>
              
              <div className="h-48 flex items-end space-x-2">
                {/* Simple bar chart simulation */}
                <div className="flex-1 flex items-end justify-around">
                  {Array.from({ length: 7 }).map((_, index) => {
                    const height = Math.floor(Math.random() * 100);
                    return (
                      <div key={index} className="flex flex-col items-center">
                        <div 
                          className="w-10 bg-green-500 rounded-t" 
                          style={{ height: `${height}%` }}
                        ></div>
                        <span className="text-xs text-gray-500 mt-1">Day {index + 1}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Regional Performance */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Regional Performance</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-4">Top Performing Regions</h3>
              <div className="space-y-4">
                {['Northern California', 'Pacific Northwest', 'Midwest', 'Southwest', 'Northeast'].map((region, index) => {
                  const percentage = 95 - (index * 10);
                  return (
                    <div key={index}>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">{region}</span>
                        <span className="text-sm font-medium text-gray-900">{percentage}%</span>
                      </div>
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-4">Growth Opportunity Regions</h3>
              <div className="space-y-4">
                {['Southeast', 'Rocky Mountains', 'Great Plains', 'Mid-Atlantic', 'South'].map((region, index) => {
                  const percentage = 65 - (index * 8);
                  return (
                    <div key={index}>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">{region}</span>
                        <span className="text-sm font-medium text-gray-900">{percentage}%</span>
                      </div>
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </SuperAdminLayout>
  );
}