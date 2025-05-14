import Link from "next/link";
import { FaCcMastercard, FaCcPaypal, FaCcVisa, FaFacebook, FaInstagram, FaLinkedin, FaMobileAlt, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 xl:px-20">
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
          
          {/* AgriLink Info */}
          <div>
            <h3 className="text-xl font-semibold text-white">🌱 AgriLink</h3>
            <p className="mt-2 text-sm">
              Connecting farmers to markets and delivering fresh farm produce across Ghana.
            </p>
            <p className="mt-2 text-sm">📍 Accra, Ghana</p>
            <p className="mt-2 text-sm">📞 +233 24 123 4567</p>
            <p className="mt-2 text-sm">✉️ support@agrilink.com</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <ul className="mt-3 space-y-2">
              {["Shop", "Blog", "Help Center", "Contact Us", "Affiliate Program"].map((link, index) => (
                <li key={index}>
                  <Link href={`/${link.toLowerCase().replace(/\s/g, "-")}`} className="hover:text-green-400 transition">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Payment & Security */}
          <div>
            <h3 className="text-lg font-semibold text-white">Secure Payments</h3>
            <p className="mt-3 text-sm">We accept various payment methods for a seamless shopping experience.</p>
            <div className="flex items-center space-x-4 mt-3 text-3xl">
              <FaCcVisa />
              <FaCcMastercard />
              <FaCcPaypal />
              <FaMobileAlt />
            </div>
          </div>

          {/* Newsletter Subscription */}
          <div>
            <h3 className="text-lg font-semibold text-white">Stay Updated</h3>
            <p className="mt-3 text-sm">Subscribe to get the latest offers and fresh farm produce updates.</p>
            <form className="mt-4 flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 text-white rounded-l-md focus:outline-none border border-white"
              />
              <button className="bg-green-600 text-white px-4 py-2 rounded-r-md hover:bg-green-700 transition">
                Subscribe
              </button>
            </form>
          </div>

        </div>

        {/* Social Media & Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          <div className="flex justify-center space-x-6 text-2xl">
            <Link href="https://facebook.com" className="hover:text-blue-500 transition"><FaFacebook /></Link>
            <Link href="https://twitter.com" className="hover:text-blue-400 transition"><FaTwitter /></Link>
            <Link href="https://instagram.com" className="hover:text-pink-500 transition"><FaInstagram /></Link>
            <Link href="https://linkedin.com" className="hover:text-blue-600 transition"><FaLinkedin /></Link>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            © {new Date().getFullYear()} AgriLink. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
