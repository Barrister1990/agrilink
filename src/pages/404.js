import { ArrowLeft, Search } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function NotFound() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-lg text-center">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center">
            <span className="text-3xl font-bold text-green-600">Agri</span>
            <span className="text-3xl font-bold text-gray-800">Link</span>
          </div>
        </div>
        
        {/* Error Illustration */}
        <div className="relative mx-auto w-64 h-64 mb-8">
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-full h-full text-gray-200" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M26.2878 74.634C37.6583 86.0046 56.1577 86.0046 67.5282 74.634C78.8988 63.2635 78.8988 44.7641 67.5282 33.3936C56.1577 22.023 37.6583 22.023 26.2878 33.3936C14.9172 44.7641 14.9172 63.2635 26.2878 74.634Z" fill="currentColor" />
              <path d="M33.6626 66.9639C41.5713 74.8726 54.4618 74.8726 62.3705 66.9639C70.2792 59.0552 70.2792 46.1647 62.3705 38.256C54.4618 30.3473 41.5713 30.3473 33.6626 38.256C25.7539 46.1647 25.7539 59.0552 33.6626 66.9639Z" fill="white" />
              <path d="M40.2444 60.382C45.1662 65.3038 53.0498 65.3038 57.9716 60.382C62.8934 55.4603 62.8934 47.5766 57.9716 42.6549C53.0498 37.7331 45.1662 37.7331 40.2444 42.6549C35.3227 47.5766 35.3227 55.4603 40.2444 60.382Z" fill="#9CA3AF" />
              <path d="M14.4109 87.5398L29.3307 72.62" stroke="#4B5563" strokeWidth="4" strokeLinecap="round" />
            </svg>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-7xl font-bold text-gray-800">404</h1>
              <div className="mt-1 text-green-600 font-medium">Page Not Found</div>
            </div>
          </div>
        </div>
        
        {/* Error Message */}
        <h2 className="mb-3 text-2xl font-bold text-gray-800">We Cannot Find That Page</h2>
        <p className="mb-8 text-gray-600">
          The page you are looking for may have been moved, deleted, or possibly never existed.
          Lets get you back on track!
        </p>
        
        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for products, categories, etc."
              className="w-full px-4 py-3 pl-12 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <button
              type="submit"
              className="absolute inset-y-0 right-0 flex items-center px-4 font-medium text-white bg-green-600 rounded-r-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Search
            </button>
          </div>
        </form>
        
        {/* Navigation Options */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Link
            href="/"
            className="flex items-center justify-center px-4 py-3 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <Link
            href="/all-products"
            className="flex items-center justify-center px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Browse Products
          </Link>
        </div>
        
        {/* Help Text */}
        <div className="mt-8 text-gray-500 text-sm">
          <p>Need help? <Link href="/contact" className="text-green-600 hover:underline">Contact our support team</Link></p>
        </div>
        
        {/* Farm-themed illustration */}
        <div className="mt-12 opacity-20">
          <svg className="w-full h-12" viewBox="0 0 300 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,30 L300,30" stroke="#9CA3AF" strokeWidth="1" />
            <path d="M20,30 L20,25 L25,20 L30,25 L30,30" fill="#4B5563" />
            <path d="M40,30 L40,15 L50,15 L50,30" fill="#4B5563" />
            <path d="M60,30 L60,20 Q65,10 70,20 L70,30" fill="#4B5563" />
            <path d="M80,30 L80,20 L85,15 L90,20 L90,30" fill="#4B5563" />
            <path d="M150,30 L150,10 L155,5 L160,10 L160,30" fill="#4B5563" />
            <path d="M180,30 L180,20 L190,20 L190,30" fill="#4B5563" />
            <path d="M200,30 L200,25 L210,25 L210,30" fill="#4B5563" />
            <path d="M220,30 L220,15 L230,15 L230,30" fill="#4B5563" />
            <path d="M240,30 C240,25 245,20 250,20 C255,20 260,25 260,30" fill="#4B5563" />
            <path d="M270,30 C270,20 280,20 290,25 L290,30" fill="#4B5563" />
            <circle cx="230" cy="10" r="5" fill="#047857" />
            <circle cx="50" cy="10" r="3" fill="#047857" />
            <circle cx="190" cy="15" r="4" fill="#047857" />
            <circle cx="280" cy="15" r="4" fill="#047857" />
            <circle cx="100" cy="20" r="3" fill="#047857" />
          </svg>
        </div>
      </div>
    </div>
  );
}