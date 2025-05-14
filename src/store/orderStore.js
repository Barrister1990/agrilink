import { supabase } from '@/lib/supabaseClient';
import { create } from 'zustand';

const useOrderStore = create((set, get) => ({
  orders: [],
  isLoading: false,
  error: null,

  // Fetch all orders from Supabase with independent queries
  fetchOrders: async () => {
    set({ isLoading: true, error: null });
    try {
      // Get current user session
      const { data: { session } } = await supabase.auth.getSession();
   
      if (!session) {
        throw new Error("User not authenticated");
      }
      
      // Step 1: Query orders table
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (ordersError) throw ordersError;
      
      // Process each order
      const processedOrders = await Promise.all(ordersData.map(async (order) => {
        // Step 2: Query profiles table for each order
        const { data: profileData, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', order.user_id)
          .single();
          
        if (profileError) {
          console.error("Error fetching profile for order:", order.id, profileError);
        }
        
        // Step 2b: Query user address - Added this missing query
        const { data: addressData, error: addressError } = await supabase
          .from('user_address')
          .select('address, city, region')
          .eq('user_id', order.user_id)
          .single();
          
        if (addressError) {
          console.error("Error fetching address for order:", order.id, addressError);
        }
        
        // Step 3: Query order_items table for each order
        const { data: orderItemsData, error: itemsError } = await supabase
          .from('order_items')
          .select('id, product_id, quantity, price, total')
          .eq('order_id', order.id);
          
        if (itemsError) {
          console.error("Error fetching order items for order:", order.id, itemsError);
        }
        
        // Format customer name
        const firstName = profileData?.first_name || 'Unknown';
        const lastName = profileData?.last_name || 'User';
        const customerName = `${firstName} ${lastName}`;
        
        // Format location
        const city = addressData?.city || '';
        const region = addressData?.region || '';
        const location = [city, region].filter(Boolean).join(', ');
        
        // Format amount with currency symbol
        const formattedAmount = `$${parseFloat(order.total_amount).toFixed(2)}`;
        
        // Format date
        const dateObj = new Date(order.created_at);
        const formattedDate = dateObj.toISOString().split('T')[0]; // YYYY-MM-DD
        
        // Calculate total items
        const itemCount = orderItemsData ? orderItemsData.length : 0;
        
        
        return {
          id: order.id,
          customer: customerName,
          amount: formattedAmount,
          status: order.status.charAt(0).toUpperCase() + order.status.slice(1), // Capitalize status
          date: formattedDate,
          items: itemCount,
          location: location || 'Unknown',
          paymentStatus: order.payment_status,
          paymentMethod: order.payment_method,
          shippingAddress: order.shipping_address,
          shippingFee: order.shipping_fee,
          notes: order.notes,
          orderItems: orderItemsData || [],
        };
      }));
      
      set({ orders: processedOrders, isLoading: false });
    } catch (error) {
      console.error("Error fetching orders:", error);
      set({ 
        error: `Failed to fetch orders: ${error.message}`, 
        isLoading: false,
        orders: [] // No mock data fallback
      });
    }
  },

  // Get order by ID from Supabase with independent queries
  getOrderById: async (id) => {
    // First check if we already have the order in state
    let order = get().orders.find(order => order.id === id);
    
    if (order) return order;
    
    // If not found in state, fetch from Supabase with independent queries
    try {
      // Step 1: Query order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .single();
        
      if (orderError) throw orderError;
      
      if (!orderData) return null;
      
      // Step 2: Query user profile
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('first_name, last_name, phone')
        .eq('user_id', orderData.user_id)
        .single();
        
      if (profileError) {
        console.error("Error fetching profile for order:", id, profileError);
      }
      
      // Step 2b: Query user address
      const { data: addressData, error: addressError } = await supabase
        .from('user_address')
        .select('address, city, region')
        .eq('user_id', orderData.user_id)
        .single();
        
      if (addressError) {
        console.error("Error fetching address for order:", id, addressError);
      }
      
      // Step 3: Query order items
      const { data: orderItemsData, error: itemsError } = await supabase
        .from('order_items')
        .select('id, product_id, quantity, price, total')
        .eq('order_id', id);
        
      if (itemsError) {
        console.error("Error fetching order items for order:", id, itemsError);
      }
      
      // Step 4: Query product details for each order item
      const orderItemsWithProducts = await Promise.all((orderItemsData || []).map(async (item) => {
        const { data: productData, error: productError } = await supabase
          .from('products')
          .select('name, image_url')
          .eq('id', item.product_id)
          .single();
          
        if (productError) {
          console.error("Error fetching product for order item:", item.id, productError);
        }
        
        return {
          ...item,
          product: productData || null
        };
      }));
      
      // Format customer name
      const firstName = profileData?.first_name || 'Unknown';
      const lastName = profileData?.last_name || 'User';
      const customerName = `${firstName} ${lastName}`;
      
      // Format location
      const city = addressData?.city || '';
      const region = addressData?.region || '';
      const location = [city, region].filter(Boolean).join(', ');
      
      const formattedOrder = {
        id: orderData.id,
        customer: customerName,
        customerPhone: profileData?.phone,
        amount: `$${parseFloat(orderData.total_amount).toFixed(2)}`,
        status: orderData.status.charAt(0).toUpperCase() + orderData.status.slice(1),
        date: new Date(orderData.created_at).toISOString().split('T')[0],
        items: orderItemsWithProducts.length,
        itemDetails: orderItemsWithProducts,
        location: location,
        paymentStatus: orderData.payment_status,
        paymentMethod: orderData.payment_method,
        shippingAddress: orderData.shipping_address,
        shippingFee: orderData.shipping_fee,
        notes: orderData.notes,
      };
      
      return formattedOrder;
    } catch (error) {
      console.error("Error fetching specific order:", error);
      return null; // No mock data fallback
    }
  },

  // Add new order
  addOrder: (newOrder) => {
    set(state => ({ orders: [...state.orders, newOrder] }));
    // Note: This just updates the local state
    // The actual Supabase insertion is handled by saveOrderToSupabase function
  },

  // Update order status in Supabase
  updateOrderStatus: async (id, newStatus) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus.toLowerCase() })
        .eq('id', id);
        
      if (error) throw error;
      
      // Update local state
      set(state => ({
        orders: state.orders.map(order =>
          order.id === id ? { ...order, status: newStatus } : order
        )
      }));
      
      return true;
    } catch (error) {
      console.error("Error updating order status:", error);
      return false;
    }
  },

  // Update payment status in Supabase
  updatePaymentStatus: async (id, newPaymentStatus) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ payment_status: newPaymentStatus })
        .eq('id', id);
        
      if (error) throw error;
      
      // Update local state
      set(state => ({
        orders: state.orders.map(order =>
          order.id === id ? { ...order, paymentStatus: newPaymentStatus } : order
        )
      }));
      
      return true;
    } catch (error) {
      console.error("Error updating payment status:", error);
      return false;
    }
  },

  // Delete order from Supabase
  deleteOrder: async (id) => {
    try {
      // First delete related order items (assuming there's a foreign key constraint)
      const { error: itemsError } = await supabase
        .from('order_items')
        .delete()
        .eq('order_id', id);
        
      if (itemsError) throw itemsError;
      
      // Then delete the order itself
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      // Update local state
      set(state => ({
        orders: state.orders.filter(order => order.id !== id)
      }));
      
      return true;
    } catch (error) {
      console.error("Error deleting order:", error);
      return false;
    }
  }
}));

export default useOrderStore;