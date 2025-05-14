// components/OnboardingForm.js
import { supabase } from '@/lib/supabaseClient';
import Image from "next/image";
import { useRouter } from 'next/router';
import { useState } from 'react';

const OnboardingForm = ({ userProfile }) => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'United States',
    shipping_same_as_billing: true,
    shipping_address_line1: '',
    shipping_address_line2: '',
    shipping_city: '',
    shipping_state: '',
    shipping_postal_code: '',
    shipping_country: 'United States',
    payment_method: 'credit_card',
    card_number: '',
    expiration_date: '',
    cvv: '',
    card_holder_name: '',
    email_preferences: {
      marketing: true,
      orders: true,
      promotions: true
    }
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      if (name === 'shipping_same_as_billing') {
        setFormData({
          ...formData,
          [name]: checked
        });
      } else if (name.startsWith('email_preferences.')) {
        const prefName = name.split('.')[1];
        setFormData({
          ...formData,
          email_preferences: {
            ...formData.email_preferences,
            [prefName]: checked
          }
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      // Prepare the user profile data
      const profileData = {
        user_id: userProfile.user_id,
        email: userProfile.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone,
        created_at: new Date()
      };
      
      // Insert into user_profiles table
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert(profileData);
      
      if (profileError) throw profileError;
      
      // Prepare the address data
      const addressData = {
        user_id: userProfile.user_id,
        address_type: 'billing',
        address_line1: formData.address_line1,
        address_line2: formData.address_line2,
        city: formData.city,
        state: formData.state,
        postal_code: formData.postal_code,
        country: formData.country,
        is_default: true
      };
      
      // Insert billing address
      const { error: addressError } = await supabase
        .from('user_addresses')
        .insert(addressData);
      
      if (addressError) throw addressError;
      
      // If shipping address is different, insert it as well
      if (!formData.shipping_same_as_billing) {
        const shippingAddressData = {
          user_id: userProfile.user_id,
          address_type: 'shipping',
          address_line1: formData.shipping_address_line1,
          address_line2: formData.shipping_address_line2,
          city: formData.shipping_city,
          state: formData.shipping_state,
          postal_code: formData.shipping_postal_code,
          country: formData.shipping_country,
          is_default: true
        };
        
        const { error: shippingAddressError } = await supabase
          .from('user_addresses')
          .insert(shippingAddressData);
        
        if (shippingAddressError) throw shippingAddressError;
      }
      
      // If payment method is added, store it
      if (formData.payment_method === 'credit_card' && formData.card_number) {
        // In a real app, you would use a secure payment processor
        // This is just for demonstration - never store actual card details in Supabase!
        const paymentData = {
          user_id: userProfile.user_id,
          payment_type: 'credit_card',
          card_last_four: formData.card_number.slice(-4),
          card_brand: detectCardBrand(formData.card_number),
          is_default: true,
          holder_name: formData.card_holder_name,
          expiry_date: formData.expiration_date
        };
        
        const { error: paymentError } = await supabase
          .from('payment_methods')
          .insert(paymentData);
        
        if (paymentError) throw paymentError;
      }
      
      // Store email preferences
      const preferencesData = {
        user_id: userProfile.user_id,
        marketing_emails: formData.email_preferences.marketing,
        order_updates: formData.email_preferences.orders,
        promotional_emails: formData.email_preferences.promotions
      };
      
      const { error: preferencesError } = await supabase
        .from('user_preferences')
        .insert(preferencesData);
      
      if (preferencesError) throw preferencesError;
      
      // Redirect to dashboard on successful completion
      router.push('/');
      
    } catch (error) {
      console.error('Error saving profile:', error.message);
      alert('Error saving your profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to detect card brand based on number
  const detectCardBrand = (cardNumber) => {
    const firstDigit = cardNumber.charAt(0);
    
    if (cardNumber.startsWith('4')) return 'Visa';
    if (cardNumber.startsWith('5')) return 'Mastercard';
    if (cardNumber.startsWith('3')) return 'Amex';
    if (cardNumber.startsWith('6')) return 'Discover';
    
    return 'Unknown';
  };

  // Render steps based on current step
  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-medium text-gray-800">Personal Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={userProfile.email}
                className="w-full p-2 bg-gray-100 border border-gray-300 rounded-md"
                readOnly
              />
              <p className="text-xs text-gray-500 mt-1">This email is linked to your Google account</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>
            <div className="pt-4">
              <button
                type="button"
                onClick={nextStep}
                className="w-full bg-green-600 text-white font-medium py-2 px-4 rounded-md hover:bg-green-700 transition"
              >
                Continue to Address
              </button>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-medium text-gray-800">Billing Address</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1</label>
              <input
                type="text"
                name="address_line1"
                value={formData.address_line1}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2 (Optional)</label>
              <input
                type="text"
                name="address_line2"
                value={formData.address_line2}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State/Province</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                <input
                  type="text"
                  name="postal_code"
                  value={formData.postal_code}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                >
                  <option value="United States">Ghana</option>
                  <option value="Canada">Nigeria</option>
                  <option value="United Kingdom">Kenya</option>
                  <option value="Australia">South Africa</option>
                  {/* Add more countries as needed */}
                </select>
              </div>
            </div>
            
            <div className="pt-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="shipping_same_as_billing"
                  checked={formData.shipping_same_as_billing}
                  onChange={handleChange}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Shipping address same as billing</span>
              </label>
            </div>
            
            {!formData.shipping_same_as_billing && (
              <div className="border-t border-gray-200 pt-4 mt-4">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Shipping Address</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1</label>
                  <input
                    type="text"
                    name="shipping_address_line1"
                    value={formData.shipping_address_line1}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2 (Optional)</label>
                  <input
                    type="text"
                    name="shipping_address_line2"
                    value={formData.shipping_address_line2}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      name="shipping_city"
                      value={formData.shipping_city}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State/Province</label>
                    <input
                      type="text"
                      name="shipping_state"
                      value={formData.shipping_state}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                    <input
                      type="text"
                      name="shipping_postal_code"
                      value={formData.shipping_postal_code}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <select
                      name="shipping_country"
                      value={formData.shipping_country}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      required
                    >
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Australia">Australia</option>
                      {/* Add more countries as needed */}
                    </select>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={prevStep}
                className="bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-md hover:bg-gray-300 transition"
              >
                Back
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="bg-green-600 text-white font-medium py-2 px-4 rounded-md hover:bg-green-700 transition"
              >
                Continue to Payment
              </button>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-medium text-gray-800">Payment Method</h3>
            <p className="text-sm text-gray-600">Add a payment method for faster checkout (optional)</p>
            
            <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
              <div className="flex items-center mb-4">
                <input
                  type="radio"
                  id="credit_card"
                  name="payment_method"
                  value="credit_card"
                  checked={formData.payment_method === 'credit_card'}
                  onChange={handleChange}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                />
                <label htmlFor="credit_card" className="ml-2 text-sm font-medium text-gray-700">Credit or Debit Card</label>
              </div>
              
              {formData.payment_method === 'credit_card' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                    <input
                      type="text"
                      name="card_number"
                      value={formData.card_number}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="1234 5678 9012 3456"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Expiration Date</label>
                      <input
                        type="text"
                        name="expiration_date"
                        value={formData.expiration_date}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="MM/YY"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                      <input
                        type="text"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="123"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
                    <input
                      type="text"
                      name="card_holder_name"
                      value={formData.card_holder_name}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="John Doe"
                    />
                  </div>
                </div>
              )}
              
              <div className="mt-4">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="paypal"
                    name="payment_method"
                    value="paypal"
                    checked={formData.payment_method === 'paypal'}
                    onChange={handleChange}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                  />
                  <label htmlFor="paypal" className="ml-2 text-sm font-medium text-gray-700">PayPal</label>
                </div>
              </div>
              
              <div className="mt-4">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="skip_payment"
                    name="payment_method"
                    value="skip"
                    checked={formData.payment_method === 'skip'}
                    onChange={handleChange}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                  />
                  <label htmlFor="skip_payment" className="ml-2 text-sm font-medium text-gray-700">Add payment method later</label>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={prevStep}
                className="bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-md hover:bg-gray-300 transition"
              >
                Back
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="bg-green-600 text-white font-medium py-2 px-4 rounded-md hover:bg-green-700 transition"
              >
                Continue to Preferences
              </button>
            </div>
          </div>
        );
      
      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-medium text-gray-800">Communication Preferences</h3>
            <p className="text-sm text-gray-600">Choose how you&apos;d like to hear from us</p>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="email_orders"
                  name="email_preferences.orders"
                  checked={formData.email_preferences.orders}
                  onChange={handleChange}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="email_orders" className="ml-2 text-sm text-gray-700">Order updates and shipping notifications</label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="email_marketing"
                  name="email_preferences.marketing"
                  checked={formData.email_preferences.marketing}
                  onChange={handleChange}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="email_marketing" className="ml-2 text-sm text-gray-700">Marketing emails and newsletters</label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="email_promotions"
                  name="email_preferences.promotions"
                  checked={formData.email_preferences.promotions}
                  onChange={handleChange}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="email_promotions" className="ml-2 text-sm text-gray-700">Special offers and promotions</label>
              </div>
            </div>
            
            <div className="pt-6">
              <h4 className="text-lg font-medium text-gray-800 mb-2">Ready to Finish!</h4>
              <p className="text-sm text-gray-600">
                Thank you for setting up your AgriLink account. Click the button below to complete your registration.
              </p>
            </div>
            
            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={prevStep}
                className="bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-md hover:bg-gray-300 transition"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="bg-green-600 text-white font-medium py-2 px-4 rounded-md hover:bg-green-700 transition"
              >
                {loading ? 'Processing...' : 'Complete Registration'}
              </button>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-8">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image src="/logo.png" alt="AgriLink Logo" width={60} height={60} />
        </div>
        
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-1">
            <span className="text-xs font-medium text-green-700">Step {step} of 4</span>
            <span className="text-xs font-medium text-green-700">{Math.round((step / 4) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all duration-300 ease-in-out" 
              style={{ width: `${(step / 4) * 100}%` }}
            ></div>
          </div></div>
        
        {/* Form Steps */}
        <form className="space-y-6">
          {renderStep()}
        </form>
      </div>
    </div>
  );
};

export default OnboardingForm;