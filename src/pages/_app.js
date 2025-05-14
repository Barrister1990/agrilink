import AdminAccessDenied from "@/components/AdminAccessDenied";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabaseClient";
import "@/styles/globals.css";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [farmerProfile, setFarmerProfile] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authStatus, setAuthStatus] = useState("loading");
  
  const hideLayout = ["/auth", "/user-details", "/admin", "/farmer-unboarding", "/super-admin"].some((path) =>
    router.pathname.startsWith(path)
  );
  
  const isAdminRoute = router.pathname.startsWith("/admin");
  const isSuperAdminRoute = router.pathname.startsWith("/super-admin");
  const isFarmerOnboardingRoute = router.pathname.startsWith("/farmer-unboarding");

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          setAuthStatus("unauthenticated");
          setLoading(false);
          
          // Redirect to admin login if trying to access super-admin without auth
          if (isSuperAdminRoute) {
            router.push("/auth/admin");
          }
          return;
        }
        
        setUser(session.user);
        
        // Check if user is in admin table for super-admin routes
        if (isSuperAdminRoute) {
          const { data: adminData, error: adminError } = await supabase
            .from('admin')
            .select('*')
            .eq('user_id', session.user.id)
            .single();
          
          if (adminError || !adminData) {
            setIsAdmin(false);
            setAuthStatus("not-admin");
            setLoading(false);
            
            // Redirect to admin login if not an admin
            router.push("/auth/admin");
            return;
          } else {
            setIsAdmin(true);
            setAuthStatus("admin-approved");
          }
        }
        
        // Always check for farmer profile if authenticated for either admin routes
        // or farmer onboarding routes
        if (isAdminRoute || isFarmerOnboardingRoute) {
          const { data: farmerData, error } = await supabase
            .from('farmer_profiles')
            .select('*')
            .eq('user_id', session.user.id)
            .single();
          
          if (error || !farmerData) {
            setAuthStatus("no-farmer-profile");
          } else {
            setFarmerProfile(farmerData);
            console.log(farmerData);
            setAuthStatus(farmerData.application_status);
          }
        } else {
          setAuthStatus("authenticated");
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Authentication check error:", error);
        setAuthStatus("error");
        setLoading(false);
      }
    };

    checkAuth();
  }, [router.pathname, isAdminRoute, isFarmerOnboardingRoute, isSuperAdminRoute, router]);

  // Render loading state with modern AgriLink animation
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="loading-animation">
          <div className="agrilink-logo-container">
            <svg className="agrilink-logo" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
              {/* Stylized "A" letter for AgriLink */}
              <path 
                d="M60 10 L90 100 L60 80 L30 100 Z" 
                fill="none" 
                stroke="#2563EB" 
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="logo-path"
              />
              {/* Leaf element */}
              <path 
                d="M60 40 Q70 20 85 35 Q95 45 80 60 Q65 75 60 60 Q55 75 40 60 Q25 45 35 35 Q50 20 60 40 Z" 
                fill="none" 
                stroke="#2563EB" 
                strokeWidth="3"
                className="leaf-path"
              />
            </svg>
          </div>
          <div className="pulse-rings">
            <div className="pulse-ring"></div>
            <div className="pulse-ring delay-1"></div>
            <div className="pulse-ring delay-2"></div>
          </div>
          <div className="loading-text">Loading AgriLink</div>
        </div>

        <style jsx>{`
          .loading-animation {
            position: relative;
            width: 120px;
            height: 160px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }
          
          .agrilink-logo-container {
            width: 80px;
            height: 80px;
            z-index: 10;
            animation: float 3s ease-in-out infinite;
          }
          
          .agrilink-logo {
            width: 100%;
            height: 100%;
          }
          
          .logo-path {
            stroke-dasharray: 300;
            stroke-dashoffset: 300;
            animation: draw 2.5s forwards, pulse 3s infinite;
          }
          
          .leaf-path {
            stroke-dasharray: 200;
            stroke-dashoffset: 200;
            animation: draw 2.5s 0.3s forwards, pulse 3s 0.3s infinite;
          }
          
          .pulse-rings {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .pulse-ring {
            position: absolute;
            border: 2px solid rgba(37, 99, 235, 0.4);
            border-radius: 50%;
            width: 60px;
            height: 60px;
            opacity: 0;
            animation: pulse-ring 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
          }
          
          .delay-1 {
            animation-delay: 0.4s;
          }
          
          .delay-2 {
            animation-delay: 0.8s;
          }

          .loading-text {
            margin-top: 20px;
            font-size: 16px;
            color: #2563EB;
            font-weight: 500;
            opacity: 0;
            animation: fade-in 0.6s ease-out forwards 1s;
          }
          
          @keyframes float {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-5px);
            }
          }
          
          @keyframes draw {
            to {
              stroke-dashoffset: 0;
            }
          }
          
          @keyframes pulse {
            0%, 100% {
              filter: drop-shadow(0 0 3px rgba(37, 99, 235, 0.5));
            }
            50% {
              filter: drop-shadow(0 0 8px rgba(37, 99, 235, 0.7));
            }
          }
          
          @keyframes pulse-ring {
            0% {
              transform: scale(0.5);
              opacity: 0;
            }
            50% {
              opacity: 0.2;
            }
            100% {
              transform: scale(1.8);
              opacity: 0;
            }
          }

          @keyframes fade-in {
            from {
              opacity: 0;
              transform: translateY(5px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    );
  }

  // Handle super admin route authentication
  if (isSuperAdminRoute) {
    // Already redirecting in the useEffect if not authenticated or not admin
    if (authStatus === "unauthenticated" || authStatus === "not-admin") {
      return (
        <AdminAccessDenied 
          title="Super Admin Access Denied"
          message="You need proper admin credentials to access this area."
          actionText="Admin Login"
          actionLink="/auth/admin"
        />
      );
    }
    
    // If they're not an admin in the database
    if (!isAdmin) {
      return (
        <AdminAccessDenied 
          title="Super Admin Access Denied"
          message="Your account doesn't have super admin privileges."
          actionText="Return Home"
          actionLink="/"
        />
      );
    }
    
    // Otherwise continue with super admin access
  }

  // Handle different authentication scenarios for admin routes
  if (isAdminRoute) {
    // Check authentication status and render appropriate content
    switch (authStatus) {
      case "unauthenticated":
        return (
          <AdminAccessDenied 
            title="Authentication Required"
            message="You need to sign in to access the farmer dashboard."
            actionText="Sign Up"
            actionLink="/auth/signup"
          />
        );
      
      case "no-farmer-profile":
        return (
          <AdminAccessDenied 
            title="Farmer Profile Required"
            message="You need to apply to become a farmer to access this dashboard."
            actionText="Apply Now"
            actionLink="/farmer-unboarding"
          />
        );
      
      case "pending":
        return (
          <AdminAccessDenied 
            title="Application Pending"
            message="Your farmer application is currently under review. Please wait for approval or contact support for assistance."
            actionText="Contact Support"
            actionLink="/contact"
          />
        );
      
      case "rejected":
        return (
          <AdminAccessDenied 
            title="Application Rejected"
            message="Your farmer application was not approved. You may submit a new application."
            actionText="Apply Again"
            actionLink="/farmer-unboarding"
          />
        );
      
      case "approved":
        // Allow access to admin routes
        break;
      
      default:
        return (
          <AdminAccessDenied 
            title="Access Error"
            message="There was an error checking your access. Please try again later."
            actionText="Go Home"
            actionLink="/"
          />
        );
    }
  }
  
  // Special case for farmer-unboarding route
  if (isFarmerOnboardingRoute) {
    // Only check if user is authenticated - allow access if they don't have a profile
    if (authStatus === "unauthenticated") {
      return (
        <AdminAccessDenied 
          title="Authentication Required"
          message="You need to sign in to apply as a farmer."
          actionText="Sign In"
          actionLink="/auth/signup"
        />
      );
    }
    
    // If they already have a profile, don't allow re-application unless rejected
    if (authStatus !== "no-farmer-profile" && authStatus !== "rejected") {
      return (
        <AdminAccessDenied 
          title="Application Already Exists"
          message={
            authStatus === "pending" 
              ? "Your application is already submitted and pending review." 
              : "You already have a farmer account."
          }
          actionText={
            authStatus === "pending"
              ? "Contact Support"
              : "Go to Dashboard"
          }
          actionLink={
            authStatus === "pending"
              ? "/contacts"
              : "/admin/dashboard"
          }
        />
      );
    }
    // Otherwise, allow access to the onboarding route
  }

  // Render normal layout for non-admin routes or approved admin access
  return (
    <div className="flex flex-col min-h-screen">
      {!hideLayout && <Navbar />}
      <main className="flex-grow">
        <Component {...pageProps} user={user} farmerProfile={farmerProfile} isAdmin={isAdmin} />
      </main>
      {!hideLayout && <Footer />}
    </div>
  );
}