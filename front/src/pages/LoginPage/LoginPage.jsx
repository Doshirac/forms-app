import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";

export const LoginPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        login(data.token);
        navigate("/");
      } else {
        const data = await response.json();
        setErrorMessage(data.message || "Login failed");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="p-6 bg-white dark:bg-gray-800 rounded shadow-md w-80"
      >
        <h2 className="text-2xl font-bold mb-4 dark:text-white">{t("login.title")}</h2>
        {errorMessage && (
          <div className="bg-red-100 dark:bg-red-200 text-red-700 p-2 mb-4 rounded">
            {errorMessage}
          </div>
        )}
        <div className="mb-4">
          <label className="block mb-1 dark:text-white">{t("login.labelEmail")}</label>
          <input
            name="email"
            type="email"
            className="border w-full p-2 dark:bg-gray-700 dark:text-white"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 dark:text-white">{t("login.labelPassword")}</label>
          <input
            name="password"
            type="password"
            className="border w-full p-2 dark:bg-gray-700 dark:text-white"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 w-full rounded hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
        >
          {t("login.btnLogin")}
        </button>
        <div className="mt-4 text-center text-sm dark:text-white">
          <span>{t("login.dontHaveAccount")}</span>{" "}
          <Link to="/register" className="text-blue-500 hover:text-blue-600">
            {t("login.createAccount")}
          </Link>
        </div>
      </form>
    </div>
  );
};
