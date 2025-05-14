// dashboardStore.js
import { create } from 'zustand';
import useFarmerStore from './farmerStore';
import useOrderStore from './orderStore';

const useDashboardStore = create((set) => ({
  stats: [],
  isLoading: false,
  error: null,

  // Fetch dashboard statistics
  fetchDashboardStats: async () => {
    set({ isLoading: true, error: null });
    try {
      // Access the farmer and order stores
      const farmerStore = useFarmerStore.getState();
      const orderStore = useOrderStore.getState();

      // If farmer data or order data isn't loaded yet, fetch them
      const fetchPromises = [];
      if (farmerStore.farmers.length === 0 && !farmerStore.isLoading) {
        fetchPromises.push(farmerStore.fetchFarmers());
      }
      if (orderStore.orders.length === 0 && !orderStore.isLoading) {
        fetchPromises.push(orderStore.fetchOrders());
      }

      // Wait for both to complete if needed
      if (fetchPromises.length > 0) {
        await Promise.all(fetchPromises);
      }

      // Get the updated data after fetching
      const farmers = useFarmerStore.getState().farmers;
      const orders = useOrderStore.getState().orders;

      // Calculate statistics
      const stats = calculateDashboardStats(farmers, orders);

      set({ stats, isLoading: false });
    } catch (error) {
      set({ error: "Failed to fetch dashboard statistics", isLoading: false });
    }
  }
}));

// Helper function to calculate dashboard statistics
function calculateDashboardStats(farmers, orders) {
  const totalFarmers = farmers.length;
  const pendingApplications = farmers.filter(farmer => farmer.status === 'Pending').length;
  const totalOrders = orders.length;
  
  // Calculate deliveries today by comparing with current date
  const today = new Date().toISOString().split('T')[0];
  const deliveriesToday = orders.filter(order => 
    order.status === 'Delivered' && 
    order.date === today
  ).length;

  return [
    { title: 'Total Farmers', value: totalFarmers.toString(), icon: 'Users', color: 'bg-blue-500' },
    { title: 'Pending Applications', value: pendingApplications.toString(), icon: 'AlertCircle', color: 'bg-yellow-500' },
    { title: 'Total Orders', value: totalOrders.toString(), icon: 'ShoppingBag', color: 'bg-green-500' },
    { title: 'Deliveries Today', value: deliveriesToday.toString(), icon: 'Truck', color: 'bg-purple-500' },
  ];
}

export default useDashboardStore;