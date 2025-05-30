import { supabase } from "@/lib/supabaseClient";
import useCartStore from "@/store/cartStore";
import { ArrowRightIcon, MinusIcon, PlusIcon, ShoppingBagIcon, SparklesIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const CartModal = ({ isOpen, onClose }) => {
  const { cart, increaseQuantity, decreaseQuantity, removeFromCart } = useCartStore();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [animateItems, setAnimateItems] = useState({});
  const router = useRouter();

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 0 ? 5.99 : 0;
  const total = subtotal + shipping;

  // Check if user is authenticated
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        setIsLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        setIsAuthenticated(!!session);
      } catch (error) {
        console.error("Error checking auth status:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Handle checkout button click
  const handleCheckoutClick = () => {
    if (!isAuthenticated) {
      router.push("/auth/signup");
      onClose();
    } else {
      router.push("/checkout");
      onClose();
    }
  };

  // Animate quantity changes
  const handleQuantityChange = (itemId, action) => {
    setAnimateItems(prev => ({ ...prev, [itemId]: true }));
    setTimeout(() => {
      setAnimateItems(prev => ({ ...prev, [itemId]: false }));
    }, 200);
    
    if (action === 'increase') {
      increaseQuantity(itemId);
    } else {
      decreaseQuantity(itemId);
    }
  };

  // Close on escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay with glassmorphism effect */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-md z-[150] transition-all duration-500 ease-out"
        onClick={onClose}
      ></div>
      
      {/* Modal with slide-in animation */}
      <div className={`fixed top-0 right-0 w-full sm:w-[420px] h-full bg-white/95 backdrop-blur-xl shadow-2xl z-[200] transform transition-all duration-500 ease-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Gradient Header */}
        <div className="relative bg-gradient-to-r from-[#F68B1E] via-orange-500 to-orange-600 p-6 shadow-lg">
          {/* Background pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
          
          <div className="relative flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl mr-4 shadow-lg">
                <ShoppingBagIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Shopping Cart</h2>
                <p className="text-white/80 text-sm">{cart.length} {cart.length === 1 ? 'item' : 'items'}</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-200 group"
            >
              <XMarkIcon className="h-5 w-5 text-white group-hover:rotate-90 transition-transform duration-200" />
            </button>
          </div>
        </div>
        
        {/* Cart Items */}
        <div className="flex-grow overflow-y-auto">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <div className="relative mb-8">
                <div className="bg-gradient-to-br from-orange-100 to-orange-200 p-8 rounded-3xl shadow-lg">
                  <ShoppingBagIcon className="h-16 w-16 text-[#F68B1E] mx-auto" />
                </div>
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-400 p-2 rounded-full shadow-lg animate-bounce">
                  <SparklesIcon className="h-4 w-4 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Your cart is empty</h3>
              <p className="text-gray-500 mb-8 max-w-sm leading-relaxed">Discover amazing fresh produce and add them to your cart to get started!</p>
              <button 
                onClick={onClose}
                className="group px-8 py-4 bg-gradient-to-r from-[#F68B1E] to-orange-600 text-white rounded-2xl hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center font-semibold"
              >
                <span>Start Shopping</span>
                <ArrowRightIcon className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </div>
          ) : (
            <div className="p-6 space-y-4">
              {cart.map((item, index) => (
                <div 
                  key={item.id} 
                  className={`group bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg hover:shadow-xl border border-gray-100/50 transition-all duration-300 hover:scale-[1.02] ${animateItems[item.id] ? 'animate-pulse' : ''}`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center gap-4">
                    {/* Product Image with overlay effects */}
                    <div className="relative w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden flex-shrink-0 shadow-md">
                      {item.image ? (
                        <>
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300" 
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                          No image
                        </div>
                      )}
                    </div>
                    
                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-800 truncate mb-1">{item.name}</h3>
                      <p className="text-xs text-gray-500 mb-3">{item.weight || '1 kg'}</p>
                      
                      <div className="flex items-center justify-between">
                        {/* Quantity Controls */}
                        <div className="flex items-center bg-gray-50/80 backdrop-blur-sm rounded-full border border-gray-200/50 overflow-hidden shadow-sm">
                          <button 
                            onClick={() => handleQuantityChange(item.id, 'decrease')}
                            className="p-2 hover:bg-red-50 hover:text-red-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={item.quantity <= 1}
                          >
                            <MinusIcon className="h-4 w-4" />
                          </button>
                          <div className="px-4 py-2 bg-white/60 backdrop-blur-sm">
                            <span className="text-sm font-bold text-gray-800">{item.quantity}</span>
                          </div>
                          <button 
                            onClick={() => handleQuantityChange(item.id, 'increase')}
                            className="p-2 hover:bg-green-50 hover:text-green-600 transition-colors duration-200"
                          >
                            <PlusIcon className="h-4 w-4" />
                          </button>
                        </div>
                        
                        {/* Price */}
                        <div className="text-right">
                          <span className="text-lg font-bold bg-gradient-to-r from-[#F68B1E] to-orange-600 bg-clip-text text-transparent">
                            ₵{(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Remove Button */}
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 hover:bg-red-50 rounded-full transition-all duration-200 group/remove opacity-60 hover:opacity-100"
                    >
                      <TrashIcon className="h-5 w-5 text-gray-400 group-hover/remove:text-red-500 group-hover/remove:scale-110 transition-all duration-200" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Order Summary - Glassmorphism design */}
        {cart.length > 0 && (
          <div className="bg-gradient-to-r from-gray-50/90 to-white/90 backdrop-blur-xl border-t border-gray-200/50 p-6 mt-auto shadow-2xl">
            {/* Price Breakdown */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 mb-6 shadow-lg border border-gray-100/50">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold text-gray-800">₵{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 flex items-center">
                    Delivery
                    <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">Fast</span>
                  </span>
                  <span className="font-semibold text-gray-800">₵{shipping.toFixed(2)}</span>
                </div>
                <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                <div className="flex justify-between text-lg pt-1">
                  <span className="font-bold text-gray-800">Total</span>
                  <span className="font-bold text-2xl bg-gradient-to-r from-[#F68B1E] to-orange-600 bg-clip-text text-transparent">
                    ₵{total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Authentication Notice */}
            {!isAuthenticated && !isLoading && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 text-blue-700 p-4 rounded-2xl text-sm mb-4 shadow-sm">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 animate-pulse"></div>
                  Please sign in to complete your purchase
                </div>
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="space-y-3">
              <button 
                onClick={handleCheckoutClick}
                className={`group relative w-full py-4 rounded-2xl text-center font-bold text-lg transition-all duration-300 overflow-hidden ${
                  isLoading 
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                    : "bg-gradient-to-r from-[#F68B1E] via-orange-500 to-orange-600 text-white hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]"
                }`}
                disabled={isLoading}
              >
                {/* Animated background */}
                {!isLoading && (
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-600 via-orange-500 to-[#F68B1E] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                )}
                
                <span className="relative flex items-center justify-center">
                  {isLoading ? (
                    "Loading..."
                  ) : (
                    <>
                      {isAuthenticated ? "Proceed to Checkout" : "Sign in to Checkout"}
                      <ArrowRightIcon className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                    </>
                  )}
                </span>
              </button>
              
              <button 
                onClick={onClose}
                className="w-full py-3 text-[#F68B1E] bg-white/80 backdrop-blur-sm border-2 border-orange-200/50 rounded-2xl text-center font-semibold hover:bg-orange-50 hover:border-orange-300 transition-all duration-300 hover:scale-[1.02]"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartModal;