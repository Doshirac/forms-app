import React from "react";
import { Outlet } from "react-router-dom";
import { NavBar } from "../components/NavBar/NavBar";

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