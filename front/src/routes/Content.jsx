import React from "react";
import { Outlet } from "react-router-dom";
import { NavBar } from "../components/NavBar/NavBar";

const Content = () => {
  return (
    <div>
      <NavBar />
      <div className="p-16">
        <Outlet />
      </div>
    </div>
  );
};

export default Content;