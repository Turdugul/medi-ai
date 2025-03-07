import { useContext, useState, useCallback, memo } from "react";
import { useRouter } from "next/router";
import AuthContext from "../context/AuthContext";
import Layout from "@/components/Layout";
import { 
  FaUser, 
  FaHeadphonesAlt, 
  FaSignOutAlt, 
  FaEnvelope
} from "react-icons/fa";
import { MdRecordVoiceOver } from "react-icons/md";
import { showToast } from "@/components/Toast";

// Memoize the action button component
const ActionButton = memo(({ icon: Icon, label, onClick, variant = "primary" }) => {
  const baseClasses = "flex items-center gap-3 px-4 py-3 rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200";
  const variants = {
    primary: "bg-gradient-to-r from-blue-600 to-indigo-600 text-white",
    secondary: "bg-gradient-to-r from-purple-600 to-pink-600 text-white",
    danger: "text-red-600 hover:bg-red-50"
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]}`}
    >
      <Icon className={variant === "danger" ? "w-4 h-4" : "text-xl"} />
      <span>{label}</span>
    </button>
  );
});

// Memoize the profile header component
const ProfileHeader = memo(({ user }) => (
  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-100">
    <div className="flex items-center gap-6">
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500
        flex items-center justify-center shadow-lg">
        <FaUser className="text-white text-3xl" />
      </div>
      <div>
        <h1 className="text-2xl font-bold text-gray-800">{user?.name || "User"}</h1>
        <p className="text-gray-600 flex items-center gap-2">
          <FaEnvelope className="text-gray-400" />
          {user?.email || "email@example.com"}
        </p>
      </div>
    </div>
  </div>
));

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const router = useRouter();

  // Memoize callback functions
  const handleNavigation = useCallback((path) => {
    router.push(path);
  }, [router]);

  const handleLogout = useCallback(() => {
    logout();
    router.push("/");
    showToast("info", "Logged out successfully");
  }, [logout, router]);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <ProfileHeader user={user} />

          {/* Quick Actions */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ActionButton
                icon={MdRecordVoiceOver}
                label="New Recording"
                onClick={() => handleNavigation("/assistant")}
                variant="primary"
              />
              <ActionButton
                icon={FaHeadphonesAlt}
                label="View Recordings"
                onClick={() => handleNavigation("/audiolist")}
                variant="secondary"
              />
            </div>
          </div>

          {/* Account Settings */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Account Settings</h2>
            <div className="space-y-3">
              <ActionButton
                icon={FaSignOutAlt}
                label="Logout"
                onClick={handleLogout}
                variant="danger"
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default memo(Profile);
