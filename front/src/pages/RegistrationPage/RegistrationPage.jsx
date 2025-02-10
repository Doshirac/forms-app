import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const RegistrationPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    repeatPassword: "",
    username: "",
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
    if (formData.password !== formData.repeatPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.username,
        }),
      });

      if (response.status === 201) {
        navigate("/login");
      } else {
        const data = await response.json();
        setErrorMessage(data.message || "Registration failed");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Registration failed");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="p-6 bg-white dark:bg-gray-800 rounded shadow-md w-80"
      >
        <h2 className="text-2xl font-bold mb-4 dark:text-white">
          {t("registration.title")}
        </h2>
        {errorMessage && (
          <div className="bg-red-100 dark:bg-red-200 text-red-700 p-2 mb-4 rounded">
            {errorMessage}
          </div>
        )}
        <div className="mb-4">
          <label className="block mb-1 dark:text-white">{t("registration.labelName")}</label>
          <input
            name="username"
            type="text"
            className="border w-full p-2 dark:bg-gray-700 dark:text-white"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 dark:text-white">{t("registration.labelEmail")}</label>
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
          <label className="block mb-1 dark:text-white">{t("registration.labelPassword")}</label>
          <input
            name="password"
            type="password"
            className="border w-full p-2 dark:bg-gray-700 dark:text-white"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 dark:text-white">{t("registration.labelConfirmPassword")}</label>
          <input
            name="repeatPassword"
            type="password"
            className="border w-full p-2 dark:bg-gray-700 dark:text-white"
            value={formData.repeatPassword}
            onChange={handleChange}
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 w-full rounded hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
        >
          {t("registration.btnRegister")}
        </button>
        <div className="mt-4 text-center text-sm dark:text-white">
          <span>{t("registration.alreadyRegistered")}</span>{" "}
          <Link to="/login" className="text-blue-500 hover:text-blue-600">
            {t("registration.signIn")}
          </Link>
        </div>
      </form>
    </div>
  );
};
