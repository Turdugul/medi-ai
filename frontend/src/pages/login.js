import { useForm } from "react-hook-form";
import { useState, useCallback, forwardRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { showToast } from "../components/Toast";
import { FaEnvelope, FaLock, FaSpinner } from "react-icons/fa";
import AuthLayout from "@/components/auth/AuthLayout";
import { loginUser } from "./api/auth";

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

  const onSubmit = useCallback(async (data) => {
    console.log('🔍 Login form submitted with data:', { email: data.email, hasPassword: !!data.password });
    setLoading(true);
    try {
      console.log('🔍 Calling loginUser from api/auth (same pattern as register)...');
      const response = await loginUser(data);
      console.log('🔍 Login response:', response);
      
      if (response && response.token) {
        console.log('✅ Login successful, token stored');
        showToast("success", "Login successful! Redirecting...");
        // Reload page to let AuthContext pick up the token
        setTimeout(() => {
          window.location.href = '/';
        }, 500);
      } else {
        throw new Error(response?.message || "Login failed");
      }
    } catch (error) {
      console.error('❌ Exception in onSubmit:', error);
      showToast("error", error.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  return (
    <AuthLayout title="Welcome Back!" subtitle="Sign in to your account">
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
