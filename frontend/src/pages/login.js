import { useForm } from "react-hook-form";
import { useState, useContext } from "react";
import { useRouter } from "next/router";
import AuthContext from "../context/AuthContext";
import { loginUser } from "./api/auth";
import Link from "next/link";

import { showToast } from "../components/Toast";

export default function Login() {
  const { handleSubmit, setValue, formState: { errors } } = useForm();
  const { login } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      console.log("🔄 Logging in...");
      const responseData = await loginUser(data);

      if (responseData && responseData.token) {
        login(responseData.token);
        showToast("success", "Login successful! Redirecting...");
        setTimeout(() => router.push("/"), 3000);
      } else {
        throw new Error("Invalid login response.");
      }
    } catch (error) {
      showToast("error", error.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 items-center justify-center min-h-screen bg-gray-100 px-4">
      <h1 className="text-3xl font-bold text-blue-600">Medi Mate</h1>
      <div className="p-6 bg-white shadow-lg rounded-md w-full max-w-sm">
        <h2 className="text-center text-xl font-semibold">Login</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email Field */}
          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              onChange={(e) => setValue("email", e.target.value, { shouldValidate: true })}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-gray-700 mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              onChange={(e) => setValue("password", e.target.value, { shouldValidate: true })}
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded-md mt-2 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </form>

        {/* Register Link */}
        <p className="text-center mt-4">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-blue-500">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
