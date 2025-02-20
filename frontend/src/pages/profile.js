import { useContext } from "react";
import { useRouter } from "next/router"; // For navigation
import AuthContext from "../context/AuthContext";
import Layout from "@/components/Layout";
import { FaUser, FaHeadphonesAlt, FaSignOutAlt } from "react-icons/fa"; // Using react-icons for icons
import { MdRecordVoiceOver } from "react-icons/md";
const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const router = useRouter();

  const handleNavigation = (path) => {
    router.push(path);
  };

  const handleLogout = () => {
    logout();
    router.push("/"); // Redirect to homepage after logout
  };

  return (
    <Layout>
      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
        <div className="w-full max-w-md p-6 shadow-lg rounded-2xl bg-white">
          <div className="flex justify-center items-center mb-6">
            <FaUser className="text-4xl text-purple-600 mr-2" />
            <p className="text-2xl text-gray-600">
              Welcome, {user ? user.name : "Guest"}!
            </p>
          </div>

          {/* Navigation Menu */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <MdRecordVoiceOver className="text-lg text-purple-600" />
              <button
                onClick={() => handleNavigation("/assistant")}
                className="text-lg text-gray-700 hover:text-purple-600"
              >
                Go to Assistant Page
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <FaHeadphonesAlt className="text-lg text-purple-600" />
              <button
                onClick={() => handleNavigation("/audiolist")}
                className="text-lg text-gray-700 hover:text-purple-600"
              >
                Go to Audiolist Page
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <FaSignOutAlt className="text-lg text-red-600" />
              <button
                onClick={handleLogout}
                className="text-lg text-red-600 hover:text-red-800"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
