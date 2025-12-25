import React, { useEffect, useRef, memo, useCallback } from 'react';
import { FaTimes, FaSpinner } from 'react-icons/fa';
import { createPortal } from 'react-dom';

// Backdrop Component
function Backdrop({ onClose, variant = 'default' }) {
  return (
    <div 
      className={`fixed inset-0 transition-opacity duration-300 ${
        variant === 'blur' ? 'bg-black/30 backdrop-blur-sm' : 'bg-black/50'
      }`}
      onClick={onClose}
      aria-hidden="true"
    />
  );
}
Backdrop.displayName = 'Backdrop';

// Close Button Component
function CloseButton({ onClose, className = '' }) {
  return (
    <button
      onClick={onClose}
      className={`absolute right-4 top-4 p-2 rounded-lg text-gray-400 hover:text-gray-500 
        hover:bg-gray-100/80 transition-all duration-200 ${className}`}
      aria-label="Close modal"
    >
      <FaTimes className="w-4 h-4" />
    </button>
  );
}
CloseButton.displayName = 'CloseButton';

// Modal Header Component
function ModalHeader({ title, subtitle, icon: Icon, variant = 'default' }) {
  if (!title && !subtitle && !Icon) return null;

  return (
    <div className="px-6 pt-6 pb-0">
      <div className="flex items-center gap-4">
        {Icon && (
          <div className={`p-3 rounded-full ${
            variant === 'danger' ? 'bg-red-100 text-red-600' :
            variant === 'success' ? 'bg-green-100 text-green-600' :
            'bg-blue-100 text-blue-600'
          }`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
        <div>
          {title && (
            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          )}
          {subtitle && (
            <p className="text-gray-600 mt-1">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
}
ModalHeader.displayName = 'ModalHeader';

// Modal Footer Component
function ModalFooter({
  primaryAction,
  secondaryAction,
  primaryLabel = 'Confirm',
  secondaryLabel = 'Cancel',
  primaryVariant = 'primary',
  isSubmitting = false
}) {
  if (!primaryAction && !secondaryAction) return null;

  return (
    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
      <div className="flex justify-end gap-3">
        {secondaryAction && (
          <button
            onClick={secondaryAction}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border 
              border-gray-300 rounded-md hover:bg-gray-50"
          >
            {secondaryLabel}
          </button>
        )}
        {primaryAction && (
          <button
            onClick={primaryAction}
            disabled={isSubmitting}
            className={`px-4 py-2 text-sm font-medium text-white rounded-md 
              focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200
              ${primaryVariant === 'danger' ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' :
                primaryVariant === 'success' ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500' :
                'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
              } disabled:opacity-50`}
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <FaSpinner className="animate-spin mr-2" />
                Loading...
              </div>
            ) : primaryLabel}
          </button>
        )}
      </div>
    </div>
  );
}
ModalFooter.displayName = 'ModalFooter';

// Main Modal Component
function Modal({ 
  isOpen, 
  onClose,
  children,
  size = 'default',
  animation = 'scale',
  position = 'center',
  showClose = true,
  preventClose = false,
  title,
  subtitle,
  icon,
  headerVariant,
  primaryAction,
  secondaryAction,
  primaryLabel,
  secondaryLabel,
  primaryVariant,
  isSubmitting,
  isLoading,
  backdropVariant = 'default'
}) {
  const modalRef = useRef(null);

  // Memoize the escape key handler
  const handleEscape = useCallback((e) => {
    if (e.key === 'Escape' && !preventClose) onClose();
  }, [onClose, preventClose]);

  // Handle scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = '15px'; // Prevent layout shift
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    };
  }, [isOpen]);

  // Handle keyboard events
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, handleEscape]);

  // Focus management
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();

      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstFocusable = focusableElements[0];
      const lastFocusable = focusableElements[focusableElements.length - 1];

      const handleTabKey = (e) => {
        if (e.key === 'Tab') {
          if (e.shiftKey) {
            if (document.activeElement === firstFocusable) {
              lastFocusable.focus();
              e.preventDefault();
            }
          } else {
            if (document.activeElement === lastFocusable) {
              firstFocusable.focus();
              e.preventDefault();
            }
          }
        }
      };

      modalRef.current.addEventListener('keydown', handleTabKey);
      return () => modalRef.current?.removeEventListener('keydown', handleTabKey);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    default: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-full mx-4'
  };

  const animationClasses = {
    scale: 'animate-modal-enter',
    slideUp: 'animate-slide-up',
    slideDown: 'animate-slide-down',
    fade: 'animate-fade-in'
  };

  const positionClasses = {
    center: 'items-center',
    top: 'items-start pt-20',
    bottom: 'items-end pb-20'
  };

  const modalContent = (
    <div className="fixed inset-0 z-[100] overflow-y-auto">
      <Backdrop onClose={!preventClose ? onClose : undefined} variant={backdropVariant} />

      <div className={`flex min-h-full justify-center p-4 ${positionClasses[position]}`}>
        <div
          ref={modalRef}
          className={`relative w-full ${sizeClasses[size]} transform overflow-hidden 
            rounded-xl bg-white shadow-2xl transition-all duration-300 ${animationClasses[animation]}`}
          role="dialog"
          aria-modal="true"
          tabIndex={-1}
          style={{ zIndex: 101 }}
        >
          {showClose && !preventClose && <CloseButton onClose={onClose} />}

          <ModalHeader 
            title={title}
            subtitle={subtitle}
            icon={icon}
            variant={headerVariant}
          />

          <div className="p-6">
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <FaSpinner className="w-8 h-8 text-blue-500 animate-spin" />
              </div>
            ) : (
              children
            )}
          </div>

          {(primaryAction || secondaryAction) && (
            <ModalFooter
              primaryAction={primaryAction}
              secondaryAction={secondaryAction}
              primaryLabel={primaryLabel}
              secondaryLabel={secondaryLabel}
              primaryVariant={primaryVariant}
              isSubmitting={isSubmitting}
            />
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

Modal.displayName = 'Modal';

export default memo(Modal);
