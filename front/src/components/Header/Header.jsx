import React from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import ThemeToggle from "../ThemeToggle/ThemeToggle";

export const Header = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();

  const handleLanguageChange = (event) => {
    const selectedLang = event.target.value;
    i18n.changeLanguage(selectedLang);
  };

  return (
    <header className="flex items-center justify-between p-4
                       bg-white shadow-md border-b border-gray-300
                       text-gray-900
                       dark:bg-gray-800 dark:text-white dark:border-gray-700
                       transition-colors duration-300">
      {/* Title */}
      <div className="text-xl font-bold">
        {t("header.title")}
      </div>

      {/* Language Dropdown */}
      <div className="relative">
        <select
          value={i18n.language}            // current language
          onChange={handleLanguageChange}  // handle selection changes
          className="px-3 py-1 bg-white text-black border border-gray-400 rounded dark:bg-gray-700 dark:text-white"
        >
          <option value="en">English</option>
          <option value="de">Deutsch</option>
          {/* Add more languages if needed */}
        </select>
      </div>
    <ThemeToggle />
      {/* Login / Register Links in the Header */}
      <div>
        {location.pathname === "/login" ? (
          // If user is on the Login page, show "Register"
          <Link
            to="/register"
            className="px-3 py-1 bg-purple-600 text-white rounded dark:bg-purple-800"
          >
            {t("header.register")}
          </Link>
        ) : (
          // Otherwise show "Login"
          <Link
            to="/login"
            className="px-3 py-1 bg-purple-600 text-white rounded dark:bg-purple-800"
          >
            {t("header.login")}
          </Link>
        )}
      </div>
    </header>
  );
};