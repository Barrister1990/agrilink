import { ChevronRight, Clock, Shield, Tag, Truck, Users } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
const AgriLinkIntro = () => {
  const [hoverCategory, setHoverCategory] = useState(null);
  
  const categories = [
    { name: "Vegetables", emoji: "🥬", color: "from-green-400 to-green-600" },
    { name: "Fruits", emoji: "🍍", color: "from-yellow-400 to-yellow-600" },
    { name: "Grains & Legumes", emoji: "🌾", color: "from-amber-400 to-amber-600" },
    { name: "Livestock & Poultry", emoji: "🐓", color: "from-red-400 to-red-600" },
    { name: "Dairy Products", emoji: "🥛", color: "from-blue-400 to-blue-600" },
    { name: "Processed Goods", emoji: "🛢️", color: "from-purple-400 to-purple-600" },
  ];
  
  const features = [
    { icon: <Users size={20} />, text: "Direct from farmers" },
    { icon: <Truck size={20} />, text: "Nationwide delivery" },
    { icon: <Shield size={20} />, text: "Quality assurance" },
    { icon: <Tag size={20} />, text: "Competitive pricing" },
    { icon: <Clock size={20} />, text: "Same-day processing" }
  ];

  return (
    <section className="bg-gradient-to-b from-green-50 to-white py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Abstract shapes background */}
        <div className="absolute inset-0 overflow-hidden -z-10">
          <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-green-100 opacity-60"></div>
          <div className="absolute top-1/2 -left-32 w-96 h-96 rounded-full bg-green-50 opacity-40"></div>
          <div className="absolute bottom-0 right-1/3 w-80 h-80 rounded-full bg-yellow-50 opacity-30"></div>
        </div>
        
        {/* Hero Section */}
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-12 mb-20">
            {/* Left content */}
            <div className="flex-1 text-left">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-400">AgriLink</span>
              </h1>
              <p className="text-3xl md:text-4xl font-medium text-gray-800 mt-2 mb-6">
                Farm to Table, Simplified
              </p>
              <p className="text-gray-600 text-lg mb-8 max-w-xl">
                Ghana&apos;s premier platform connecting farmers directly to consumers and businesses.
                Fresh produce, fair prices, and sustainable practices.
              </p>
              
              {/* Feature tags */}
              <div className="flex flex-wrap gap-3 mb-8">
                {features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full shadow-sm border border-gray-100">
                    <span className="text-green-600">{feature.icon}</span>
                    <span className="text-sm font-medium text-gray-700">{feature.text}</span>
                  </div>
                ))}
              </div>
              
              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4">
              <Link href="/all-products" passHref>
  <button className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2">
    Start Shopping <ChevronRight size={18} />
  </button>
</Link>
<Link href="/about-us" passHref>
                <button className="px-6 py-3 bg-white text-green-600 border border-green-200 font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                  Learn More
                </button>
                </Link>
              </div>
            </div>
            
            {/* Right image */}
            <div className="flex-1 relative">
              <div className="relative shadow-2xl rounded-2xl overflow-hidden aspect-[4/3] bg-white p-1">
                <img 
                  src="/images/farmers-market.png" 
                  alt="Fresh Farm Produce" 
                  className="rounded-xl object-cover w-full h-full"
                />
                <div className="absolute bottom-4 left-4 right-4 bg-white/80 backdrop-blur-sm p-3 rounded-lg">
                  <div className="text-sm font-medium text-gray-900">Over 500+ farmers across Ghana</div>
                  <div className="text-xs text-gray-600">Supporting local agriculture and sustainable farming</div>
                </div>
              </div>
              
              {/* Floating badge */}
              <div className="absolute -bottom-6 -right-6 bg-gradient-to-r from-yellow-500 to-yellow-400 text-white p-4 rounded-full shadow-lg transform rotate-12">
                <div className="text-lg font-bold">100%</div>
                <div className="text-xs font-medium">Fresh</div>
              </div>
            </div>
          </div>
        </div>

        {/* What We Offer Section */}
        <div className="mb-24">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-3 text-gray-800">What We Offer</h2>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
            Discover a wide range of fresh, high-quality agricultural products sourced directly from local farms.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <div 
                key={index}
                className="relative overflow-hidden rounded-xl cursor-pointer transition-all duration-300 group"
                onMouseEnter={() => setHoverCategory(index)}
                onMouseLeave={() => setHoverCategory(null)}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-80 group-hover:opacity-100 transition-opacity duration-300`}></div>
                <div className="relative flex flex-col items-center justify-center p-6 text-white aspect-square">
                  <span className="text-4xl mb-2 transform group-hover:scale-110 transition-transform duration-300">{category.emoji}</span>
                  <h3 className="text-sm md:text-base font-medium text-white text-center group-hover:font-bold transition-all duration-300">{category.name}</h3>
                  
                  {hoverCategory === index && (
                    <div className="absolute bottom-2 left-0 right-0 flex justify-center">
                      <span className="bg-white/20 backdrop-blur-sm text-white text-xs py-1 px-2 rounded-full">
                        Explore
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Testimonial */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-16 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-green-600"></div>
          
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="md:w-1/3">
              <div className="aspect-square relative rounded-full overflow-hidden border-4 border-green-100 shadow-inner">
                <img 
                  src="/images/agriceo.jpeg" 
                  alt="Satisfied Customer" 
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
            
            <div className="md:w-2/3">
              <div className="text-5xl text-green-200">&apos;</div>
              <p className="text-gray-700 text-lg italic mb-6">
                AgriLink has transformed our restaurant&apos;s supply chain. We now get the freshest produce delivered directly from farms, cutting costs while improving quality. The difference in taste is remarkable!
              </p>
              <div className="font-medium text-gray-900">Daniel Fahene Acquaye</div>
              <div className="text-sm text-gray-500">Executive Chef, Agri Impact Group</div>
            </div>
          </div>
        </div>
        
        {/* Call to Action */}
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Ready to experience farm-fresh quality?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers across Ghana enjoying premium agricultural products delivered to their doorstep.
          </p>
          <Link href="/all-products" passHref>
          <button className="px-8 py-4 bg-gradient-to-r from-green-600 to-green-500 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 mx-auto">
            Start Shopping Now <ChevronRight size={18} />
          </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AgriLinkIntro;