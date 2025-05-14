import { supabase } from "@/lib/supabaseClient";
import { AlertCircle, ArrowLeft, Check, ChevronLeft, ChevronRight, LogIn, Package, ShoppingBag, Truck, X } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Orders = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("ongoing");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellingOrder, setCancellingOrder] = useState(false);
  const [cancelSuccess, setCancelSuccess] = useState(false);
  const [cancelError, setCancelError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  // Format the status for display
  const formatStatus = (status) => {
    const statusMap = {
      'pending': 'Order Placed',
      'confirmed': 'Order Confirmed',
      'processing': 'Waiting to be Shipped',
      'shipped': 'Shipped',
      'delivered': 'Delivered',
      'cancelled': 'Cancelled'
    };
    
    return statusMap[status.toLowerCase()] || status;
  };

  // Check authentication status and fetch orders
  useEffect(() => {
    const checkAuthAndFetchOrders = async () => {
      try {
        setLoading(true);
        
        // Get current user
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }
        
        setIsAuthenticated(true);
        
        // Fetch orders
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false });
          
        if (ordersError) throw ordersError;
        
        // For each order, fetch its items and products separately
        const ordersWithItems = await Promise.all(
          ordersData.map(async (order) => {
            // First get order items
            const { data: itemsData, error: itemsError } = await supabase
              .from('order_items')
              .select('id, quantity, price, total, product_id')
              .eq('order_id', order.id);
              
            if (itemsError) throw itemsError;
            
            // For each order item, fetch the product details separately
            const itemsWithProducts = await Promise.all(
              itemsData.map(async (item) => {
                // Query products table independently using product_id
                const { data: productData, error: productError } = await supabase
                  .from('products')
                  .select('id, name, image')
                  .eq('id', item.product_id)
                  .single();
                  
                if (productError) throw productError;
                
                // Combine item and product data
                return {
                  name: productData.name,
                  image: productData.image || "/api/placeholder/100/100",
                  quantity: item.quantity,
                  price: item.price.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'GHS'
                  }),
                  productId: productData.id
                };
              })
            );
            
            // Format the order data
            return {
              ...order,
              formattedStatus: formatStatus(order.status),
              date: new Date(order.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              }),
              items: itemsWithProducts,
              total: order.total_amount.toLocaleString('en-US', {
                style: 'currency',
                currency: 'GHS'
              })
            };
          })
        );
        
        setOrders(ordersWithItems);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to load orders. Please try again later.");
        setLoading(false);
      }
    };
    
    checkAuthAndFetchOrders();
  }, []);
  
  // Handle navigation to auth page
  const navigateToAuth = () => {
    router.push('/auth/signup');
  };

  // Render unauthenticated state
  const renderUnauthenticatedState = () => {
    return (
      <div className="max-w-md mx-auto text-center py-16 px-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <LogIn className="w-8 h-8 text-gray-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Sign in to view your orders</h2>
          <p className="text-gray-600 mb-6">
            Please log in or create an account to view your order history and track current orders.
          </p>
          <div className="flex flex-col space-y-3">
            <button
              onClick={navigateToAuth}
              className="w-full py-3 px-4 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => router.push('/auth/signup')}
              className="w-full py-3 px-4 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Create Account
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-6">
            Already have items in your cart? Your cart will be saved when you sign in.
          </p>
        </div>
      </div>
    );
  };
  
  // Filter orders based on active tab
  const filteredOrders = orders.filter(order => {
    if (activeTab === "ongoing") {
      return ["pending", "confirmed", "processing", "shipped", "delivered"].includes(order.status.toLowerCase());
    } else {
      return ["cancelled"].includes(order.status.toLowerCase());
    }
  });

  // Get current orders for pagination
  const indexOfLastOrder = currentPage * itemsPerPage;
  const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  
  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  // Go to next page
  const nextPage = () => {
    if (currentPage < Math.ceil(filteredOrders.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  // Go to previous page
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Function to get the first item image to display on the order card
  const getDisplayImage = (order) => {
    return order.items[0]?.image || "/api/placeholder/100/100";
  };
  
  // Function to get the status style
  const getStatusStyle = (status) => {
    const statusLower = status.toLowerCase();
    
    switch (statusLower) {
      case "delivered":
        return "bg-green-100 text-green-700 border border-green-300";
      case "shipped":
        return "bg-blue-100 text-blue-700 border border-blue-300";
      case "processing":
      case "waiting to be shipped":
      case "order confirmed":
        return "bg-yellow-100 text-yellow-700 border border-yellow-300";
      case "cancelled":
        return "bg-red-100 text-red-700 border border-red-300";
      case "order placed":
      case "pending":
        return "bg-purple-100 text-purple-700 border border-purple-300";
      default:
        return "bg-gray-100 text-gray-700 border border-gray-300";
    }
  };

  // Function to get the status icon
  const getStatusIcon = (status) => {
    const statusLower = status.toLowerCase();
    
    switch (statusLower) {
      case "delivered":
        return <Check className="w-4 h-4" />;
      case "shipped":
        return <Truck className="w-4 h-4" />;
      case "processing":
      case "waiting to be shipped":
      case "order confirmed":
        return <Package className="w-4 h-4" />;
      case "cancelled":
        return <X className="w-4 h-4" />;
      case "order placed":
      case "pending":
        return <ShoppingBag className="w-4 h-4" />;
      default:
        return null;
    }
  };

  // Function to close the order details modal
  const closeOrderDetails = () => {
    setSelectedOrder(null);
    setCancelSuccess(false);
    setCancelError(null);
  };
  
  // Function to check if an order can be cancelled
  const canCancelOrder = (order) => {
    const nonCancellableStatuses = ["shipped", "delivered", "cancelled"];
    return !nonCancellableStatuses.includes(order.status.toLowerCase());
  };
  
  // Function to cancel an order
  const handleCancelOrder = async (orderId) => {
    try {
      setCancellingOrder(true);
      setCancelError(null);
      
      // Update the order status in the database
      const { error } = await supabase
        .from('orders')
        .update({ status: 'cancelled' })
        .eq('id', orderId);
        
      if (error) throw error;
      
      // Update local state
      const updatedOrders = orders.map(order => {
        if (order.id === orderId) {
          return {
            ...order,
            status: 'cancelled',
            formattedStatus: 'Cancelled'
          };
        }
        return order;
      });
      
      setOrders(updatedOrders);
      
      // Update the selected order if it's currently open
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({
          ...selectedOrder,
          status: 'cancelled',
          formattedStatus: 'Cancelled'
        });
      }
      
      setCancelSuccess(true);
      setCancellingOrder(false);
    } catch (err) {
      console.error("Error cancelling order:", err);
      setCancelError("Failed to cancel order. Please try again.");
      setCancellingOrder(false);
    }
  };

  // Function to render order list based on active tab
  const renderOrders = () => {
    if (loading) {
      return (
        <div className="w-full py-12 flex justify-center">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-gray-200 h-12 w-12"></div>
            <div className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="w-full py-8 text-center">
          <p className="text-red-500">{error}</p>
          <button 
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      );
    }
    
    if (filteredOrders.length === 0) {
      return (
        <div className="w-full py-12 text-center">
          <p className="text-gray-500 text-lg">No {activeTab === "ongoing" ? "ongoing" : "cancelled"} orders found.</p>
        </div>
      );
    }
    
    return currentOrders.map((order) => (
      <div
        key={order.id}
        className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100"
      >
        <div className="flex items-start p-6">
          {/* Order Preview Image */}
          <div className="h-24 w-24 rounded-lg overflow-hidden flex-shrink-0 bg-gray-50">
            <img
              src={getDisplayImage(order)}
              alt="Order preview"
              className="w-full h-full object-cover"
            />
            {order.items.length > 1 && (
              <div className="relative -mt-6 ml-1 bg-white bg-opacity-90 px-2 py-1 rounded text-xs font-medium">
                +{order.items.length - 1} more
              </div>
            )}
          </div>

          {/* Order Details */}
          <div className="ml-5 flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Order #{order.id.slice(0, 8).toUpperCase()}</h3>
                <p className="text-sm text-gray-500 mt-1">{order.date}</p>
              </div>
              <span
                className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusStyle(order.formattedStatus)} flex items-center gap-1`}
              >
                {getStatusIcon(order.formattedStatus)}
                {order.formattedStatus}
              </span>
            </div>
            
            <div className="mt-3 flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">
                  {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                </p>
                <p className="text-lg font-bold text-gray-800 mt-1">{order.total}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {order.payment_method === 'Ondelivery' ? 'Pay on Delivery' : 'Paid online'}
                </p>
              </div>
              
              <button
                onClick={() => setSelectedOrder(order)}
                className="bg-green-50 text-green-700 border border-green-200 text-sm px-4 py-2 rounded-lg hover:bg-green-100 transition-colors duration-300 flex items-center gap-1 font-medium"
              >
                View Details
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    ));
  };

  // Calculate the counts for the tabs
  const ongoingCount = orders.filter(order => 
    ["pending", "confirmed", "processing", "shipped", "delivered"].includes(order.status.toLowerCase())
  ).length;
  
  const cancelledCount = orders.filter(order => 
    ["cancelled"].includes(order.status.toLowerCase())
  ).length;

  // Render pagination controls
  const renderPagination = () => {
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
    
    if (totalPages <= 1) {
      return null;
    }
    
    return (
      <div className="flex items-center justify-center mt-8 space-x-2">
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className={`p-2 rounded-md border ${
            currentPage === 1
              ? "text-gray-400 border-gray-200 cursor-not-allowed"
              : "text-gray-700 border-gray-300 hover:bg-gray-50"
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <div className="flex items-center space-x-1">
          {[...Array(totalPages)].map((_, index) => {
            const pageNumber = index + 1;
            const isActive = pageNumber === currentPage;
            
            // Show a limited set of page numbers with ellipsis
            if (
              pageNumber === 1 ||
              pageNumber === totalPages ||
              (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
            ) {
              return (
                <button
                  key={pageNumber}
                  onClick={() => paginate(pageNumber)}
                  className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium ${
                    isActive
                      ? "bg-green-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {pageNumber}
                </button>
              );
            } else if (
              (pageNumber === currentPage - 2 && currentPage > 3) ||
              (pageNumber === currentPage + 2 && currentPage < totalPages - 2)
            ) {
              return <span key={pageNumber} className="text-gray-500">...</span>;
            }
            
            return null;
          })}
        </div>
        
        <button
          onClick={nextPage}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-md border ${
            currentPage === totalPages
              ? "text-gray-400 border-gray-200 cursor-not-allowed"
              : "text-gray-700 border-gray-300 hover:bg-gray-50"
          }`}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    );
  };
  
  // Function to render the order progress tracker
  const renderOrderProgress = (status) => {
    const statusOrder = ["pending", "confirmed", "processing", "shipped", "delivered"];
    const statusLower = status.toLowerCase();
    
    // Return empty fragment if cancelled
    if (statusLower === "cancelled") {
      return null;
    }
    
    const currentStepIndex = statusOrder.indexOf(statusLower);
    
    return (
      <div className="my-6">
        <div className="relative">
          {/* Progress Bar */}
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2"></div>
          <div 
            className="absolute top-1/2 left-0 h-1 bg-green-500 -translate-y-1/2"
            style={{ width: `${Math.max(0, (currentStepIndex / (statusOrder.length - 1)) * 100)}%` }}
          ></div>
          
          {/* Status Steps */}
          <div className="relative flex justify-between">
            {statusOrder.map((step, index) => {
              const isActive = index <= currentStepIndex;
              const stepLabel = formatStatus(step);
              
              return (
                <div key={step} className="flex flex-col items-center">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center
                    ${isActive ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}
                  `}>
                    {isActive ? <Check className="w-5 h-5" /> : index + 1}
                  </div>
                  <span className={`
                    text-xs mt-2 text-center
                    ${isActive ? 'text-green-600 font-medium' : 'text-gray-500'}
                  `}>
                    {stepLabel}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1); // Reset to first page when changing tabs
  };

  // If authentication state is still being determined, show loading
  if (isAuthenticated === null) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex justify-center">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-gray-200 h-12 w-12"></div>
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If user is not authenticated, show sign-in prompt
  if (isAuthenticated === false) {
    return renderUnauthenticatedState();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Title */}
      <h2 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h2>

      {/* Tabs */}
      <div className="flex mb-8 bg-gray-50 p-1 rounded-lg">
        <button
          className={`flex-1 py-3 px-4 text-sm font-medium rounded-md transition-all duration-300 ${
            activeTab === "ongoing"
              ? "bg-white shadow-sm text-green-700"
              : "text-gray-600 hover:text-gray-800"
          }`}
          onClick={() => handleTabChange("ongoing")}
        >
          Ongoing & Delivered ({ongoingCount})
        </button>
        <button
          className={`flex-1 py-3 px-4 text-sm font-medium rounded-md transition-all duration-300 ${
            activeTab === "cancelled"
              ? "bg-white shadow-sm text-red-700"
              : "text-gray-600 hover:text-gray-800"
          }`}
          onClick={() => handleTabChange("cancelled")}
        >
          Cancelled & Returns ({cancelledCount})
        </button>
      </div>

      {/* Orders List */}
      <div className="grid grid-cols-1 gap-4">
        {renderOrders()}
      </div>
      
      {/* Pagination */}
      {renderPagination()}
      
      {/* Results Summary */}
      {!loading && !error && filteredOrders.length > 0 && (
        <div className="text-center text-sm text-gray-500 mt-4">
          Showing {indexOfFirstOrder + 1} to {Math.min(indexOfLastOrder, filteredOrders.length)} of {filteredOrders.length} orders
        </div>
      )}
      
      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm pb-10">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto pt-5">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 sticky top-2 bg-white z-10">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={closeOrderDetails}
                    className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <h3 className="text-xl font-bold text-gray-900">
                    Order #{selectedOrder.id.slice(0, 8).toUpperCase()}
                  </h3>
                </div>
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full flex items-center gap-1 ${getStatusStyle(selectedOrder.formattedStatus)}`}
                >
                  {getStatusIcon(selectedOrder.formattedStatus)}
                  {selectedOrder.formattedStatus}
                </span>
              </div>
            </div>
            
            <div className="p-6">
              {/* Cancel Success Message */}
              {cancelSuccess && (
                <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
                  <Check className="w-5 h-5" />
                  <p>Your order has been cancelled successfully.</p>
                </div>
              )}
              
              {/* Cancel Error Message */}
              {cancelError && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  <p>{cancelError}</p>
                </div>
              )}
              
              {/* Order Progress */}
              {renderOrderProgress(selectedOrder.status)}
              
              {/* Order Summary */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h4 className="font-semibold text-gray-800 mb-3">Order Summary</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Order Date</p>
                    <p className="font-medium">{selectedOrder.date}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Payment Method</p>
                    <p className="font-medium">
                      {selectedOrder.payment_method === 'Ondelivery' ? 'Pay on Delivery' : selectedOrder.payment_method}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Payment Status</p>
                    <p className={`font-medium ${selectedOrder.payment_status.toLowerCase() === 'paid' ? 'text-green-600' : 'text-orange-600'}`}>
                      {selectedOrder.payment_status}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Amount</p>
                    <p className="font-bold text-lg">{selectedOrder.total}</p>
                  </div>
                </div>
              </div>
              
              {/* Shipping Address */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h4 className="font-semibold text-gray-800 mb-2">Shipping Address</h4>
                <p className="text-gray-700">{selectedOrder.shipping_address}</p>
                {selectedOrder.notes && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-sm font-medium text-gray-700">Order Notes:</p>
                    <p className="text-gray-600 mt-1">{selectedOrder.notes}</p>
                  </div>
                )}
              </div>
              
              {/* Order Items */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
                <h4 className="font-semibold text-gray-800 px-4 py-3 border-b border-gray-200 bg-gray-50">
                  Items in Your Order ({selectedOrder.items.length})
                </h4>
                <div className="divide-y divide-gray-100">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex items-center p-4 hover:bg-gray-50 transition-colors">
                      <div className="h-16 w-16 rounded-md overflow-hidden bg-gray-50 border border-gray-200">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="ml-4 flex-1">
                        <h5 className="font-medium text-gray-900">{item.name}</h5>
                        <p className="text-sm text-gray-600 mt-1">
                          Qty: {item.quantity} × {item.price}
                        </p>
                      </div>
                      <div className="font-medium text-right">
                        {(parseFloat(item.price.replace(/[^0-9.-]+/g, '')) * item.quantity).toLocaleString('en-US', {
                          style: 'currency',
                          currency: 'GHS'
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 mt-8">
                <button
                  onClick={closeOrderDetails}
                  className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                
                {selectedOrder.formattedStatus === "Delivered" && (
                  <button
                    className="px-4 py-2 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    Buy Again
                  </button>
                )}
                
                {canCancelOrder(selectedOrder) && !cancelSuccess && (
                  <button
                    onClick={() => handleCancelOrder(selectedOrder.id)}
                    disabled={cancellingOrder}
                    className={`px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors ${
                      cancellingOrder ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {cancellingOrder ? "Cancelling..." : "Cancel Order"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;