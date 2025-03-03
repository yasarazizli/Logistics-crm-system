import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext.tsx";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Roles } from "@/features/dashboard/constants/enum.constant.tsx";

// Context

export default function PrivateRoute() {
  const location = useLocation();
  const { auth } = useContext(AuthContext);
  const { i18n } = useTranslation();

  const normalizedPath = `/${location.pathname.replace(/^\/[^\/]+\//, "")}`;

  if (!auth.isAuth) {
    return <Navigate to={`/${i18n.language}/auth/login`} />;
  }

  // User
  if (auth.role === Roles.user) {
    const accessiblePages = [
      "/order",
      "/order/create",
      "/order/update",

      "/profile",
    ];
    if (!accessiblePages.includes(normalizedPath)) {
      return <Navigate to={`/${i18n.language}/order`} />;
    }
  }

  // Lawyer
  if (auth.role === Roles.lawyer) {
    const accessiblePages = [
      "/home",
      "/users",

      "/vendors",
      "/services",

      "/profile",
    ];
    if (!accessiblePages.includes(normalizedPath)) {
      return <Navigate to={`/${i18n.language}/home`} />;
    }
  }

  // Accountant
  if (auth.role === Roles.accountant) {
    const accessiblePages = [
      "/home",
      "/users",
      "/balance",
      "/order",
      "/profile",
    ];
    if (!accessiblePages.includes(normalizedPath)) {
      return <Navigate to={`/${i18n.language}/users`} />;
    }
  }

  // Buyer Manager
  if (auth.role === Roles.buyer_manager) {
    const accessiblePages = [
      "/vendors",
      "/services",
      "/tasks",

      "/order",
      "/order/update",
      "/profile",
    ];
    if (!accessiblePages.includes(normalizedPath)) {
      return <Navigate to={`/${i18n.language}/vendors`} />;
    }
  }

  // Commercial Directory
  if (auth.role === Roles.commercial_directory) {
    const accessiblePages = ["/users", "/order", "/services", "/profile"];
    if (!accessiblePages.includes(normalizedPath)) {
      return <Navigate to={`/${i18n.language}/order`} />;
    }
  }

  // Director
  if (auth.role === "directory") {
    const accessiblePages = [
      "/profile",
      "/balance",
      "/order",
      "/order/create",
      "/order/update",
    ];
    if (!accessiblePages.includes(normalizedPath)) {
      return <Navigate to={`/${i18n.language}/order`} />;
    }
  }

  // Admin
  if (auth.role === Roles.admin) {
    const accessiblePages = [
      "/home",
      "/users",
      "/workers",
      "/balance",
      "/price",

      "/vendors",
      "/tasks",
      "/services",
      "/location",

      "/order",
      "/order/create",
      "/order/update",

      "/settings",

      "/profile",
    ];
    if (!accessiblePages.includes(normalizedPath)) {
      return <Navigate to={`/${i18n.language}/home`} />;
    }
  }

  return <Outlet />;
}
