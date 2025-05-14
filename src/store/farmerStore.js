import { supabase } from "@/lib/supabaseClient";
import { create } from 'zustand';

const useFarmerStore = create((set, get) => ({
  farmers: [],
  isLoading: false,
  error: null,
  
  // Fetch all farmers
  fetchFarmers: async () => {
    set({ isLoading: true, error: null });
    try {
      // Fetch farmer profiles with their application status
      const { data: farmerProfiles, error: profilesError } = await supabase
        .from('farmer_profiles')
        .select(`
          id,
          user_id,
          farm_name,
          first_name,
          last_name,
          email,
          phone,
          farm_location,
          main_products,
          application_status,
          rejection_reason,
          created_at,
          updated_at,
          profile_image_url
        `)
        .order('created_at', { ascending: false });
      
      if (profilesError) throw profilesError;
      
      // Format the data to match our application needs
      const formattedFarmers = farmerProfiles.map(profile => {
        // Generate a display ID
        const displayId = `FA-${profile.id.toString().padStart(4, '0')}`;
        
        // Format date
        const date = new Date(profile.created_at).toISOString().split('T')[0];
        
        // Format products array to string
        const products = Array.isArray(profile.main_products) 
          ? profile.main_products.join(', ') 
          : '';
        
        // Format the farmer's full name
        const farmerName = `${profile.first_name} ${profile.last_name}`;
        
        return {
          id: displayId,
          originalId: profile.id,
          userId: profile.user_id,
          farmer: farmerName,
          farmName: profile.farm_name,
          date: date,
          status: profile.application_status.charAt(0).toUpperCase() + profile.application_status.slice(1), // Capitalize status
          email: profile.email,
          phone: profile.phone,
          location: profile.farm_location,
          products: products,
          profileImage: profile.profile_image_url,
          rejection_reason: profile.rejection_reason || '',
          updated_at: profile.updated_at
        };
      });
      
      set({ farmers: formattedFarmers, isLoading: false });
    } catch (error) {
      console.error("Error fetching farmers:", error);
      set({ error: "Failed to fetch farmers", isLoading: false });
    }
  },
  
  // Get a single farmer by ID (display ID)
  getFarmerById: (id) => {
    return get().farmers.find(farmer => farmer.id === id);
  },
  
  // Get complete farmer details by ID
  getFarmerDetailsById: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      // Fetch farmer profile
      const { data: profile, error: profileError } = await supabase
        .from('farmer_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (profileError) throw profileError;
      
      // Fetch farm address
      const { data: address, error: addressError } = await supabase
        .from('user_addresses')
        .select('*')
        .eq('user_id', userId)
        .eq('address_type', 'farm')
        .single();
      
      if (addressError && addressError.code !== 'PGRST116') {
        throw addressError;
      }
      
      // Fetch business details
      const { data: business, error: businessError } = await supabase
        .from('farmer_business_details')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (businessError && businessError.code !== 'PGRST116') {
        throw businessError;
      }
      
      // Fetch payment details
      const { data: payment, error: paymentError } = await supabase
        .from('farmer_payment_details')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (paymentError && paymentError.code !== 'PGRST116') {
        throw paymentError;
      }
      
      // Compile all details into one object
      const farmerDetails = {
        // Personal Details
        farm_name: profile.farm_name || "",
        farm_type: profile.farm_type || "",
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        
        // Farm Details
        farm_size: profile.farm_size || 0,
        farm_size_unit: profile.farm_size_unit || "acres",
        farm_location: profile.farm_location || "",
        farm_address: address?.address_line1 || "",
        farm_city: address?.city || "",
        farm_state: address?.state || "",
        farm_postal_code: address?.postal_code || "",
        farm_country: address?.country || "Ghana",
        years_farming: profile.years_farming || 0,
        
        // Production Details
        main_products: profile.main_products || [],
        growing_methods: profile.growing_methods || [],
        organic_certified: profile.organic_certified || false,
        certifications: profile.certifications || [],
        
        // Business Details
        business_entity: profile.business_entity || "",
        tax_id: business?.tax_id || "",
        business_license: business?.business_license || "",
        insurance_policy: business?.insurance_policy || "",
        
        // Bank Details (masked for security)
        bank_name: payment?.bank_name || "",
        account_holder: payment?.account_holder || "",
        account_number_last4: payment?.account_number_last4 || "",
        routing_number_last4: payment?.routing_number_last4 || "",
        
        // Additional Info
        bio: profile.bio || "",
        profile_image_url: profile.profile_image_url || null,
        farm_image_urls: profile.farm_image_urls || [],
        website: profile.website || "",
        social_media: profile.social_media || {
          facebook: "",
          instagram: "",
          twitter: ""
        },
        
        // Application status
        application_status: profile.application_status || "pending",
        rejection_reason: profile.rejection_reason || "",
        created_at: profile.created_at,
        updated_at: profile.updated_at
      };
      
      return farmerDetails;
    } catch (error) {
      console.error("Error fetching farmer details:", error);
      set({ error: "Failed to fetch farmer details", isLoading: false });
      return null;
    } finally {
      set({ isLoading: false });
    }
  },
  
  // Update farmer application status
  updateFarmerStatus: async (originalId, newStatus, rejectionReason = '') => {
    set({ isLoading: true, error: null });
    try {
      const updateData = {
        application_status: newStatus.toLowerCase(),
        updated_at: new Date()
      };
      
      if (newStatus.toLowerCase() === 'rejected' && rejectionReason) {
        updateData.rejection_reason = rejectionReason;
      } else if (newStatus.toLowerCase() !== 'rejected') {
        updateData.rejection_reason = null;
      }
      
      const { error } = await supabase
        .from('farmer_profiles')
        .update(updateData)
        .eq('id', originalId);
      
      if (error) throw error;
      
      // Update the store's state
      set(state => ({
        farmers: state.farmers.map(farmer => 
          farmer.originalId === originalId
            ? {
                ...farmer,
                status: newStatus,
                rejection_reason: newStatus.toLowerCase() === 'rejected' ? rejectionReason : '',
                updated_at: new Date().toISOString()
              }
            : farmer
        )
      }));
      
      return true;
    } catch (error) {
      console.error("Error updating farmer status:", error);
      set({ error: "Failed to update farmer status", isLoading: false });
      return false;
    } finally {
      set({ isLoading: false });
    }
  },
  
  // Delete farmer
  deleteFarmer: async (originalId, userId) => {
    set({ isLoading: true, error: null });
    try {
      // Delete related records first to maintain referential integrity
      // Delete farmer payment details
      await supabase
        .from('farmer_payment_details')
        .delete()
        .eq('user_id', userId);
      
      // Delete farmer business details
      await supabase
        .from('farmer_business_details')
        .delete()
        .eq('user_id', userId);
      
      // Delete farmer addresses
      await supabase
        .from('user_addresses')
        .delete()
        .eq('user_id', userId)
        .eq('address_type', 'farm');
      
      // Finally delete the farmer profile
      const { error } = await supabase
        .from('farmer_profiles')
        .delete()
        .eq('id', originalId);
      
      if (error) throw error;
      
      // Update the store's state
      set(state => ({
        farmers: state.farmers.filter(farmer => farmer.originalId !== originalId)
      }));
      
      return true;
    } catch (error) {
      console.error("Error deleting farmer:", error);
      set({ error: "Failed to delete farmer", isLoading: false });
      return false;
    } finally {
      set({ isLoading: false });
    }
  }
}));

export default useFarmerStore;