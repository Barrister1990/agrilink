import { ChevronLeft, ChevronRight, Edit, Eye, Filter, Plus, Search, Trash } from 'lucide-react';
import SuperAdminLayout from './layout';

export default function ProductsPage() {
  // Sample products data
  const products = [
    { id: 'PROD-1234', name: 'Organic Tomatoes', category: 'Vegetables', farmer: 'John Doe', price: '$4.99/kg', stock: 230, status: 'Active' },
    { id: 'PROD-1233', name: 'Fresh Apples', category: 'Fruits', farmer: 'Jane Smith', price: '$3.49/kg', stock: 450, status: 'Active' },
    { id: 'PROD-1232', name: 'Raw Honey', category: 'Honey', farmer: 'Samuel Johnson', price: '$12.99/jar', stock: 75, status: 'Active' },
    { id: 'PROD-1231', name: 'Basmati Rice', category: 'Grains', farmer: 'David Wilson', price: '$8.99/kg', stock: 320, status: 'Active' },
    { id: 'PROD-1230', name: 'Almond Nuts', category: 'Nuts', farmer: 'Robert Brown', price: '$15.99/kg', stock: 180, status: 'Low Stock' },
    { id: 'PROD-1229', name: 'Fresh Milk', category: 'Dairy', farmer: 'Emily Davis', price: '$2.99/L', stock: 90, status: 'Low Stock' },
    { id: 'PROD-1228', name: 'Organic Carrots', category: 'Vegetables', farmer: 'Michael Wilson', price: '$3.29/kg', stock: 280, status: 'Active' },
    { id: 'PROD-1227', name: 'Fresh Strawberries', category: 'Fruits', farmer: 'Sarah Taylor', price: '$6.99/box', stock: 120, status: 'Active' },
    { id: 'PROD-1226', name: 'Whole Wheat Flour', category: 'Grains', farmer: 'Thomas Anderson', price: '$4.49/kg', stock: 0, status: 'Out of Stock' },
    { id: 'PROD-1225', name: 'Organic Potatoes', category: 'Vegetables', farmer: 'Jennifer Clark', price: '$3.99/kg', stock: 340, status: 'Active' },
  ];

  return (
    <SuperAdminLayout>
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Products Management</h1>
          <p className="text-gray-600">View and manage all products</p>
        </div>
        <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </button>
      </div>
      
      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </button>
          
          <select className="pl-4 pr-8 py-2 border border-gray-300 rounded-md shadow-sm text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-green-500">
            <option value="all">All Categories</option>
            <option value="vegetables">Vegetables</option>
            <option value="fruits">Fruits</option>
            <option value="grains">Grains</option>
            <option value="dairy">Dairy</option>
            <option value="nuts">Nuts</option>
            <option value="honey">Honey</option>
          </select>
          
          <select className="pl-4 pr-8 py-2 border border-gray-300 rounded-md shadow-sm text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-green-500">
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="low_stock">Low Stock</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>
        </div>
      </div>
      
      {/* Products Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3 text-left">Product ID</th>
                <th className="px-6 py-3 text-left">Product Name</th>
                <th className="px-6 py-3 text-left">Category</th>
                <th className="px-6 py-3 text-left">Farmer</th>
                <th className="px-6 py-3 text-left">Price</th>
                <th className="px-6 py-3 text-left">Stock</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {product.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.farmer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.stock}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${product.status === 'Active' ? 'bg-green-100 text-green-800' : 
                        product.status === 'Low Stock' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'}`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <button className="p-1 rounded-full text-blue-600 hover:bg-blue-100">
                        <Eye className="h-5 w-5" />
                      </button>
                      <button className="p-1 rounded-full text-yellow-600 hover:bg-yellow-100">
                        <Edit className="h-5 w-5" />
                      </button>
                      <button className="p-1 rounded-full text-red-600 hover:bg-red-100">
                        <Trash className="h-5 w-5" />
                      </button>
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
                Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of{' '}
                <span className="font-medium">152</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span className="sr-only">Previous</span>
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  1
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  2
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  3
                </button>
                <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                  ...
                </span>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  16
                </button>
                <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
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