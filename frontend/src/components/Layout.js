import { useState, useContext, useEffect, memo, useCallback } from "react";
import { useRouter } from "next/router";
import AuthContext from "../context/AuthContext";
import Sidebar from "./SideBar";
import { FiLoader } from "react-icons/fi";

// Memoize the loading component
const LoadingOverlay = memo(({ message }) => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
    <div className="flex flex-col items-center gap-4 p-8 rounded-2xl bg-white/50 backdrop-blur-sm shadow-xl">
      <FiLoader className="w-8 h-8 text-blue-500 animate-spin" />
      <div className="text-gray-600 font-medium animate-pulse">
        {message}
      </div>
    </div>
  </div>
));

// Memoize the background pattern component
const BackgroundPattern = memo(() => (
  <div 
    className="absolute inset-0 bg-grid-pattern opacity-[0.015] pointer-events-none"
    aria-hidden="true"
  />
));

// Memoize the main content wrapper
const MainContent = memo(({ children, isSidebarOpen, isPageLoading }) => (
  <div
    className={`
      flex-1 transition-all duration-300 ease-out
      ${isSidebarOpen ? "lg:ml-64 ml-0" : "ml-0"}
      lg:ml-64 relative
    `}
  >
    {/* Page Loading Overlay */}
    {isPageLoading && (
      <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-50">
        <FiLoader className="w-6 h-6 text-blue-500 animate-spin" />
      </div>
    )}

    {/* Main Content Area */}
    <main className="min-h-screen p-4 lg:p-6">
      <div className="w-full h-full rounded-2xl bg-white/70 backdrop-blur-sm shadow-xl p-4 lg:p-6">
        {children}
      </div>
    </main>
  </div>
));

const Layout = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const router = useRouter();

  // Memoize the sidebar toggle function
  const toggleSidebar = useCallback((open) => {
    setIsSidebarOpen(open);
  }, []);

  // Handle route change loading states
  useEffect(() => {
    const handleStart = () => setIsPageLoading(true);
    const handleComplete = () => setIsPageLoading(false);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  // Redirect unauthenticated users to the login page
  useEffect(() => {
    if (user === null) {
      router.push("/login");
    }
  }, [user, router]);

  // Loading state while checking authentication
  if (user === undefined) {
    return <LoadingOverlay message="Loading your workspace..." />;
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 relative overflow-hidden">
      <BackgroundPattern />
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <MainContent isSidebarOpen={isSidebarOpen} isPageLoading={isPageLoading}>
        {children}
      </MainContent>
    </div>
  );
};

// Add grid pattern styles to globals.css
const cssPattern = `
.bg-grid-pattern {
  background-image: linear-gradient(to right, #666 1px, transparent 1px),
    linear-gradient(to bottom, #666 1px, transparent 1px);
  background-size: 24px 24px;
}
`;

// Add pattern styles to document if they don't exist
if (typeof document !== 'undefined') {
  const styleId = 'layout-patterns';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = cssPattern;
    document.head.appendChild(style);
  }
}

export default memo(Layout);
