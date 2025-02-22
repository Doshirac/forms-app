import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/Button/Button";
import { ReactComponent as ShowPasswordIcon } from "../../assets/images/visibility.svg";
import { ReactComponent as HidePasswordIcon } from "../../assets/images/visibility_off.svg";
import { ReactComponent as PersonIcon } from "../../assets/images/person.svg";

export const LoginPage = () => {
  const { t, i18n } = useTranslation();
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
      const headers = {
        "Content-Type": "application/json",
        "X-Language": i18n.language || 'en'
      };

      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        credentials: 'include',
        headers,
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        login(data.token, data.user);
        navigate("/dashboard");
      } else {
        setErrorMessage(data.message || t("errors.login.generic"));
      }
    } catch (error) {
      console.error(error);
      setErrorMessage(t("errors.login.generic"));
    }
  };

  return (
    <div className="flex items-center justify-center h-screen text-gray-800 dark:text-gray-200">
      <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-3xl w-[26%] h-3/4 flex justify-center items-center shadow-md max-[768px]:w-[80%] max-[768px]:h-[60%]">
        <div className="h-[80%] w-2/3 flex flex-col justify-between items-center">
          <h2 className="text-xl font-bold mb-4">
            {t("login.title")}
          </h2>
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
                    <PersonIcon className="absolute right-3 top-4 w-5 h-5 text-gray-600 dark:text-yellow-500" />
                  </div>
                </div>
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
            <div className="flex flex-col items-center justify-between w-full mt-4 h-[28%]">
              <Button type="submit" size="large" text={t("login.btnLogin")} />
              <Button
                type="button"
                text={t("login.btnCancel")}
                size="medium"
                buttonType="secondary"
                onClick={handleCancel}
              />
            </div>
            <p className="mt-2 text-gray-600 dark:text-gray-300 text-center">
              {t("login.dontHaveAccount")}{" "}
              <Link
                to="/register"
                className="text-green-600 dark:text-yellow-600 hover:underline"
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
