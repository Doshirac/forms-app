import React from "react";
import { NavLink, Outlet } from "react-router-dom";

export const NavBar = () => (
  <nav className="flex gap-4 p-4 bg-gray-100 dark:bg-gray-800">
    <NavLink 
      to="/content"
      className={({ isActive }) =>
        `hover:text-yellow-500 transition-colors ${isActive ? "text-yellow-500" : ""}`
      }
    >
      My Surveys
    </NavLink>
  </nav>
);

const Content = () => {
  return (
    <div>
      <NavBar />
      <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-200
                        dark:from-gray-900 dark:to-gray-800
                        transition-colors duration-300 ">
        <Outlet />
      </div>
    </div>
  );
};

export default Content;