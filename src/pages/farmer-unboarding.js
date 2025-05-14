import { supabase } from "@/lib/supabaseClient";
import {
  ArrowRightIcon,
  CheckCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloudArrowUpIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const FarmerOnboarding = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchingUserData, setFetchingUserData] = useState(true);
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [isReapplying, setIsReapplying] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
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
    farm_country: "Ghana",
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
  const [existingProfileImage, setExistingProfileImage] = useState(null);
  const [existingFarmImages, setExistingFarmImages] = useState([]);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      setFetchingUserData(true);
      try {
        // Get current user session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;
        
        const currentUserId = session.user.id;
        setUserId(currentUserId);
        
        // Pre-fill email from auth
        setFormData(prev => ({
          ...prev,
          email: session.user.email
        }));
        
        // Check if user has a previous application
        const { data: farmerProfile, error: profileError } = await supabase
          .from('farmer_profiles')
          .select('*')
          .eq('user_id', currentUserId)
          .single();
        
        if (profileError && profileError.code !== 'PGRST116') {
          // Error other than "no rows returned"
          console.error("Error fetching farmer profile:", profileError);
        }
        
        if (farmerProfile) {
          // User has an existing profile
          if (farmerProfile.application_status === 'rejected') {
            // Rejected application, allow reapplication
            setIsReapplying(true);
            setRejectionReason(farmerProfile.rejection_reason || "Your application requires additional information.");
            
            // Get farm address
            const { data: addressData } = await supabase
              .from('user_addresses')
              .select('*')
              .eq('user_id', currentUserId)
              .eq('address_type', 'farm')
              .single();
              
            // Get business details
            const { data: businessData } = await supabase
              .from('farmer_business_details')
              .select('*')
              .eq('user_id', currentUserId)
              .single();
              
            // Get payment details
            const { data: paymentData } = await supabase
              .from('farmer_payment_details')
              .select('*')
              .eq('user_id', currentUserId)
              .single();
            
            // Prepare form data from existing profile
            const updatedFormData = {
              // Personal Details
              farm_name: farmerProfile.farm_name || "",
              farm_type: farmerProfile.farm_type || "",
              first_name: farmerProfile.first_name || "",
              last_name: farmerProfile.last_name || "",
              email: farmerProfile.email || session.user.email,
              phone: farmerProfile.phone || "",
              
              // Farm Details
              farm_size: farmerProfile.farm_size?.toString() || "",
              farm_size_unit: farmerProfile.farm_size_unit || "acres",
              farm_location: farmerProfile.farm_location || "",
              farm_address: addressData?.address_line1 || "",
              farm_city: addressData?.city || "",
              farm_state: addressData?.state || "",
              farm_postal_code: addressData?.postal_code || "",
              farm_country: addressData?.country || "Ghana",
              years_farming: farmerProfile.years_farming?.toString() || "",
              
              // Production Details
              main_products: farmerProfile.main_products || [],
              growing_methods: farmerProfile.growing_methods || [],
              organic_certified: farmerProfile.organic_certified || false,
              certifications: farmerProfile.certifications || [],
              
              // Business Details
              business_entity: farmerProfile.business_entity || "",
              tax_id: businessData?.tax_id || "",
              business_license: businessData?.business_license || "",
              insurance_policy: businessData?.insurance_policy || "",
              
              // Bank Details
              bank_name: paymentData?.bank_name || "",
              account_holder: paymentData?.account_holder || "",
              account_number: paymentData?.account_number_last4 ? `****${paymentData.account_number_last4}` : "",
              routing_number: paymentData?.routing_number_last4 ? `****${paymentData.routing_number_last4}` : "",
              
              // Additional Info
              bio: farmerProfile.bio || "",
              profile_image: null, // Will be set separately
              farm_images: [], // Will be set separately
              website: farmerProfile.website || "",
              social_media: farmerProfile.social_media || {
                facebook: "",
                instagram: "",
                twitter: ""
              }
            };
            
            setFormData(updatedFormData);
            
            // Set image previews if they exist
            if (farmerProfile.profile_image_url) {
              setExistingProfileImage(farmerProfile.profile_image_url);
              setImagePreview(farmerProfile.profile_image_url);
            }
            
            if (farmerProfile.farm_image_urls && farmerProfile.farm_image_urls.length > 0) {
              setExistingFarmImages(farmerProfile.farm_image_urls);
              setFarmImagePreviews(farmerProfile.farm_image_urls);
            }
          } 
          
        }
      } catch (error) {
        console.error("Error initializing farmer onboarding:", error);
        setError("Failed to load your information. Please refresh the page.");
      } finally {
        setFetchingUserData(false);
      }
    };
    
    fetchUserData();
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
      
      // Clear the existing image reference if we're uploading a new one
      setExistingProfileImage(null);
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
        farm_images: [...prev.farm_images, ...files]
      }));
    }
  };
  
  const removeImage = (index) => {
    // Check if the image is from existing images
    if (index < existingFarmImages.length) {
      // Remove from existing farm images
      const updatedExistingImages = [...existingFarmImages];
      updatedExistingImages.splice(index, 1);
      setExistingFarmImages(updatedExistingImages);
    } else {
      // Adjust index for new images
      const newImageIndex = index - existingFarmImages.length;
      setFormData(prev => ({
        ...prev,
        farm_images: prev.farm_images.filter((_, i) => i !== newImageIndex)
      }));
    }
    
    // Remove from previews
    setFarmImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const nextStep = () => {
    // Basic validation for current step
    if (step === 1) {
      if (!formData.farm_name) {
        setError("Farm name is required");
        return;
      }
      if (!formData.farm_type) {
        setError("Farm type is required");
        return;
      }
      if (!formData.first_name) {
        setError("First name is required");
        return;
      }
      if (!formData.last_name) {
        setError("Last name is required");
        return;
      }
      if (!formData.phone) {
        setError("Phone number is required");
        return;
      }
      // Profile image is required for reapplications
      if (isReapplying && !formData.profile_image && !existingProfileImage) {
        setError("A profile photo is required for your application");
        return;
      }
    }
    
    if (step === 2) {
      if (!formData.farm_location) {
        setError("Farm region/area is required");
        return;
      }
      if (!formData.farm_address) {
        setError("Farm address is required");
        return;
      }
      if (!formData.farm_city) {
        setError("City is required");
        return;
      }
      if (!formData.farm_state) {
        setError("State/Province is required");
        return;
      }
      if (!formData.farm_postal_code) {
        setError("Postal code is required");
        return;
      }
    }
    
    if (step === 3) {
      if (formData.main_products.length === 0) {
        setError("Please select at least one product");
        return;
      }
      if (formData.growing_methods.length === 0) {
        setError("Please select at least one growing method");
        return;
      }
      // Bio is required for reapplications
      if (isReapplying && !formData.bio) {
        setError("Please provide a bio about your farm");
        return;
      }
    }
    
    setError("");
    setStep(step + 1);
    window.scrollTo(0, 0);
  };

  const prevStep = () => {
    setStep(step - 1);
    window.scrollTo(0, 0);
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
    setSuccess(false);
    let collectedErrors = [];
  
    try {
      // Step 1: Upload profile image if exists
      let profileImageUrl = existingProfileImage;
      if (formData.profile_image) {
        profileImageUrl = await uploadImage(formData.profile_image, 'profile');
        setUploadProgress(20);
      }
  
      // Step 2: Upload farm images
      let farmImageUrls = [...existingFarmImages];
      if (formData.farm_images.length > 0) {
        let progress = 20;
        const progressIncrement = 40 / formData.farm_images.length;
  
        for (const image of formData.farm_images) {
          const url = await uploadImage(image, 'farms');
          farmImageUrls.push(url);
          progress += progressIncrement;
          setUploadProgress(Math.min(Math.round(progress), 60));
        }
      } else {
        setUploadProgress(60);
      }
  
      // Step 3: Save farmer profile
      const farmerProfileData = {
        user_id: userId,
        farm_name: formData.farm_name,
        farm_type: formData.farm_type,
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone,
        farm_size: parseFloat(formData.farm_size) || 0,
        farm_size_unit: formData.farm_size_unit,
        farm_location: formData.farm_location,
        years_farming: parseInt(formData.years_farming) || 0,
        main_products: formData.main_products,
        growing_methods: formData.growing_methods,
        organic_certified: formData.organic_certified,
        certifications: formData.certifications,
        business_entity: formData.business_entity,
        bio: formData.bio,
        profile_image_url: profileImageUrl,
        farm_image_urls: farmImageUrls,
        website: formData.website,
        social_media: formData.social_media,
        application_status: 'pending',
        rejection_reason: null,
        updated_at: new Date(),
      };
  
      try {
        if (isReapplying) {
          const { error } = await supabase
            .from('farmer_profiles')
            .update(farmerProfileData)
            .eq('user_id', userId);
          if (error) throw error;
        } else {
          farmerProfileData.created_at = new Date();
          const { error } = await supabase
            .from('farmer_profiles')
            .insert(farmerProfileData);
          if (error) throw error;
        }
      } catch (err) {
        collectedErrors.push('Failed to save farmer profile.');
      }
  
      setUploadProgress(70);
  
      // Step 4: Save farm address
      try {
        const addressData = {
          user_id: userId,
          address_type: 'farm',
          address_line1: formData.farm_address,
          address_line2: '',
          city: formData.farm_city,
          state: formData.farm_state,
          postal_code: formData.farm_postal_code,
          country: formData.farm_country,
          is_default: true,
          updated_at: new Date(),
        };
  
        const { data: existingAddress } = await supabase
          .from('user_addresses')
          .select('id')
          .eq('user_id', userId)
          .eq('address_type', 'farm')
          .single();
  
        if (existingAddress) {
          const { error } = await supabase
            .from('user_addresses')
            .update(addressData)
            .eq('id', existingAddress.id);
          if (error) throw error;
        } else {
          addressData.created_at = new Date();
          const { error } = await supabase
            .from('user_addresses')
            .insert(addressData);
          if (error) throw error;
        }
      } catch (err) {
        collectedErrors.push('Failed to save farm address.');
      }
  
      setUploadProgress(80);
  
      // Step 5: Save business details (optional)
      if (
        formData.tax_id ||
        formData.business_license ||
        formData.insurance_policy
      ) {
        try {
          const businessData = {
            user_id: userId,
            tax_id: formData.tax_id,
            business_license: formData.business_license,
            insurance_policy: formData.insurance_policy,
            updated_at: new Date(),
          };
  
          const { data: existingBusiness } = await supabase
            .from('farmer_business_details')
            .select('id')
            .eq('user_id', userId)
            .single();
  
          if (existingBusiness) {
            const { error } = await supabase
              .from('farmer_business_details')
              .update(businessData)
              .eq('id', existingBusiness.id);
            if (error) throw error;
          } else {
            businessData.created_at = new Date();
            const { error } = await supabase
              .from('farmer_business_details')
              .insert(businessData);
            if (error) throw error;
          }
        } catch (err) {
          collectedErrors.push('Failed to save business details.');
        }
      }
  
      // Step 6: Save bank details (if valid)
      if (
        formData.bank_name &&
        formData.account_holder &&
        formData.account_number &&
        !formData.account_number.startsWith('****') &&
        formData.routing_number &&
        !formData.routing_number.startsWith('****')
      ) {
        try {
          const bankData = {
            user_id: userId,
            bank_name: formData.bank_name,
            account_holder: formData.account_holder,
            account_number_last4: formData.account_number.slice(-4),
            routing_number_last4: formData.routing_number.slice(-4),
            is_default: true,
            updated_at: new Date(),
          };
  
          const { data: existingBank } = await supabase
            .from('farmer_payment_details')
            .select('id')
            .eq('user_id', userId)
            .single();
  
          if (existingBank) {
            const { error } = await supabase
              .from('farmer_payment_details')
              .update(bankData)
              .eq('id', existingBank.id);
            if (error) throw error;
          } else {
            bankData.created_at = new Date();
            const { error } = await supabase
              .from('farmer_payment_details')
              .insert(bankData);
            if (error) throw error;
          }
        } catch (err) {
          collectedErrors.push('Failed to save bank details.');
        }
      }
  
      setUploadProgress(100);
  
      if (collectedErrors.length > 0) {
        setError(collectedErrors.join(' '));
      } else {
        setSuccess(true);
        setTimeout(() => {
          router.push('/admin');
        }, 2000);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('Unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  

  // Render progress steps
  const renderProgressSteps = () => {
    const steps = [
      "Farm Info",
      "Location",
      "Products",
      "Business",
      "Payment",
      "Complete"
    ];
    
    return (
      <div className="mb-8">
        <div className="flex justify-between items-center">
          {steps.map((stepName, index) => (
            <div key={index} className="flex flex-col items-center">
              <div 
                className={`rounded-full h-10 w-10 flex items-center justify-center ${
                  step > index + 1 
                    ? "bg-green-500 text-white" 
                    : step === index + 1 
                      ? "bg-green-600 text-white" 
                      : "bg-gray-200 text-gray-500"
                }`}
              >
                {step > index + 1 ? (
                  <CheckCircleIcon className="h-6 w-6" />
                ) : (
                  index + 1
                )}
              </div>
              <span 
                className={`mt-2 text-xs sm:text-sm ${
                  step === index + 1 ? "text-green-600 font-medium" : "text-gray-500"
                }`}
              >
                {stepName}
              </span>
            </div>
          ))}
        </div>
        
        <div className="relative mt-2">
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 rounded"></div>
          <div 
            className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-green-500 rounded transition-all duration-300"
            style={{ width: `${(step - 1) * 20}%` }}
          ></div>
        </div>
      </div>
    );
  };

  // Render form based on current step
  const renderForm = () => {
    switch(step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Tell us about your farm</h2>
              <p className="text-gray-600">Let&apos;s start with the basics about your farm and yourself.</p>
            </div>
            
            {isReapplying && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <InformationCircleIcon className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      Your previous application was not approved. Reason: {rejectionReason}
                    </p>
                    <p className="text-sm text-yellow-700 mt-2">
                      Please update your information and resubmit your application.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-gray-700 font-medium mb-2">
                  Farm Name*
                </label>
                <input
                  type="text"
                  name="farm_name"
                  value={formData.farm_name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Your farm's name"
                  required
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-gray-700 font-medium mb-2">
                  Farm Type*
                </label>
                <select
                  name="farm_type"
                  value={formData.farm_type}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                >
                  <option value="">Select farm type</option>
                  {farmTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  First Name*
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Your first name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Last Name*
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Your last name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Email Address*
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50"
                  placeholder="Your email address"
                  disabled
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Phone Number*
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Your phone number"
                  required
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-gray-700 font-medium mb-2">
                  Upload Profile Photo {isReapplying && "*"}
                </label>
                <div className="flex items-center">
                  <div className="mr-4">
                    {imagePreview ? (
                      <div className="w-24 h-24 rounded-full overflow-hidden">
                      <img 
                        src={imagePreview} 
                        alt="Profile preview" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                      <CloudArrowUpIcon className="h-10 w-10 text-gray-400" />
                    </div>
                  )}
                </div>
                <div>
                  <label className="cursor-pointer bg-white border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-md text-sm font-medium text-gray-700">
                    Choose File
                    <input
                      type="file"
                      onChange={handleImageChange}
                      className="hidden"
                      accept="image/*"
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-1">JPG, PNG or GIF, max 5MB</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    
    case 2:
      return (
        <div className="space-y-6">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Farm Location</h2>
            <p className="text-gray-600">Please provide details about your farm&apos;s location.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-medium mb-2">
                Farm Size
              </label>
              <div className="flex">
                <input
                  type="number"
                  name="farm_size"
                  value={formData.farm_size}
                  onChange={handleChange}
                  className="w-2/3 px-4 py-3 rounded-l-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Size"
                  min="0"
                />
                <select
                  name="farm_size_unit"
                  value={formData.farm_size_unit}
                  onChange={handleChange}
                  className="w-1/3 px-4 py-3 rounded-r-lg border border-gray-300 border-l-0 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="acres">Acres</option>
                  <option value="hectares">Hectares</option>
                  <option value="sq_ft">Square Feet</option>
                </select>
              </div>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-medium mb-2">
                Region/Area*
              </label>
              <input
                type="text"
                name="farm_location"
                value={formData.farm_location}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g. Central Valley, California"
                required
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-medium mb-2">
                Street Address*
              </label>
              <input
                type="text"
                name="farm_address"
                value={formData.farm_address}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Street address"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                City*
              </label>
              <input
                type="text"
                name="farm_city"
                value={formData.farm_city}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="City"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                State/Province*
              </label>
              <input
                type="text"
                name="farm_state"
                value={formData.farm_state}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="State/Province"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Postal Code*
              </label>
              <input
                type="text"
                name="farm_postal_code"
                value={formData.farm_postal_code}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Postal code"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Country
              </label>
              <input
                type="text"
                name="farm_country"
                value={formData.farm_country}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50"
                disabled
              />
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Years Farming
              </label>
              <input
                type="number"
                name="years_farming"
                value={formData.years_farming}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Years of farming experience"
                min="0"
              />
            </div>
          </div>
        </div>
      );
    
    case 3:
      return (
        <div className="space-y-6">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Farm Production</h2>
            <p className="text-gray-600">Tell us about what you grow and how you grow it.</p>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Main Products*
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {productOptions.map((product) => (
                  <label key={product} className="flex items-center space-x-2 p-2 border rounded hover:bg-gray-50">
                    <input
                      type="checkbox"
                      name={`main_products-${product}`}
                      checked={formData.main_products.includes(product)}
                      onChange={handleChange}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <span>{product}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Growing Methods*
              </label>
              <div className="grid grid-cols-2 gap-2">
                {growingMethodOptions.map((method) => (
                  <label key={method} className="flex items-center space-x-2 p-2 border rounded hover:bg-gray-50">
                    <input
                      type="checkbox"
                      name={`growing_methods-${method}`}
                      checked={formData.growing_methods.includes(method)}
                      onChange={handleChange}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <span>{method}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="organic_certified"
                  checked={formData.organic_certified}
                  onChange={handleChange}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <span className="text-gray-700 font-medium">Organic Certified</span>
              </label>
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Certifications
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {certificationOptions.map((cert) => (
                  <label key={cert} className="flex items-center space-x-2 p-2 border rounded hover:bg-gray-50">
                    <input
                      type="checkbox"
                      name={`certifications-${cert}`}
                      checked={formData.certifications.includes(cert)}
                      onChange={handleChange}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <span>{cert}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Farm Bio {isReapplying && "*"}
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Tell us about your farm, your story, and what makes your products unique..."
                rows="5"
              ></textarea>
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Farm Images
              </label>
              <div className="space-y-4">
                <div>
                  <label className="cursor-pointer inline-block bg-white border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-md text-sm font-medium text-gray-700">
                    Upload Images
                    <input
                      type="file"
                      multiple
                      onChange={handleFarmImagesChange}
                      className="hidden"
                      accept="image/*"
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-1">Upload up to 5 images of your farm (JPG, PNG or GIF, max 5MB each)</p>
                </div>
                
                {farmImagePreviews.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {farmImagePreviews.map((preview, index) => (
                      <div key={index} className="relative">
                        <img 
                          src={preview} 
                          alt={`Farm preview ${index + 1}`} 
                          className="w-full h-36 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                        >
                          <ExclamationCircleIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    
    case 4:
      return (
        <div className="space-y-6">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Business Details</h2>
            <p className="text-gray-600">Please provide information about your business structure.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-medium mb-2">
                Business Entity Type
              </label>
              <select
                name="business_entity"
                value={formData.business_entity}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Select business type</option>
                {businessEntityOptions.map((entity) => (
                  <option key={entity} value={entity}>{entity}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Tax ID / EIN (optional)
              </label>
              <input
                type="text"
                name="tax_id"
                value={formData.tax_id}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Tax ID number"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Business License # (optional)
              </label>
              <input
                type="text"
                name="business_license"
                value={formData.business_license}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Business license number"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-medium mb-2">
                Insurance Policy # (optional)
              </label>
              <input
                type="text"
                name="insurance_policy"
                value={formData.insurance_policy}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Insurance policy number"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-medium mb-2">
                Website (optional)
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="https://yourfarm.com"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Facebook (optional)
              </label>
              <input
                type="text"
                name="social_media.facebook"
                value={formData.social_media.facebook}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Facebook page or profile URL"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Instagram (optional)
              </label>
              <input
                type="text"
                name="social_media.instagram"
                value={formData.social_media.instagram}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Instagram handle (e.g. @yourfarm)"
              />
            </div>
          </div>
        </div>
      );
    
    case 5:
      return (
        <div className="space-y-6">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Information</h2>
            <p className="text-gray-600">Please provide your bank details for payments.</p>
            <p className="text-sm text-gray-500 mt-2">This information is optional now and can be provided later.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-medium mb-2">
                Bank Name
              </label>
              <input
                type="text"
                name="bank_name"
                value={formData.bank_name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter your bank name"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-medium mb-2">
                Account Holder Name
              </label>
              <input
                type="text"
                name="account_holder"
                value={formData.account_holder}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Name on your bank account"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Account Number
              </label>
              <input
                type="text"
                name="account_number"
                value={formData.account_number}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Your bank account number"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Routing Number
              </label>
              <input
                type="text"
                name="routing_number"
                value={formData.routing_number}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Your bank routing number"
              />
            </div>
          </div>
          
          <div className="mt-8">
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <InformationCircleIcon className="h-5 w-5 text-blue-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    Your bank information is securely stored and used only for payments. You can also add this information later.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    
    case 6:
      return (
        <div className="space-y-6">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Review & Submit</h2>
            <p className="text-gray-600">Please review your information before submitting your application.</p>
          </div>
          
          <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <InformationCircleIcon className="h-5 w-5 text-green-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">
                  Your application will be reviewed by our team. You will be notified by email when your application is approved.
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="border rounded-lg p-4">
              <h3 className="font-medium text-gray-800 mb-2">Farm Information</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-600">Farm Name:</div>
                <div>{formData.farm_name}</div>
                
                <div className="text-gray-600">Farm Type:</div>
                <div>{formData.farm_type}</div>
                
                <div className="text-gray-600">Farm Size:</div>
                <div>{formData.farm_size} {formData.farm_size_unit}</div>
                
                <div className="text-gray-600">Years Farming:</div>
                <div>{formData.years_farming}</div>
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="font-medium text-gray-800 mb-2">Contact Information</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-600">Name:</div>
                <div>{formData.first_name} {formData.last_name}</div>
                
                <div className="text-gray-600">Email:</div>
                <div>{formData.email}</div>
                
                <div className="text-gray-600">Phone:</div>
                <div>{formData.phone}</div>
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="font-medium text-gray-800 mb-2">Farm Location</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-600">Address:</div>
                <div>{formData.farm_address}</div>
                
                <div className="text-gray-600">City:</div>
                <div>{formData.farm_city}</div>
                
                <div className="text-gray-600">State/Province:</div>
                <div>{formData.farm_state}</div>
                
                <div className="text-gray-600">Postal Code:</div>
                <div>{formData.farm_postal_code}</div>
                
                <div className="text-gray-600">Country:</div>
                <div>{formData.farm_country}</div>
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="font-medium text-gray-800 mb-2">Production Information</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-600">Main Products:</div>
                <div>{formData.main_products.join(", ")}</div>
                
                <div className="text-gray-600">Growing Methods:</div>
                <div>{formData.growing_methods.join(", ")}</div>
                
                <div className="text-gray-600">Organic Certified:</div>
                <div>{formData.organic_certified ? "Yes" : "No"}</div>
                
                <div className="text-gray-600">Certifications:</div>
                <div>{formData.certifications.length > 0 ? formData.certifications.join(", ") : "None"}</div>
              </div>
            </div>
            
            {formData.business_entity && (
              <div className="border rounded-lg p-4">
                <h3 className="font-medium text-gray-800 mb-2">Business Information</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-gray-600">Business Entity:</div>
                  <div>{formData.business_entity}</div>
                  
                  {formData.tax_id && (
                    <>
                      <div className="text-gray-600">Tax ID:</div>
                      <div>{formData.tax_id}</div>
                    </>
                  )}
                  
                  {formData.business_license && (
                    <>
                      <div className="text-gray-600">Business License:</div>
                      <div>{formData.business_license}</div>
                    </>
                  )}
                  
                  {formData.insurance_policy && (
                    <>
                      <div className="text-gray-600">Insurance Policy:</div>
                      <div>{formData.insurance_policy}</div>
                    </>
                  )}
                </div>
              </div>
            )}
            
            {formData.bank_name && formData.account_holder && (
              <div className="border rounded-lg p-4">
                <h3 className="font-medium text-gray-800 mb-2">Payment Information</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-gray-600">Bank Name:</div>
                  <div>{formData.bank_name}</div>
                  
                  <div className="text-gray-600">Account Holder:</div>
                  <div>{formData.account_holder}</div>
                  
                  <div className="text-gray-600">Account Number:</div>
                  <div>{formData.account_number}</div>
                  
                  <div className="text-gray-600">Routing Number:</div>
                  <div>{formData.routing_number}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      );
      
    default:
      return null;
  }
};

// Show loading spinner during data fetch
if (fetchingUserData) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
    </div>
  );
}

return (
  <div className="bg-gray-50 min-h-screen py-10">
    <div className="max-w-4xl mx-auto px-4">
      <div className="bg-white rounded-xl shadow-md p-6 sm:p-8">
        {renderProgressSteps()}
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <ExclamationCircleIcon className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          {renderForm()}
          {/* Upload Progress Bar */}
{uploadProgress > 0 && uploadProgress < 100 && (
  <div className="mt-6 mb-6">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Uploading File... {uploadProgress}%
    </label>
    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
      <div
        className="bg-green-500 h-3 transition-all duration-300"
        style={{ width: `${uploadProgress}%` }}
      ></div>
    </div>
  </div>
)}

{uploadProgress === 100 && (
  <div className="mt-6 mb-6 flex items-center text-green-700 bg-green-50 border border-green-200 rounded-md px-4 py-2">
    <CheckCircleIcon className="h-5 w-5 mr-2 text-green-600" />
    <span className="text-sm font-medium">Upload Complete</span>
  </div>
)}
          
          <div className="mt-10 flex justify-between items-center">
            {step > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="flex items-center px-5 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <ChevronLeftIcon className="h-5 w-5 mr-1" />
                Back
              </button>
            )}
            
            {step < 6 ? (
              <button
                type="button"
                onClick={nextStep}
                className="ml-auto flex items-center px-5 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Next
                <ChevronRightIcon className="h-5 w-5 ml-1" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isLoading || success}
                className={`ml-auto flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white ${
                  isLoading || success
                     ? "bg-gray-400 cursor-not-allowed"
                     : "bg-green-600 hover:bg-green-700 focus:ring-green-500"
                 }`}
               >
                 {isLoading ? (
                   <div className="flex items-center">
                     <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                     </svg>
                     Submitting...
                   </div>
                 ) : success ? (
                   <div className="flex items-center">
                     <CheckCircleIcon className="h-5 w-5 mr-2" />
                     Application Submitted
                   </div>
                 ) : (
                   <div className="flex items-center">
                     Submit Application
                     <ArrowRightIcon className="h-5 w-5 ml-2" />
                   </div>
                 )}
               </button>
             )}
           </div>
         </form>
         
         {success && (
           <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
             <div className="flex">
               <div className="flex-shrink-0">
                 <CheckCircleIcon className="h-8 w-8 text-green-500" />
               </div>
               <div className="ml-4">
                 <h3 className="text-lg font-medium text-green-800">Application Successfully Submitted</h3>
                 <p className="mt-2 text-green-700">
                   Thank you for your application! We&apos;ve sent a confirmation email to {formData.email}.
                   Our team will review your application and get back to you within 3-5 business days.
                 </p>
                 <div className="mt-4">
                   <button
                     type="button"
                     onClick={() => {
                       setSuccess(false);
                       setStep(1);
                       setFormData(initialFormData);
                     }}
                     className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                   >
                     Start a New Application
                   </button>
                 </div>
               </div>
             </div>
           </div>
         )}
       </div>
       
       <div className="mt-10 text-center text-sm text-gray-500">
         <p>
           Need help with your application? Contact support at{" "}
           <a href="mailto:support@example.com" className="text-green-600 hover:text-green-500">
             support@example.com
           </a>
         </p>
       </div>
     </div>
   </div>
 );
}
export default FarmerOnboarding;