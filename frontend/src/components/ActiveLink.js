import React, { memo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

// Memoize the background glow effect
const BackgroundGlow = memo(() => (
  <div 
    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100
      transition-opacity duration-300 pointer-events-none
      bg-gradient-to-r from-blue-500/20 to-indigo-500/20 blur"
    aria-hidden="true"
  />
));

// Memoize the active indicator
const ActiveIndicator = memo(() => (
  <div 
    className="absolute left-0 top-1/1 -translate-y-1/2 w-1 h-8 
      bg-white rounded-r-full shadow-lg animate-fade-in"
    aria-hidden="true"
  />
));

// Memoize the status indicator
const StatusIndicator = memo(({ isActive }) => (
  <div 
    className={`
      absolute right-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full
      transition-all duration-300
      ${isActive ? 'bg-white' : 'bg-blue-400/0 group-hover:bg-blue-400/50'}
    `}
    aria-hidden="true"
  />
));

export const SidebarLink = memo(({ href, children }) => {
  const router = useRouter();
  const isActive = router.pathname === href;

  return (
    <Link
      href={href}
      className={`
        group relative flex items-center w-full px-4 py-2.5 rounded-xl
        transition-all duration-200 ease-in-out
        ${isActive 
          ? 'text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md' 
          : 'text-gray-100 hover:text-gray-100 hover:bg-gradient-to-r hover:from-blue-600/90 hover:to-indigo-600/90'
        }
      `}
    >
      {/* Background Glow Effect - Only show when not active */}
      {!isActive && <BackgroundGlow />}

      {/* Active Indicator */}
      {isActive && <ActiveIndicator />}

      {/* Content */}
      <div className="relative flex items-center gap-3">
        {children}
      </div>

      {/* Status Indicator */}
      <StatusIndicator isActive={isActive} />
    </Link>
  );
});

export const ActiveLink = memo(({ href, children, className = '' }) => {
  const router = useRouter();
  const isActive = router.pathname === href;

  return (
    <Link
      href={href}
      className={`
        relative inline-flex items-center transition-colors duration-200
        ${isActive 
          ? 'text-blue-600 font-medium' 
          : 'text-gray-600 hover:text-blue-600'
        }
        ${className}
      `}
    >
      <span className="relative">
        {children}
        {/* Underline - Only animate on hover when not active */}
        <span 
          className={`
            absolute bottom-0 left-0 w-full h-0.5 rounded-full
            transition-transform duration-300
            ${isActive 
              ? 'bg-blue-600' 
              : 'bg-blue-400 scale-x-0 group-hover:scale-x-100'
            }
          `}
          aria-hidden="true"
        />
      </span>
    </Link>
  );
});

export default ActiveLink;
  