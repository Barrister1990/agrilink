import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/router';
import { useState } from 'react';


export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSignIn = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Sign in with Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      // Check if user exists in admin table
      const { data: adminData, error: adminError } = await supabase
        .from('admin')
        .select('*')
        .eq('user_id', authData.user.id)
        .single();

      if (adminError && adminError.code !== 'PGRST116') {
        throw adminError;
      }

      if (!adminData) {
        // User is not an admin
        await supabase.auth.signOut();
        throw new Error('You do not have administrator privileges.');
      }

      // Navigate to admin dashboard
      router.push('/super-admin');
      
    } catch (err) {
      setError(err.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left side - Farm image */}
      <div className="hidden lg:flex lg:w-1/2 bg-cover bg-center" 
        style={{ backgroundImage: "url('/admin-bg.jpg')" }}>
        <div className="w-full h-full bg-gradient-to-r from-green-800/70 to-transparent flex items-center">
          <div className="px-12">
            <h2 className="text-4xl font-bold text-white mb-4">AgriLink Admin Portal</h2>
            <p className="text-white text-xl">Manage your agricultural resources efficiently</p>
          </div>
        </div>
      </div>
      
      {/* Right side - Sign in form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            {/* AgriLink Logo */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-green-600 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                </svg>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
            <p className="text-gray-600 mt-2">Sign in to access the admin dashboard</p>
          </div>
          
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4 flex items-center animate-fadeIn">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}
          
          <div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email Address</label>
              <input
                id="email"
                type="email"
                className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <label htmlFor="password" className="text-gray-700 font-medium">Password</label>
                <a className="text-sm text-green-600 hover:text-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 rounded cursor-pointer">
                  Forgot password?
                </a>
              </div>
              <input
                id="password"
                type="password"
                className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSignIn();
                  }
                }}
              />
            </div>
            
            <button
              onClick={handleSignIn}
              className={`w-full bg-green-600 text-white py-3 rounded-lg font-semibold transition transform hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-0.5'}`}
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </div>
              ) : 'Sign In'}
            </button>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Need an account? <a className="text-green-600 hover:text-green-700 font-medium cursor-pointer">Contact administrator</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}