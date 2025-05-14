import useCartStore from "@/store/cartStore";
import { ArrowRightIcon, MinusIcon, PlusIcon, ShoppingBagIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useEffect } from "react";

const CartModal = ({ isOpen, onClose }) => {
  const { cart, increaseQuantity, decreaseQuantity, removeFromCart } = useCartStore();

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 0 ? 5.99 : 0;
  const total = subtotal + shipping;

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
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[150] transition-opacity duration-300"
        onClick={onClose}
      ></div>
      
      {/* Modal */}
      <div className="fixed top-0 right-0 w-full sm:w-96 h-full bg-white shadow-xl z-[200] transform transition-transform duration-300 ease-in-out flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center">
            <ShoppingBagIcon className="h-5 w-5 mr-2 text-[#F68B1E]" />
            Your Cart {cart.length > 0 && `(${cart.length})`}
          </h2>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 transition"
          >
            <XMarkIcon className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        
        {/* Cart Items - Using flex-grow instead of fixed height */}
        <div className="flex-grow overflow-y-auto pb-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <div className="bg-orange-100 p-4 rounded-full mb-4">
                <ShoppingBagIcon className="h-12 w-12 text-[#F68B1E]" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Your cart is empty</h3>
              <p className="text-gray-500 mb-6">Looks like you haven&apos;t added any items to your cart yet.</p>
              <button 
                onClick={onClose}
                className="px-6 py-2.5 bg-[#F68B1E] text-white rounded-full hover:bg-orange-600 transition flex items-center"
              >
                Start Shopping
                <ArrowRightIcon className="h-4 w-4 ml-2" />
              </button>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition">
                  {/* Product Image */}
                  <div className="relative w-20 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                    {item.image ? (
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="object-cover w-full h-full" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No image
                      </div>
                    )}
                  </div>
                  
                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-800 truncate">{item.name}</h3>
                    <p className="text-xs text-gray-500">{item.weight || '1 kg'}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-gray-200 rounded-full">
                        <button 
                          onClick={() => decreaseQuantity(item.id)}
                          className="p-1 hover:bg-gray-100 rounded-l-full transition"
                          disabled={item.quantity <= 1}
                        >
                          <MinusIcon className="h-4 w-4 text-gray-500" />
                        </button>
                        <span className="px-3 text-sm font-medium">{item.quantity}</span>
                        <button 
                          onClick={() => increaseQuantity(item.id)}
                          className="p-1 hover:bg-gray-100 rounded-r-full transition"
                        >
                          <PlusIcon className="h-4 w-4 text-gray-500" />
                        </button>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                  
                  {/* Remove Button */}
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="p-1 hover:bg-gray-100 rounded-full transition"
                  >
                    <XMarkIcon className="h-5 w-5 text-gray-400 hover:text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Order Summary - No longer relying on absolute positioning */}
        {cart.length > 0 && (
          <div className="border-t border-gray-100 bg-gray-50 p-4 space-y-4 mt-auto">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium">₵{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Shipping</span>
                <span className="font-medium">₵{shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base pt-2 border-t border-dashed border-gray-200">
                <span className="font-medium text-gray-800">Total</span>
                <span className="font-semibold text-[#F68B1E]">₵{total.toFixed(2)}</span>
              </div>
            </div>
            
            {/* Checkout Buttons */}
            <div className="space-y-2">
              <Link 
                href="/checkout" 
                className="block w-full py-3 bg-[#F68B1E] text-white rounded-full text-center font-medium hover:bg-orange-600 transition"
                onClick={onClose}
              >
                Proceed to Checkout
              </Link>
              <button 
                onClick={onClose}
                className="block w-full py-2.5 text-[#F68B1E] bg-white border border-[#F68B1E] rounded-full text-center font-medium hover:bg-orange-50 transition"
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