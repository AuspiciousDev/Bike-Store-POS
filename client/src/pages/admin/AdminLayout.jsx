import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../admin/components/Sidebar";
import Navbar from "../admin/components/Navbar";
import { Box } from "@mui/material";
const AdminLayout = () => {
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

export default AdminLayout;
