import Link from "next/link";

export default function AdminAccessDenied({ title, message, actionText, actionLink }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-blue-600 py-4">
          <div className="flex justify-center">
            <div className="loading-animation">
              <div className="agrilink-logo-container">
                <svg className="agrilink-logo" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
                  {/* Stylized "A" letter for AgriLink */}
                  <path 
                    d="M60 10 L90 100 L60 80 L30 100 Z" 
                    fill="none" 
                    stroke="white" 
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="logo-path"
                  />
                  {/* Leaf element */}
                  <path 
                    d="M60 40 Q70 20 85 35 Q95 45 80 60 Q65 75 60 60 Q55 75 40 60 Q25 45 35 35 Q50 20 60 40 Z" 
                    fill="none" 
                    stroke="white" 
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
            </div>
          </div>
        </div>
        
        <div className="p-8">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
            {title}
          </h2>
          
          <p className="text-gray-600 text-center mb-8">
            {message}
          </p>
          
          <div className="flex justify-center">
            <Link
              href={actionLink}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
            >
              {actionText}
            </Link>
          </div>
        </div>
        
        <div className="bg-gray-50 px-4 py-3 sm:px-6 border-t border-gray-200">
          <div className="flex justify-center">
            <Link href="/" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              Return to Home
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .loading-animation {
          position: relative;
          width: 100px;
          height: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .agrilink-logo-container {
          width: 60px;
          height: 60px;
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
          animation: draw 3s forwards, pulse 3s infinite;
        }
        
        .leaf-path {
          stroke-dasharray: 200;
          stroke-dashoffset: 200;
          animation: draw 3s 0.5s forwards, pulse 3s 0.5s infinite;
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
          border: 2px solid rgba(255, 255, 255, 0.5);
          border-radius: 50%;
          width: 50px;
          height: 50px;
          opacity: 0;
          animation: pulse-ring 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
        }
        
        .delay-1 {
          animation-delay: 0.4s;
        }
        
        .delay-2 {
          animation-delay: 0.8s;
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
            filter: drop-shadow(0 0 3px rgba(255, 255, 255, 0.7));
          }
          50% {
            filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.9));
          }
        }
        
        @keyframes pulse-ring {
          0% {
            transform: scale(0.5);
            opacity: 0;
          }
          50% {
            opacity: 0.3;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}