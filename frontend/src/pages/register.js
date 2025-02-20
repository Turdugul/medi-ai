import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { registerUser } from "./api/auth";
import { showToast } from "../components/Toast";

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
    <div className="flex flex-col gap-3 items-center justify-center min-h-screen bg-gray-100 px-4">
      <h2 className="text-3xl font-bold">Medi Mate</h2>

      <div className="p-6 bg-white shadow-lg rounded-md w-full max-w-sm">
        <h3 className="text-xl text-center">Register</h3>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name Input */}
          <div>
            <label className="block text-gray-700 mb-1">Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              onChange={(e) => setValue("name", e.target.value, { shouldValidate: true })}
            />
            {errors.name && <p className="text-red-500">{errors.name.message}</p>}
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              onChange={(e) => setValue("email", e.target.value, { shouldValidate: true })}
            />
            {errors.email && <p className="text-red-500">{errors.email.message}</p>}
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-gray-700 mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter a strong password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              onChange={(e) => setValue("password", e.target.value, { shouldValidate: true })}
            />
            {errors.password && <p className="text-red-500">{errors.password.message}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md mt-4"
            disabled={loading}
          >
            {loading ? "Loading..." : "Register"}
          </button>
        </form>

        <p className="text-center mt-4">
          Already have an account? <Link href="/login" className="text-blue-500">Login</Link>
        </p>
      </div>
    </div>
  );
}
