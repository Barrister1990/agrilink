import { supabase } from '@/lib/supabaseClient';
import { useEffect, useState } from 'react';

const TopSellingProducts = () => {
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopSellingProducts = async () => {
      try {
        setLoading(true);
        
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          console.error('No user found');
          setLoading(false);
          return;
        }
        
        const userId = user.id;
        
        // First, get all order_items for this farmer
        const { data: orderItems, error: orderItemsError } = await supabase
          .from('order_items')
          .select('product_id, quantity, total')
          .eq('farmer_id', userId);
          
        if (orderItemsError) {
          console.error('Error fetching order items:', orderItemsError);
          return;
        }
        
        if (!orderItems || orderItems.length === 0) {
          setTopProducts([]);
          setLoading(false);
          return;
        }
        
        // Group by product_id and calculate sales
        const productSales = {};
        const productRevenue = {};
        
        orderItems.forEach(item => {
          if (!productSales[item.product_id]) {
            productSales[item.product_id] = 0;
            productRevenue[item.product_id] = 0;
          }
          productSales[item.product_id] += item.quantity || 1;
          productRevenue[item.product_id] += item.total || 0;
        });
        
        // Get unique product IDs
        const productIds = Object.keys(productSales);
        
        // Fetch product details for these products
        const { data: products, error: productsError } = await supabase
          .from('products')
          .select('id, name, image')
          .in('id', productIds);
          
        if (productsError) {
          console.error('Error fetching products:', productsError);
          return;
        }
        
        // Combine the data
        const productsWithSales = products.map(product => {
          return {
            id: product.id,
            name: product.name,
            sales: productSales[product.id] || 0,
            amount: `$${(productRevenue[product.id] || 0).toFixed(2)}`,
            // Use the first image from images array or a placeholder
            image: product.image
            
          };
        });
        
        // Sort by sales (highest first) and take top 4
        const sortedProducts = productsWithSales
          .sort((a, b) => b.sales - a.sales)
          .slice(0, 4);
          
        setTopProducts(sortedProducts);
      } catch (error) {
        console.error('Error in fetchTopSellingProducts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopSellingProducts();
  }, []);

  // Format currency amounts with commas for thousands
  const formatCurrency = (amount) => {
    const numericValue = parseFloat(amount.replace(/[^0-9.-]+/g, ''));
    return `$${numericValue.toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 0})}`;
  };

  return (
    <div>
      {loading ? (
        <div className="flex justify-center py-4">
          <span className="text-gray-500">Loading top products...</span>
        </div>
      ) : topProducts.length === 0 ? (
        <div className="text-center py-4 text-gray-500">
          No product sales data available.
        </div>
      ) : (
        topProducts.map((product) => (
          <div key={product.id} className="flex items-center py-3 border-b">
            <img
              src={product.image}
              alt={product.name}
              className="w-10 h-10 rounded object-cover"
             
            />
            <div className="ml-3 flex-1">
              <h4 className="text-sm font-medium">{product.name}</h4>
              <p className="text-xs text-gray-500">{product.sales} sold</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">{formatCurrency(product.amount)}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default TopSellingProducts;