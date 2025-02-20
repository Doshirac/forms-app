import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../Button/Button";
import { ReactComponent as CloseIcon } from "../../assets/images/close.svg";
import { ReactComponent as MenuIcon } from "../../assets/images/menu.svg";
import { ReactComponent as AccountIcon } from "../../assets/images/account_circle.svg";
import { ReactComponent as DashboardIcon } from "../../assets/images/dashboard.svg";
import { ReactComponent as UsersIcon } from "../../assets/images/group.svg";
import { ReactComponent as HomeIcon } from "../../assets/images/home.svg";
import { ReactComponent as LogoutIcon } from "../../assets/images/logout.svg";

export const Header = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated, logout, isAdmin } = useAuth();

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const handleLanguageChange = (event) => {
    const selectedLang = event.target.value;
    i18n.changeLanguage(selectedLang);
  };

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  const handleNavClick = () => {
    setMenuVisible(false);
  };

  return (
    <header className="flex items-center justify-between p-4
                       bg-white shadow-md border-b border-gray-300
                       text-gray-900
                       dark:bg-gray-800 dark:text-white dark:border-gray-700
                       transition-colors duration-300">
      <div className="text-xl font-bold cursor-pointer max-[768px]:text-sm max-[768px]:hidden" onClick={() => navigate('/')}>
        {t("header.title")}
      </div >
      {isAuthenticated && (
        <div className={`${
          menuVisible 
            ? "fixed top-0 left-0 w-64 h-auto max-h-[70vh] bg-white dark:bg-gray-800 z-50 duration-300 transform translate-x-0 shadow-lg rounded-br-lg" 
            : "fixed top-0 left-0 w-64 h-auto transform -translate-x-full"
          } transition-transform ease-in-out`}
        >
          <div className="p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg font-semibold dark:text-white">
                {t("header.menu")}
              </h2>
              <CloseIcon 
                className="h-5 w-5 cursor-pointer text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100" 
                onClick={toggleMenu}
              />
            </div>
            <nav className="flex flex-col space-y-2">
              <NavLink
                to="/"
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `flex items-center space-x-3 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 ${
                    isActive 
                      ? "text-green-600 dark:text-yellow-500 bg-gray-100 dark:bg-gray-700" 
                      : "text-gray-700 dark:text-gray-200"
                  }`
                }
              >
                <HomeIcon className="h-5 w-5" />
                <span className="text-sm">{t("header.title")}</span>
              </NavLink>
              <NavLink
                to="/content"
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `flex items-center space-x-3 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 ${
                    isActive 
                      ? "text-green-600 dark:text-yellow-500 bg-gray-100 dark:bg-gray-700" 
                      : "text-gray-700 dark:text-gray-200"
                  }`
                }
              >
                <AccountIcon className="h-5 w-5" />
                <span className="text-sm">{t("header.myAccount")}</span>
              </NavLink>
              <NavLink
                to="/dashboard"
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `flex items-center space-x-3 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 ${
                    isActive 
                      ? "text-green-600 dark:text-yellow-500 bg-gray-100 dark:bg-gray-700" 
                      : "text-gray-700 dark:text-gray-200"
                  }`
                }
              >
                <DashboardIcon className="h-5 w-5" />
                <span className="text-sm">{t("header.dashboard")}</span>
              </NavLink>
              {isAdmin && (
                <NavLink
                  to="/user-management"
                  onClick={handleNavClick}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      isActive 
                        ? "text-green-600 dark:text-yellow-500 bg-gray-100 dark:bg-gray-700" 
                        : "text-gray-700 dark:text-gray-200"
                    }`
                  }
                >
                  <UsersIcon className="h-5 w-5" />
                  <span className="text-sm">{t("header.userManagement")}</span>
                </NavLink>
              )}
            </nav>
          </div>
        </div>
      )}
      {menuVisible && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleMenu}
        />
      )}
      {isAuthenticated && (
        <div>
          <MenuIcon className="hidden h-6 w-6 cursor-pointer max-[768px]:block" onClick={toggleMenu}/>
          <nav className="flex gap-4 max-[768px]:text-sm max-[768px]:flex-col max-[768px]:hidden">
            <NavLink
              to="/content"
              className={({ isActive }) =>
                `text-black hover:text-green-500 dark:hover:text-yellow-500 dark:text-white transition-colors ${
                  isActive ? "font-bold text-green-500 dark:text-yellow-500" : ""
                }`
              }
            >
              {t("header.myAccount")}
            </NavLink>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `text-black hover:text-green-500 dark:hover:text-yellow-500 dark:text-white transition-colors ${
                  isActive ? "font-bold text-green-500 dark:text-yellow-500" : ""
                }`
              }
            >
              {t("header.dashboard")}
            </NavLink>
            {isAdmin && (
              <NavLink
                to="/user-management"
                className={({ isActive }) =>
                  `text-black hover:text-green-500 dark:hover:text-yellow-500 dark:text-white transition-colors ${
                    isActive ? "font-bold text-green-500 dark:text-yellow-500" : ""
                  }`
                }
              >
                {t("header.userManagement")}
              </NavLink>
            )}
          </nav>
        </div>
      )}
      <div className="flex items-center gap-8">
        <ThemeToggle />
        <div>
          <select
            value={i18n.language}
            onChange={handleLanguageChange}
            className="px-3 py-1 bg-white text-black border border-gray-400 rounded dark:bg-gray-700 dark:text-white"
          >
            <option value="en">English</option>
            <option value="de">Deutsch</option>
          </select>
        </div>
        <div>
          {isAuthenticated && (
            <Button
            buttonType="tertiary"
            size="small"
            onClick={handleSignOut}
            text={<LogoutIcon className="m-auto"/>} />
          )}
        </div>
      </div>
    </header>
  );
};