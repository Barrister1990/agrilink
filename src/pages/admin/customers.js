// pages/Customers.jsx
import { Search, UserPlus } from 'lucide-react';
import { useState } from 'react';
import AdminLayout from './layout';

const Customers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock data for customers
  const customers = [
    { id: 1, name: 'Jane Smith', email: 'jane.smith@example.com', orders: 15, spent: '$1,256.00', status: 'Active', joined: '15 Jan 2025' },
    { id: 2, name: 'Michael Brown', email: 'michael.brown@example.com', orders: 8, spent: '$824.50', status: 'Active', joined: '03 Feb 2025' },
    { id: 3, name: 'Sarah Johnson', email: 'sarah.j@example.com', orders: 5, spent: '$498.99', status: 'Active', joined: '12 Dec 2024' },
    { id: 4, name: 'David Wilson', email: 'david.wilson@example.com', orders: 12, spent: '$975.25', status: 'Active', joined: '28 Nov 2024' },
    { id: 5, name: 'Emily Davis', email: 'emily.d@example.com', orders: 9, spent: '$724.00', status: 'Active', joined: '10 Jan 2025' },
    { id: 6, name: 'Robert Taylor', email: 'robert.t@example.com', orders: 3, spent: '$182.50', status: 'Inactive', joined: '05 Mar 2025' },
    { id: 7, name: 'Lisa Anderson', email: 'lisa.anderson@example.com', orders: 18, spent: '$1,413.75', status: 'Active', joined: '22 Oct 2024' },
    { id: 8, name: 'Thomas Martin', email: 'tom.martin@example.com', orders: 7, spent: '$547.99', status: 'Active', joined: '17 Jan 2025' },
  ];
  
  // Filter customers based on search query
  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Function to get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <AdminLayout>
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Customers</h2>
        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center">
          <UserPlus size={18} className="mr-1" />
          Add Customer
        </button>
      </div>
      
      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="relative">
          <Search size={20} className="absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search customers by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>
      
      {/* Customers Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Spent</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{customer.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{customer.email}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{customer.joined}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{customer.orders}</td>
                  <td className="px-4 py-3 text-sm font-medium">{customer.spent}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(customer.status)}`}>
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-right">
                    <button className="text-blue-600 hover:text-blue-800 text-sm mr-3">View</button>
                    <button className="text-gray-600 hover:text-gray-800 text-sm">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredCustomers.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-gray-500">No customers found. Try adjusting your search.</p>
          </div>
        )}
        
        {/* Pagination */}
        <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredCustomers.length}</span> of{" "}
                <span className="font-medium">{filteredCustomers.length}</span> results
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
      </div>
    </div>
    </AdminLayout>
  );
};

export default Customers;