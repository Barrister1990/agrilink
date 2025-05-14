import { create } from "zustand";
import { supabase } from "../lib/supabaseClient"; // Adjust this import path to match your project structure

const useSupermarketStore = create((set) => ({
  supermarketProducts: [],
  loading: true,
  error: null,
  
  fetchSupermarketProducts: async () => {
    set({ loading: true, error: null });
    try {
      // Fetch products with 'Supermarket' promotion from Supabase
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('promotion', 'Supermarket');
        
      if (error) throw error;
      
      // Format the data to match the expected structure
      const formattedSupermarketProducts = data.map(product => {
        // Extract numeric values from price strings
        const originalPrice = parseFloat(product.price.replace('$', ''));
        const supermarketPrice = parseFloat(product.promotionPrice.replace('$', ''));
        
        return {
          id: product.id,
          name: product.name,
          image: product.imageUrl || product.image,
          originalPrice: originalPrice,
          supermarketPrice: supermarketPrice,
          price: supermarketPrice, // Use supermarketPrice for the price field
          discount: product.savingsPercentage || Math.round(((originalPrice - supermarketPrice) / originalPrice) * 100),
          stock: product.stock,
          category: product.category
        };
      });
      
      set({ supermarketProducts: formattedSupermarketProducts, loading: false });
    } catch (error) {
      console.error("Error fetching supermarket products:", error);
      set({ error: "Failed to fetch supermarket products", loading: false });
    }
  },
}));

export default useSupermarketStore;