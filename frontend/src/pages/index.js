import { useEffect, useContext, useState } from "react";
import { useRouter } from "next/router";
import dynamic from 'next/dynamic';
import Link from "next/link";
import { FaUser, FaSignOutAlt, FaMicrophone, FaHeadset, FaChartLine, FaLock } from "react-icons/fa";
import { MdRecordVoiceOver, MdOutlineWavingHand } from "react-icons/md";
import { showToast } from "@/components/Toast";
import { useAuth } from "@/context/AuthContext";

// Features data
const FEATURES = [
  {
    icon: MdRecordVoiceOver,
    title: "Voice Recording",
    description: "Record your dental notes with high-quality audio capture and real-time transcription"
  },
  {
    icon: FaChartLine,
    title: "Smart Analysis",
    description: "AI-powered analysis of dental records with intelligent insights and recommendations"
  },
  {
    icon: FaLock,
    title: "Secure Storage",
    description: "Enterprise-grade encryption and secure storage for all your sensitive medical data"
  }
];

// Feature Card Component
const FeatureCard = ({ icon: Icon, title, description }) => {
  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-100
      hover:shadow-xl hover:scale-[1.02] transition-all duration-200">
      <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-500 
        w-14 h-14 rounded-lg shadow-lg flex items-center justify-center mb-4">
        <Icon className="text-white text-2xl" />
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

// Navigation Button Component
const NavButton = ({ onClick, gradient, icon: Icon, title, subtitle }) => {
  return (
    <button 
      onClick={onClick}
      className={`w-full bg-gradient-to-r ${gradient} text-white p-6 
        rounded-xl font-medium shadow-md hover:shadow-xl 
        transform hover:-translate-y-1 transition-all duration-200 
        flex items-center gap-4`}
    >
      <div className="p-3 bg-white/10 rounded-lg">
        <Icon className="text-2xl" />
      </div>
      <div className="text-left">
        <div className="text-lg font-semibold">{title}</div>
        <div className="text-sm text-white/90">{subtitle}</div>
      </div>
    </button>
  );
};

// Action Button Component
const ActionButton = ({ onClick, gradient, icon: Icon, label }) => {
  return (
    <button 
      onClick={onClick}
      className={`flex-1 bg-gradient-to-r ${gradient} text-white 
        py-4 px-6 rounded-xl font-medium shadow-md hover:shadow-xl 
        transform hover:-translate-y-1 transition-all duration-200 
        flex items-center justify-center gap-3`}
    >
      <Icon className="text-xl" />
      <span className="text-lg">{label}</span>
    </button>
  );
};

// Loading Screen Component
const LoadingScreen = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 
      flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 p-8 rounded-2xl 
        bg-white/50 backdrop-blur-sm shadow-xl">
        <FaHeadset className="text-5xl text-blue-600 animate-pulse" />
        <div className="text-lg text-gray-700 font-medium">Loading Medi Mate...</div>
      </div>
    </div>
  );
};

// Authenticated Menu Component
const AuthenticatedMenu = ({ onNavigate, onLogout, userName }) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Welcome back{userName ? `, ${userName}` : ''}!
        </h2>
        <p className="text-gray-600">What would you like to do today?</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <NavButton
          onClick={() => onNavigate("/assistant")}
          gradient="from-blue-600 to-indigo-600"
          icon={MdRecordVoiceOver}
          title="New Recording"
          subtitle="Start a new session"
        />
        <NavButton
          onClick={() => onNavigate("/audiolist")}
          gradient="from-purple-600 to-pink-600"
          icon={FaMicrophone}
          title="Audio List"
          subtitle="View recordings"
        />
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <ActionButton
          onClick={() => onNavigate("/profile")}
          gradient="from-gray-700 to-gray-800"
          icon={FaUser}
          label="Profile"
        />
        <ActionButton
          onClick={onLogout}
          gradient="from-red-500 to-red-600"
          icon={FaSignOutAlt}
          label="Logout"
        />
      </div>
    </div>
  );
};

// Unauthenticated Content Component
const UnauthenticatedContent = ({ features }) => {
  return (
    <div className="space-y-10">
      <div className="text-center space-y-3">
        <MdOutlineWavingHand className="text-5xl text-yellow-500 mx-auto mb-3" />
        <h2 className="text-3xl font-bold text-gray-800">Welcome to Medi Mate</h2>
        <p className="text-xl text-gray-600">Your AI-powered dental assistant</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <FeatureCard key={index} {...feature} />
        ))}
      </div>
      
      <div className="space-y-4">
        <Link 
          href="/login" 
          className="block w-full bg-gradient-to-r from-blue-600 to-indigo-600 
            text-white py-4 px-6 rounded-xl text-lg font-medium shadow-md hover:shadow-xl 
            transform hover:-translate-y-1 transition-all duration-200 text-center"
        >
          Sign In
        </Link>
        
        <div className="text-center space-y-2">
          <p className="text-gray-600">Don't have an account?</p>
          <Link 
            href="/register" 
            className="text-blue-600 hover:text-blue-700 font-medium text-lg
              transition-colors duration-200 hover:underline"
          >
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
};

// Main Home Component
function Home() {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { user, logout } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  function handleNavigation(path) {
    router.push(path);
  }

  function handleLogout() {
    logout();
    showToast("info", "Logged out successfully");
  }

  // Show loading screen during initial mount
  if (!mounted) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 
      flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-5xl">
        <div className="text-center space-y-6 mb-10">
          <div className="inline-flex items-center gap-4">
            <FaHeadset className="text-5xl text-blue-600" />
            <h1 className="text-6xl font-bold text-gray-800 tracking-tight">
              Medi Mate
            </h1>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl 
          p-8 lg:p-10 space-y-8 border border-gray-100">
          {mounted && (
            user ? (
              <AuthenticatedMenu 
                onNavigate={handleNavigation}
                onLogout={handleLogout}
                userName={user.name}
              />
            ) : (
              <UnauthenticatedContent features={FEATURES} />
            )
          )}
        </div>
      </div>
    </div>
  );
}

// Add display names for debugging
Home.displayName = 'Home';
FeatureCard.displayName = 'FeatureCard';
NavButton.displayName = 'NavButton';
ActionButton.displayName = 'ActionButton';
LoadingScreen.displayName = 'LoadingScreen';
AuthenticatedMenu.displayName = 'AuthenticatedMenu';
UnauthenticatedContent.displayName = 'UnauthenticatedContent';

// Export with no SSR to prevent hydration issues
const HomeWithNoSSR = dynamic(() => Promise.resolve(Home), {
  ssr: false
});

export default HomeWithNoSSR;
