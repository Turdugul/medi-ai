import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/router"; 

import Link from "next/link";
import AuthContext from "../context/AuthContext";
import { LuSquareMenu } from "react-icons/lu";
import { SidebarLink } from "./ActiveLink";
import { FaSignOutAlt } from "react-icons/fa";


export const Sidebar = () => {
  const { logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleRouteChange = () => setIsOpen(false);
    router.events.on("routeChangeStart", handleRouteChange);

    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [router]);

  return (
    <>
      <div className="lg:hidden flex flex-row justify-between bg-purple-500 p-4">
        <Link href="/" passHref className="text-white">
          Medi Mate
        </Link>
        <button
    onClick={toggleSidebar}
    className="text-white"
  >
    {!isOpen ? (
      <LuSquareMenu/>  
    ) : (
      ""
    )}
  </button>
      </div>
      <aside
        className={`lg:w-64 w-full fixed z-50 text-white bg-gray-600 top-15 sm:top-0 h-screen p-5 transition-all duration-300 ease-in-out ${isOpen ? "block" : "hidden"} lg:block`}
      >
        <div className="text-xl font-bold text-white mb-6">
          <Link href="/" passHref>
            Medi Mate
          </Link>
        </div>

        
        <nav>
          <ul className="space-y-4">
          <li>
              <SidebarLink href="/assistant">
                 Assistant
              </SidebarLink>
            </li>
            <li>
              <SidebarLink href="/audiolist">
                Audio List
              </SidebarLink>
            </li>
            <li>
              <SidebarLink href="/profile">
              
                 Profile
              </SidebarLink>
            </li>
            <li>
              <button
                onClick={() => {
                  logout();
                }}
                className="flex flex-row items-center py-2 px-4 bg-red-600 hover:bg-red-500 rounded text-white"
              >  <FaSignOutAlt className="text-lg text-white" />
                   <span className="ml-2"> Logout</span>
              </button>
            </li>
          </ul>
        </nav>
       
      </aside>
    </>
  );
};

export default Sidebar;
