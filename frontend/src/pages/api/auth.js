// Determine API URL based on environment
const getApiBaseUrl = () => {
  // If explicitly set, use it (highest priority)
  if (process.env.NEXT_PUBLIC_API_URL) {
    console.log('🔍 Using NEXT_PUBLIC_API_URL from env:', process.env.NEXT_PUBLIC_API_URL);
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  // In browser, check hostname to determine environment
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    console.log('🔍 Detected hostname:', hostname);
    
    // If we're on Render (production), use production backend
    if (hostname.includes('onrender.com') || hostname.includes('vercel.app')) {
      console.log('🔍 Production hostname detected, using production backend');
      return 'https://medi-ai-backend.onrender.com';
    }
    
    // For localhost, use local backend
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      console.log('🔍 Localhost detected, using local backend');
      return 'http://localhost:5000';
    }
    
    console.log('⚠️ Unknown hostname, defaulting to production backend');
    return 'https://medi-ai-backend.onrender.com';
  }
  
  // Server-side: check NODE_ENV
  if (process.env.NODE_ENV === 'production') {
    console.log('🔍 Server-side production detected');
    return 'https://medi-ai-backend.onrender.com';
  }
  
  // Default to localhost for development
  console.log('🔍 Defaulting to localhost backend');
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
  // Validate credentials first
  if (!credentials || !credentials.email || !credentials.password) {
    const error = new Error("Email and password are required");
    console.error("❌ loginUser: Missing credentials");
    throw error;
  }

  const loginUrl = `${API_BASE_URL}/api/auth/login`;
  
  // Log request details
  console.log('🔍 ===== LOGIN REQUEST START =====');
  console.log('🔍 loginUser called');
  console.log('🔍 API_BASE_URL:', API_BASE_URL);
  console.log('🔍 Login URL:', loginUrl);
  console.log('🔍 Credentials email:', credentials.email);
  console.log('🔍 Has password:', !!credentials.password);
  console.log('🔍 Request body will be:', JSON.stringify({ email: credentials.email, password: '***' }));
  
  try {
    // Make the fetch request with explicit error handling
    let response;
    try {
      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
      
      response = await fetch(loginUrl, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
        },
        credentials: 'include', // Include credentials for CORS - CRITICAL for production
        body: JSON.stringify(credentials),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      console.log('✅ Fetch request completed');
      console.log('🔍 Login response status:', response.status);
      console.log('🔍 Login response ok:', response.ok);
      console.log('🔍 Login response headers:', Object.fromEntries(response.headers.entries()));
    } catch (fetchError) {
      // Handle network errors, CORS errors, timeouts, etc.
      console.error('❌ ===== FETCH ERROR =====');
      console.error('❌ Fetch error name:', fetchError.name);
      console.error('❌ Fetch error message:', fetchError.message);
      console.error('❌ Fetch error stack:', fetchError.stack);
      
      if (fetchError.name === 'AbortError' || fetchError.name === 'TimeoutError') {
        throw new Error("Request timed out. Please check your connection and try again.");
      } else if (fetchError.message === "Failed to fetch") {
        // This usually means CORS error or network failure
        throw new Error("Unable to connect to the server. This may be a CORS or network issue. Please check your connection.");
      } else {
        throw new Error(`Network error: ${fetchError.message}`);
      }
    }

    // Check if response is ok before trying to parse JSON
    if (!response.ok) {
      console.error('❌ Login response not ok:', response.status);
      console.error('❌ Response status text:', response.statusText);
      
      if (response.status === 404) {
        throw new Error("API endpoint not found. Please check server configuration.");
      } else if (response.status === 0) {
        // Status 0 usually indicates CORS error
        throw new Error("CORS error: Request blocked. Please check server CORS configuration.");
      }
      
      let errorData;
      try {
        errorData = await response.text();
        console.error('❌ Login error response body:', errorData);
      } catch (e) {
        console.error('❌ Could not read error response:', e);
        errorData = `Server error: ${response.status} ${response.statusText}`;
      }
      
      let errorMessage;
      try {
        const jsonError = JSON.parse(errorData);
        // Try multiple possible error message fields
        errorMessage = jsonError.message || jsonError.error || jsonError.data?.message || `Login failed (${response.status})`;
        console.error('❌ Extracted error message from JSON:', errorMessage);
      } catch (e) {
        // If JSON parsing fails, use the raw error data or a generic message
        errorMessage = errorData || `Server error: ${response.status} ${response.statusText}`;
        console.error('❌ Could not parse error as JSON, using raw data:', errorMessage);
      }
      
      // Provide user-friendly messages for common status codes
      if (response.status === 400 && !errorMessage.includes('Invalid credentials')) {
        errorMessage = "Invalid email or password. Please try again.";
      } else if (response.status === 401) {
        errorMessage = "Invalid credentials. Please check your email and password.";
      } else if (response.status === 500) {
        errorMessage = "Server error. Please try again later.";
      }
      
      throw new Error(errorMessage);
    }

    // Parse response
    let data;
    try {
      data = await response.json();
      console.log('🔍 Login response data:', data);
    } catch (parseError) {
      console.error('❌ Failed to parse JSON response:', parseError);
      const textResponse = await response.text();
      console.error('❌ Response text:', textResponse);
      throw new Error("Invalid response format from server");
    }
    
    // Check for success field (same as register expects)
    if (!data || !data.success) {
      console.error('❌ Login failed - no success flag:', data);
      // Extract error message from various possible response formats
      const errorMessage = data?.message || data?.error || data?.data?.message || "Invalid credentials. Please check your email and password.";
      console.error('❌ Error message extracted:', errorMessage);
      throw new Error(errorMessage);
    }
    
    if (!data.token) {
      console.error('❌ No token in response:', data);
      throw new Error("Invalid response format from server - no token");
    }

    console.log('✅ Storing token in localStorage');
    localStorage.setItem("token", data.token);
    console.log('✅ ===== LOGIN SUCCESS =====');
    return data;
  } catch (error) {
    console.error("❌ ===== LOGIN ERROR =====");
    console.error("❌ Error type:", error.constructor.name);
    console.error("❌ Error message:", error.message);
    console.error("❌ Error stack:", error.stack);
    
    // Re-throw with a user-friendly message if it's not already an Error with message
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error(error.message || "An unexpected error occurred during login");
    }
  }
};



// Logout User
export const logoutUser = () => {
  localStorage.removeItem("token");
};