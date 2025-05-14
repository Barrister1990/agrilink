import { supabase } from "@/lib/supabaseClient";
import useCartStore from "@/store/cartStore";
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon, CreditCardIcon, TruckIcon, UserIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast, { Toaster } from 'react-hot-toast';
import { v4 as uuidv4 } from "uuid";

// Shipping fee configuration based on region and proximity to Accra
const SHIPPING_FEES = {
  "greater-accra": 5.99,
  "central": 8.99,
  "eastern": 8.99,
  "western": 12.99,
  "ashanti": 15.99,
  "volta": 15.99,
  "bono": 18.99,
  "ahafo": 18.99,
  "bono-east": 18.99,
  "northern": 25.99,
  "upper-east": 28.99,
  "upper-west": 28.99,
  "north-east": 28.99,
  "savannah": 25.99,
  "oti": 20.99,
  "western-north": 18.99,
};

// Main checkout component
const CheckoutPage = () => {
  const { cart, clearCart } = useCartStore();

  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [loadingAddress, setLoadingAddress] = useState(true);
  const [hasDefaultAddress, setHasDefaultAddress] = useState(false);

  // Form state
  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    address: "",
    city: "",
    region: "",
    postalCode: "",
    additionalInfo: "",
    saveAddress: true
  });
  
  const [paymentMethod, setPaymentMethod] = useState("paystack");
  const [momoInfo, setMomoInfo] = useState({
    phoneNumber: "",
    provider: "mtn"
  });
  
  // Calculate order summary
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = shippingInfo.region ? SHIPPING_FEES[shippingInfo.region] || 15.99 : 0;
  const total = subtotal + shipping;
  
  // Fetch user's default address
  useEffect(() => {
    const fetchDefaultAddress = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      const user = session?.user;
      if (!user) return;
      
      try {
        setLoadingAddress(true);
        const { data, error } = await supabase
          .from('user_addresses')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_default', true)
          .single();
        
        if (error && error.code !== 'PGRST116') {
          console.error("Error fetching address:", error);
          return;
        }
        
        if (data) {
          setHasDefaultAddress(true);
          setShippingInfo({
            fullName: data.full_name || "",
            email: user.email || "",
            phoneNumber: data.phone_number || "",
            address: data.address_line1 || "",
            addressLine2: data.address_line2 || "",
            city: data.city || "",
            region: data.state || "",
            postalCode: data.postal_code || "",
            additionalInfo: "",
            saveAddress: false
          });
        } else {
          setHasDefaultAddress(false);
          setShippingInfo(prev => ({
            ...prev,
            email: user.email || ""
          }));
        }
      } catch (error) {
        console.error("Error fetching default address:", error);
      } finally {
        setLoadingAddress(false);
      }
    };
    
    fetchDefaultAddress();
  }, []);
  
  // Handle form updates
  const handleShippingChange = (e) => {
    const { name, value, type, checked } = e.target;
    setShippingInfo(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };
  
  const handleMomoChange = (e) => {
    const { name, value } = e.target;
    setMomoInfo(prev => ({ ...prev, [name]: value }));
  };
  
  // Proceed to next step
  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };
  
  // Go back to previous step
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  // Save shipping address to Supabase
  const saveAddressToSupabase = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;
    if (!user || !shippingInfo.saveAddress) return;

    try {
      // Check if there's already a default address
      if (hasDefaultAddress) {
        // Update existing default address
        const { error } = await supabase
          .from('user_addresses')
          .update({
            full_name: shippingInfo.fullName,
            phone_number: shippingInfo.phoneNumber,
            address_line1: shippingInfo.address,
            address_line2: shippingInfo.addressLine2 || null,
            city: shippingInfo.city,
            state: shippingInfo.region,
            postal_code: shippingInfo.postalCode || null,
            country: "Ghana",
            updated_at: new Date()
          })
          .eq('user_id', user.id)
          .eq('is_default', true);

        if (error) throw error;
      } else {
        // Insert new default address
        const { error } = await supabase
          .from('user_addresses')
          .insert({
            user_id: user.id,
            address_type: 'shipping',
            full_name: shippingInfo.fullName,
            phone_number: shippingInfo.phoneNumber,
            address_line1: shippingInfo.address,
            address_line2: shippingInfo.addressLine2 || null,
            city: shippingInfo.city,
            state: shippingInfo.region,
            postal_code: shippingInfo.postalCode || null,
            country: "Ghana",
            is_default: true
          });

        if (error) throw error;
      }
    } catch (error) {
      console.error("Error saving address:", error);
      toast.error("Failed to save address. Please try again.");
    }
  };

  // Reduce product stock in Supabase
  const reduceProductStock = async (orderItems) => {
    try {
      // For each item in the order, reduce the stock
      for (const item of orderItems) {
        // First get the current stock
        const { data: productData, error: fetchError } = await supabase
          .from('products')
          .select('stock_quantity')
          .eq('id', item.product_id)
          .single();
        
        if (fetchError) {
          console.error(`Error fetching product ${item.product_id}:`, fetchError);
          continue;
        }
        
        // Calculate new stock quantity
        const currentStock = productData.stock_quantity || 0;
        const newStock = Math.max(0, currentStock - item.quantity); // Ensure stock doesn't go below 0
        
        // Update the stock
        const { error: updateError } = await supabase
          .from('products')
          .update({ stock_quantity: newStock })
          .eq('id', item.product_id);
        
        if (updateError) {
          console.error(`Error updating stock for product ${item.product_id}:`, updateError);
        }
      }
      return true;
    } catch (error) {
      console.error("Error reducing product stock:", error);
      return false;
    }
  };

  // Save order to Supabase
  const saveOrderToSupabase = async (reference, paymentStatus = 'pending') => {
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;
    if (!user) return null;
    
    try {
      // Generate order ID
      const newOrderId = uuidv4();
      setOrderId(newOrderId);
      
      // Prepare order items
      const orderItems = cart.map(item => ({
        order_id: newOrderId,
        product_id: item.id,
        quantity: item.quantity,
        farmer_id: item.farmer_id,
        price: item.price,
        total: item.price * item.quantity
      }));
      
      // Create order
      const { error: orderError } = await supabase
        .from('orders')
        .insert({
          id: newOrderId,
          user_id: user.id,
          status: 'pending',
          shipping_address: `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.region}`,
          shipping_fee: shipping,
          total_amount: total,
          payment_method: paymentMethod,
          payment_status: paymentStatus,
          payment_reference: reference || null,
          notes: shippingInfo.additionalInfo || null
        });
        
      if (orderError) throw orderError;
      
      // Create order items
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);
        
      if (itemsError) throw itemsError;
      
      // Reduce stock for all ordered items
      await reduceProductStock(orderItems);
      
      return newOrderId;
    } catch (error) {
      console.error("Error saving order:", error);
      toast.error("Failed to save order. Please try again.");
      return null;
    }
  };

  // Process successful payment
  const processSuccessfulPayment = async (transaction) => {
    try {
      // Save address if requested
      await saveAddressToSupabase();
      
      // Save order to database with payment reference and completed status
      const orderId = await saveOrderToSupabase(transaction.reference, 'completed');
      
      if (orderId) {
        // Clear cart only after successful order creation
        clearCart();
        setOrderComplete(true);
        setCurrentStep(4);
        toast.success("Payment successful! Your order has been placed.");
      } else {
        toast.error("Failed to complete order. Please contact support.");
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      toast.error("Payment successful but order processing failed. Please contact support with reference: " + transaction.reference);
    } finally {
      setIsProcessing(false);
    }
  };

  // Initialize Paystack payment
  const initializePaystack = (channels = ['card']) => {
    // Validate form data before initiating payment
    if (!shippingInfo.fullName || !shippingInfo.phoneNumber || !shippingInfo.address || 
        !shippingInfo.city || !shippingInfo.region || !shippingInfo.email) {
      toast.error("Please fill all required fields");
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Make sure the Paystack script is loaded
      if (window.PaystackPop) {
        const paystackReference = `order_${Date.now()}`;
        
        // Configure the payment
        const paystackConfig = {
          key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
          email: shippingInfo.email,
          amount: Math.round(total * 100), // Convert to smallest currency unit (pesewas)
          currency: 'GHS',
          ref: paystackReference,
          channels: channels,
          
          // For mobile money, add these if needed
          ...(paymentMethod === 'momo' && {
            phone: momoInfo.phoneNumber,
            metadata: {
              custom_fields: [
                {
                  display_name: "Mobile Money Provider",
                  variable_name: "momo_provider",
                  value: momoInfo.provider
                }
              ]
            }
          }),
          
          callback: function(response) {
            // Process order only after successful payment
            processSuccessfulPayment({
              reference: response.reference,
              status: 'success',
              transaction: response.transaction,
              message: 'Payment complete!'
            });
          },
          onClose: function() {
            // Handle when user cancels
            toast.error("Payment cancelled. Your order has not been placed.");
            setIsProcessing(false);
          }
        };
        
        // Open Paystack popup
        const handler = window.PaystackPop.setup(paystackConfig);
        handler.openIframe();
      } else {
        toast.error("Payment system is not available. Please try again later.");
        setIsProcessing(false);
      }
    } catch (error) {
      console.error("Error initializing Paystack payment:", error);
      toast.error("Failed to initialize payment. Please try again.");
      setIsProcessing(false);
    }
  };

  const handlePaystackCardPayment = () => {
    initializePaystack(['card']);
  };

  const handlePaystackMomoPayment = () => {
    // Validate mobile money fields first
    if (!momoInfo.phoneNumber || !momoInfo.provider) {
      toast.error("Please enter your mobile money details");
      return;
    }
    
    initializePaystack(['mobile_money']);
  };
  
  const submitOrder = async (e) => {
    e.preventDefault();
    
    // Validate form data
    if (!shippingInfo.fullName || !shippingInfo.phoneNumber || !shippingInfo.address || 
        !shippingInfo.city || !shippingInfo.region || !shippingInfo.email) {
      toast.error("Please fill all required fields");
      return;
    }
    
    setIsProcessing(true);
    
    if (paymentMethod === 'paystack') {
      // Initiate Paystack card payment
      handlePaystackCardPayment();
    } else if (paymentMethod === 'momo') {
      // Initiate Paystack mobile money payment
      handlePaystackMomoPayment();
    } else if (paymentMethod === 'cod') {
      // Handle Cash on Delivery
      try {
        // Save address if requested
        await saveAddressToSupabase();
        
        // Save order with CoD and pending payment status
        const orderId = await saveOrderToSupabase(null, 'pending');
        
        if (orderId) {
          clearCart();
          setOrderComplete(true);
          setCurrentStep(4);
          toast.success("Order placed successfully! You'll pay when your order is delivered.");
        } else {
          toast.error("Failed to complete order. Please try again.");
        }
      } catch (error) {
        console.error("Error processing CoD order:", error);
        toast.error("Failed to process order. Please try again.");
      } finally {
        setIsProcessing(false);
      }
    }
  };
  
  // If cart is empty and order not complete, redirect to home
  useEffect(() => {
    if (cart.length === 0 && !orderComplete) {
      // You can add a redirect here
      // router.push('/');
    }
  }, [cart, orderComplete]);
  
  return (
    <div className="bg-gray-50 min-h-screen pb-12">
  
      <Toaster />
      {/* Checkout Steps */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Checkout</h1>
        
        {/* Progress Steps */}
        <div className="flex justify-between mb-8 relative">
          <div className="absolute top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 -z-10"></div>
          
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex flex-col items-center z-10">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step < currentStep ? "bg-green-500 text-white" : 
                  step === currentStep ? "bg-[#F68B1E] text-white" : 
                  "bg-white border-2 border-gray-300 text-gray-400"
                }`}
              >
                {step < currentStep ? (
                  <CheckIcon className="h-5 w-5" />
                ) : step === 1 ? (
                  <UserIcon className="h-5 w-5" />
                ) : step === 2 ? (
                  <TruckIcon className="h-5 w-5" />
                ) : step === 3 ? (
                  <CreditCardIcon className="h-5 w-5" />
                ) : (
                  <CheckIcon className="h-5 w-5" />
                )}
              </div>
              <span className={`text-xs mt-2 font-medium ${step === currentStep ? "text-[#F68B1E]" : "text-gray-500"}`}>
                {step === 1 ? "Shipping" : 
                 step === 2 ? "Delivery" : 
                 step === 3 ? "Payment" : "Confirmation"}
              </span>
            </div>
          ))}
        </div>
        
        {/* Main Checkout Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Form Steps */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {loadingAddress && currentStep === 1 && (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F68B1E]"></div>
                  <span className="ml-2 text-gray-600">Loading your address...</span>
                </div>
              )}
              
              {!loadingAddress && (
                <>
                  {/* Step 1: Shipping Information */}
                  {currentStep === 1 && (
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800 mb-4">Shipping Information</h2>
                      {hasDefaultAddress && (
                        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                          <p className="text-sm text-blue-700">
                            We&apos;ve pre-filled your default shipping address. You can update it below if needed.
                          </p>
                        </div>
                      )}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="col-span-2 md:col-span-1">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name*</label>
                          <input
                            type="text"
                            name="fullName"
                            value={shippingInfo.fullName}
                            onChange={handleShippingChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#F68B1E] focus:border-[#F68B1E]"
                            required
                          />
                        </div>
                        <div className="col-span-2 md:col-span-1">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number*</label>
                          <input
                            type="tel"
                            name="phoneNumber"
                            value={shippingInfo.phoneNumber}
                            onChange={handleShippingChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#F68B1E] focus:border-[#F68B1E]"
                            required
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address*</label>
                          <input
                            type="email"
                            name="email"
                            value={shippingInfo.email}
                            onChange={handleShippingChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#F68B1E] focus:border-[#F68B1E]"
                            required
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Address*</label>
                          <input
                            type="text"
                            name="address"
                            value={shippingInfo.address}
                            onChange={handleShippingChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#F68B1E] focus:border-[#F68B1E]"
                            required
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2 (Optional)</label>
                          <input
                            type="text"
                            name="addressLine2"
                            value={shippingInfo.addressLine2 || ""}
                            onChange={handleShippingChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#F68B1E] focus:border-[#F68B1E]"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">City*</label>
                          <input
                            type="text"
                            name="city"
                            value={shippingInfo.city}
                            onChange={handleShippingChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#F68B1E] focus:border-[#F68B1E]"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Region*</label>
                          <select
                            name="region"
                            value={shippingInfo.region}
                            onChange={handleShippingChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#F68B1E] focus:border-[#F68B1E]"
                            required
                          >
                            <option value="">Select Region</option>
                            <option value="greater-accra">Greater Accra</option>
                            <option value="ashanti">Ashanti</option>
                            <option value="eastern">Eastern</option>
                            <option value="western">Western</option>
                            <option value="central">Central</option>
                            <option value="northern">Northern</option>
                            <option value="upper-east">Upper East</option>
                            <option value="upper-west">Upper West</option>
                            <option value="volta">Volta</option>
                            <option value="bono">Bono</option>
                            <option value="ahafo">Ahafo</option>
                            <option value="bono-east">Bono East</option>
                            <option value="north-east">North East</option>
                            <option value="savannah">Savannah</option>
                            <option value="oti">Oti</option>
                            <option value="western-north">Western North</option>
                          </select>
                        </div>
                        <div className="col-span-2 md:col-span-1">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code (Optional)</label>
                          <input
                            type="text"
                            name="postalCode"
                            value={shippingInfo.postalCode || ""}
                            onChange={handleShippingChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#F68B1E] focus:border-[#F68B1E]"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Additional Information (Optional)</label>
                          <textarea
                            name="additionalInfo"
                            value={shippingInfo.additionalInfo}
                            onChange={handleShippingChange}
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#F68B1E] focus:border-[#F68B1E]"
                          />
                        </div>
                        
                          <div className="col-span-2">
                            <label className="flex items-center space-x-2 cursor-pointer">
                              <input
                                type="checkbox"
                                name="saveAddress"
                                checked={shippingInfo.saveAddress}
                                onChange={handleShippingChange}
                                className="rounded text-[#F68B1E] focus:ring-[#F68B1E]"
                              />
                              <span className="text-sm text-gray-700">Save this address as my default shipping address</span>
                            </label>
                          </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Step 2: Delivery Options */}
                  {currentStep === 2 && (
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800 mb-4">Delivery Options</h2>
                      <div className="space-y-4">
                        <div className="border border-gray-200 rounded-lg p-4 hover:border-[#F68B1E] cursor-pointer bg-orange-50">
                          <div className="flex items-start">
                            <div className="h-5 w-5 bg-[#F68B1E] rounded-full flex-shrink-0 mr-3 mt-0.5"></div>
                            <div>
                              <h3 className="font-medium text-gray-800">Standard Delivery (3-5 business days)</h3>
                              <p className="text-sm text-gray-500 mt-1">₵{shipping.toFixed(2)}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                Shipping fee based on your location: {shippingInfo.region ? shippingInfo.region.replace('-', ' ') : 'Not specified'}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 cursor-pointer opacity-50">
                          <div className="flex items-start">
                            <div className="h-5 w-5 border border-gray-300 rounded-full flex-shrink-0 mr-3 mt-0.5"></div>
                            <div>
                              <h3 className="font-medium text-gray-800">Express Delivery (1-2 business days)</h3>
                              <p className="text-sm text-gray-500 mt-1">₵{(shipping * 2).toFixed(2)}</p>
                              <p className="text-xs text-gray-500 mt-1">Currently unavailable for your location</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 cursor-pointer opacity-50">
                          <div className="flex items-start">
                            <div className="h-5 w-5 border border-gray-300 rounded-full flex-shrink-0 mr-3 mt-0.5"></div>
                            <div>
                              <h3 className="font-medium text-gray-800">Store Pickup (Free)</h3>
                              <p className="text-sm text-gray-500 mt-1">Available only for Greater Accra region</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-6">
                          <h3 className="font-medium text-gray-800 mb-2">Delivery Address</h3>
                          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                            <p className="font-medium">{shippingInfo.fullName}</p>
                            <p className="text-gray-700">{shippingInfo.address}</p>
                            {shippingInfo.addressLine2 && <p className="text-gray-700">{shippingInfo.addressLine2}</p>}
                            <p className="text-gray-700">{shippingInfo.city}, {shippingInfo.region?.replace('-', ' ')}</p>
                            {shippingInfo.postalCode && <p className="text-gray-700">Postal Code: {shippingInfo.postalCode}</p>}
                            <p className="text-gray-700">{shippingInfo.phoneNumber}</p>
                            <p className="text-gray-700">{shippingInfo.email}</p>
                            {shippingInfo.additionalInfo && (
                              <p className="text-gray-500 mt-1">Note: {shippingInfo.additionalInfo}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  
{/* Step 3: Payment */}
{currentStep === 3 && (
  <div>
    <h2 className="text-xl font-semibold text-gray-800 mb-4">Payment Method</h2>
    <div className="space-y-4">
      {/* Payment with Card */}
      <div 
        className={`border rounded-lg p-4 cursor-pointer ${paymentMethod === 'paystack' ? 'border-[#F68B1E] bg-orange-50' : 'border-gray-200 hover:border-gray-300'}`}
        onClick={() => setPaymentMethod('paystack')}
      >
        <div className="flex items-start">
          <div className={`h-5 w-5 rounded-full flex-shrink-0 mr-3 mt-0.5 ${paymentMethod === 'paystack' ? 'bg-[#F68B1E]' : 'border border-gray-300'}`}></div>
          <div>
            <h3 className="font-medium text-gray-800">Pay with Card</h3>
            <p className="text-sm text-gray-500 mt-1">Secure payment via Paystack</p>
            <div className="flex space-x-2 mt-2">
              <img src="/visa.png" alt="Visa" className="h-6" />
              <img src="/mastercard.jpeg" alt="Mastercard" className="h-6" />
              <img src="/verve.png" alt="Verve" className="h-6" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Money */}
      <div 
        className={`border rounded-lg p-4 cursor-pointer ${paymentMethod === 'momo' ? 'border-[#F68B1E] bg-orange-50' : 'border-gray-200 hover:border-gray-300'}`}
        onClick={() => setPaymentMethod('momo')}
      >
        <div className="flex items-start">
          <div className={`h-5 w-5 rounded-full flex-shrink-0 mr-3 mt-0.5 ${paymentMethod === 'momo' ? 'bg-[#F68B1E]' : 'border border-gray-300'}`}></div>
          <div className="w-full">
            <h3 className="font-medium text-gray-800">Mobile Money</h3>
            <p className="text-sm text-gray-500 mt-1">Pay with MTN, Vodafone or AirtelTigo mobile money</p>
            
            {paymentMethod === 'momo' && (
              <div className="mt-3 space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Provider</label>
                  <select
                    name="provider"
                    value={momoInfo.provider}
                    onChange={handleMomoChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#F68B1E] focus:border-[#F68B1E]"
                  >
                    <option value="mtn">MTN Mobile Money</option>
                    <option value="vodafone">Vodafone Cash</option>
                    <option value="airtel">AirtelTigo Money</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Money Number</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={momoInfo.phoneNumber}
                    onChange={handleMomoChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#F68B1E] focus:border-[#F68B1E]"
                    placeholder="e.g. 024xxxxxxx"
                  />
                </div>
              </div>
            )}
            
            <div className="flex space-x-2 mt-2">
              <img src="/mtn-momo.png" alt="MTN Mobile Money" className="h-6" />
              <img src="/vodafone-cash.png" alt="Vodafone Cash" className="h-6" />
              <img src="/airteltigo-money.jpeg" alt="AirtelTigo Money" className="h-6" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Cash on Delivery */}
      <div 
        className={`border rounded-lg p-4 cursor-pointer ${paymentMethod === 'cod' ? 'border-[#F68B1E] bg-orange-50' : 'border-gray-200 hover:border-gray-300'}`}
        onClick={() => setPaymentMethod('cod')}
      >
        <div className="flex items-start">
          <div className={`h-5 w-5 rounded-full flex-shrink-0 mr-3 mt-0.5 ${paymentMethod === 'cod' ? 'bg-[#F68B1E]' : 'border border-gray-300'}`}></div>
          <div>
            <h3 className="font-medium text-gray-800">Cash on Delivery</h3>
            <p className="text-sm text-gray-500 mt-1">Pay with cash when your order is delivered</p>
            <p className="text-xs text-yellow-600 mt-2">Note: Available only in select areas of Greater Accra and Kumasi</p>
          </div>
        </div>
      </div>
    </div>
  </div>
)}

{/* Step 4: Order Confirmation */}
{currentStep === 4 && orderComplete && (
  <div className="text-center py-8">
    <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
      <CheckIcon className="h-8 w-8 text-green-500" />
    </div>
    <h2 className="text-2xl font-bold text-gray-800 mb-2">Thank You For Your Order!</h2>
    <p className="text-gray-600 mb-6">Your order has been placed successfully.</p>
    
    <div className="bg-gray-50 rounded-lg p-4 max-w-md mx-auto mb-6">
      <p className="text-sm font-medium text-gray-700">Order ID: <span className="text-gray-900">{orderId}</span></p>
      <p className="text-sm text-gray-600 mt-1">
        A confirmation email has been sent to <span className="font-medium">{shippingInfo.email}</span>
      </p>
    </div>
    
    <div className="space-y-4">
      <Link href="/orders" className="inline-block bg-[#F68B1E] text-white px-6 py-2 rounded-md font-medium hover:bg-[#e67e12] transition-colors">
        Track Your Order
      </Link>
      <div>
        <Link href="/" className="text-[#F68B1E] hover:underline font-medium">
          Continue Shopping
        </Link>
      </div>
    </div>
  </div>
)}
                </>
              )}
              
              {/* Navigation Buttons */}
              {!orderComplete && !loadingAddress && currentStep < 4 && (
                <div className="mt-8 flex justify-between">
                  {currentStep > 1 && (
                    <button
                      onClick={prevStep}
                      className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50"
                    >
                      <ArrowLeftIcon className="h-4 w-4 mr-2" /> Back
                    </button>
                  )}
                  
                  {currentStep < 3 && (
                    <button
                      onClick={nextStep}
                      className={`ml-auto flex items-center px-6 py-2 bg-[#F68B1E] text-white rounded-md font-medium hover:bg-[#e67e12] ${
                        (currentStep === 1 && (!shippingInfo.fullName || !shippingInfo.phoneNumber || !shippingInfo.address || !shippingInfo.city || !shippingInfo.region || !shippingInfo.email)) ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      disabled={currentStep === 1 && (!shippingInfo.fullName || !shippingInfo.phoneNumber || !shippingInfo.address || !shippingInfo.city || !shippingInfo.region || !shippingInfo.email)}
                    >
                      Next <ArrowRightIcon className="h-4 w-4 ml-2" />
                    </button>
                  )}
                  
                  {currentStep === 3 && (
                    <button
                      onClick={submitOrder}
                      className="ml-auto px-6 py-2 bg-[#F68B1E] text-white rounded-md font-medium hover:bg-[#e67e12] flex items-center"
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Processing...
                        </>
                      ) : (
                        <>Place Order (₵{total.toFixed(2)})</>
                      )}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Right Column - Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>
              
              {/* Cart Items */}
              <div className="space-y-3 mb-6 max-h-60 overflow-y-auto pr-2">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3 pb-3 border-b border-gray-100">
                    <div className="h-14 w-14 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                      {item.image && (
                        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-800 truncate">{item.name}</h4>
                      <p className="text-xs text-gray-500">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-sm font-medium text-gray-800">
                      ₵{(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Price Summary */}
              <div className="space-y-2 pb-4 border-b border-gray-200">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₵{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>₵{shipping.toFixed(2)}</span>
                </div>
              </div>
              
              {/* Total */}
              <div className="flex justify-between font-semibold text-lg text-gray-800 mt-4">
                <span>Total</span>
                <span>₵{total.toFixed(2)}</span>
              </div>
              
              {/* Secure Checkout Message */}
              <div className="mt-6 text-xs text-gray-500 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Secure Checkout Powered by Paystack
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;