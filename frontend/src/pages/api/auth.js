const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://medi-ai-backend.onrender.com'
export const registerUser = async (userData) => {
  try {
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
      throw new Error(error.message || "Network error. Please check your internet connection.");
  }
};



export const loginUser = async (credentials) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    // Check if response is ok before trying to parse JSON
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("API endpoint not found. Please check server configuration.");
      }
      const errorData = await response.text();
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
    if (!data || !data.token) {
      throw new Error("Invalid response format from server");
    }

    localStorage.setItem("token", data.token);
    return data;
  } catch (error) {
    console.error("❌ Login error:", error.message);
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