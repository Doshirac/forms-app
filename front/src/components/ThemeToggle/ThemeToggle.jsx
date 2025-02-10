import React, { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import "@theme-toggles/react/css/Around.css";
import { Around } from "@theme-toggles/react";

export const ThemeToggle = () => {
  const { darkTheme, toggleTheme } = useContext(ThemeContext);

  return (
    <div className="flex items-center">
      <Around
        toggled={darkTheme}
        toggle={toggleTheme}
        duration={750}
        className="
          text-gray-800
          dark:text-gray-100
          hover:opacity-80
          cursor-pointer
          transition-all
        "
      />
    </div>
  );
};

export default ThemeToggle;
