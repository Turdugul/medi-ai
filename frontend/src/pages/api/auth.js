const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://medi-ai-backend.onrender.com'

console.log('🔍 API_BASE_URL initialized:', API_BASE_URL);

export const registerUser = async (userData) => {
  try {
      console.log('🔍 registerUser called, URL:', `${API_BASE_URL}/api/auth/register`);
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
      });

      const data = await response.json(); 

      if (!response.ok) {
          throw new Error(data?.message || "Registration failed. Please try again.");
      }

      return data; 
  } catch (error) {
      console.error('❌ registerUser error:', error);
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