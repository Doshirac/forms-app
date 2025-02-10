import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../ThemeToggle/ThemeToggle";

export const Header = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const handleLanguageChange = (event) => {
    const selectedLang = event.target.value;
    i18n.changeLanguage(selectedLang);
  };

  const isLoginPage = window.location.pathname === "/login";

  return (
    <header className="flex items-center justify-between p-4
                       bg-white shadow-md border-b border-gray-300
                       text-gray-900
                       dark:bg-gray-800 dark:text-white dark:border-gray-700
                       transition-colors duration-300">
      <div className="text-xl font-bold">
        {t("header.title")}
      </div>
      <div className="relative">
        <select
          value={i18n.language}
          onChange={handleLanguageChange}
          className="px-3 py-1 bg-white text-black border border-gray-400 rounded dark:bg-gray-700 dark:text-white"
        >
          <option value="en">English</option>
          <option value="de">Deutsch</option>
        </select>
      </div>
      <ThemeToggle />
      <div>
        <button
          onClick={() => navigate(isLoginPage ? "/register" : "/login")}
          className="px-3 py-1 bg-purple-600 text-white rounded dark:bg-purple-800"
        >
          {isLoginPage ? t("header.register") : t("header.login")}
        </button>
      </div>
    </header>
  );
};