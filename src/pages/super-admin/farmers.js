import useFarmerStore from '@/store/farmerStore';
import { CheckCircle, ChevronLeft, ChevronRight, Filter, Search, XCircle } from 'lucide-react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import SuperAdminLayout from './layout';
export default function FarmersPage() {
  const router = useRouter();
  // Get farmers and actions from the store
  const { 
    farmers, 
    isLoading, 
    error, 
    fetchFarmers, 
    updateFarmerStatus 
  } = useFarmerStore();

  // Local state for search and filtering
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Fetch farmers on component mount
  useEffect(() => {
    fetchFarmers();
  }, [fetchFarmers]);

  // Handle status updates
  const handleApprove = (id) => {
    updateFarmerStatus(id, 'Approved');
  };

  const handleReject = (id) => {
    updateFarmerStatus(id, 'Rejected');
  };

  // Navigate to farmer details page
  const handleViewFarmer = (id, name) => {
    // Use the farmer's ID for the query, but include the name in the URL for SEO
    const formattedName = name.toLowerCase().replace(/\s+/g, '-');
    router.push({
      pathname: `/super-admin/farmers/${formattedName}`,
      query: { id }
    });
  };

  // Filter and search farmers
  const filteredFarmers = farmers.filter(farmer => {
    // Apply status filter
    const statusMatch = statusFilter === 'all' || farmer.status === statusFilter;
    
    // Apply search filter - search in id, name, email, and phone
    const searchMatch = searchTerm === '' || 
      farmer.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmer.farmer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmer.phone.toLowerCase().includes(searchTerm.toLowerCase());
    
    return statusMatch && searchMatch;
  });

  const enhancedFarmers = filteredFarmers.map(farmer => ({
    ...farmer,
    name: farmer.farmer, // Rename 'farmer' to 'name' for UI consistency
    location: 'Not specified', // Placeholder for location
    products: 'Not specified', // Placeholder for products
  }));

  if (isLoading) {
    return (
      <SuperAdminLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-lg text-gray-600">Loading farmers data...</p>
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
        <h1 className="text-2xl font-bold text-gray-800">Farmer Applications</h1>
        <p className="text-gray-600">Review and manage farmer applications</p>
      </div>
      
      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search applications..."
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
            <option value="all">All Applications</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>
      
      {/* Applications Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3 text-left">ID</th>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Contact Info</th>
                <th className="px-6 py-3 text-left">Location</th>
                <th className="px-6 py-3 text-left">Products</th>
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredFarmers.map((farmer) => (
                <tr key={farmer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {farmer.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {farmer.farmer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>{farmer.email}</div>
                    <div>{farmer.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {farmer.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {farmer.products}
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
                    <div className="flex items-center space-x-2">
                      <button 
                        className="p-1 rounded-full text-green-600 hover:bg-green-100"
                        onClick={() => handleApprove(farmer.id)}
                      >
                        <CheckCircle className="h-5 w-5" />
                      </button>
                      <button 
                        className="p-1 rounded-full text-red-600 hover:bg-red-100"
                        onClick={() => handleReject(farmer.id)}
                      >
                        <XCircle className="h-5 w-5" />
                      </button>
                      <button 
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => handleViewFarmer(farmer.id, farmer.farmer)}
                      >
                        View
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
                Showing <span className="font-medium">1</span> to <span className="font-medium">{enhancedFarmers.length}</span> of{' '}
                <span className="font-medium">{farmers.length}</span> results
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