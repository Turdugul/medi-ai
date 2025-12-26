// Determine API URL based on environment
const getApiBaseUrl = () => {
  // If explicitly set, use it (highest priority)
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  // In browser, check hostname to determine environment
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    
    // If we're on Render (production), use production backend
    if (hostname.includes('onrender.com') || hostname.includes('vercel.app')) {
      return 'https://medi-ai-backend.onrender.com';
    }
    
    // For localhost, use local backend
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:5000';
    }
  }
  
  // Server-side: check NODE_ENV
  if (process.env.NODE_ENV === 'production') {
    return 'https://medi-ai-backend.onrender.com';
  }
  
  // Default to localhost for development
  return 'http://localhost:5000';
};

const API_BASE_URL = getApiBaseUrl();

// Force console log that will definitely show
if (typeof window !== 'undefined') {
  window.__API_BASE_URL__ = API_BASE_URL;
  window.__NEXT_PUBLIC_API_URL__ = process.env.NEXT_PUBLIC_API_URL;
  console.log('🔍 API_BASE_URL initialized:', API_BASE_URL);
  console.log('🔍 NEXT_PUBLIC_API_URL from env:', process.env.NEXT_PUBLIC_API_URL);
  console.log('🔍 Current hostname:', window.location.hostname);
  console.log('🔍 Window object available, API module loaded');
} else {
  console.log('🔍 API_BASE_URL initialized (server-side):', API_BASE_URL);
  console.log('🔍 NEXT_PUBLIC_API_URL from env:', process.env.NEXT_PUBLIC_API_URL);
}

export const registerUser = async (userData) => {
  try {
      console.log('🔍 registerUser called, URL:', `${API_BASE_URL}/api/auth/register`);
      console.log('🔍 API_BASE_URL:', API_BASE_URL);
      
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          credentials: 'include', // Include credentials for CORS
          body: JSON.stringify(userData),
      });

      console.log('🔍 Register response status:', response.status);
      console.log('🔍 Register response ok:', response.ok);

      // Check if response is ok before trying to parse JSON
      if (!response.ok) {
        const errorData = await response.text();
        console.error('❌ Register error data:', errorData);
        let errorMessage;
        try {
          const jsonError = JSON.parse(errorData);
          errorMessage = jsonError.message || "Registration failed";
        } catch (e) {
          errorMessage = errorData || "Invalid server response";
        }
        throw new Error(errorMessage);
      }

      const data = await response.json(); 
      console.log('🔍 Register response data:', data);

      return data; 
  } catch (error) {
      console.error('❌ registerUser error:', error);
      console.error('❌ Error message:', error.message);
      console.error('❌ Error stack:', error.stack);
      if (error.message === "Failed to fetch") {
        throw new Error("Unable to connect to the server. Please check your internet connection or try again later.");
      }
      throw new Error(error.message || "Network error. Please check your internet connection.");
  }
};



export const loginUser = async (credentials) => {
  try {
    console.log('🔍 loginUser called with:', { email: credentials?.email, hasPassword: !!credentials?.password });
    console.log('🔍 API_BASE_URL:', API_BASE_URL);
    const loginUrl = `${API_BASE_URL}/api/auth/login`;
    console.log('🔍 Login URL:', loginUrl);
    
    const response = await fetch(loginUrl, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json"
      },
      credentials: 'include', // Include credentials for CORS - CRITICAL for production
      body: JSON.stringify(credentials),
    });

    console.log('🔍 Login response status:', response.status);
    console.log('🔍 Login response ok:', response.ok);

    // Check if response is ok before trying to parse JSON
    if (!response.ok) {
      console.error('❌ Login response not ok:', response.status);
      if (response.status === 404) {
        throw new Error("API endpoint not found. Please check server configuration.");
      }
      const errorData = await response.text();
      console.error('❌ Login error data:', errorData);
      let errorMessage;
      try {
        const jsonError = JSON.parse(errorData);
        errorMessage = jsonError.message || "Login failed";
      } catch (e) {
        errorMessage = errorData || "Invalid server response";
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('🔍 Login response data:', data);
    
    // Check for success field (same as register expects)
    if (!data || !data.success) {
      console.error('❌ Login failed - no success flag:', data);
      throw new Error(data?.message || "Login failed");
    }
    
    if (!data.token) {
      console.error('❌ No token in response:', data);
      throw new Error("Invalid response format from server - no token");
    }

    console.log('✅ Storing token in localStorage');
    localStorage.setItem("token", data.token);
    return data;
  } catch (error) {
    console.error("❌ Login error in loginUser:", error);
    console.error("❌ Error message:", error.message);
    console.error("❌ Error stack:", error.stack);
    if (error.message === "Failed to fetch") {
      throw new Error("Unable to connect to the server. Please check your internet connection or try again later.");
    }
    throw error;
  }
};



// Logout User
export const logoutUser = () => {
  localStorage.removeItem("token");
};