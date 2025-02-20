import React from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const NavBar = () => {
  const { t } = useTranslation();
  
  return (
    <nav className="flex gap-4 p-4 bg-gray-100 dark:bg-gray-800">
      <NavLink 
        to="/content"
        className={({ isActive }) =>
          `hover:text-green-500 dark:hover:text-yellow-500 transition-colors ${isActive ? "font-bold text-green-500 dark:text-yellow-500" : ""}`
        }
      >
        {t("surveys.list")}
      </NavLink>
    </nav>
  );
};
