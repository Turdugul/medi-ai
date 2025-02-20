import { useRouter } from "next/router";

const { default: Link } = require("next/link");


export const SidebarLink = ({ href, children }) => {
    const router = useRouter();
  
    const isActive = router.pathname === href; 
    const activeClass = isActive ? "border-l-4 border-purple-500" : "";
  
    return (
      <Link href={href} passHref>
        <span
          className={`block py-2 px-4 bg-gray-700 hover:bg-gray-900 rounded ${activeClass}`}
        >
          {children}
        </span>
      </Link>
    );
  };
  