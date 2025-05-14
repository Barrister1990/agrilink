import { create } from "zustand";
import { supabase } from "../lib/supabaseClient"; // Adjust this import path to match your project structure

const useWholePriceStore = create((set) => ({
  wholePriceProducts: [],
  loading: true,
  error: null,
  
  fetchWholePriceProducts: async () => {
    set({ loading: true, error: null });
    try {
      // Fetch products with 'WholePrice' promotion from Supabase
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('promotion', 'Wholesale');
        
      if (error) throw error;
      
      // Format the data to match the expected structure
      const formattedWholePriceProducts = data.map(product => {
        // Extract numeric values from price strings
        const originalPrice = parseFloat(product.price.replace('$', ''));
        const salePrice = parseFloat(product.promotionPrice.replace('$', ''));
        
        return {
          id: product.id,
          name: product.name,
          image: product.imageUrl || product.image,
          originalPrice: originalPrice,
          salePrice: salePrice,
          price: salePrice, // Use salePrice for the price field
          stock: product.stock,
          category: product.category
        };
      });
      
      set({ wholePriceProducts: formattedWholePriceProducts, loading: false });
    } catch (error) {
      console.error("Error fetching WholePrice products:", error);
      set({ error: "Failed to fetch WholePrice products", loading: false });
    }
  },
}));

export default useWholePriceStore;