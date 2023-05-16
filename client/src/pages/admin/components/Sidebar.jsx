import React from "react";

import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { useState, useEffect } from "react";
import useAuth from "../../../hooks/useAuth";
import { ProSidebar, Menu, MenuItem, SidebarHeader } from "react-pro-sidebar";

import { Avatar, Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { tokens } from "../../../themes";
import {
  GridViewOutlined,
  DashboardOutlined,
  PointOfSaleOutlined,
  BadgeOutlined,
  WarehouseOutlined,
  Inventory2Outlined,
  InventoryOutlined,
  MonetizationOnOutlined,
  MenuOutlined,
  EventOutlined,
} from "@mui/icons-material";
import "react-pro-sidebar/dist/css/styles.css";
import logo from "../../../assets/logo.png";

const Item = ({ title, to, icon, selected, setSelected }) => {
  const location = useLocation();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // var subLocation = location.pathname.replace("/admin", "");
  var subLocation = location.pathname;
  // console.log("Sidebar       : ", to);
  // console.log("Page          : ", subLocation);
  // console.log("Pageslice     : ", subLocation.slice(0, 1));
  // console.log("Pagesub       : ", subLocation.substring(7));
  // console.log("Title         : ", title);
  return (
    <MenuItem
      active={
        subLocation === "/admin"
          ? subLocation === to
          : subLocation.substring(7).includes(to)
      }
      //  subLocation.slice(0, 1) === to
      style={{
        color: colors.black[100],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const { auth } = useAuth();

  return (
    <Box
      sx={{
        display: { xs: "none", sm: "flex" },
        "& .pro-sidebar-inner": {
          background: `${colors.black[900]} !important`,
          color: `${colors.black[100]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          color: `${colors.black[100]} !important`,
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          backgroundColor: `${colors.secondary[500]} !important`,
          color: `${colors.black[100]} !important`,
        },
        "& .pro-menu-item.active": {
          backgroundColor: `${colors.secondary[500]}!important`,
          // color: `${colors.whiteOnly[100]} !important`,
        },
      }}
    >
      <ProSidebar
        collapsed={isCollapsed}
        style={{
          boxShadow: "rgba(0, 0, 0, 0.15) 1px 1px 2.6px",
        }}
      >
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <SidebarHeader>
            <MenuItem
              onClick={() => setIsCollapsed(!isCollapsed)}
              icon={isCollapsed ? <MenuOutlined /> : undefined}
            >
              {!isCollapsed && (
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                    <MenuOutlined />
                  </IconButton>
                </Box>
              )}
            </MenuItem>

            {isCollapsed && (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                m="10px 0"
              >
                <img
                  alt="profile-user"
                  style={{
                    width: "50px",
                    height: "50px",
                    objectFit: "contain",
                  }}
                  src={logo}
                />
              </Box>
            )}
            {!isCollapsed && (
              <Box
                display="flex"
                flexDirection="row"
                alignItems="center"
                padding=" 10px 0 10px 15px"
                // backgroundColor={colors.black[900]}
              >
                <img
                  alt="profile-user"
                  style={{
                    width: "50px",
                    height: "50px",
                    objectFit: "contain",
                  }}
                  src={logo}
                />

                <Box ml="10px">
                  <Typography
                    variant="h5"
                    width="180px"
                    color={colors.black[50]}
                    sx={{ textTransform: "capitalize" }}
                  >
                    {auth.firstName} {auth.lastName}
                  </Typography>{" "}
                  <Typography
                    color={colors.primary[500]}
                    variant="subtitle2"
                    textTransform="uppercase"
                  >
                    {auth.userType}
                  </Typography>
                </Box>
              </Box>
            )}
          </SidebarHeader>
          {/* <Item
            title="Dashboard"
            to="/admin"
            icon={<DashboardOutlined />}
            selected={selected}
            setSelected={setSelected}
          /> */}

          <Item
            title="Cashier"
            to="/admin"
            icon={<PointOfSaleOutlined />}
            selected={selected}
            setSelected={setSelected}
          />
          <Item
            title="Inventory"
            to="inventory"
            icon={<WarehouseOutlined />}
            selected={selected}
            setSelected={setSelected}
          />
          <Item
            title="Employee"
            to="employee"
            icon={<BadgeOutlined />}
            selected={selected}
            setSelected={setSelected}
          />
          <Item
            title="Restock"
            to="restock"
            icon={<InventoryOutlined />}
            selected={selected}
            setSelected={setSelected}
          />
          <Item
            title="Sales"
            to="sales"
            icon={<MonetizationOnOutlined />}
            selected={selected}
            setSelected={setSelected}
          />
          <Item
            title="Archived"
            to="archived"
            icon={<Inventory2Outlined />}
            selected={selected}
            setSelected={setSelected}
          />
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
