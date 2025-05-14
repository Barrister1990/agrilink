import { supabase } from "@/lib/supabaseClient";
import {
  ArrowUpTrayIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  PencilIcon,
  ShieldCheckIcon,
  UserCircleIcon, XMarkIcon
} from "@heroicons/react/24/outline";
import { Briefcase, CreditCard, Home, User } from 'lucide-react';
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import AdminLayout from "./layout";


const FarmerSettings = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTab, setSelectedTab] = useState('account');
  const tabs = [
    { name: 'Account', value: 'account', icon: User },
    { name: 'Farm Details', value: 'farm_details', icon: Home },
    { name: 'Business Info', value: 'business', icon: Briefcase },
    { name: 'Payment', value: 'payment', icon: CreditCard }
  ];
  
  
  const [formData, setFormData] = useState({
    // Personal Details
    farm_name: "",
    farm_type: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    
    // Farm Details
    farm_size: "",
    farm_size_unit: "acres",
    farm_location: "",
    farm_address: "",
    farm_city: "",
    farm_state: "",
    farm_postal_code: "",
    farm_country: "United States",
    years_farming: "",
    
    // Production Details
    main_products: [],
    growing_methods: [],
    organic_certified: false,
    certifications: [],
    
    // Business Details
    business_entity: "",
    tax_id: "",
    business_license: "",
    insurance_policy: "",
    
    // Bank Details
    bank_name: "",
    account_holder: "",
    account_number: "",
    routing_number: "",
    
    // Additional Info
    bio: "",
    profile_image: null,
    farm_images: [],
    website: "",
    social_media: {
      facebook: "",
      instagram: "",
      twitter: ""
    }
  });
  
  const [imagePreview, setImagePreview] = useState(null);
  const [farmImagePreviews, setFarmImagePreviews] = useState([]);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: ""
  });
  const [passwordError, setPasswordError] = useState("");

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Error fetching session:", error);
        router.push("/auth/signin");
        return;
      }
      
      if (!session) {
        router.push("/auth/signin");
        return;
      }
      
      setUserId(session.user.id);
      
      // Fetch farmer profile
      const { data: farmerProfile, error: profileError } = await supabase
        .from("farmer_profiles")
        .select("*")
        .eq("user_id", session.user.id)
        .single();
        
      if (profileError) {
        console.error("Error fetching farmer profile:", profileError);
        setError("Failed to load your profile data.");
        setIsLoading(false);
        return;
      }
      
      // Fetch farm address
      const { data: addressData, error: addressError } = await supabase
        .from("user_addresses")
        .select("*")
        .eq("user_id", session.user.id)
        .eq("address_type", "farm")
        .single();
      
      // Fetch business details
      const { data: businessData, error: businessError } = await supabase
        .from("farmer_business_details")
        .select("*")
        .eq("user_id", session.user.id)
        .single();
      
      // Fetch bank details
      const { data: bankData, error: bankError } = await supabase
        .from("farmer_payment_details")
        .select("*")
        .eq("user_id", session.user.id)
        .eq("is_default", true)
        .single();
      
      // Combine all data
      const combinedData = {
        ...formData,
        farm_name: farmerProfile?.farm_name || "",
        farm_type: farmerProfile?.farm_type || "",
        first_name: farmerProfile?.first_name || "",
        last_name: farmerProfile?.last_name || "",
        email: farmerProfile?.email || "",
        phone: farmerProfile?.phone || "",
        farm_size: farmerProfile?.farm_size?.toString() || "",
        farm_size_unit: farmerProfile?.farm_size_unit || "acres",
        farm_location: farmerProfile?.farm_location || "",
        years_farming: farmerProfile?.years_farming?.toString() || "",
        main_products: farmerProfile?.main_products || [],
        growing_methods: farmerProfile?.growing_methods || [],
        organic_certified: farmerProfile?.organic_certified || false,
        certifications: farmerProfile?.certifications || [],
        business_entity: farmerProfile?.business_entity || "",
        bio: farmerProfile?.bio || "",
        website: farmerProfile?.website || "",
        social_media: farmerProfile?.social_media || {
          facebook: "",
          instagram: "",
          twitter: ""
        },
        
        // Address data
        farm_address: addressData?.address_line1 || "",
        farm_city: addressData?.city || "",
        farm_state: addressData?.state || "",
        farm_postal_code: addressData?.postal_code || "",
        farm_country: addressData?.country || "United States",
        
        // Business data
        tax_id: businessData?.tax_id || "",
        business_license: businessData?.business_license || "",
        insurance_policy: businessData?.insurance_policy || "",
        
        // Bank data
        bank_name: bankData?.bank_name || "",
        account_holder: bankData?.account_holder || "",
        account_number: bankData?.account_number_last4 ? `****${bankData.account_number_last4}` : "",
        routing_number: bankData?.routing_number_last4 ? `****${bankData.routing_number_last4}` : ""
      };
      
      setFormData(combinedData);
      
      // Set profile image preview if exists
      if (farmerProfile?.profile_image_url) {
        setImagePreview(farmerProfile.profile_image_url);
      }
      
      // Set farm image previews if exist
      if (farmerProfile?.farm_image_urls && farmerProfile.farm_image_urls.length > 0) {
        setFarmImagePreviews(farmerProfile.farm_image_urls);
      }
      
      setIsLoading(false);
    };
    
    fetchUser();
  }, [router]);

  const farmTypes = [
    "Vegetable Farm",
    "Fruit Orchard",
    "Livestock Farm",
    "Dairy Farm",
    "Poultry Farm",
    "Mixed Farm",
    "Vineyard",
    "Greenhouse",
    "Aquaculture",
    "Other"
  ];
  
  const productOptions = [
    "Vegetables", "Fruits", "Herbs",
    "Dairy", "Eggs", "Meat",
    "Honey", "Grains", "Wine",
    "Flowers", "Nuts", "Seeds"
  ];
  
  const growingMethodOptions = [
    "Conventional", "Organic", "Hydroponic",
    "Aquaponic", "Biodynamic", "Permaculture",
    "No-Till", "Regenerative"
  ];
  
  const certificationOptions = [
    "USDA Organic", "Certified Naturally Grown",
    "Certified Humane", "Animal Welfare Approved",
    "Good Agricultural Practices (GAP)",
    "Non-GMO Project Verified",
    "Regenerative Organic Certified"
  ];
  
  const businessEntityOptions = [
    "Sole Proprietorship", "LLC", "Partnership",
    "Corporation", "S-Corporation", "Cooperative"
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes(".")) {
      // Handle nested objects like social_media.facebook
      const [parent, child] = name.split(".");
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else if (type === "checkbox") {
      if (name === "organic_certified") {
        setFormData(prev => ({
          ...prev,
          [name]: checked
        }));
      } else {
        // Handle arrays for checkboxes like certifications
        const arrayName = name.split("-")[0];
        const itemValue = name.split("-")[1];
        
        setFormData(prev => {
          const currentArray = [...prev[arrayName]];
          if (checked) {
            return {
              ...prev,
              [arrayName]: [...currentArray, itemValue]
            };
          } else {
            return {
              ...prev,
              [arrayName]: currentArray.filter(item => item !== itemValue)
            };
          }
        });
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      setFormData(prev => ({
        ...prev,
        profile_image: file
      }));
    }
  };
  
  const handleFarmImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      // Generate previews
      const newPreviews = [];
      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPreviews.push(reader.result);
          if (newPreviews.length === files.length) {
            setFarmImagePreviews(prev => [...prev, ...newPreviews]);
          }
        };
        reader.readAsDataURL(file);
      });
      
      // Update form data
      setFormData(prev => ({
        ...prev,
        farm_images: [...(prev.farm_images || []), ...files]
      }));
    }
  };
  
  const removeImage = (index) => {
    setFarmImagePreviews(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      farm_images: prev.farm_images.filter((_, i) => i !== index)
    }));
  };

  const uploadImage = async (file, path) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}_${Date.now()}.${fileExt}`;
    const filePath = `${path}/${fileName}`;
    
    const { error: uploadError } = await supabase.storage
      .from('farmer-images')
      .upload(filePath, file);
      
    if (uploadError) {
      throw uploadError;
    }
    
    // Get public URL
    const { data } = supabase.storage
      .from('farmer-images')
      .getPublicUrl(filePath);
      
    return data.publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");
    
    try {
      // Upload profile image if exists and is a File object (not a URL string)
      let profileImageUrl = null;
      if (formData.profile_image && typeof formData.profile_image !== 'string') {
        profileImageUrl = await uploadImage(formData.profile_image, 'profile');
      }
      
      // Upload new farm images if exist
      let farmImageUrls = [...farmImagePreviews.filter(url => typeof url === 'string')];
      if (formData.farm_images && formData.farm_images.length > 0) {
        for (const image of formData.farm_images) {
          if (typeof image !== 'string') {
            const url = await uploadImage(image, 'farms');
            farmImageUrls.push(url);
          }
        }
      }
      
      // Prepare data for Supabase
      const farmerProfileData = {
        farm_name: formData.farm_name,
        farm_type: formData.farm_type,
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone,
        farm_size: parseFloat(formData.farm_size) || null,
        farm_size_unit: formData.farm_size_unit,
        farm_location: formData.farm_location,
        years_farming: parseInt(formData.years_farming) || 0,
        main_products: formData.main_products,
        growing_methods: formData.growing_methods,
        organic_certified: formData.organic_certified,
        certifications: formData.certifications,
        business_entity: formData.business_entity,
        bio: formData.bio,
        website: formData.website,
        social_media: formData.social_media,
      };
      
      // Only add image URLs if they were uploaded or changed
      if (profileImageUrl) {
        farmerProfileData.profile_image_url = profileImageUrl;
      }
      
      if (farmImageUrls.length > 0) {
        farmerProfileData.farm_image_urls = farmImageUrls;
      }
      
      // Update farmer profile
      const { error: profileError } = await supabase
        .from('farmer_profiles')
        .update(farmerProfileData)
        .eq('user_id', userId);
        
      if (profileError) throw profileError;
      
      // Update farm address
      const addressData = {
        address_line1: formData.farm_address,
        city: formData.farm_city,
        state: formData.farm_state,
        postal_code: formData.farm_postal_code,
        country: formData.farm_country,
      };
      
      const { error: addressError } = await supabase
        .from('user_addresses')
        .update(addressData)
        .eq('user_id', userId)
        .eq('address_type', 'farm');
        
      if (addressError) throw addressError;
      
      // Update business details if they exist
      if (formData.tax_id || formData.business_license || formData.insurance_policy) {
        const businessData = {
          tax_id: formData.tax_id,
          business_license: formData.business_license,
          insurance_policy: formData.insurance_policy
        };
        
        // Check if business details exist first
        const { data: existingBusiness } = await supabase
          .from('farmer_business_details')
          .select('id')
          .eq('user_id', userId)
          .single();
          
        if (existingBusiness) {
          // Update existing record
          const { error: businessError } = await supabase
            .from('farmer_business_details')
            .update(businessData)
            .eq('user_id', userId);
            
          if (businessError) throw businessError;
        } else {
          // Insert new record
          const { error: businessError } = await supabase
            .from('farmer_business_details')
            .insert({
              user_id: userId,
              ...businessData
            });
            
          if (businessError) throw businessError;
        }
      }
      
      // Update bank details if provided and not masked
      if (formData.bank_name && formData.account_holder && 
          !formData.account_number.startsWith('****') && 
          !formData.routing_number.startsWith('****')) {
        
        const bankData = {
          bank_name: formData.bank_name,
          account_holder: formData.account_holder,
          account_number_last4: formData.account_number.slice(-4),
          routing_number_last4: formData.routing_number.slice(-4),
        };
        
        // Check if bank details exist first
        const { data: existingBank } = await supabase
          .from('farmer_payment_details')
          .select('id')
          .eq('user_id', userId)
          .eq('is_default', true)
          .single();
          
        if (existingBank) {
          // Update existing record
          const { error: bankError } = await supabase
            .from('farmer_payment_details')
            .update(bankData)
            .eq('id', existingBank.id);
            
          if (bankError) throw bankError;
        } else {
          // Insert new record
          const { error: bankError } = await supabase
            .from('farmer_payment_details')
            .insert({
              user_id: userId,
              is_default: true,
              ...bankData
            });
            
          if (bankError) throw bankError;
        }
      }
      
      setSuccess("Your profile has been updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating farmer profile:", error);
      setError("There was an error updating your profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderAccountTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-medium text-gray-900">Account Information</h3>
        {!isEditing && (
          <button 
            type="button"
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <PencilIcon className="h-4 w-4 mr-2" /> Edit Profile
          </button>
        )}
      </div>
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-6">
        <div className="relative">
          {imagePreview ? (
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100">
              <img 
                src={imagePreview} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
              <UserCircleIcon className="h-12 w-12 text-gray-400" />
            </div>
          )}
          
          {isEditing && (
            <div className="absolute bottom-0 right-0">
              <label className="flex items-center justify-center w-8 h-8 rounded-full bg-green-600 text-white cursor-pointer hover:bg-green-700">
                <PencilIcon className="h-4 w-4" />
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
            </div>
          )}
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-gray-900">{formData.first_name} {formData.last_name}</h3>
          <p className="text-gray-600">{formData.email}</p>
          <div className="mt-2">
            <button
              type="button"
              className="text-green-600 hover:text-green-800 text-sm font-medium flex items-center"
            >
              <ShieldCheckIcon className="h-4 w-4 mr-1" /> Change Password
            </button>
          </div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full px-3 py-2 rounded-md border ${isEditing ? 'border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent' : 'border-gray-200 bg-gray-50'}`}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full px-3 py-2 rounded-md border ${isEditing ? 'border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent' : 'border-gray-200 bg-gray-50'}`}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              disabled={true}
              className="w-full px-3 py-2 rounded-md border border-gray-200 bg-gray-50"
            />
            <p className="mt-1 text-xs text-gray-500">Contact support to change your email</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full px-3 py-2 rounded-md border ${isEditing ? 'border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent' : 'border-gray-200 bg-gray-50'}`}
            />
          </div>
        </div>
        
        {isEditing && (
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </form>
    </div>
  );

  const renderFarmDetailsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-medium text-gray-900">Farm Details</h3>
        {!isEditing && (
          <button 
            type="button"
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <PencilIcon className="h-4 w-4 mr-2" /> Edit Farm Details
          </button>
        )}
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Farm Name
            </label>
            <input
              type="text"
              name="farm_name"
              value={formData.farm_name}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full px-3 py-2 rounded-md border ${isEditing ? 'border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent' : 'border-gray-200 bg-gray-50'}`}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Farm Type
            </label>
            <select
              name="farm_type"
              value={formData.farm_type}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full px-3 py-2 rounded-md border ${isEditing ? 'border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent' : 'border-gray-200 bg-gray-50'}`}
            >
              <option value="">Select farm type</option>
              {farmTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Years Farming
            </label>
            <input
              type="number"
              name="years_farming"
              value={formData.years_farming}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full px-3 py-2 rounded-md border ${isEditing ? 'border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent' : 'border-gray-200 bg-gray-50'}`}
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Farm Region/Area
            </label>
            <input
              type="text"
              name="farm_location"
              value={formData.farm_location}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full px-3 py-2 rounded-md border ${isEditing ? 'border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent' : 'border-gray-200 bg-gray-50'}`}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Farm Size
            </label>
            <div className="flex">
              <input
                type="number"
                name="farm_size"
                value={formData.farm_size}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-3 py-2 rounded-l-md border ${isEditing ? 'border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent' : 'border-gray-200 bg-gray-50'}`}
              />
              <select
                name="farm_size_unit"
                value={formData.farm_size_unit}
                onChange={handleChange}
                disabled={!isEditing}
                className={`px-3 py-2 rounded-r-md border-t border-r border-b ${isEditing ? 'border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent' : 'border-gray-200 bg-gray-50'}`}
              >
                <option value="acres">acres</option>
                <option value="hectares">hectares</option>
                <option value="sq_ft">sq ft</option>
              </select>
            </div>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bio / About Your Farm
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              disabled={!isEditing}
              rows={4}
              className={`w-full px-3 py-2 rounded-md border ${isEditing ? 'border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent' : 'border-gray-200 bg-gray-50'}`}
            ></textarea>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Farm Images
            </label>
            {isEditing ? (
              <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center">
                <ArrowUpTrayIcon className="h-8 w-8 text-gray-400" />
                <p className="mt-1 text-sm text-gray-500">Upload images of your farm</p>
                <label className="mt-4 cursor-pointer">
                  <span className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                    Select Images
                  </span>
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    accept="image/*"
                    onChange={handleFarmImagesChange}
                  />
                </label>
              </div>
            ) : null}
            
            {farmImagePreviews.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                {farmImagePreviews.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt={`Farm image ${index + 1}`}
                      className="h-32 w-full object-cover rounded-md"
                    />
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <span className="sr-only">Remove</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="md:col-span-2">
            <h4 className="text-lg font-medium text-gray-900 mb-3">Main Products</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {productOptions.map((product) => (
                <div key={product} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`main_products-${product}`}
                    name={`main_products-${product}`}
                    checked={formData.main_products.includes(product)}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`h-4 w-4 rounded ${isEditing ? 'text-green-600 focus:ring-green-500' : 'text-gray-300'}`}
                  />
                  <label htmlFor={`main_products-${product}`} className="ml-2 text-sm text-gray-700">
                    {product}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="md:col-span-2">
            <h4 className="text-lg font-medium text-gray-900 mb-3">Growing Methods</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {growingMethodOptions.map((method) => (
                <div key={method} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`growing_methods-${method}`}
                    name={`growing_methods-${method}`}
                    checked={formData.growing_methods.includes(method)}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`h-4 w-4 rounded ${isEditing ? 'text-green-600 focus:ring-green-500' : 'text-gray-300'}`}
                  />
                  <label htmlFor={`growing_methods-${method}`} className="ml-2 text-sm text-gray-700">
                    {method}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="md:col-span-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="organic_certified"
                name="organic_certified"
                checked={formData.organic_certified}
                onChange={handleChange}
                disabled={!isEditing}
                className={`h-4 w-4 rounded ${isEditing ? 'text-green-600 focus:ring-green-500' : 'text-gray-300'}`}
              />
              <label htmlFor="organic_certified" className="ml-2 text-sm font-medium text-gray-700">
                Organic Certified
              </label>
            </div>
          </div>
          
          <div className="md:col-span-2">
            <h4 className="text-lg font-medium text-gray-900 mb-3">Certifications</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {certificationOptions.map((cert) => (
                <div key={cert} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`certifications-${cert}`}
                    name={`certifications-${cert}`}
                    checked={formData.certifications.includes(cert)}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`h-4 w-4 rounded ${isEditing ? 'text-green-600 focus:ring-green-500' : 'text-gray-300'}`}
                  />
                  <label htmlFor={`certifications-${cert}`} className="ml-2 text-sm text-gray-700">
                    {cert}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {isEditing && (
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </form>
    </div>
  );

  const renderBusinessTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-medium text-gray-900">Business Information</h3>
        {!isEditing && (
          <button 
            type="button"
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <PencilIcon className="h-4 w-4 mr-2" /> Edit Business Info
          </button>
        )}
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Business Entity Type
            </label>
            <select
              name="business_entity"
              value={formData.business_entity}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full px-3 py-2 rounded-md border ${isEditing ? 'border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent' : 'border-gray-200 bg-gray-50'}`}
            >
              <option value="">Select business type</option>
              {businessEntityOptions.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tax ID / EIN
            </label>
            <input
              type="text"
              name="tax_id"
              value={formData.tax_id}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full px-3 py-2 rounded-md border ${isEditing ? 'border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent' : 'border-gray-200 bg-gray-50'}`}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Business License Number
            </label>
            <input
              type="text"
              name="business_license"
              value={formData.business_license}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full px-3 py-2 rounded-md border ${isEditing ? 'border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent' : 'border-gray-200 bg-gray-50'}`}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Insurance Policy Number
            </label>
            <input
              type="text"
              name="insurance_policy"
              value={formData.insurance_policy}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full px-3 py-2 rounded-md border ${isEditing ? 'border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent' : 'border-gray-200 bg-gray-50'}`}
            />
          </div>
          
          <div className="md:col-span-2">
            <h4 className="font-medium text-gray-900 mb-4">Farm Address</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  name="farm_address"
                  value={formData.farm_address}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full px-3 py-2 rounded-md border ${isEditing ? 'border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent' : 'border-gray-200 bg-gray-50'}`}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  name="farm_city"
                  value={formData.farm_city}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full px-3 py-2 rounded-md border ${isEditing ? 'border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent' : 'border-gray-200 bg-gray-50'}`}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State / Province
                </label>
                <input
                  type="text"
                  name="farm_state"
                  value={formData.farm_state}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full px-3 py-2 rounded-md border ${isEditing ? 'border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent' : 'border-gray-200 bg-gray-50'}`}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Postal / ZIP Code
                </label>
                <input
                  type="text"
                  name="farm_postal_code"
                  value={formData.farm_postal_code}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full px-3 py-2 rounded-md border ${isEditing ? 'border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent' : 'border-gray-200 bg-gray-50'}`}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <input
                  type="text"
                  name="farm_country"
                  value={formData.farm_country}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full px-3 py-2 rounded-md border ${isEditing ? 'border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent' : 'border-gray-200 bg-gray-50'}`}
                />
              </div>
            </div>
          </div>
          
          <div className="md:col-span-2">
            <h4 className="font-medium text-gray-900 mb-4">Online Presence</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Website
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="https://..."
                  className={`w-full px-3 py-2 rounded-md border ${isEditing ? 'border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent' : 'border-gray-200 bg-gray-50'}`}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Facebook
                </label>
                <input
                  type="text"
                  name="social_media.facebook"
                  value={formData.social_media.facebook}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="Username or URL"
                  className={`w-full px-3 py-2 rounded-md border ${isEditing ? 'border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent' : 'border-gray-200 bg-gray-50'}`}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Instagram
                </label>
                <input
                  type="text"
                  name="social_media.instagram"
                  value={formData.social_media.instagram}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="Username or URL"
                  className={`w-full px-3 py-2 rounded-md border ${isEditing ? 'border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent' : 'border-gray-200 bg-gray-50'}`}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Twitter
                </label>
                <input
                  type="text"
                  name="social_media.twitter"
                  value={formData.social_media.twitter}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="Username or URL"
                  className={`w-full px-3 py-2 rounded-md border ${isEditing ? 'border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent' : 'border-gray-200 bg-gray-50'}`}
                />
              </div>
            </div>
          </div>
        </div>
        
        {isEditing && (
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </form>
    </div>
  );

  const renderPaymentTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-medium text-gray-900">Payment Information</h3>
        {!isEditing && (
          <button 
            type="button"
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <PencilIcon className="h-4 w-4 mr-2" /> Edit Payment Info
          </button>
        )}
      </div>
      
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <ExclamationCircleIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              Your payment information is securely stored and used only for processing payments for your sales.
            </p>
          </div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bank Name
            </label>
            <input
              type="text"
              name="bank_name"
              value={formData.bank_name}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full px-3 py-2 rounded-md border ${isEditing ? 'border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent' : 'border-gray-200 bg-gray-50'}`}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Account Holder Name
            </label>
            <input
              type="text"
              name="account_holder"
              value={formData.account_holder}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full px-3 py-2 rounded-md border ${isEditing ? 'border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent' : 'border-gray-200 bg-gray-50'}`}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Account Number
            </label>
            <input
              type="text"
              name="account_number"
              value={formData.account_number}
              onChange={handleChange}
              disabled={!isEditing || formData.account_number.startsWith('****')}
              className={`w-full px-3 py-2 rounded-md border ${isEditing && !formData.account_number.startsWith('****') ? 'border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent' : 'border-gray-200 bg-gray-50'}`}
            />
            {formData.account_number.startsWith('****') && isEditing && (
              <p className="mt-1 text-xs text-gray-500">To change your account number, please enter a new one</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Routing Number
            </label>
            <input
              type="text"
              name="routing_number"
              value={formData.routing_number}
              onChange={handleChange}
              disabled={!isEditing || formData.routing_number.startsWith('****')}
              className={`w-full px-3 py-2 rounded-md border ${isEditing && !formData.routing_number.startsWith('****') ? 'border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent' : 'border-gray-200 bg-gray-50'}`}
            />
            {formData.routing_number.startsWith('****') && isEditing && (
              <p className="mt-1 text-xs text-gray-500">To change your routing number, please enter a new one</p>
            )}
          </div>
        </div>
        
        {isEditing && (
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </form>
    </div>
  );



// Success notification component
const renderSuccessNotification = () => (
  <div className={`fixed bottom-0 inset-x-0 pb-2 sm:pb-5 ${success ? '' : 'hidden'}`}>
    <div className="max-w-md mx-auto px-2 sm:px-4">
      <div className="p-2 rounded-lg bg-green-600 shadow-lg sm:p-3">
        <div className="flex items-center justify-between flex-wrap">
          <div className="w-0 flex-1 flex items-center">
            <CheckCircleIcon className="h-6 w-6 text-white" aria-hidden="true" />
            <p className="ml-3 font-medium text-white truncate">
              {success}
            </p>
          </div>
          <div className="order-2 flex-shrink-0 sm:order-3 sm:ml-2">
            <button
              type="button"
              onClick={() => setSuccess("")}
              className="-mr-1 flex p-2 rounded-md hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-white"
            >
              <span className="sr-only">Dismiss</span>
              <XMarkIcon className="h-5 w-5 text-white" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

return (
  <AdminLayout>
  <div className="min-h-screen bg-gray-100">
    <div className="py-10">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6 py-3" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.name}
                  onClick={() => setSelectedTab(tab.value)}
                  className={`${
                    selectedTab === tab.value
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                >
                  <tab.icon className="h-5 w-5 mr-2" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
          
          <div className="px-4 py-5 sm:p-6">
            {selectedTab === 'account' && renderAccountTab()}
            {selectedTab === 'farm_details' && renderFarmDetailsTab()}
            {selectedTab === 'business' && renderBusinessTab()}
            {selectedTab === 'payment' && renderPaymentTab()}
          </div>
        </div>
      </main>
    </div>
    

    {renderSuccessNotification()}
  </div>
  </AdminLayout>
)
}
export default FarmerSettings;