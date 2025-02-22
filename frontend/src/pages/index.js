import { useEffect, useContext, useState } from "react";
import { useRouter } from "next/router";
import AuthContext from "@/context/AuthContext";
import Link from "next/link";
import { FaUser, FaSignOutAlt, FaMicrophone, } from "react-icons/fa";
import { MdRecordVoiceOver } from "react-icons/md";

const Home = () => {
  const { user, logout } = useContext(AuthContext);
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user === null && router.pathname !== '/') {
      router.push("/login");
    } else {
      setLoading(false);
    }
  }, [user, router]);

  const handleNavigation = (path) => {
    if (!user) {
      router.push("/login");
    } else {
      router.push(path);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const renderAuthenticatedMenu = () => (
    <div className="mt-6 space-y-4">
      <button onClick={() => handleNavigation("/assistant")} className="btn-purple">
        <MdRecordVoiceOver className="mr-2" />  Go to Assistant Page
      </button>
      <button onClick={() => handleNavigation("/audiolist")} className="btn-purple">
        <FaMicrophone className="mr-2" /> Go to Audiolist Page
      </button>
      <button onClick={() => handleNavigation("/profile")} className="btn-purple">
        <FaUser className="mr-2" /> Profile
      </button>
      <button onClick={handleLogout} className="flex items-center px-4 py-2 w-full text-white bg-red-600 rounded-lg hover:bg-red-700">
        <FaSignOutAlt className="mr-2" /> Logout
      </button>
    </div>
  );

  const renderUnauthenticatedContent = () => (
   
      <div className="w-full max-w-md  mt-6 p-6 shadow-2xl rounded-2xl bg-white text-center">
        <p className="text-gray-600 mt-4">Welcome, Guest!</p>
        <p className="text-gray-600 mt-4">You need to login to access other pages.</p>
        <Link href="/login" className="text-blue-500 mt-2 inline-block">Login</Link>
        <p className="text-gray-600 mt-4">Don't have an account?</p>
        <Link href="/register" className="text-blue-500 mt-2 inline-block">Register</Link>
      </div>
    
  );

  if (loading) {
    return <div className="text-center text-gray-600">Loading user info...</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg p-6 shadow-lg rounded-2xl bg-white text-center">
        <h3 className="text-xl font-bold text-gray-800">Medi Mate – Dentist’s Assistant Home Page</h3>
        {user ? (
          <>
            <div className="flex justify-center items-center mt-4">
              <FaUser className="text-2xl text-purple-800 mr-2" />
              <p className="text-gray-600 text-lg">Welcome, {user.name}!</p>
            </div>
            {renderAuthenticatedMenu()}
          </>
        ) : (
          renderUnauthenticatedContent()
        )}
      </div>
    </div>
  );
};

export default Home;
