import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext({
  user: null,
  token: null,
  loading: true,
  login: async () => {},
  logout: () => {},
  register: async () => {},
  isAuthenticated: false,
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    checkUser();
  }, []);

  const checkUser = () => {
    if (typeof window === 'undefined') {
      setLoading(false);
      return;
    }
    
    try {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        const decoded = jwtDecode(storedToken);
        const currentTime = Date.now() / 1000;
        
        if (decoded.exp < currentTime) {
          logout();
        } else {
          setUser(decoded);
          setToken(storedToken);
          axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        }
      }
    } catch (error) {
      console.error('Auth check error:', error);
      logout();
    }
    setLoading(false);
  };

  const login = async (credentials) => {
    if (typeof window === 'undefined') return { success: false };

    try {
      // Use environment variable - same as register
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://medi-ai-backend.onrender.com';
      const loginUrl = `${apiUrl}/api/auth/login`;
      
      console.log('🔍 Attempting login to:', loginUrl);
      console.log('🔍 API URL from env:', process.env.NEXT_PUBLIC_API_URL);
      console.log('🔍 Credentials:', { email: credentials.email, password: '***' });
      
      const response = await axios.post(loginUrl, credentials, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true
      });
      
      console.log('📥 Login response:', response.data);
      
      // Check if response has success field and token
      if (!response.data.success) {
        console.error('❌ Login failed - no success flag:', response.data);
        return {
          success: false,
          error: response.data.message || 'Login failed'
        };
      }
      
      const { token: newToken } = response.data;
      
      if (!newToken) {
        console.error('❌ No token received from login response:', response.data);
        return {
          success: false,
          error: 'No token received from server'
        };
      }
      
      console.log('✅ Login successful, storing token');
      localStorage.setItem('token', newToken);
      const decoded = jwtDecode(newToken);
      setUser(decoded);
      setToken(newToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      router.push('/');
      return { success: true };
    } catch (error) {
      console.error('❌ Login error:', error);
      console.error('❌ Error response:', error.response?.data);
      console.error('❌ Error status:', error.response?.status);
      console.error('❌ Error message:', error.message);
      
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      return {
        success: false,
        error: errorMessage
      };
    }
  };

  const logout = () => {
    if (typeof window === 'undefined') return;

    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
    delete axios.defaults.headers.common['Authorization'];
    router.push('/login');
  };

  const register = async (userData) => {
    if (typeof window === 'undefined') return { success: false };

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://medi-ai-backend.onrender.com';
      const registerUrl = `${apiUrl}/api/auth/register`;
      
      console.log('🔍 Attempting registration to:', registerUrl);
      
      const response = await axios.post(registerUrl, userData, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true
      });
      
      console.log('📥 Registration response:', response.data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ Registration error:', error);
      console.error('❌ Error response:', error.response?.data);
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed'
      };
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    register,
    isAuthenticated: !!user,
  };

  // Return null during SSR
  if (typeof window === 'undefined') {
    return null;
  }

  // Return null until mounted on client
  if (!mounted) {
    return null;
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
