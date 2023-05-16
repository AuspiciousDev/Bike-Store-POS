import React from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const RequireAuth = ({ allowedRoles }) => {
  console.log(
    "🚀 ~ file: RequireAuth.jsx:6 ~ RequireAuth ~ allowedRoles",
    allowedRoles
  );
  const { auth } = useAuth();
  console.log(
    "🚀 ~ file: RequireAuth.jsx:11 ~ RequireAuth ~ auth",
    auth.userType
  );
  const location = useLocation();
  // console.log("Allowed Roles = ", allowedRoles);
  // console.log(
  //   "User Roles = ",
  //   auth?.roles?.map((role) => {
  //     return role;
  //   })
  // );
  return allowedRoles.includes(auth?.userType) ? (
    <Outlet />
  ) : auth?.username ? (
    <Navigate to="/unauthorized" state={{ from: location }} replace />
  ) : (
    <Navigate to="/" state={{ from: location }} replace />
  );

  //
  // return auth?.username ? (
  //   <Outlet />
  // ) : (
  //   <Navigate to="/unauthorized" state={{ from: location }} replace />
  // );
};
export default RequireAuth;
