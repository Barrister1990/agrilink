import { supabase } from "@/lib/supabaseClient";
import {
  CheckCircleIcon,
  CreditCardIcon,
  EnvelopeIcon,
  MapPinIcon,
  PencilSquareIcon,
  UserCircleIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

const MyAccount = ({ setActiveSection }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingAddress, setEditingAddress] = useState(false);
  
  // Form state for editing
  const [profileForm, setProfileForm] = useState({
    first_name: '',
    last_name: '',
    phone: ''
  });
  
  const [addressForm, setAddressForm] = useState({
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'Ghana'
  });

  // Fetch user data from Supabase
  useEffect(() => {
    async function fetchUserData() {
      try {
        setLoading(true);
        
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) throw new Error("User not authenticated");
        
        // Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        if (profileError) throw profileError;
        
        // Fetch user addresses
        const { data: addressesData, error: addressesError } = await supabase
          .from('user_addresses')
          .select('*')
          .eq('user_id', user.id);
        
        if (addressesError) throw addressesError;
        
        // Set state with fetched data
        setUserProfile(profileData);
        setAddresses(addressesData);
        
        // Initialize form states
        setProfileForm({
          first_name: profileData.first_name || '',
          last_name: profileData.last_name || '',
          phone: profileData.phone || ''
        });
        
        // Find default shipping address
        const defaultShipping = addressesData.find(addr => 
          addr.address_type === 'shipping' && addr.is_default
        ) || addressesData[0];
        
        if (defaultShipping) {
          setAddressForm({
            address_line1: defaultShipping.address_line1 || '',
            address_line2: defaultShipping.address_line2 || '',
            city: defaultShipping.city || '',
            state: defaultShipping.state || '',
            postal_code: defaultShipping.postal_code || '',
            country: defaultShipping.country || 'Ghana'
          });
        }
        
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchUserData();
  }, []);

  // Handle profile form changes
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle address form changes
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddressForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Update profile in Supabase
  const saveProfile = async () => {
    try {
      setLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('user_profiles')
        .update({
          first_name: profileForm.first_name,
          last_name: profileForm.last_name,
          phone: profileForm.phone,
          updated_at: new Date()
        })
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      // Update local state
      setUserProfile(prev => ({
        ...prev,
        first_name: profileForm.first_name,
        last_name: profileForm.last_name,
        phone: profileForm.phone
      }));
      
      setEditingProfile(false);
      
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Update address in Supabase
  const saveAddress = async () => {
    try {
      setLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      
      // Find the default shipping address
      const shippingAddress = addresses.find(addr => 
        addr.address_type === 'shipping' && addr.is_default
      );
      
      if (shippingAddress) {
        // Update existing address
        const { error } = await supabase
          .from('user_addresses')
          .update({
            address_line1: addressForm.address_line1,
            address_line2: addressForm.address_line2,
            city: addressForm.city,
            state: addressForm.state,
            postal_code: addressForm.postal_code,
            country: addressForm.country
          })
          .eq('id', shippingAddress.id);
        
        if (error) throw error;
      } else {
        // Create new address
        const { error } = await supabase
          .from('user_addresses')
          .insert({
            user_id: user.id,
            address_type: 'shipping',
            address_line1: addressForm.address_line1,
            address_line2: addressForm.address_line2,
            city: addressForm.city,
            state: addressForm.state,
            postal_code: addressForm.postal_code,
            country: addressForm.country,
            is_default: true
          });
        
        if (error) throw error;
      }
      
      // Fetch updated addresses
      const { data: newAddresses, error: fetchError } = await supabase
        .from('user_addresses')
        .select('*')
        .eq('user_id', user.id);
      
      if (fetchError) throw fetchError;
      
      setAddresses(newAddresses);
      setEditingAddress(false);
      
    } catch (err) {
      console.error("Error updating address:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Format shipping address for display
  const getFormattedAddress = () => {
    const shippingAddress = addresses.find(addr => 
      addr.address_type === 'shipping' && addr.is_default
    );
    
    if (!shippingAddress) return "No shipping address found";
    
    return [
      shippingAddress.address_line1,
      shippingAddress.address_line2,
      [shippingAddress.city, shippingAddress.state, shippingAddress.postal_code].filter(Boolean).join(', '),
      shippingAddress.country
    ].filter(Boolean).join(', ');
  };

  if (loading && !userProfile) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse text-green-600">Loading account details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">
        Error loading account data: {error}
      </div>
    );
  }

  return (
    <>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">My AgriLink Account</h2>
          <p className="mt-2 text-gray-600">
            Welcome back, {userProfile?.first_name || 'Valued Customer'}! Manage your farming journey with us.
          </p>
        </div>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-green-50 rounded-lg p-4 flex flex-col items-center justify-center">
            <span className="text-xl md:text-2xl font-bold text-green-700">12</span>
            <span className="text-xs md:text-sm text-gray-600">Orders</span>
          </div>
          <div className="bg-green-50 rounded-lg p-4 flex flex-col items-center justify-center">
            <span className="text-xl md:text-2xl font-bold text-green-700">485</span>
            <span className="text-xs md:text-sm text-gray-600">Reward Points</span>
          </div>
          <div className="bg-green-50 rounded-lg p-4 flex flex-col items-center justify-center">
            <span className="text-xl md:text-2xl font-bold text-green-700">GHS 250</span>
            <span className="text-xs md:text-sm text-gray-600">Store Credit</span>
          </div>
          <div className="bg-green-50 rounded-lg p-4 flex flex-col items-center justify-center">
            <span className="text-xl md:text-2xl font-bold text-green-700">3</span>
            <span className="text-xs md:text-sm text-gray-600">Saved Addresses</span>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User Account Details */}
          <div className="bg-white rounded-lg shadow p-6 relative overflow-hidden border border-gray-100">
            <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <UserCircleIcon className="w-6 h-6 text-green-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-800">Account Details</h3>
              </div>
              <button 
                className="text-gray-500 hover:text-green-600 transition-colors"
                onClick={() => setEditingProfile(true)}
              >
                <PencilSquareIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 ml-8">
              <p className="text-gray-600">
                <span className="font-medium text-gray-700">Name:</span>{' '}
                {userProfile?.first_name} {userProfile?.last_name}
              </p>
              <p className="text-gray-600">
                <span className="font-medium text-gray-700">Email:</span>{' '}
                {userProfile?.email}
              </p>
              <p className="text-gray-600">
                <span className="font-medium text-gray-700">Phone:</span>{' '}
                {userProfile?.phone || 'Not provided'}
              </p>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-lg shadow p-6 relative overflow-hidden border border-gray-100">
            <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <MapPinIcon className="w-6 h-6 text-amber-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-800">Shipping Address</h3>
              </div>
              <button
                className="text-gray-500 hover:text-amber-600 transition-colors"
                onClick={() => setEditingAddress(true)}
              >
                <PencilSquareIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="ml-8">
              <p className="text-gray-600">
                {getFormattedAddress()}
              </p>
            </div>
          </div>

          {/* AgriLink Store Balance */}
          <div className="bg-white rounded-lg shadow p-6 relative overflow-hidden border border-gray-100">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
            <div className="flex items-center mb-4">
              <CreditCardIcon className="w-6 h-6 text-blue-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-800">Store Balance</h3>
            </div>
            <div className="ml-8">
              <p className="text-3xl font-bold text-green-600">GHS 250.00</p>
              <p className="text-gray-600 mt-1 text-sm">
                Available for purchases & withdrawals
              </p>
              <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors">
                Add Funds
              </button>
            </div>
          </div>

          {/* Newsletter Preferences */}
          <div className="bg-white rounded-lg shadow p-6 relative overflow-hidden border border-gray-100">
            <div className="absolute top-0 left-0 w-1 h-full bg-purple-500"></div>
            <div className="flex items-center mb-4">
              <EnvelopeIcon className="w-6 h-6 text-purple-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-800">Newsletter Preferences</h3>
            </div>
            <div className="ml-8">
              <div className="flex items-center mb-2">
                <CheckCircleIcon className="w-5 h-5 text-green-600 mr-2" />
                <p className="text-gray-600">AgriLink News</p>
              </div>
              <div className="flex items-center mb-2">
                <CheckCircleIcon className="w-5 h-5 text-green-600 mr-2" />
                <p className="text-gray-600">Farming Tips</p>
              </div>
              <button className="mt-3 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition-colors">
                Manage Preferences
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {editingProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative">
            <div className="bg-green-600 text-white py-3 px-4 rounded-t-lg">
              <h3 className="text-lg font-semibold">Edit Account Details</h3>
            </div>
            <button 
              className="absolute top-3 right-3 text-white hover:text-gray-200"
              onClick={() => setEditingProfile(false)}
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
            
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  name="first_name"
                  value={profileForm.first_name}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  value={profileForm.last_name}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  value={profileForm.phone}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="+233 123 456 789"
                />
              </div>
              
              <div className="flex justify-end gap-3">
                <button
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                  onClick={() => setEditingProfile(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  onClick={saveProfile}
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Address Modal */}
      {editingAddress && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative">
            <div className="bg-amber-600 text-white py-3 px-4 rounded-t-lg">
              <h3 className="text-lg font-semibold">Edit Shipping Address</h3>
            </div>
            <button 
              className="absolute top-3 right-3 text-white hover:text-gray-200"
              onClick={() => setEditingAddress(false)}
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
            
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1</label>
                <input
                  type="text"
                  name="address_line1"
                  value={addressForm.address_line1}
                  onChange={handleAddressChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2 (Optional)</label>
                <input
                  type="text"
                  name="address_line2"
                  value={addressForm.address_line2}
                  onChange={handleAddressChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    value={addressForm.city}
                    onChange={handleAddressChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State/Region</label>
                  <input
                    type="text"
                    name="state"
                    value={addressForm.state}
                    onChange={handleAddressChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                  <input
                    type="text"
                    name="postal_code"
                    value={addressForm.postal_code}
                    onChange={handleAddressChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <select
                    name="country"
                    value={addressForm.country}
                    onChange={handleAddressChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="Ghana">Ghana</option>
                    <option value="Nigeria">Nigeria</option>
                    <option value="Kenya">Kenya</option>
                    <option value="South Africa">South Africa</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end gap-3">
                <button
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                  onClick={() => setEditingAddress(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors"
                  onClick={saveAddress}
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Address'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MyAccount;