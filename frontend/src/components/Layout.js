import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import AuthContext from "../context/AuthContext";
import Sidebar from "./SideBar";

const Layout = ({ children }) => {
  const { user } = useContext(AuthContext); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

  // Redirect unauthenticated users to the login page
  useEffect(() => {
    if (user === null) { 
      router.push("/login");
    }
  }, [user, router]);


  const toggleSidebar = (open) => setIsSidebarOpen(open);

  if (user === undefined) {
    return <div>Loading...</div>; 
  }

  return (
    <div className="flex flex-col lg:flex-row z-56">
      
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

  
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "lg:ml-64 ml-0" : "ml-0"
        } lg:ml-64`}
      >
        <main className="min-h-screen bg-gray-100">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
