// store/useFarmerAdminProductStore.js
import { supabase } from '@/lib/supabaseClient';
import { create } from 'zustand';

const defaultCategories = [
  'Vegetables', 
  'Fruits', 
  'Meat & Poultry', 
  'Dairy & Eggs', 
  'Seafood',
  'Grains',
  'Other'
];

const promotionTypes = ['None', 'Sponsored', 'Wholesale', 'Flashsale', 'Supermarket'];

const useFarmerAdminProductStore = create((set, get) => ({
  // Products data
  products: [],
  isLoading: true,
  availableImages: [],
  filteredImages: [],
  categories: ['all', ...defaultCategories],
  
  // Pagination
  currentPage: 1,
  productsPerPage: 8,
  
  // Filters
  searchQuery: '',
  categoryFilter: 'all',
  imageSearchQuery: '',
  
  // Form data
  currentProduct: null,
  formData: {
    name: '',
    category: 'Vegetables',
    price: '',
    stock: '',
    image: '/api/placeholder/160/160',
    imageUrl: '',
    imagePath: '',
    promotion: 'None',
    promotionPrice: '',
    // New fields based on ProductDetails
    description: '',
    originalPrice: '',
    discount: 0,
    totalUsers: 0,
    sold: 0,
    brand: 'FreshMarket',
    origin: 'Ghana',
    weight: '1kg',
    shelfLife: '7 days',
    storage: 'Cool, dry place',
    organic: true,
    packaging: 'Eco-friendly'
  },
  isSubmitting: false,
  
  // Constants
  getDefaultCategories: () => defaultCategories,
  getPromotionTypes: () => promotionTypes,
  
  // Actions - Products
  fetchProducts: async () => {
    set({ isLoading: true });
    try {
      // First get the current user's ID
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) throw sessionError;
      
      if (!session?.user?.id) {
        console.error('No authenticated user found');
        set({ products: [], isLoading: false });
        return;
      }
      
      // Then fetch only products belonging to the current user
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('farmer_id', session.user.id)
        .order('id', { ascending: true });
      
      if (error) throw error;
      
      if (data) {
        set({ products: data });
        
        // Extract unique categories
        const categoriesFromData = data.map(p => p.category);
        const uniqueCategories = ['all', ...new Set([...defaultCategories, ...categoriesFromData])];
        set({ categories: uniqueCategories });
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      set({ isLoading: false });
    }
  },
  
  deleteProduct: async (productId) => {
    try {
      const { products } = get();
      // Get the product to potentially delete its image too
      const productToDelete = products.find(p => p.id === productId);
      
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);
      
      if (error) throw error;
      
      // If product has a storage path, try to delete the image too
      // Only if no other products are using it
      if (productToDelete && productToDelete.imagePath) {
        const otherProductsWithSameImage = products.filter(
          p => p.id !== productId && p.imagePath === productToDelete.imagePath
        );
        
        if (otherProductsWithSameImage.length === 0) {
          const { error: storageError } = await supabase
            .storage
            .from('product-images')
            .remove([productToDelete.imagePath]);
          
          if (storageError) console.error('Failed to delete image:', storageError);
        }
      }
      
      // Update local state
      set({ products: get().products.filter(p => p.id !== productId) });
      return { success: true };
    } catch (error) {
      console.error('Error deleting product:', error);
      return { success: false, error };
    }
  },
  
  // Actions - Filters
  setSearchQuery: (query) => set({ searchQuery: query, currentPage: 1 }),
  setCategoryFilter: (category) => set({ categoryFilter: category, currentPage: 1 }),
  
  // Actions - Pagination
  setCurrentPage: (page) => set({ currentPage: page }),
  
  // Actions - Form data
  resetFormData: () => set({
    currentProduct: null,
    formData: {
      name: '',
      category: 'Vegetables',
      price: '',
      stock: '',
      image: '/api/placeholder/160/160',
      imageUrl: '',
      imagePath: '',
      promotion: 'None',
      promotionPrice: '',
      // Reset new fields
      description: '',
      originalPrice: '',
      discount: 0,
      totalUsers: 0,
      sold: 0,
      brand: 'FreshMarket',
      origin: 'Ghana',
      weight: '1kg',
      shelfLife: '7 days',
      storage: 'Cool, dry place',
      organic: true,
      packaging: 'Eco-friendly'
    }
  }),
  
  setCurrentProduct: (product) => {
    if (product) {
      // Strip currency symbols when setting form data
      const stripCurrency = (value) => {
        if (!value) return '';
        return value.toString().replace(/[^\d.]/g, '');
      };
      
      set({
        currentProduct: product,
        formData: {
          name: product.name,
          category: product.category,
          price: stripCurrency(product.price),
          stock: product.stock,
          image: product.image,
          imageUrl: product.imageUrl || product.image,
          imagePath: product.imagePath || '',
          promotion: product.promotion,
          promotionPrice: stripCurrency(product.promotionPrice),
          // New fields
          description: product.description || '',
          originalPrice: stripCurrency(product.originalPrice),
          discount: product.discount || 0,
          totalUsers: product.totalUsers || 0,
          sold: product.sold || 0,
          brand: product.brand || 'FreshMarket',
          origin: product.origin || 'Ghana',
          weight: product.weight || '1kg',
          shelfLife: product.shelfLife || '7 days',
          storage: product.storage || 'Cool, dry place',
          organic: product.organic !== undefined ? product.organic : true,
          packaging: product.packaging || 'Eco-friendly'
        }
      });
    } else {
      set({
        currentProduct: null,
        formData: {
          name: '',
          category: 'Vegetables',
          price: '',
          stock: '',
          image: '/api/placeholder/160/160',
          imageUrl: '',
          imagePath: '',
          promotion: 'None',
          promotionPrice: '',
          // Reset new fields
          description: '',
          originalPrice: '',
          discount: 0,
          totalUsers: 0,
          sold: 0,
          brand: 'FreshMarket',
          origin: 'Ghana',
          weight: '1kg',
          shelfLife: '7 days',
          storage: 'Cool, dry place',
          organic: true,
          packaging: 'Eco-friendly'
        }
      });
    }
  },
  
  updateFormField: (name, value) => {
    set(state => ({
      formData: {
        ...state.formData,
        [name]: value
      }
    }));
  },
  
  // Actions - Images
  fetchStoredImages: async () => {
    try {
      const { data, error } = await supabase
        .storage
        .from('product-images')
        .list();
      
      if (error) throw error;
      
      if (data) {
        const images = data.map(file => {
          const { publicURL } = supabase
            .storage
            .from('product-images')
            .getPublicUrl(file.name);
          
          return {
            name: file.name,
            path: publicURL,
            storagePath: file.name
          };
        });
        
        set({ availableImages: images });
        
        // Update filtered images based on current search query or product name
        const state = get();
        const query = state.imageSearchQuery.toLowerCase();
        
        if (query) {
          set({
            filteredImages: images.filter(img => 
              img.name.toLowerCase().includes(query)
            )
          });
        } else if (state.formData.name) {
          // Try to match based on product name
          const productNameQuery = state.formData.name.toLowerCase();
          const words = productNameQuery.split(' ');
          
          set({
            filteredImages: images.filter(img => {
              const imgName = img.name.toLowerCase();
              return words.some(word => word.length > 2 && imgName.includes(word));
            })
          });
        } else {
          set({ filteredImages: images });
        }
      }
    } catch (error) {
      console.error('Error fetching stored images:', error);
    }
  },
  
  setImageSearchQuery: (query) => {
    set({ imageSearchQuery: query });
    
    // Update filtered images based on new search query
    const state = get();
    const searchQuery = query.toLowerCase();
    
    if (searchQuery) {
      set({
        filteredImages: state.availableImages.filter(img => 
          img.name.toLowerCase().includes(searchQuery)
        )
      });
    } else if (state.formData.name) {
      // Try to match based on product name
      const productNameQuery = state.formData.name.toLowerCase();
      const words = productNameQuery.split(' ');
      
      set({
        filteredImages: state.availableImages.filter(img => {
          const imgName = img.name.toLowerCase();
          return words.some(word => word.length > 2 && imgName.includes(word));
        })
      });
    } else {
      set({ filteredImages: state.availableImages });
    }
  },
  
  updateProductImage: (image) => {
    set(state => ({
      formData: {
        ...state.formData,
        image: image.path,
        imageUrl: image.path,
        imagePath: image.storagePath || ''
      }
    }));
  },
  
  uploadImage: async (file) => {
    try {
      // Create a unique file name to prevent collisions
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      
      // Upload file to Supabase storage
      const { error: uploadError } = await supabase
        .storage
        .from('product-images')
        .upload(fileName, file);
      
      if (uploadError) throw uploadError;
      
      // Get the public URL for the uploaded file
      const { data } = supabase
        .storage
        .from('product-images')
        .getPublicUrl(fileName);
      
      const publicUrl = data.publicUrl;
      
      // Update form with the new image URL and path
      set(state => ({
        formData: {
          ...state.formData,
          image: publicUrl,
          imageUrl: publicUrl,
          imagePath: fileName
        },
        availableImages: [
          ...state.availableImages, 
          { path: publicUrl, name: fileName, storagePath: fileName }
        ],
        filteredImages: [
          ...state.filteredImages,
          { path: publicUrl, name: fileName, storagePath: fileName }
        ]
      }));
      
      return { success: true, url: publicUrl };
    } catch (error) {
      console.error('Error uploading image:', error);
      return { success: false, error };
    }
  },
  
  // Helpers
  calculateSavings: (originalPrice, promoPrice) => {
    if (!promoPrice) return null;
    
    // Parse numeric values
    const original = parseFloat(originalPrice);
    const promo = parseFloat(promoPrice);
    
    if (isNaN(original) || isNaN(promo) || original <= 0) return null;
    
    const savingsPercent = ((original - promo) / original) * 100;
    return Math.round(savingsPercent);
  },
  
  getPromotionBadgeColor: (promotion) => {
    switch(promotion) {
      case 'Sponsored':
        return 'bg-purple-100 text-purple-800';
      case 'Wholesale':
        return 'bg-blue-100 text-blue-800';
      case 'Flashsale':
        return 'bg-red-100 text-red-800';
      case 'Supermarket':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'hidden';
    }
  },
  
  // Save/submit form
  saveProduct: async () => {
    set({ isSubmitting: true });
    
    try {
      const { formData, currentProduct, calculateSavings } = get();
      
      // Parse price inputs as numbers
      const parsePrice = (value) => {
        // Remove any non-numeric characters except decimal point
        const cleanValue = value.toString().replace(/[^\d.]/g, '');
        const numValue = parseFloat(cleanValue);
        return isNaN(numValue) ? 0 : numValue;
      };
      
      const price = parsePrice(formData.price);
      const promotionPrice = formData.promotion !== 'None' ? parsePrice(formData.promotionPrice) : null;
      
      // Validation for promotion price
      if (promotionPrice !== null && promotionPrice >= price) {
        set({ isSubmitting: false });
        return { 
          success: false, 
          error: 'Promotion price must be lower than the regular price.' 
        };
      }
      
      // Calculate discount
      let discount = formData.discount;
      const originalPrice = parsePrice(formData.originalPrice);
      
      if (originalPrice > 0 && price > 0 && originalPrice > price) {
        discount = Math.round(((originalPrice - price) / originalPrice) * 100);
      }
      
      // Get current user session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      
      // Prepare product data with all fields
      const productData = {
        name: formData.name,
        category: formData.category,
        price: price,
        stock: parseInt(formData.stock),
        image: formData.image,
        imageUrl: formData.imageUrl || formData.image,
        imagePath: formData.imagePath || '',
        promotion: formData.promotion,
        promotionPrice: formData.promotion !== 'None' ? promotionPrice : null,
        savingsPercentage: calculateSavings(price, promotionPrice),
        farmer_id: session.user.id,
        // New fields
        description: formData.description,
        originalPrice: originalPrice > 0 ? originalPrice : null,
        discount: discount,
        totalUsers: parseInt(formData.totalUsers) || 0,
        sold: parseInt(formData.sold) || 0,
        brand: formData.brand || 'FreshMarket',
        origin: formData.origin || 'Ghana',
        weight: formData.weight || '1kg',
        shelfLife: formData.shelfLife || '7 days',
        storage: formData.storage || 'Cool, dry place',
        organic: formData.organic !== undefined ? formData.organic : true,
        packaging: formData.packaging || 'Eco-friendly'
      };
      
      if (currentProduct) {
        // Update existing product in Supabase
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', currentProduct.id);
        
        if (error) throw error;
        
        // Update local state
        set(state => ({
          products: state.products.map(p => 
            p.id === currentProduct.id 
              ? { ...productData, id: currentProduct.id } 
              : p
          )
        }));
        
        return { success: true, mode: 'update', product: { ...productData, id: currentProduct.id } };
      } else {
        // Add new product to Supabase
        const { data, error } = await supabase
          .from('products')
          .insert([productData])
          .select();
        
        if (error) throw error;
        
        // Update local state with the new product including its server-generated ID
        if (data && data.length > 0) {
          set(state => ({
            products: [...state.products, data[0]]
          }));
          
          return { success: true, mode: 'create', product: data[0] };
        }
      }
    } catch (error) {
      console.error('Error saving product:', error);
      return { success: false, error: error.message };
    } finally {
      set({ isSubmitting: false });
    }
  }
}));

export default useFarmerAdminProductStore;