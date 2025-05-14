import { supabase } from "@/lib/supabaseClient";
import { create } from "zustand";

const useTopSellingStore = create((set, get) => ({
  topSellingProducts: [],
  loading: true,
  error: null,

  fetchTopSellingProducts: async () => {
    set({ loading: true, error: null });
    try {
      // Step 1: Aggregate order_items to find most sold products
      const { data: orderItemsData, error: orderItemsError } = await supabase
        .from('order_items')
        .select('product_id, quantity');

      if (orderItemsError) throw orderItemsError;

      // Create a map to accumulate total quantity sold for each product
      const productSalesMap = {};
      
      // Sum up quantities for each product
      orderItemsData.forEach(item => {
        const productId = item.product_id;
        const quantity = item.quantity || 0;
        
        if (productId in productSalesMap) {
          productSalesMap[productId] += quantity;
        } else {
          productSalesMap[productId] = quantity;
        }
      });

      // Convert to array and sort by quantity (descending)
      const sortedProducts = Object.entries(productSalesMap)
        .map(([productId, totalSold]) => ({ 
          productId, 
          totalSold 
        }))
        .sort((a, b) => b.totalSold - a.totalSold)
        .slice(0, 10); // Get top 10 most sold products

      if (sortedProducts.length === 0) {
        set({ topSellingProducts: [], loading: false });
        return;
      }

      // Step 2: Fetch product details for the top selling products
      const productIds = sortedProducts.map(item => item.productId);
      
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .in('id', productIds);

      if (productsError) throw productsError;

      // Merge product data with sales data and format
      const formattedProducts = productsData.map(product => {
        // Find the sales count for this product
        const salesInfo = sortedProducts.find(item => item.productId === product.id);
        const salesCount = salesInfo ? salesInfo.totalSold : 0;

        // Extract numeric values from price strings
        const originalPrice = parseFloat(product.price.replace('$', ''));
        const salePrice = parseFloat(product.promotionPrice ? product.promotionPrice.replace('$', '') : product.price.replace('$', ''));

        return {
          id: product.id,
          name: product.name,
          image: product.imageUrl || product.image,
          originalPrice: originalPrice,
          sellingPrice: salePrice,
          price: salePrice,
          discount: product.savingsPercentage || Math.round(((originalPrice - salePrice) / originalPrice) * 100),
          stock: product.stock,
          category: product.category,
          salesCount: salesCount
        };
      });

      // Sort again to ensure they're in order of most to least sold
      formattedProducts.sort((a, b) => b.salesCount - a.salesCount);

      set({ topSellingProducts: formattedProducts, loading: false });
      console.log("Top selling products:", formattedProducts);
    } catch (error) {
      console.error("Error fetching top selling products:", error);
      set({ error: "Failed to fetch top selling products", loading: false });
    }
  },

  getTopSellingProductById: (id) => {
    const products = get().topSellingProducts;
    return products.find((product) => product.id === id) || null;
  }
}));

export default useTopSellingStore;