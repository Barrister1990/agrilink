import useOrderStore from '@/store/orderStore';
import { ArrowLeft, CheckCircle, ChevronDown, ChevronUp, Clock, CreditCard, Download, Truck, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import SuperAdminLayout from '../layout';

export default function OrderDetailsPage() {
  const router = useRouter();
  const { id } = router.query;
  const { getOrderById, updatePaymentStatus } = useOrderStore();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedFarmers, setExpandedFarmers] = useState({});
  const [farmerGroups, setFarmerGroups] = useState([]);

  useEffect(() => {
    async function fetchOrderData() {
      if (id) {
        setLoading(true);
        // Fetch order details from Supabase using orderStore
        const orderData = await getOrderById(id);
        
        if (orderData) {
          setOrder(orderData);
          
          // Group items by seller/farmer
          const farmerItemGroups = groupItemsByFarmer(orderData.itemDetails || []);
          setFarmerGroups(farmerItemGroups);
        }
        
        setLoading(false);
      }
    }
    
    fetchOrderData();
  }, [id, getOrderById]);

  // Group order items by seller/farmer
  const groupItemsByFarmer = (items) => {
    // Group items by their seller/farmer
    const groupedItems = {};
    
    // In a real implementation, you'd use the farmer/seller ID from each product
    // For now, we'll extract that from product data or use a default
    items.forEach(item => {
      const farmerId = item.product?.farmer_id || 'unknown';
      const farmerName = item.product?.farmer_name || 'Unknown Farm';
      const farmerLocation = item.product?.farmer_location || 'Unknown Location';
      
      if (!groupedItems[farmerId]) {
        groupedItems[farmerId] = {
          farmer: {
            id: farmerId,
            name: farmerName,
            location: farmerLocation
          },
          items: [],
          subtotal: 0,
          shipmentStatus: determineShipmentStatus(order?.status),
          trackingNumber: `TRK${Math.floor(Math.random() * 900000) + 100000}`, // Would come from real tracking data
          paid: order?.paymentStatus === 'Paid'
        };
      }
      
      // Add item to the farmer's group
      groupedItems[farmerId].items.push({
        id: item.id,
        name: item.product?.name || 'Unknown Product',
        category: item.product?.category || 'Uncategorized',
        price: item.price,
        quantity: item.quantity,
        unit: item.product?.unit || 'item',
        subtotal: item.total
      });
      
      // Update farmer group subtotal
      groupedItems[farmerId].subtotal += parseFloat(item.total || 0);
    });
    
    // Convert the object to array and format subtotals
    return Object.values(groupedItems).map(group => ({
      ...group,
      subtotal: group.subtotal.toFixed(2)
    }));
  };

  // Determine shipment status based on order status
  const determineShipmentStatus = (orderStatus) => {
    switch (orderStatus) {
      case 'Delivered':
        return 'delivered';
      case 'Shipped':
        return 'shipped';
      default:
        return 'prepared';
    }
  };

  // Toggle farmer section expansion
  const toggleFarmerExpansion = (farmerId) => {
    setExpandedFarmers(prev => ({
      ...prev,
      [farmerId]: !prev[farmerId]
    }));
  };

  // Pay farmer
  const handlePayFarmer = async (farmerId) => {
    // First update the UI optimistically
    setFarmerGroups(prev => 
      prev.map(group => 
        group.farmer.id === farmerId 
          ? { ...group, paid: true } 
          : group
      )
    );
    
    // Then update the payment status in the database
    // In a real implementation, you might track payments per farmer
    if (order) {
      const allFarmersPaid = farmerGroups.every(group => 
        group.farmer.id === farmerId || group.paid
      );
      
      if (allFarmersPaid) {
        // Update the order's payment status if all farmers are now paid
        await updatePaymentStatus(order.id, 'Paid');
        
        // Update local order state
        setOrder(prev => ({
          ...prev,
          paymentStatus: 'Paid'
        }));
      }
    }
  };

  if (loading) {
    return (
      <SuperAdminLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-lg text-gray-600">Loading order details...</p>
        </div>
      </SuperAdminLayout>
    );
  }

  if (!order) {
    return (
      <SuperAdminLayout>
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-lg text-red-600">Order not found</p>
          <Link href="/super-admin/orders" className="mt-4 text-blue-500 hover:underline">
            Return to Orders
          </Link>
        </div>
      </SuperAdminLayout>
    );
  }

  // Calculate order totals
  const orderSubtotal = parseFloat((order.amount || '0').replace('$', ''));
  const shippingFee = parseFloat(order.shippingFee || 0);
  const tax = orderSubtotal * 0.08; // 8% tax (ideally this would come from the database)
  const orderTotal = orderSubtotal; // Already includes shipping and tax in the total amount

  // Safely create dates for order timeline
  const getFormattedDate = (baseDate, offsetDays = 0) => {
    try {
      // Ensure we have a valid date to start with
      const date = baseDate ? new Date(baseDate) : new Date();
      
      // Check if the created date is valid
      if (isNaN(date.getTime())) {
        return "Invalid date";
      }
      
      // Add days if needed
      if (offsetDays !== 0) {
        date.setDate(date.getDate() + offsetDays);
      }
      
      return date.toISOString().split('T')[0]; // YYYY-MM-DD format
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Date error";
    }
  };

  // Format time (hard-coded for demo, would come from actual timestamps in production)
  const getTimeString = (timeType) => {
    switch(timeType) {
      case "order": return "10:30 AM";
      case "shipped": return "2:15 PM";
      case "delivered": return "11:45 AM";
      default: return "12:00 PM";
    }
  };

  // Get order date
  const orderDate = order.date || "N/A";
  
  // Calculate shipped and delivered dates based on order status
  const shippedDate = order.status === 'Processing' ? null : getFormattedDate(orderDate, 1);
  const deliveredDate = order.status === 'Delivered' ? getFormattedDate(orderDate, 2) : null;

  return (
    <SuperAdminLayout>
      <div className="space-y-6 pb-8">
        {/* Header with back button */}
        <div className="flex items-center justify-between">
          <div>
            <Link 
              href="/super-admin/orders" 
              className="inline-flex items-center text-blue-600 hover:text-blue-800"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              <span>Back to Orders</span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-800 mt-2">Order Details: {order.id}</h1>
          </div>
          
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 inline-flex items-center">
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
          </div>
        </div>
        
        {/* Order summary and status */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Customer Information</h3>
                <p className="mt-2 text-gray-900 font-medium">{order.customer}</p>
                <p className="text-gray-600">{order.customerPhone || 'No phone provided'}</p>
                <p className="text-gray-600">{order.location}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Order Information</h3>
                <p className="mt-2 text-gray-900"><span className="font-medium">Date:</span> {orderDate}</p>
                <p className="text-gray-900"><span className="font-medium">Total:</span> {order.amount}</p>
                <p className="text-gray-900">
                  <span className="font-medium">Status:</span>
                  <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 
                      order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' : 
                      'bg-yellow-100 text-yellow-800'}`}
                  >
                    {order.status}
                  </span>
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Payment Information</h3>
                <p className="mt-2 text-gray-900"><span className="font-medium">Method:</span> {order.paymentMethod || 'Credit Card'}</p>
                <p className="text-gray-900">
                  <span className="font-medium">Status:</span>
                  <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${order.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' : 
                      'bg-yellow-100 text-yellow-800'}`}
                  >
                    {order.paymentStatus}
                  </span>
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Shipping Address</h3>
                <p className="mt-2 text-gray-900">{order.customer}</p>
                <p className="text-gray-600">{order.shippingAddress || '123 Main Street'}</p>
                <p className="text-gray-600">{order.location}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Order items by farmer */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Order Items</h2>
            
            {farmerGroups.length === 0 ? (
              <p className="text-gray-600">No items found for this order.</p>
            ) : (
              <div className="space-y-6">
                {farmerGroups.map((farmerGroup) => (
                  <div key={farmerGroup.farmer.id} className="border border-gray-200 rounded-lg">
                    {/* Farmer header - clickable to expand/collapse */}
                    <div 
                      className="p-4 bg-gray-50 rounded-t-lg flex items-center justify-between cursor-pointer"
                      onClick={() => toggleFarmerExpansion(farmerGroup.farmer.id)}
                    >
                      <div>
                        <h3 className="font-medium text-gray-800">{farmerGroup.farmer.name}</h3>
                        <p className="text-sm text-gray-600">{farmerGroup.farmer.location}</p>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        {/* Shipment status badge */}
                        <div className="flex items-center">
                          {farmerGroup.shipmentStatus === 'delivered' ? (
                            <div className="flex items-center text-green-600">
                              <CheckCircle className="h-5 w-5 mr-1" />
                              <span className="text-sm font-medium">Delivered</span>
                            </div>
                          ) : farmerGroup.shipmentStatus === 'shipped' ? (
                            <div className="flex items-center text-blue-600">
                              <Truck className="h-5 w-5 mr-1" />
                              <span className="text-sm font-medium">Shipped</span>
                            </div>
                          ) : (
                            <div className="flex items-center text-yellow-600">
                              <Clock className="h-5 w-5 mr-1" />
                              <span className="text-sm font-medium">Preparing</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Payment status */}
                        <div className="flex items-center">
                          {farmerGroup.paid ? (
                            <div className="flex items-center text-green-600">
                              <CreditCard className="h-5 w-5 mr-1" />
                              <span className="text-sm font-medium">Paid</span>
                            </div>
                          ) : (
                            <div className="flex items-center text-red-600">
                              <XCircle className="h-5 w-5 mr-1" />
                              <span className="text-sm font-medium">Unpaid</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Expand/collapse icon */}
                        {expandedFarmers[farmerGroup.farmer.id] ? (
                          <ChevronUp className="h-5 w-5 text-gray-500" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-500" />
                        )}
                      </div>
                    </div>
                    
                    {/* Farmer items - collapsible */}
                    {expandedFarmers[farmerGroup.farmer.id] && (
                      <div className="p-4 border-t border-gray-200">
                        {/* Tracking info if shipped */}
                        {farmerGroup.shipmentStatus !== 'prepared' && (
                          <div className="mb-4 p-2 bg-blue-50 rounded-md">
                            <div className="flex items-center text-blue-700">
                              <Truck className="h-4 w-4 mr-2" />
                              <p className="text-sm">
                                <span className="font-medium">Tracking Number:</span> {farmerGroup.trackingNumber}
                              </p>
                            </div>
                          </div>
                        )}
                        
                        {/* Items table */}
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Product
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Category
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Price
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Quantity
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Subtotal
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {farmerGroup.items.map((item) => (
                              <tr key={item.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {item.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {item.category}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  ${parseFloat(item.price).toFixed(2)}/{item.unit}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {item.quantity} {item.unit}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  ${parseFloat(item.subtotal).toFixed(2)}
                                </td>
                              </tr>
                            ))}
                            
                            {/* Farmer subtotal */}
                            <tr className="bg-gray-50">
                              <td colSpan="4" className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                                Subtotal:
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                ${farmerGroup.subtotal}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        
                        {/* Pay Farmer button - only show for delivered orders that aren't paid */}
                        {farmerGroup.shipmentStatus === 'delivered' && !farmerGroup.paid && (
                          <div className="mt-4 flex justify-end">
                            <button 
                              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                              onClick={() => handlePayFarmer(farmerGroup.farmer.id)}
                            >
                              Pay Farmer Now
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Order summary (totals) */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Order Summary</h2>
            
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${(orderSubtotal - shippingFee - tax).toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Shipping Fee</span>
                <span className="font-medium">${shippingFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Tax (8%)</span>
                <span className="font-medium">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-3 text-lg font-bold border-t border-gray-200 mt-2">
                <span>Total</span>
                <span>${orderSubtotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Order timeline */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Order Timeline</h2>
            
            <ol className="relative border-l border-gray-200 ml-3">
              <li className="mb-6 ml-6">
                <span className="absolute flex items-center justify-center w-6 h-6 bg-green-100 rounded-full -left-3 ring-8 ring-white">
                  <CheckCircle className="w-3 h-3 text-green-800" />
                </span>
                <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900">Order Placed</h3>
                <time className="block mb-2 text-sm font-normal leading-none text-gray-400">
                  {orderDate} at {getTimeString("order")}
                </time>
                <p className="mb-4 text-sm font-normal text-gray-500">Order was placed by the customer.</p>
              </li>
              
              {order.status !== 'Processing' && shippedDate && (
                <li className="mb-6 ml-6">
                  <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white">
                    <Truck className="w-3 h-3 text-blue-800" />
                  </span>
                  <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900">Order Shipped</h3>
                  <time className="block mb-2 text-sm font-normal leading-none text-gray-400">
                    {shippedDate} at {getTimeString("shipped")}
                  </time>
                  <p className="mb-4 text-sm font-normal text-gray-500">Order was shipped to the customer.</p>
                </li>
              )}
              
              {order.status === 'Delivered' && deliveredDate && (
                <li className="ml-6">
                  <span className="absolute flex items-center justify-center w-6 h-6 bg-green-100 rounded-full -left-3 ring-8 ring-white">
                    <CheckCircle className="w-3 h-3 text-green-800" />
                  </span>
                  <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900">Order Delivered</h3>
                  <time className="block mb-2 text-sm font-normal leading-none text-gray-400">
                    {deliveredDate} at {getTimeString("delivered")}
                  </time>
                  <p className="text-sm font-normal text-gray-500">Order was successfully delivered to the customer.</p>
                </li>
              )}
              
              {/* Notes section, if available */}
              {order.notes && (
                <li className="ml-6 mt-6">
                  <span className="absolute flex items-center justify-center w-6 h-6 bg-gray-100 rounded-full -left-3 ring-8 ring-white">
                    <p className="text-xs font-bold">i</p>
                  </span>
                  <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900">Order Notes</h3>
                  <p className="text-sm font-normal text-gray-500">{order.notes}</p>
                </li>
              )}
            </ol>
          </div>
        </div>
      </div>
    </SuperAdminLayout>
  );
}