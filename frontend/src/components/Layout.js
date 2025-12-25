import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import  { useAuth } from "../context/AuthContext";
import Sidebar from "./SideBar";
import { FiLoader } from "react-icons/fi";

function LoadingOverlay({ message }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 p-8 rounded-2xl bg-white/50 backdrop-blur-sm shadow-xl">
        <FiLoader className="w-8 h-8 text-blue-500 animate-spin" />
        <div className="text-gray-600 font-medium animate-pulse">
          {message}
        </div>
      </div>
    </div>
  );
}

function BackgroundPattern() {
  return (
    <div 
      className="absolute inset-0 bg-grid-pattern opacity-[0.015] pointer-events-none"
      aria-hidden="true"
    />
  );
}

function MainContent({ children, isSidebarOpen, isPageLoading }) {
  return (
    <div
      className={`
        flex-1 transition-all duration-300 ease-out
        ${isSidebarOpen ? "lg:ml-64 ml-0" : "ml-0"}
        lg:ml-64 relative
      `}
    >
      {isPageLoading && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-50">
          <FiLoader className="w-6 h-6 text-blue-500 animate-spin" />
        </div>
      )}

      <main className="min-h-screen p-4 lg:p-6">
        <div className="w-full h-full rounded-2xl bg-white/70 backdrop-blur-sm shadow-xl p-4 lg:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}

function Layout({ children }) {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    function handleStart() {
      setIsPageLoading(true);
    }

    function handleComplete() {
      setIsPageLoading(false);
    }

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  useEffect(() => {
    if (user === null) {
      router.push("/login");
    }
  }, [user, router]);

  if (user === undefined) {
    return <LoadingOverlay message="Loading your workspace..." />;
  }

  function handleSidebarToggle(open) {
    setIsSidebarOpen(open);
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 relative overflow-hidden">
      <BackgroundPattern />
      <Sidebar isOpen={isSidebarOpen} onToggle={handleSidebarToggle} />
      <MainContent isSidebarOpen={isSidebarOpen} isPageLoading={isPageLoading}>
        {children}
      </MainContent>
    </div>
  );
}

// Add grid pattern styles
if (typeof document !== 'undefined') {
  const styleId = 'layout-patterns';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      .bg-grid-pattern {
        background-image: linear-gradient(to right, #666 1px, transparent 1px),
          linear-gradient(to bottom, #666 1px, transparent 1px);
        background-size: 24px 24px;
      }
    `;
    document.head.appendChild(style);
  }
}

// Add display names for debugging
Layout.displayName = 'Layout';
LoadingOverlay.displayName = 'LoadingOverlay';
BackgroundPattern.displayName = 'BackgroundPattern';
MainContent.displayName = 'MainContent';

export default Layout;
