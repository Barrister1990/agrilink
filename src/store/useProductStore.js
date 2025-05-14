import { supabase } from "@/lib/supabaseClient";
import { create } from "zustand";

const useProductStore = create((set, get) => ({
  products: [],
  loading: true,
  error: null,

  fetchAllProducts: async () => {
    set({ loading: true, error: null });
    try {
      // Fetch all products from Supabase
      const { data, error } = await supabase
        .from('products')
        .select('*');
        
      if (error) throw error;
      
      // Format the data to match the expected structure
      const formattedProducts = data.map(product => {
        // Extract numeric values from price strings
        const originalPrice = parseFloat(product.price.replace('$', ''));
        const salePrice = parseFloat(product.promotionPrice ? product.promotionPrice.replace('$', '') : product.price.replace('$', ''));
        
        return {
          id: product.id,
          name: product.name,
          image: product.imageUrl || product.image,
          originalPrice: originalPrice,
          salePrice: salePrice,
          price: salePrice, // Use salePrice for the price field
          discount: product.savingsPercentage || Math.round(((originalPrice - salePrice) / originalPrice) * 100),
          stock: product.stock,
          category: product.category,
          description: product.description || '',
          totalUsers: product.totalUsers || 0,
          sold: product.sold || 0,
          brand: product.brand || 'FreshMarket',
          origin: product.origin || 'Ghana',
          weight: product.weight || '1kg',
          shelfLife: product.shelfLife || '7 days',
          storage: product.storage || 'Cool, dry place',
          organic: product.organic !== undefined ? product.organic : true,
          packaging: product.packaging || 'Eco-friendly'
        };
      });
      
      set({ products: formattedProducts, loading: false });
      console.log(formattedProducts)
    } catch (error) {
      console.error("Error fetching all products:", error);
      set({ error: "Failed to fetch products", loading: false });
    }
  },
  
  getProductById: (id) => {
    const products = get().products;
    return products.find((product) => product.id === id) || null;
  },

  searchProducts: (query) => {
    if (!query) return [];
    return get().products.filter((product) =>
      product.name.toLowerCase().includes(query.toLowerCase())
    );
  }
}));

export default useProductStore;