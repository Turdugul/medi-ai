import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router"; 
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { LuSquareMenu } from "react-icons/lu";
import { SidebarLink } from "./ActiveLink";
import { FaSignOutAlt, FaHeadset, FaList, FaUser } from "react-icons/fa";

function Logo() {
  return (
    <Link 
      href="/" 
      className="flex items-center space-x-2 transform hover:scale-[0.98] transition-all duration-200"
    >
      <FaHeadset className="h-7 w-7 text-white/90" />
      <span className="text-2xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
        Medi Mate
      </span>
    </Link>
  );
}

function MobileHeader({ onToggle, isOpen }) {
  return (
    <div className="lg:hidden flex items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 shadow-lg">
      <Logo />
      <button
        onClick={() => onToggle(!isOpen)}
        className="p-2 text-white hover:bg-white/10 rounded-lg transition-all duration-200 
          hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/20"
        aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
        aria-expanded={isOpen}
      >
        <LuSquareMenu className="text-2xl" />
      </button>
    </div>
  );
}

function UserProfile({ user }) {
  if (!user) return null;
  
  return (
    <div className="px-4 py-4 border-b border-white/10">
      <div className="flex items-center space-x-3 px-2">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/10 to-white/5 
          flex items-center justify-center">
          <FaUser className="text-white/80 text-lg" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-medium truncate">{user.email}</p>
          <p className="text-white/60 text-sm truncate">Active Session</p>
        </div>
      </div>
    </div>
  );
}

function Navigation() {
  return (
    <nav className="p-4 flex-1 overflow-y-auto">
      <ul className="space-y-2">
        <li>
          <SidebarLink href="/assistant">
            <div className="flex items-center gap-3 py-2.5 px-4 rounded-xl transition-all duration-200">
              <FaHeadset className="text-lg" />
              <span className="font-medium">Assistant</span>
            </div>
          </SidebarLink>
        </li>
        <li>
          <SidebarLink href="/audiolist">
            <div className="flex items-center gap-3 py-2.5 px-4 rounded-xl transition-all duration-200">
              <FaList className="text-lg" />
              <span className="font-medium">Audio List</span>
            </div>
          </SidebarLink>
        </li>
        <li>
          <SidebarLink href="/profile">
            <div className="flex items-center gap-3 py-2.5 px-4 rounded-xl transition-all duration-200">
              <FaUser className="text-lg" />
              <span className="font-medium">Profile</span>
            </div>
          </SidebarLink>
        </li>
      </ul>
    </nav>
  );
}

function Sidebar({ isOpen = false, onToggle }) {
  const { logout, user } = useAuth();
  const sidebarRef = useRef(null);
  const router = useRouter();
  
  // Default no-op function if onToggle is not provided
  const handleToggle = onToggle || (() => {});

  useEffect(() => {
    function handleClickOutside(event) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        handleToggle(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleToggle]);

  useEffect(() => {
    function handleRouteChange() {
      handleToggle(false);
    }

    router.events.on("routeChangeStart", handleRouteChange);
    return () => router.events.off("routeChangeStart", handleRouteChange);
  }, [router, handleToggle]);

  useEffect(() => {
    function handleEscape(e) {
      if (e.key === 'Escape') handleToggle(false);
    }

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [handleToggle]);

  function handleLogout() {
    logout();
  }

  return (
    <>
      <MobileHeader onToggle={handleToggle} isOpen={isOpen} />

      <div
        className={`
          fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden
          transition-opacity duration-300
          ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
        onClick={() => handleToggle(false)}
        aria-hidden="true"
      />

      <aside
        ref={sidebarRef}
        className={`
          fixed z-50 h-screen lg:w-64 w-[280px] max-w-full
          bg-gradient-to-b from-blue-500 via-purple-800 to-indigo-800
          shadow-2xl backdrop-blur-sm
          transition-all duration-300 ease-out
          border-r border-white/10
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="p-6 border-b border-white/10">
          <Logo />
        </div>

        <UserProfile user={user} />
        <Navigation />

        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 py-2.5 px-4 
              bg-gradient-to-r from-red-500 to-red-600 
              text-white rounded-xl font-medium 
              shadow-lg hover:shadow-xl 
              transform hover:-translate-y-0.5 hover:from-red-600 hover:to-red-700
              transition-all duration-200 active:scale-95
              focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            <FaSignOutAlt className="text-lg" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}

// Add display names for debugging
Sidebar.displayName = 'Sidebar';
Logo.displayName = 'Logo';
MobileHeader.displayName = 'MobileHeader';
UserProfile.displayName = 'UserProfile';
Navigation.displayName = 'Navigation';

export default Sidebar;
