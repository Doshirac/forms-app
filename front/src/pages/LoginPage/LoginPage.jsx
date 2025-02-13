import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";
import { ReactComponent as ShowPasswordIcon } from "../../assets/images/visibility.svg";
import { ReactComponent as HidePasswordIcon } from "../../assets/images/visibility_off.svg";
import { ReactComponent as PersonIcon } from "../../assets/images/person.svg";

export const LoginPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleCancel = () => {
    setFormData({
      email: "",
      password: "",
    });
    setErrorMessage("");
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
    <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-black text-gray-800 dark:text-gray-200">
      <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-3xl w-[26%] h-3/4 flex justify-center items-center shadow-md max-[768px]:w-[80%] max-[768px]:h-1/2">
        <div className="h-[80%] w-2/3 flex flex-col justify-between items-center">
          <h2 className="text-xl font-bold mb-4">
            {t("login.title")}
          </h2>

          {/* Error message display */}
          {errorMessage && (
            <div className="bg-red-100 dark:bg-red-200 text-red-700 p-2 mb-2 rounded w-full text-center">
              {errorMessage}
            </div>
          )}

          <form
            className="m-0 w-full h-[86%] flex flex-col justify-between items-center"
            onSubmit={handleSubmit}
          >
            <div className="w-full flex flex-col items-start">
              <div className="w-full h-[82%] flex flex-col items-center">
                {/* Email Field */}
                <div className="w-full mb-4">
                  <label className="block mb-1 font-semibold">
                    {t("login.labelEmail")}
                  </label>
                  <div className="relative">
                    <input
                      name="email"
                      type="email"
                      placeholder={t("login.enterEmail")}
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full h-12 pl-4 pr-10 bg-green-100 focus:ring-green-600 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 dark:focus:ring-yellow-500"
                    />
                    {/* Person Icon */}
                    <PersonIcon className="absolute right-3 top-4 w-5 h-5 text-gray-600 dark:text-yellow-500" />
                  </div>
                </div>

                {/* Password Field */}
                <div className="w-full">
                  <label className="block mb-1 font-semibold">
                    {t("login.labelPassword")}
                  </label>
                  <div className="relative">
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder={t("login.enterPassword")}
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="w-full h-12 pl-4 pr-10 bg-green-100 focus:ring-green-600 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 dark:focus:ring-yellow-500"
                    />
                    {showPassword ? (
                      <HidePasswordIcon
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 top-3 cursor-pointer w-6 h-6 text-gray-600 dark:text-yellow-500"
                      />
                      ) : (
                      <ShowPasswordIcon
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 top-3 cursor-pointer w-6 h-6 text-gray-600 dark:text-yellow-500"
                      />
                    )} 
                  </div>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col items-center w-full mt-4">
              <button
                type="submit"
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold w-full h-12 rounded-md text-center tracking-wide uppercase border border-yellow-500 dark:border-yellow-400"
              >
                {t("login.btnLogin")}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="border border-yellow-500 dark:border-yellow-400 text-yellow-500 dark:text-yellow-400 font-bold w-32 h-10 rounded-md text-center tracking-wide uppercase mt-4 hover:bg-yellow-500 hover:text-black transition-colors"
              >
                {t("login.btnCancel")}
              </button>
            </div>

            {/* Register Link */}
            <p className="mt-2 text-center text-sm">
              {t("login.dontHaveAccount")}{" "}
              <Link
                to="/register"
                className="text-yellow-600 dark:text-yellow-400 hover:underline"
              >
                {t("login.createAccount")}
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
