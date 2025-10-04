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

  const normalizedPath = `/${location.pathname.replace(/^\/[^/]+\//, "")}`;

  // if (!auth.isAuth) {
  //   return <Navigate to={`/${i18n.language}/auth/login`} />;
  // }

  // User
  if (auth.role === Roles.user) {
    const accessiblePages = [
      "/users",
      "/user/offer/confirmation",
      "/users/ask/quotation",
    ];
    if (!accessiblePages.includes(normalizedPath)) {
      return <Navigate to={`/${i18n.language}/users`} />;
    }
  }

  // Lawyer
  if (auth.role === Roles.lawyer) {
    const accessiblePages = ["/lawyer/users"];
    if (!accessiblePages.includes(normalizedPath)) {
      return <Navigate to={`/${i18n.language}/lawyer/users`} />;
    }
  }

  // Accountant
  if (auth.role === Roles.accountant) {
    const accessiblePages = ["/accountant/users"];
    if (!accessiblePages.includes(normalizedPath)) {
      return <Navigate to={`/${i18n.language}/accountant/users`} />;
    }
  }

  // Buyer Manager
  if (auth.role === Roles.buyer_manager) {
    const accessiblePages = ["/services", "/vendors"];
    if (!accessiblePages.includes(normalizedPath)) {
      return <Navigate to={`/${i18n.language}/services`} />;
    }
  }

  // Commercial Directory
  if (auth.role === Roles.commercial_directory) {
    const accessiblePages = [
      "/commercial/directory/users",
      "/commercial/directory/services",
    ];
    if (!accessiblePages.includes(normalizedPath)) {
      return <Navigate to={`/${i18n.language}/commercial/directory/users`} />;
    }
  }

  // Commercial Manager
  if (auth.role === Roles.commercial_manager) {
    const accessiblePages = [
      "/commercial/manager/order",
      "/commercial/manager/information",
      "/commercial/manager/information/edit",
    ];
    if (!accessiblePages.includes(normalizedPath)) {
      return <Navigate to={`/${i18n.language}/commercial/manager/order`} />;
    }
  }

  // Commercial Specialist
  if (auth.role === Roles.commercial_specialist) {
    const accessiblePages = [
      "/commercial/specialist",
      "/commercial/manager/information",
      "/commercial/manager/information/edit",
    ];
    if (!accessiblePages.includes(normalizedPath)) {
      return <Navigate to={`/${i18n.language}/commercial/specialist`} />;
    }
  }

  // Director
  if (auth.role === "buyer_directory") {
    const accessiblePages = ["/services", "/vendors"];
    if (!accessiblePages.includes(normalizedPath)) {
      return <Navigate to={`/${i18n.language}/services`} />;
    }
  }

  // Admin
  if (auth.role === Roles.admin) {
    const accessiblePages = [
      "/users",
      "/controls",
      "/controls/hscode",
      "/profile",
      "/controls/country",
      "/controls/station",
      "/controls/city",
      "/employees",
      "/controls/port",
      "/lawyer/users",
      "/services",
      "/vendors",
    ];
    if (!accessiblePages.includes(normalizedPath)) {
      return <Navigate to={`/${i18n.language}/users`} />;
    }
  }

  return <Outlet />;
}
