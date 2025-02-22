const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
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

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Invalid credentials");

    localStorage.setItem("token", data.token);
    return data;
  } catch (error) {
    console.error("❌ Login error:", error.message);
    throw new Error(error.message);
  }
};



// Logout User
export const logoutUser = () => {
  localStorage.removeItem("token");
};
