import { useEffect, useContext, useState, memo, useCallback, useMemo } from "react";
import { useRouter } from "next/router";
import AuthContext from "@/context/AuthContext";
import Link from "next/link";
import { FaUser, FaSignOutAlt, FaMicrophone, FaHeadset } from "react-icons/fa";
import { MdRecordVoiceOver, MdOutlineWavingHand } from "react-icons/md";
import { showToast } from "@/components/Toast";
import { FaChartLine, FaLock } from "react-icons/fa6";

// Memoized Feature Card Component
const FeatureCard = memo(({ icon: Icon, title, description }) => (
  <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-100
    hover:shadow-xl hover:scale-[1.02] transition-all duration-200 animate-fade-in-up">
    <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-500 
      w-12 h-12 rounded-lg shadow-lg flex items-center justify-center mb-4">
      <Icon className="text-white text-xl" />
    </div>
    <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600 text-sm">{description}</p>
  </div>
));

// Memoized Navigation Button Component
const NavButton = memo(({ onClick, gradient, icon: Icon, title, subtitle }) => (
  <button 
    onClick={onClick}
    className={`bg-gradient-to-r ${gradient} text-white p-4 
      rounded-xl font-medium shadow-md hover:shadow-xl 
      transform hover:-translate-y-0.5 transition-all duration-200 
      flex items-center gap-3 animate-fade-in-up`}
  >
    <div className="p-2 bg-white/10 rounded-lg">
      <Icon className="text-xl" />
    </div>
    <div className="text-left">
      <div className="font-semibold">{title}</div>
      <div className="text-sm text-white/80">{subtitle}</div>
    </div>
  </button>
));

// Memoized Action Button Component
const ActionButton = memo(({ onClick, gradient, icon: Icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex-1 bg-gradient-to-r ${gradient} text-white 
      py-3 px-4 rounded-xl font-medium shadow-md hover:shadow-xl 
      transform hover:-translate-y-0.5 transition-all duration-200 
      flex items-center justify-center gap-2 animate-fade-in-up`}
  >
    <Icon className="text-lg" />
    <span>{label}</span>
  </button>
));

// Memoized Loading Component
const LoadingScreen = memo(() => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 
    flex items-center justify-center">
    <div className="flex flex-col items-center gap-4 p-8 rounded-2xl 
      bg-white/50 backdrop-blur-sm shadow-xl animate-fade-in">
      <FaHeadset className="text-4xl text-blue-600 animate-pulse" />
      <div className="text-gray-600 font-medium">Loading Medi Mate...</div>
    </div>
  </div>
));

// Memoized Authenticated Menu Component
const AuthenticatedMenu = memo(({ onNavigate, onLogout }) => (
  <div className="mt-8 space-y-4">
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
));

// Memoized Unauthenticated Content Component
const UnauthenticatedContent = memo(({ features }) => (
  <div className="space-y-8">
    <div className="text-center space-y-2 animate-fade-in-up">
      <MdOutlineWavingHand className="text-4xl text-yellow-500 mx-auto mb-2" />
      <h3 className="text-xl font-semibold text-gray-800">Welcome to Medi Mate</h3>
      <p className="text-gray-600">Your AI-powered dental assistant</p>
    </div>
    
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {features.map((feature, index) => (
        <FeatureCard key={index} {...feature} />
      ))}
    </div>
    
    <div className="space-y-4 animate-fade-in-up">
      <Link 
        href="/login" 
        className="block w-full bg-gradient-to-r from-blue-600 to-indigo-600 
          text-white py-3 px-4 rounded-xl font-medium shadow-md hover:shadow-xl 
          transform hover:-translate-y-0.5 transition-all duration-200 text-center"
      >
        Sign In
      </Link>
      
      <div className="text-center space-y-2">
        <p className="text-gray-500">Don't have an account?</p>
        <Link 
          href="/register" 
          className="text-blue-600 hover:text-blue-700 font-medium 
            transition-colors duration-200 hover:underline"
        >
          Create account
        </Link>
      </div>
    </div>
  </div>
));

const Home = () => {
  const { user, logout } = useContext(AuthContext);
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // Memoized features array
  const features = useMemo(() => [
    {
      icon: MdRecordVoiceOver,
      title: "Voice Recording",
      description: "Record your dental notes with high-quality audio capture"
    },
    {
      icon: FaChartLine,
      title: "Smart Analysis",
      description: "AI-powered transcription and analysis of dental records"
    },
    {
      icon: FaLock,
      title: "Secure Storage",
      description: "Your data is encrypted and stored securely"
    }
  ], []);

  // Memoized handlers
  const handleNavigation = useCallback((path) => {
    if (!user) {
      router.push("/login");
    } else {
      router.push(path);
    }
  }, [user, router]);

  const handleLogout = useCallback(() => {
    logout();
    router.push("/");
    showToast("info", "Logged out successfully");
  }, [logout, router]);

  useEffect(() => {
    if (user === null && router.pathname !== '/') {
      router.push("/login");
    } else {
      setLoading(false);
    }
  }, [user, router]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 
      flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-4xl">
        <div className="text-center space-y-4 mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-3 mb-2">
            <FaHeadset className="text-4xl text-blue-600" />
            <h1 className="text-5xl font-bold text-gray-800 tracking-tight">
              Medi Mate
            </h1>
          </div>
          <p className="text-xl text-gray-600">
            {user 
              ? `Welcome back, ${user.name}!` 
              : "Your AI-Powered Dental Assistant"
            }
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl 
          p-6 lg:p-8 space-y-6 border border-gray-100 animate-fade-in">
          {user ? (
            <AuthenticatedMenu 
              onNavigate={handleNavigation}
              onLogout={handleLogout}
            />
          ) : (
            <UnauthenticatedContent features={features} />
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(Home);
