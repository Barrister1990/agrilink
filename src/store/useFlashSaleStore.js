import { supabase } from "@/lib/supabaseClient";
import { create } from "zustand";

const useFlashSaleStore = create((set) => ({
  flashProducts: [],
  loading: false,
  error: null,

  fetchFlashProducts: async () => {
    set({ loading: true, error: null });
    try {
      // Fetch products with 'Flashsale' promotion from Supabase
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('promotion', 'Flashsale');

      if (error) throw error;

      // Format the data to match the expected structure
      const formattedFlashProducts = data.map(product => {
        // Extract numeric values from price strings
        const originalPrice = parseFloat(product.price.replace('$', ''));
        const salePrice = parseFloat(product.promotionPrice.replace('$', ''));
        
        return {
          id: product.id,
          name: product.name,
          image:product.image,
          originalPrice: originalPrice,
          salePrice: salePrice,
          price: salePrice, // Use salePrice for the price field
          discount: product.savingsPercentage || Math.round(((originalPrice - salePrice) / originalPrice) * 100),
          stock: product.stock,
          category: product.category
        };
      });

      set({ flashProducts: formattedFlashProducts, loading: false });
    } catch (error) {
      console.error("Error fetching flash sale products:", error);
      set({ error: "Failed to fetch products", loading: false });
    }
  },
}));

export default useFlashSaleStore;