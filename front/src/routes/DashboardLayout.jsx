import React from "react";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <div className="p-4">
      <Outlet />
    </div>
  );
};

export default DashboardLayout;
