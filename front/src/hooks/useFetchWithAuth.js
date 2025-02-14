import { useNavigate } from "react-router-dom";

export const useFetchWithAuth = () => {
  const navigate = useNavigate();

  const fetchWithAuth = async (url, options = {}) => {
    const token = localStorage.getItem("jwtToken");

    const headers = {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    };

    const config = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("jwtToken");
        navigate("/login");
        alert(
          "Your account doesn't have access to this page. Please login again."
        );
        throw new Error("Unauthorized or Forbidden");
      }

      return response;
    } catch (error) {
      console.error("Fetch error:", error);
      throw error;
    }
  };

  return { fetchWithAuth };
};