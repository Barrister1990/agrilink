// pages/auth/signup.js
import OnboardingForm from '@/components/OnboardingForm';
import { supabase } from '@/lib/supabaseClient';
import Image from "next/image";
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { FcGoogle } from "react-icons/fc";

const Signup = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  
  useEffect(() => {
    // Check authentication status on page load
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // Check if the user has completed profile
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', session.user.id)
          .single();
        
        if (error || !data) {
          setIsNewUser(true);
          setUserProfile({ user_id: session.user.id, email: session.user.email });
        } else {
          // User has completed onboarding, redirect to dashboard
          router.push('/');
        }
      }
    };
    
    checkUser();
  }, [router]);
  
  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/auth/signup'
        }
      });
      
      if (error) throw error;
    } catch (error) {
      console.error('Error signing in with Google:', error.message);
      alert('Error signing in with Google. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // If user needs to complete onboarding
  if (isNewUser && userProfile) {
    return <OnboardingForm userProfile={userProfile} />;
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <Image src="/logo.png" alt="AgriLink Logo" width={80} height={80} />
        </div>
        
        {/* Welcome Text */}
        <h2 className="text-2xl font-semibold text-gray-700">Welcome to AgriLink</h2>
        <p className="text-gray-600 mt-2 text-sm">
          Login or sign up to access your AgriLink account
        </p>
        
        {/* Google Sign In Button */}
        <button 
          className="flex items-center justify-center w-full mt-6 py-3 border border-gray-300 rounded-lg shadow-sm text-gray-700 font-medium hover:bg-gray-50 transition cursor-pointer"
          onClick={handleGoogleSignIn}
          disabled={loading}
        >
          <FcGoogle className="text-xl mr-2" />
          {loading ? 'Processing...' : 'Continue with Google'}
        </button>
      </div>
    </div>
  );
};

export default Signup;