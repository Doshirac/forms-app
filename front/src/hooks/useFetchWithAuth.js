import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const useFetchWithAuth = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const handleAuthError = (status, message) => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("isAdmin");
    navigate("/login", { 
      state: { 
        errorMessage: message || t("errors.login.generic")
      }
    });
  };

  const fetchWithAuth = async (url, options = {}) => {
    const token = localStorage.getItem("jwtToken");

    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      "x-language": i18n.language,
      ...(options.headers || {}),
    };

    const config = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);

      if (response.status === 401 || response.status === 403) {
        handleAuthError(response.status, "Your account doesn't have access to this page. Please login again.");
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