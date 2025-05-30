import { ArrowRight, ChevronRight, Clock, Shield, Star, Tag, Truck, Users } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const AgriLinkIntro = () => {
  const [hoverCategory, setHoverCategory] = useState(null);
  
  const categories = [
    { name: "Vegetables", emoji: "🥬", color: "from-emerald-400 to-emerald-600", items: "120+ items" },
    { name: "Fruits", emoji: "🍍", color: "from-orange-400 to-orange-600", items: "85+ items" },
    { name: "Grains", emoji: "🌾", color: "from-amber-400 to-amber-600", items: "45+ items" },
    { name: "Livestock", emoji: "🐓", color: "from-red-400 to-red-600", items: "30+ items" },
    { name: "Dairy", emoji: "🥛", color: "from-blue-400 to-blue-600", items: "25+ items" },
    { name: "Processed", emoji: "🛢️", color: "from-purple-400 to-purple-600", items: "60+ items" },
  ];
  
  const features = [
    { icon: <Users size={16} />, text: "Direct farmers" },
    { icon: <Truck size={16} />, text: "Fast delivery" },
    { icon: <Shield size={16} />, text: "Quality assured" },
    { icon: <Tag size={16} />, text: "Fair pricing" },
    { icon: <Clock size={16} />, text: "Same-day" }
  ];

  const stats = [
    { number: "500+", label: "Farmers" },
    { number: "10K+", label: "Customers" },
    { number: "98%", label: "Satisfaction" },
    { number: "24/7", label: "Support" }
  ];

  return (
    <section className="relative bg-gradient-to-br from-gray-50 via-white to-green-50/30 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-64 h-64 rounded-full bg-gradient-to-br from-green-200/20 to-emerald-300/20 animate-pulse"></div>
        <div className="absolute top-1/3 -left-24 w-48 h-48 rounded-full bg-gradient-to-br from-yellow-200/20 to-orange-300/20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full bg-gradient-to-br from-purple-200/10 to-pink-300/10 animate-pulse delay-2000"></div>
      </div>
      
      <div className="relative z-10 px-4 py-12 max-w-7xl mx-auto sm:px-6 lg:px-8 lg:py-20">
        
        {/* Hero Section */}
        <div className="mb-16 lg:mb-24">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-16">
            
            {/* Content */}
            <div className="flex-1 text-center lg:text-left">
              {/* Brand Badge */}
              <div className="inline-flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full border border-green-200 mb-6">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-700 text-sm font-medium">Ghana&apos;s #1 Farm-to-Table Platform</span>
              </div>
              
              {/* Main Heading */}
              <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-4 sm:text-4xl lg:text-6xl">
                <span className="bg-gradient-to-r from-green-600 via-emerald-500 to-green-400 bg-clip-text text-transparent">
                  AgriLink
                </span>
                <br />
                <span className="text-gray-800 text-2xl sm:text-3xl lg:text-4xl font-medium">
                  Farm to Table, Simplified
                </span>
              </h1>
              
              <p className="text-gray-600 text-base mb-6 max-w-xl mx-auto lg:mx-0 sm:text-lg">
                Connect directly with Ghana&apos;s finest farmers. Fresh produce, fair prices, sustainable practices—delivered to your doorstep.
              </p>
              
              {/* Feature Pills */}
              <div className="flex flex-wrap gap-2 justify-center mb-8 lg:justify-start">
                {features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/80 backdrop-blur-sm rounded-full shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                    <span className="text-green-600">{feature.icon}</span>
                    <span className="text-xs font-medium text-gray-700 sm:text-sm">{feature.text}</span>
                  </div>
                ))}
              </div>
              
              {/* CTA Buttons */}
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
                <Link href="/all-products" className="group inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-500 text-white font-medium rounded-xl shadow-lg hover:shadow-xl hover:from-green-700 hover:to-emerald-600 transition-all duration-300 sm:px-8 sm:py-4">
                  Start Shopping 
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
                <Link href="/about-us" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-sm text-green-600 border border-green-200 font-medium rounded-xl shadow-sm hover:shadow-md hover:bg-white transition-all duration-300 sm:px-8 sm:py-4">
                  Learn More
                </Link>
              </div>
            </div>
            
            {/* Hero Image */}
            <div className="flex-1 relative max-w-lg mx-auto lg:max-w-none">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-white p-2 hover:shadow-3xl transition-shadow duration-500">
                <img 
                  src="/images/farmers-market.png" 
                  alt="Fresh Farm Produce" 
                  className="rounded-2xl object-cover w-full aspect-[4/3]"
                />
                
                {/* Floating Stats Card */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                  <div className="grid grid-cols-2 gap-3 text-center">
                    {stats.slice(0, 2).map((stat, idx) => (
                      <div key={idx}>
                        <div className="text-lg font-bold text-gray-900 sm:text-xl">{stat.number}</div>
                        <div className="text-xs text-gray-600 sm:text-sm">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Floating Badge */}
              <div className="absolute -bottom-4 -right-4 bg-gradient-to-br from-yellow-400 to-orange-500 text-white p-4 rounded-2xl shadow-xl transform rotate-6 hover:rotate-12 transition-transform duration-300">
                <div className="text-center">
                  <div className="text-lg font-bold">100%</div>
                  <div className="text-xs font-medium">Fresh</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Section */}
        <div className="mb-16 lg:mb-24">
          <div className="text-center mb-8 lg:mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:text-3xl lg:text-4xl">What We Offer</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
              Discover premium agricultural products sourced directly from local farms across Ghana.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 lg:gap-4">
            {categories.map((category, index) => (
              <div 
                key={index}
                className="group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl"
                onMouseEnter={() => setHoverCategory(index)}
                onMouseLeave={() => setHoverCategory(null)}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-90 group-hover:opacity-100 transition-opacity duration-300`}></div>
                
                <div className="relative flex flex-col items-center justify-center p-4 text-white aspect-square sm:p-6">
                  <span className="text-2xl mb-2 transform group-hover:scale-110 transition-transform duration-300 sm:text-3xl lg:text-4xl">
                    {category.emoji}
                  </span>
                  <h3 className="text-xs font-semibold text-center mb-1 sm:text-sm lg:text-base">
                    {category.name}
                  </h3>
                  <span className="text-xs opacity-80 sm:text-sm">
                    {category.items}
                  </span>
                  
                  {/* Hover Effect */}
                  <div className={`absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300`}>
                    <div className="bg-white/20 backdrop-blur-sm text-white text-xs py-2 px-4 rounded-full flex items-center gap-1 sm:text-sm">
                      Explore <ArrowRight size={14} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Testimonial Section */}
        <div className="mb-16 lg:mb-24">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 relative overflow-hidden border border-gray-100 sm:p-8 lg:p-12">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-emerald-500"></div>
            
            <div className="flex flex-col gap-6 items-center lg:flex-row lg:gap-12">
              {/* Customer Image */}
              <div className="flex-shrink-0">
                <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-4 border-green-100 shadow-inner sm:w-32 sm:h-32 lg:w-40 lg:h-40">
                  <img 
                    src="/images/agriceo.jpeg" 
                    alt="Daniel Fahene Acquaye" 
                    className="object-cover w-full h-full"
                  />
                  {/* Rating Badge */}
                  <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-white p-2 rounded-xl shadow-lg">
                    <div className="flex items-center gap-1">
                      <Star size={12} fill="currentColor" />
                      <span className="text-xs font-bold">5.0</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Testimonial Content */}
              <div className="flex-1 text-center lg:text-left">
                <div className="text-4xl text-green-200 mb-2 lg:text-6xl">&quot;</div>
                <p className="text-gray-700 text-sm italic mb-4 sm:text-base lg:text-lg">
                  AgriLink has transformed our restaurant&apos;s supply chain. Fresh produce delivered directly from farms, cutting costs while improving quality. The difference in taste is remarkable!
                </p>
                <div className="space-y-1">
                  <div className="font-semibold text-gray-900 text-sm sm:text-base">Daniel Fahene Acquaye</div>
                  <div className="text-xs text-gray-500 sm:text-sm">Executive Chef, Agri Impact Group</div>
                </div>
                
                {/* Trust Indicators */}
                <div className="flex items-center justify-center gap-4 mt-4 lg:justify-start">
                  <div className="flex items-center gap-1">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} className="text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <span className="text-xs text-gray-600 ml-1">5.0 rating</span>
                  </div>
                  <div className="text-xs text-gray-500">Verified customer</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Final CTA Section */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 sm:text-3xl lg:text-4xl">
            Ready for farm-fresh quality?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto text-sm sm:text-base">
            Join thousands of satisfied customers across Ghana enjoying premium agricultural products delivered fresh to their doorstep.
          </p>
          
          {/* Stats Row */}
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-8 sm:grid-cols-4 sm:max-w-2xl">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-xl font-bold text-green-600 sm:text-2xl lg:text-3xl">{stat.number}</div>
                <div className="text-xs text-gray-600 sm:text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
          
          <Link href="/all-products" className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-green-700 hover:to-emerald-600 transition-all duration-300 sm:px-10 sm:py-5">
            Start Shopping Now 
            <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AgriLinkIntro;