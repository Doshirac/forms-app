import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "../../components/Button/Button";

export const RegistrationPage = () => {
  const { t, i18n } = useTranslation();
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
      setErrorMessage(t("errors.registration.passwordMismatch"));
      return;
    }

    try {
      const headers = {
        "Content-Type": "application/json",
        "X-Language": i18n.language || 'en'
      };
      
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        credentials: 'include',
        headers,
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
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="m-auto bg-white dark:bg-gray-800 border border-white dark:border-gray-700 rounded-3xl w-[26%] h-[90%] flex justify-center items-center shadow-md max-[768px]:w-[80%] max-[768px]:h-[70%]">
        <div className="h-[80%] w-2/3 flex flex-col justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white max-[768px]:text-base">
            {t("registration.title")}
          </h2>
            {errorMessage && (
              <div className="bg-red-100 dark:bg-red-200 text-red-700 p-2 mb-4 rounded w-full text-center">
                {errorMessage}
              </div>
            )}
          <form
            onSubmit={handleSubmit}
            className="m-0 w-full h-[90%] flex flex-col justify-between items-center"
          >
            <div className="w-full">
              <label className="block text-gray-700 dark:text-gray-200 text-[2vh] font-bold mb-2 max-[768px]:text-[1.6vh]">
                {t("registration.labelName")}
              </label>
              <div className="relative">
                <input
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full h-12 pl-4 pr-10 bg-green-100 focus:ring-green-600 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 dark:focus:ring-yellow-500"
                  placeholder={t("registration.placeholderName")}
                />
              </div>
            </div>
            <div className="w-full">
              <label className="block text-gray-700 dark:text-gray-200 text-[2vh] font-bold mb-2 max-[768px]:text-[1.6vh]">
                {t("registration.labelEmail")}
              </label>
              <div className="relative">
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full h-12 pl-4 pr-10 bg-green-100 focus:ring-green-600 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 dark:focus:ring-yellow-500"
                  placeholder={t("registration.placeholderEmail")}
                />
              </div>
            </div>
            <div className="w-full">
              <label className="block text-gray-700 dark:text-gray-200 text-[2vh] font-bold mb-2 max-[768px]:text-[1.6vh]">
                {t("registration.labelPassword")}
              </label>
              <div className="relative">
                <input
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full h-12 pl-4 pr-10 bg-green-100 focus:ring-green-600 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 dark:focus:ring-yellow-500"
                  placeholder={t("registration.placeholderPassword")}
                />
              </div>
            </div>
            <div className="w-full">
              <label className="block text-gray-700 dark:text-gray-200 text-[2vh] font-bold mb-2 max-[768px]:text-[1.6vh]">
                {t("registration.labelConfirmPassword")}
              </label>
              <div className="relative">
                <input
                  name="repeatPassword"
                  type="password"
                  required
                  value={formData.repeatPassword}
                  onChange={handleChange}
                  className="w-full h-12 pl-4 pr-10 bg-green-100 focus:ring-green-600 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 dark:focus:ring-yellow-500"
                  placeholder={t("registration.placeholderConfirm") || "Confirm your password"}
                />
              </div>
            </div>
            <Button
              type="submit"
              size="large"
              text={t("registration.btnRegister")} 
            />
            <p className="mt-2 text-gray-600 dark:text-gray-300 text-center">
              {t("registration.alreadyRegistered")}{" "}
              <Link to="/login" className="text-green-600 dark:text-yellow-600 hover:underline">
                {t("registration.signIn")}
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
