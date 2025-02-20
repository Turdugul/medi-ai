import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

 
  const decodeToken = (token) => {
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  const isTokenExpired = (token) => {
    const decodedToken = decodeToken(token);
    return decodedToken ? decodedToken.exp * 1000 < Date.now() : true;
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");

      if (storedToken && !isTokenExpired(storedToken)) {
        const decodedToken = decodeToken(storedToken);
        setUser({
          ...decodedToken,
          _id: decodedToken._id || decodedToken.sub || decodedToken.userId || decodedToken.uid,
        });
        setToken(storedToken);
      } else {
        logout(); // Token expired or missing
      }
    }
  }, []);

  const login = (newToken) => {
    if (!isTokenExpired(newToken)) {
      const decodedToken = decodeToken(newToken);
      setUser({
        ...decodedToken,
        _id: decodedToken._id || decodedToken.sub || decodedToken.userId || decodedToken.uid,
      });
      setToken(newToken);
      localStorage.setItem("token", newToken);
    } else {
      logout(); // Log out if the token is expired
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
