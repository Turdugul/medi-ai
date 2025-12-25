import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { registerUser } from "./api/auth";
import { showToast } from "../components/Toast";
import { FaUser, FaEnvelope, FaLock, FaSpinner } from "react-icons/fa";
import AuthLayout from "@/components/auth/AuthLayout";

export default function Register() {
  const { handleSubmit, setValue, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      const response = await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      if (response?.success) {
        showToast("success", "Registration successful! Redirecting...");
        setTimeout(() => router.push("/login"), 3000);
      } else {
        throw new Error(response?.message || "Unexpected response from server.");
      }
    } catch (error) {
      showToast("error", error.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Create Account" subtitle="Join Medi Mate today">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Name Input */}
        <div className="space-y-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaUser className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Enter your full name"
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg
                text-gray-900 placeholder-gray-500
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                transition-colors duration-200"
              onChange={(e) => setValue("name", e.target.value, { shouldValidate: true })}
            />
          </div>
          {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
        </div>

        {/* Email Input */}
        <div className="space-y-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaEnvelope className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              placeholder="Enter your email"
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg
                text-gray-900 placeholder-gray-500
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                transition-colors duration-200"
              onChange={(e) => setValue("email", e.target.value, { shouldValidate: true })}
            />
          </div>
          {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
        </div>

        {/* Password Input */}
        <div className="space-y-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaLock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="password"
              placeholder="Create a strong password"
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg
                text-gray-900 placeholder-gray-500
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                transition-colors duration-200"
              onChange={(e) => setValue("password", e.target.value, { shouldValidate: true })}
            />
          </div>
          {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
        </div>

        {/* Submit Button */}
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
              Creating account...
            </div>
          ) : (
            "Create Account"
          )}
        </button>

        {/* Login Link */}
        <div className="text-center space-y-2">
          <p className="text-gray-600">Already have an account?</p>
          <Link 
            href="/login" 
            className="inline-block text-blue-600 hover:text-blue-700 font-medium
              transition-colors duration-200 hover:underline"
          >
            Sign in instead
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
