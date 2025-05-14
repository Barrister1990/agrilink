import { supabase } from "@/lib/supabaseClient";
import { create } from "zustand";

const useSponsoredStore = create((set) => ({
  sponsoredProducts: [],
  loading: true,
  error: null,

  fetchSponsoredProducts: async () => {
    set({ loading: true, error: null });
    try {
      // Fetch products with 'Sponsored' promotion from Supabase
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('promotion', 'Sponsored');

      if (error) throw error;

      // Format the data to match the expected structure
      const formattedSponsoredProducts = data.map(product => {
        // Extract numeric values from price strings
        const originalPrice = parseFloat(product.price.replace('$', ''));
        const sponsoredPrice = parseFloat(product.promotionPrice.replace('$', ''));
        
        return {
          id: product.id,
          name: product.name,
          image: product.imageUrl || product.image,
          originalPrice: originalPrice,
          sponsoredPrice: sponsoredPrice,
          price: sponsoredPrice, // Use sponsoredPrice for the price field
          discount: product.savingsPercentage || Math.round(((originalPrice - sponsoredPrice) / originalPrice) * 100),
          stock: product.stock,
          category: product.category
        };
      });

      set({ sponsoredProducts: formattedSponsoredProducts, loading: false });
    } catch (error) {
      console.error("Error fetching sponsored products:", error);
      set({ error: "Failed to fetch sponsored products", loading: false });
    }
  },
}));

export default useSponsoredStore;