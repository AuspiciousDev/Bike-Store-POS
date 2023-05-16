import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../employee/components/Sidebar";
import Navbar from "../employee/components/Navbar";
import { Box } from "@mui/material";
const EmployeeLayout = () => {
  return (
    <Box className="container-layout">
      <Sidebar />
      <Box className="container-main">
        <Navbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default EmployeeLayout;
