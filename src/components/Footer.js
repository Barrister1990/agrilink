import Link from "next/link";
import {
  FaCcMastercard,
  FaCcPaypal,
  FaCcVisa,
  FaCode,
  FaEnvelope,
  FaExternalLinkAlt,
  FaFacebook,
  FaHeart,
  FaInstagram,
  FaLeaf,
  FaLinkedin,
  FaMapMarkerAlt,
  FaMobileAlt,
  FaPhone,
  FaTwitter
} from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Shop", href: "/shop" },
    { name: "Blog", href: "/blog" },
    { name: "Help Center", href: "/help-center" },
    { name: "Contact Us", href: "/contact-us" },
    { name: "Affiliate Program", href: "/affiliate-program" }
  ];

  const socialLinks = [
    { icon: FaFacebook, href: "https://facebook.com", color: "hover:text-blue-500", label: "Facebook" },
    { icon: FaTwitter, href: "https://twitter.com", color: "hover:text-sky-400", label: "Twitter" },
    { icon: FaInstagram, href: "https://instagram.com", color: "hover:text-pink-500", label: "Instagram" },
    { icon: FaLinkedin, href: "https://linkedin.com", color: "hover:text-blue-600", label: "LinkedIn" }
  ];

  return (
    <footer className="bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-gray-300 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-orange-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-green-500 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-blue-500 rounded-full blur-2xl"></div>
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            
            {/* AgriLink Info */}
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-gradient-to-br from-[#F68B1E] to-orange-600 text-white p-3 rounded-2xl shadow-lg">
                  <FaLeaf className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  AgriLink
                </h3>
              </div>
              
              <p className="text-gray-400 leading-relaxed mb-6">
                Connecting farmers to markets and delivering fresh farm produce across Ghana. 
                Building sustainable communities through technology.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-sm group">
                  <div className="bg-gradient-to-br from-red-500 to-red-600 p-2 rounded-lg group-hover:scale-110 transition-transform duration-200">
                    <FaMapMarkerAlt className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-gray-300">Accra, Ghana</span>
                </div>
                
                <div className="flex items-center space-x-3 text-sm group">
                  <div className="bg-gradient-to-br from-green-500 to-green-600 p-2 rounded-lg group-hover:scale-110 transition-transform duration-200">
                    <FaPhone className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-gray-300">+233 24 123 4567</span>
                </div>
                
                <div className="flex items-center space-x-3 text-sm group">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-lg group-hover:scale-110 transition-transform duration-200">
                    <FaEnvelope className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-gray-300">support@agrilink.com</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-6 relative">
                Quick Links
                <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-[#F68B1E] to-orange-600 rounded-full"></div>
              </h3>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <Link 
                      href={link.href} 
                      className="text-gray-400 hover:text-[#F68B1E] transition-all duration-200 hover:translate-x-1 inline-block group"
                    >
                      <span className="border-b border-transparent group-hover:border-[#F68B1E] transition-all duration-200">
                        {link.name}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Payment & Security */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-6 relative">
                Secure Payments
                <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-[#F68B1E] to-orange-600 rounded-full"></div>
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                We accept various payment methods for a seamless and secure shopping experience.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-3 rounded-xl hover:scale-110 transition-transform duration-200 shadow-lg">
                  <FaCcVisa className="h-6 w-6 text-white" />
                </div>
                <div className="bg-gradient-to-br from-red-600 to-red-700 p-3 rounded-xl hover:scale-110 transition-transform duration-200 shadow-lg">
                  <FaCcMastercard className="h-6 w-6 text-white" />
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl hover:scale-110 transition-transform duration-200 shadow-lg">
                  <FaCcPaypal className="h-6 w-6 text-white" />
                </div>
                <div className="bg-gradient-to-br from-gray-600 to-gray-700 p-3 rounded-xl hover:scale-110 transition-transform duration-200 shadow-lg">
                  <FaMobileAlt className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>

            {/* Newsletter Subscription */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-6 relative">
                Stay Updated
                <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-[#F68B1E] to-orange-600 rounded-full"></div>
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Subscribe to get the latest offers and fresh farm produce updates delivered to your inbox.
              </p>
              <form className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full bg-gray-800/50 backdrop-blur-sm border-2 border-gray-700 focus:border-[#F68B1E] text-white placeholder-gray-400 px-4 py-3 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-500/20 transition-all duration-300"
                  />
                </div>
                <button 
                  type="submit"
                  className="bg-gradient-to-r from-[#F68B1E] to-orange-600 text-white px-6 py-3 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 font-medium whitespace-nowrap"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Social Media & Bottom Section */}
        <div className="border-t border-gray-700/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            
            {/* Social Media Links */}
            <div className="flex justify-center space-x-6 mb-8">
              {socialLinks.map((social, index) => {
                const IconComponent = social.icon;
                return (
                  <Link 
                    key={index}
                    href={social.href} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`bg-gray-800/50 backdrop-blur-sm p-4 rounded-2xl ${social.color} hover:scale-110 hover:shadow-lg transition-all duration-200 group`}
                    aria-label={social.label}
                  >
                    <IconComponent className="h-6 w-6" />
                  </Link>
                );
              })}
            </div>

            {/* Copyright and Developer Credit */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
              <div className="flex items-center text-gray-500">
                <span>© {currentYear} AgriLink. All Rights Reserved.</span>
                <span className="mx-2">•</span>
                <span className="flex items-center">
                  Made with <FaHeart className="h-4 w-4 text-red-500 mx-1 animate-pulse" /> in Ghana
                </span>
              </div>
              
              <div className="flex items-center space-x-2 group">
                <FaCode className="h-4 w-4 text-gray-500 group-hover:text-[#F68B1E] transition-colors duration-200" />
                <span className="text-gray-500">Developed by</span>
                <Link 
                  href="https://charlesawuku.com" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#F68B1E] hover:text-orange-400 font-medium transition-colors duration-200 flex items-center space-x-1 group"
                >
                  <span>Charles Awuku</span>
                  <FaExternalLinkAlt className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;