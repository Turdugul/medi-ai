import { useForm } from "react-hook-form";
import { useState, useCallback, forwardRef, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { showToast } from "../components/Toast";
import { FaEnvelope, FaLock, FaSpinner } from "react-icons/fa";
import AuthLayout from "@/components/auth/AuthLayout";
import { loginUser } from "./api/auth";
import { useAuth } from "@/context/AuthContext";

// Debug: Log when module loads
if (typeof window !== 'undefined') {
  console.log('🔍 Login page module loaded (client-side)');
  window.__LOGIN_PAGE_LOADED__ = true;
} else {
  console.log('🔍 Login page module loaded (server-side)');
}

// Form validation schema
const EMAIL_PATTERN = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

// Input field component
const FormInput = forwardRef(({ icon: Icon, error, ...props }, ref) => {
  return (
    <div className="space-y-2">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          ref={ref}
          className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg
            text-gray-900 placeholder-gray-500
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            transition-colors duration-200
            disabled:opacity-50 disabled:cursor-not-allowed"
          {...props}
        />
      </div>
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
});

// Submit button component
function SubmitButton({ loading }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 
        text-white py-2.5 rounded-lg font-medium
        transform hover:translate-y-[-1px] hover:shadow-lg
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0
        transition-all duration-200"
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <FaSpinner className="animate-spin -ml-1 mr-2 h-5 w-5" />
          Signing in...
        </div>
      ) : (
        "Sign In"
      )}
    </button>
  );
}

// Register link component
function RegisterLink() {
  return (
    <div className="text-center space-y-2">
      <p className="text-gray-600">Don't have an account?</p>
      <Link 
        href="/register" 
        className="inline-block text-blue-600 hover:text-blue-700 font-medium
          transition-colors duration-200 hover:underline"
      >
        Create an account
      </Link>
    </div>
  );
}

// Main login component
function Login() {
  try {
    console.log('🔍 Login component rendering');
  } catch (e) {
    console.error('❌ Error in Login render:', e);
  }
  
  const { 
    handleSubmit, 
    register, 
    formState: { errors } 
  } = useForm({
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { checkUser } = useAuth(); // Get checkUser from AuthContext to refresh user state
  
  // Debug: Log when component mounts
  useEffect(() => {
    try {
      console.log('🔍 Login component mounted');
      console.log('🔍 loginUser function available:', typeof loginUser);
      console.log('🔍 Router available:', !!router);
      console.log('🔍 Window available:', typeof window !== 'undefined');
    } catch (e) {
      console.error('❌ Error in Login useEffect:', e);
    }
  }, [router]);

  const onSubmit = useCallback(async (data) => {
    console.log('🔍 Login form submitted with data:', { email: data.email, hasPassword: !!data.password });
    setLoading(true);
    try {
      console.log('🔍 Calling loginUser from api/auth (same pattern as register)...');
      const response = await loginUser(data);
      console.log('🔍 Login response:', response);
      
      if (response && response.token) {
        console.log('✅ Login successful, token stored in localStorage');
        
        // CRITICAL FIX: Refresh AuthContext to pick up the new token
        // This ensures the user state is updated immediately
        console.log('🔍 Refreshing AuthContext to update user state...');
        if (checkUser && typeof checkUser === 'function') {
          checkUser();
          console.log('✅ AuthContext refreshed');
        } else {
          console.warn('⚠️ checkUser function not available, will rely on automatic refresh');
        }
        
        showToast("success", "Login successful! Redirecting...");
        
        // Use router.push instead of window.location for better Next.js integration
        // Small delay to ensure state is updated before redirect
        setTimeout(() => {
          console.log('🔍 Redirecting to home page using router...');
          router.push('/');
        }, 300);
      } else {
        // Extract error message from response
        const errorMessage = response?.message || response?.error || "Login failed. Please check your credentials and try again.";
        console.error('❌ Login failed - response:', response);
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('❌ Exception in onSubmit:', error);
      console.error('❌ Error details:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
      
      // Show specific error message from backend or a user-friendly message
      let errorMessage = "Login failed. Please try again.";
      
      if (error.message) {
        errorMessage = error.message;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      
      showToast("error", errorMessage);
    } finally {
      setLoading(false);
    }
  }, [router, checkUser]);

  return (
    <AuthLayout title="Welcome Back!" subtitle="Sign in to your account">
      {/* Debug indicator - remove after debugging */}
      {typeof window !== 'undefined' && (
        <div style={{ 
          position: 'fixed', 
          top: 10, 
          right: 10, 
          background: 'red', 
          color: 'white', 
          padding: '5px 10px', 
          zIndex: 9999,
          fontSize: '12px'
        }}>
          DEBUG: Login Page Loaded
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FormInput
          icon={FaEnvelope}
          type="email"
          placeholder="Enter your email"
          disabled={loading}
          error={errors.email?.message}
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: EMAIL_PATTERN,
              message: "Invalid email address"
            }
          })}
        />

        <FormInput
          icon={FaLock}
          type="password"
          placeholder="Enter your password"
          disabled={loading}
          error={errors.password?.message}
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters"
            }
          })}
        />

        <SubmitButton loading={loading} />
        <RegisterLink />
      </form>
    </AuthLayout>
  );
}

// Add display names for better debugging
FormInput.displayName = 'FormInput';
SubmitButton.displayName = 'SubmitButton';
RegisterLink.displayName = 'RegisterLink';
Login.displayName = 'Login';

export default Login;
