import ProductReviews from "@/components/ProductReviews";
import useCartStore from "@/store/cartStore";
import useProductStore from "@/store/useProductStore";
import { CreditCard, RefreshCw, ShieldCheck, Star, Truck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const ProductDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  
  const { getProductById, products, fetchAllProducts } = useProductStore();
  const { addToCart, increaseQuantity, decreaseQuantity } = useCartStore();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [activeTab, setActiveTab] = useState("description");
  const [similarProducts, setSimilarProducts] = useState([]);
  
  // Additional product images (assuming we would have multiple images per product)
  const [productImages, setProductImages] = useState([]);

  // Function to find similar products based on name similarity
  const findSimilarProducts = (currentProduct, allProducts, maxProducts = 5) => {
    if (!currentProduct || !allProducts.length) return [];
    
    // Filter out the current product and find products with similar names
    const filtered = allProducts
      .filter(p => p.id !== currentProduct.id)
      .map(p => {
        // Count matching characters (case insensitive)
        const currentName = currentProduct.name.toLowerCase();
        const compareName = p.name.toLowerCase();
        
        // Check for similarity - at least 5 matching characters in sequence
        let maxMatchLength = 0;
        let currentMatchLength = 0;
        
        for (let i = 0; i < currentName.length; i++) {
          for (let j = 0; j < compareName.length; j++) {
            currentMatchLength = 0;
            
            while (
              i + currentMatchLength < currentName.length &&
              j + currentMatchLength < compareName.length &&
              currentName[i + currentMatchLength] === compareName[j + currentMatchLength]
            ) {
              currentMatchLength++;
            }
            
            if (currentMatchLength > maxMatchLength) {
              maxMatchLength = currentMatchLength;
            }
          }
        }
        
        return {
          ...p,
          similarityScore: maxMatchLength
        };
      })
      .filter(p => p.similarityScore >= 2) // Filter products with at least 5 matching characters
      .sort((a, b) => b.similarityScore - a.similarityScore) // Sort by similarity score (highest first)
      .slice(0, maxProducts); // Take only the top matches
      
    return filtered;
  };

  useEffect(() => {
    if (id) {
      setLoading(true);

      const fetchData = async () => {
        // If products array is empty, fetch them first
        if (products.length === 0) {
          await fetchAllProducts();
        }

        // Now get the product
        const fetchedProduct = getProductById(id);
        
        if (fetchedProduct) {
          setProduct(fetchedProduct);
          
          // Find similar products
          const similar = findSimilarProducts(fetchedProduct, products);
          setSimilarProducts(similar);

          // For demo purposes, we'll create multiple images
          if (fetchedProduct?.image) {
            setProductImages([
              fetchedProduct.image,
              fetchedProduct.image, // Duplicating for demo
              fetchedProduct.image, // Duplicating for demo
            ]);
          }
        }

        setLoading(false);
      };

      fetchData();
    }
  }, [id, getProductById, fetchAllProducts, products]);

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        ...product,
        quantity: 1
      });
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/checkout");
  };

  // Handlers for quantity controls
  const handleIncreaseQuantity = () => {
    if (product) {
      increaseQuantity(product.id);
    }
  };

  const handleDecreaseQuantity = () => {
    if (product) {
      decreaseQuantity(product.id);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-700"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Product Not Found</h2>
        <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
        <Link href="/all-products" className="bg-green-700 text-white px-6 py-2 rounded-md hover:bg-green-800 transition">
          Back to All Products
        </Link>
      </div>
    );
  }

  const discountPercentage = product.discount || 0;
  const savedAmount = ((product.originalPrice - product.price) || 0).toFixed(2);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pt-24">
      {/* Breadcrumb Navigation */}
      <nav className="text-sm mb-6">
        <ol className="list-none p-0 flex flex-wrap">
          <li className="flex items-center">
            <Link href="/" className="text-green-700 hover:text-green-900">Home</Link>
            <span className="mx-2 text-gray-500">/</span>
          </li>
          <li className="flex items-center">
            <Link href="/all-products" className="text-green-700 hover:text-green-900">All Products</Link>
            <span className="mx-2 text-gray-500">/</span>
          </li>
          <li className="text-gray-500 truncate">{product.name}</li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Left Column - Product Images */}
        <div className="">
          {/* Main Product Image */}
          <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden bg-white">
            <Swiper
              spaceBetween={10}
              navigation={true}
              thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
              modules={[FreeMode, Navigation, Thumbs]}
              className="h-96"
            >
              {productImages.map((image, index) => (
                <SwiperSlide key={index}>
                  <div className="flex items-center justify-center h-full">
                    <img 
                      src={image} 
                      alt={`${product.name} - View ${index + 1}`} 
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Thumbnail Images */}
          <Swiper
            onSwiper={setThumbsSwiper}
            spaceBetween={10}
            slidesPerView={4}
            freeMode={true}
            watchSlidesProgress={true}
            modules={[FreeMode, Navigation, Thumbs]}
            className="thumbs-gallery"
          >
            {productImages.map((image, index) => (
              <SwiperSlide key={index}>
                <div className="cursor-pointer border border-gray-200 rounded-md overflow-hidden hover:border-green-500 h-20">
                  <img 
                    src={image} 
                    alt={`Thumbnail ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Product Sharing and Watch */}
          <div className="flex justify-between items-center mt-4">
            <div className="flex space-x-3">
              <button className="text-gray-500 hover:text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </button>
              <button className="text-gray-500 hover:text-red-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>
            <div className="text-sm text-gray-500">
              <span className="text-green-700 font-medium">✓</span> 230+ sold in last 24 hours
            </div>
          </div>
        </div>

        {/* Right Column - Product Information */}
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-2">{product.name}</h1>
          
          {/* Ratings & Reviews */}
          <div className="flex items-center mb-4">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  className="h-5 w-5" 
                  fill={star <= 4 ? "#FFD700" : "none"} 
                  stroke={star <= 4 ? "#FFD700" : "#6B7280"} 
                />
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-600">4.8 (126 reviews)</span>
            <span className="mx-2 text-gray-300">|</span>
            <span className="text-sm text-green-700">{product.totalUsers || 527} orders</span>
          </div>
          
          {/* Price Information */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="flex items-baseline">
              <span className="text-3xl font-bold text-gray-900">GHS {product.price}</span>
              {product.originalPrice && (
                <span className="ml-3 text-lg text-gray-500 line-through">GHS {product.originalPrice}</span>
              )}
              {discountPercentage > 0 && (
                <span className="ml-3 bg-red-100 text-red-700 px-2 py-0.5 rounded text-sm font-medium">
                  {discountPercentage}% OFF
                </span>
              )}
            </div>
            {savedAmount > 0 && (
              <p className="text-green-600 text-sm mt-1">
                You save: GHS {savedAmount} ({discountPercentage}%)
              </p>
            )}
          </div>
          
          {/* Seller Information */}
          <div className="flex items-center mb-6">
            <div className="bg-blue-100 rounded-full p-2">
              <svg className="h-5 w-5 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <span className="text-sm font-medium text-gray-700">Sold by</span>
              <span className="text-sm text-blue-600 ml-1">FreshMarket Official Store</span>
              <span className="flex items-center text-xs text-green-700 mt-0.5">
                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Top Rated Seller (98.7% positive feedback)
              </span>
            </div>
          </div>
          
          {/* Quantity Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
            <div className="flex items-center">
              <button 
                onClick={handleDecreaseQuantity}
                className="bg-gray-200 text-gray-600 hover:bg-gray-300 h-10 w-10 rounded-l-md flex items-center justify-center"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              <span className="px-4 py-2 bg-gray-100 text-gray-700">
                {product.quantity || 1} {/* Display quantity from cart */}
              </span>
              <button 
                onClick={handleIncreaseQuantity}
                className="bg-gray-200 text-gray-600 hover:bg-gray-300 h-10 w-10 rounded-r-md flex items-center justify-center"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
              <span className="ml-3 text-sm text-gray-500">
                {product.stock || 42} available / {product.sold || 138} sold
              </span>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button 
              onClick={handleAddToCart}
              className="bg-white border-2 border-green-600 text-green-600 hover:bg-green-50 py-3 px-6 rounded-md font-semibold transition flex items-center justify-center"
            >
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Add to Cart
            </button>
            <button 
              onClick={handleBuyNow}
              className="bg-green-600 text-white hover:bg-green-700 py-3 px-6 rounded-md font-semibold transition flex items-center justify-center"
            >
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Buy It Now
            </button>
          </div>
          
          {/* Shipping & Returns */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="flex mb-3">
              <Truck className="h-5 w-5 text-green-600 mr-2" />
              <div>
                <p className="text-sm font-medium text-gray-700">Free Shipping</p>
                <p className="text-xs text-gray-500">Delivery estimated in 3-5 business days</p>
              </div>
            </div>
            <div className="flex">
              <RefreshCw className="h-5 w-5 text-green-600 mr-2" />
              <div>
                <p className="text-sm font-medium text-gray-700">Easy Returns</p>
                <p className="text-xs text-gray-500">30-day return policy, buyer pays return shipping</p>
              </div>
            </div>
          </div>
          
          {/* Secure Transaction */}
          <div className="border-t border-b border-gray-200 py-4 mb-6">
            <div className="flex items-center mb-3">
              <ShieldCheck className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-sm font-medium text-gray-700">Buyer Protection</span>
            </div>
            <div className="flex items-center mb-3">
              <CreditCard className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-sm font-medium text-gray-700">Secure Payment</span>
            </div>
            <p className="text-xs text-gray-500">
              Get the item you ordered or your money back. We ensure secure transactions with PCI DSS standards.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs - Description, Specifications, Reviews */}
      <div className="mb-12">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {["description", "specifications", "reviews"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-6 font-medium text-sm border-b-2 ${
                  activeTab === tab
                    ? "border-green-600 text-green-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        <div className="py-6">
          {activeTab === "description" && (
            <div className="prose max-w-none text-gray-700">
              <h3 className="text-xl font-semibold mb-4">Product Description</h3>
              <p>
                {product.description || `Experience the premium quality of our ${product.name}. Sourced from local farms, this product brings you the best of nature's bounty in a convenient package. Perfect for everyday use, our product is known for its exceptional taste and nutritional value.`}
              </p>
              <ul className="mt-4 space-y-2">
                <li>Freshly harvested for maximum quality</li>
                <li>100% organic with no artificial additives</li>
                <li>Rich in essential vitamins and minerals</li>
                <li>Packaged with care to maintain freshness</li>
              </ul>
            </div>
          )}

          {activeTab === "specifications" && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Product Specifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <table className="min-w-full divide-y divide-gray-200">
                    <tbody className="divide-y divide-gray-200">
                      <tr>
                        <td className="py-3 text-sm font-medium text-gray-500">Brand</td>
                        <td className="py-3 text-sm text-gray-700">{product.brand}</td>
                      </tr>
                      <tr>
                        <td className="py-3 text-sm font-medium text-gray-500">Origin</td>
                        <td className="py-3 text-sm text-gray-700">{product.origin}</td>
                      </tr>
                      <tr>
                        <td className="py-3 text-sm font-medium text-gray-500">Weight</td>
                        <td className="py-3 text-sm text-gray-700">{product.weight}</td>
                      </tr>
                      <tr>
                        <td className="py-3 text-sm font-medium text-gray-500">Shelf Life</td>
                        <td className="py-3 text-sm text-gray-700">{product.shelfLife}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div>
                  <table className="min-w-full divide-y divide-gray-200">
                    <tbody className="divide-y divide-gray-200">
                      <tr>
                        <td className="py-3 text-sm font-medium text-gray-500">Storage</td>
                        <td className="py-3 text-sm text-gray-700">{product.storage}</td>
                      </tr>
                      <tr>
                        <td className="py-3 text-sm font-medium text-gray-500">Organic</td>
                        <td className="py-3 text-sm text-gray-700">{product.organic ? "Yes" : "No"}</td>
                      </tr>
                      <tr>
                        <td className="py-3 text-sm font-medium text-gray-500">Packaging</td>
                        <td className="py-3 text-sm text-gray-700">{product.packaging}</td>
                      </tr>
                      <tr>
                        <td className="py-3 text-sm font-medium text-gray-500">Category</td>
                        <td className="py-3 text-sm text-gray-700">{product.category || "Groceries"}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <ProductReviews product={product} />
          )}
        </div>
      </div>

      {/* Similar Products */}
      <div>
        <h2 className="text-2xl font-semibold mb-6">Similar Products</h2>
        {similarProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {similarProducts.map((similarProduct) => (
              <Link href={`/all-products/${similarProduct.id}`} key={similarProduct.id} className="group">
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition">
                  <div className="h-40 bg-gray-100 overflow-hidden">
                    <img 
                      src={similarProduct.image} 
                      alt={similarProduct.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-medium text-gray-800 truncate">{similarProduct.name}</h3>
                    <p className="text-green-700 font-bold mt-1">
                      GHS {similarProduct.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array(5).fill().map((_, idx) => (
              <Link href={`/all-products/${idx + 200}`} key={idx} className="group">
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition">
                  <div className="h-40 bg-gray-100 overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={`Similar Product ${idx + 1}`} 
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-medium text-gray-800 truncate">Similar {product.name}</h3>
                    <p className="text-green-700 font-bold mt-1">
                      GHS {(product.price * (0.9 + (idx * 0.1))).toFixed(2)}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;